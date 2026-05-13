"use server";

import { headers } from "next/headers";
import { createLead, updateLead } from "@/lib/db";
import { stripe } from "@/lib/stripe/server";
import { SITE } from "@/lib/supabase/server";

function originFromHeaders(h: Headers) {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  const proto = h.get("x-forwarded-proto") || "https";
  const host = h.get("x-forwarded-host") || h.get("host");
  return host ? `${proto}://${host}` : "";
}

type CreateSessionResult =
  | { ok: true; clientSecret: string; sessionId: string; leadId: string }
  | { ok: false; error: string };

export async function createCheckoutSession(formData: FormData): Promise<CreateSessionResult> {
  const kind = String(formData.get("kind") || "stay");
  const propertyId = String(formData.get("property_id") || "");
  const lang = String(formData.get("lang") || "en");

  const checkIn = String(formData.get("check_in") || "") || null;
  const checkOut = String(formData.get("check_out") || "") || null;
  const nights = Number(formData.get("nights") || 0);
  const guests = Number(formData.get("guests") || 1);
  const totalUsd = Number(formData.get("total") || 0);
  const selectedCurrency = String(formData.get("currency") || "usd").toLowerCase() as "usd" | "mxn";
  const couponCode = String(formData.get("coupon_code") || "");
  const couponId = String(formData.get("coupon_id") || "");
  const discountAmount = Number(formData.get("discount_amount") || 0);

  const mxnRate = Number(process.env.NEXT_PUBLIC_MXN_RATE || 17.5);
  // total in the selected currency (what Stripe will charge)
  const total = selectedCurrency === "mxn" ? totalUsd * mxnRate : totalUsd;

  const firstName = String(formData.get("first_name") || "");
  const lastName = String(formData.get("last_name") || "");
  const email = String(formData.get("email") || "");
  const phone = String(formData.get("phone") || "");
  const country = String(formData.get("country") || "");
  const guestNotes = String(formData.get("guest_notes") || "");
  const expTitle = String(formData.get("exp_title") || "");

  if (!email || !firstName || totalUsd <= 0) {
    return { ok: false, error: "missing_fields" };
  }

  const itemLabel = kind === "exp" ? expTitle : `Valle Stays · ${kind}`;

  const notesParts = [
    `Site: ${SITE}`,
    `Kind: ${kind}`,
    expTitle ? `Experience: ${expTitle}` : "",
    `Nights: ${nights}`,
    `Guests: ${guests}`,
    `Total: $${totalUsd} USD`,
    selectedCurrency === "mxn" ? `Currency: MXN (rate ${mxnRate})` : "",
    couponCode ? `Coupon: ${couponCode} (-$${discountAmount} USD)` : "",
    country ? `Country: ${country}` : "",
    phone ? `Phone: ${phone}` : "",
    guestNotes ? `Guest note: ${guestNotes}` : "",
  ].filter(Boolean);

  // 1) Create lead
  const leadResult = await createLead({
    name: `${firstName} ${lastName}`.trim(),
    email,
    phone: phone || null,
    property_id: kind === "stay" && propertyId ? propertyId : null,
    check_in: checkIn,
    check_out: checkOut,
    guests_count: guests,
    notes: notesParts.join(" · "),
    source: "form",
    status: "new",
  });

  if (!leadResult.ok) {
    return { ok: false, error: leadResult.error };
  }

  const leadId = leadResult.id;

  // 2) Return URL
  const origin = originFromHeaders(await headers());
  const returnParams = new URLSearchParams({
    kind,
    lang,
    lead_id: leadId,
    ...(propertyId ? { id: propertyId } : {}),
    ...(checkIn ? { in: checkIn } : {}),
    ...(checkOut ? { out: checkOut } : {}),
    nights: String(nights),
    guests: String(guests),
    total: String(totalUsd),
  });
  const returnUrl = `${origin}/confirmed?${returnParams.toString()}&session_id={CHECKOUT_SESSION_ID}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "embedded",
      return_url: returnUrl,
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: selectedCurrency,
            unit_amount: Math.round(total * 100),
            product_data: {
              name: itemLabel,
              description:
                kind === "stay"
                  ? `${nights} nights · ${guests} guests${checkIn ? ` · ${checkIn}` : ""}${
                      checkOut ? ` → ${checkOut}` : ""
                    }`
                  : `${guests} guests${checkIn ? ` · ${checkIn}` : ""}`,
            },
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        capture_method: "automatic",
        description: `${SITE} · ${itemLabel}`,
        metadata: {
          site: SITE,
          lead_id: leadId,
          kind,
          property_id: propertyId || "",
          nights: String(nights),
          guests: String(guests),
          coupon_code: couponCode,
          coupon_id: couponId,
          discount_amount_usd: String(discountAmount),
        },
      },
      metadata: {
        site: SITE,
        lead_id: leadId,
        kind,
        property_id: propertyId || "",
        nights: String(nights),
        guests: String(guests),
        coupon_code: couponCode,
        coupon_id: couponId,
        discount_amount_usd: String(discountAmount),
      },
    });

    if (!session.client_secret) {
      return { ok: false, error: "no_client_secret" };
    }

    await updateLead(leadId, {
      stripe_session_id: session.id,
      stripe_amount_cents: Math.round(total * 100),
      stripe_currency: selectedCurrency,
    });

    return {
      ok: true,
      clientSecret: session.client_secret,
      sessionId: session.id,
      leadId,
    };
  } catch (e) {
    console.error("Stripe checkout session create error:", e);
    const message = e instanceof Error ? e.message : "stripe_error";
    await updateLead(leadId, {
      notes: notesParts.concat([`Stripe error: ${message}`]).join(" · "),
    });
    return { ok: false, error: message };
  }
}
