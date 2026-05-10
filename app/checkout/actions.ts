"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
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

export async function submitCheckoutAction(formData: FormData) {
  const kind = String(formData.get("kind") || "stay");
  const propertyId = String(formData.get("property_id") || "");
  const lang = String(formData.get("lang") || "en");

  const checkIn = String(formData.get("check_in") || "") || null;
  const checkOut = String(formData.get("check_out") || "") || null;
  const nights = Number(formData.get("nights") || 0);
  const guests = Number(formData.get("guests") || 1);
  const total = Number(formData.get("total") || 0);

  const firstName = String(formData.get("first_name") || "");
  const lastName = String(formData.get("last_name") || "");
  const email = String(formData.get("email") || "");
  const phone = String(formData.get("phone") || "");
  const country = String(formData.get("country") || "");
  const govId = String(formData.get("gov_id") || "");
  const guestNotes = String(formData.get("guest_notes") || "");
  const expTitle = String(formData.get("exp_title") || "");

  if (!email || !firstName || total <= 0) {
    redirect(`/checkout?lang=${lang}&error=missing`);
  }

  const itemLabel = kind === "exp" ? expTitle : `Valle Stays · ${kind}`;

  const notesParts = [
    `Site: ${SITE}`,
    `Kind: ${kind}`,
    expTitle ? `Experience: ${expTitle}` : "",
    `Nights: ${nights}`,
    `Guests: ${guests}`,
    `Total: $${total} USD`,
    country ? `Country: ${country}` : "",
    govId ? `Gov ID: ${govId}` : "",
    phone ? `Phone: ${phone}` : "",
    guestNotes ? `Guest note: ${guestNotes}` : "",
  ].filter(Boolean);

  // 1) Create the lead first so we have a stable id to put in Stripe metadata
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
    redirect(`/checkout?lang=${lang}&error=${encodeURIComponent(leadResult.error)}`);
  }

  const leadId = leadResult.id;

  // 2) Create a Stripe Checkout Session in manual-capture mode.
  //    The card is authorized but NOT charged until we capture it after manual review.
  const origin = originFromHeaders(await headers());
  const successParams = new URLSearchParams({
    kind,
    lang,
    lead_id: leadId,
    ...(propertyId ? { id: propertyId } : {}),
    ...(checkIn ? { in: checkIn } : {}),
    ...(checkOut ? { out: checkOut } : {}),
    nights: String(nights),
    guests: String(guests),
    total: String(total),
  });
  const successUrl = `${origin}/confirmed?${successParams.toString()}&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}/checkout?${new URLSearchParams({
    kind,
    lang,
    ...(propertyId ? { id: propertyId } : {}),
    ...(checkIn ? { in: checkIn } : {}),
    ...(checkOut ? { out: checkOut } : {}),
    nights: String(nights),
    guests: String(guests),
    error: "cancelled",
  }).toString()}`;

  let sessionUrl: string | null = null;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(total * 100),
            product_data: {
              name: itemLabel,
              description: kind === "stay"
                ? `${nights} nights · ${guests} guests${checkIn ? ` · ${checkIn}` : ""}${checkOut ? ` → ${checkOut}` : ""}`
                : `${guests} guests${checkIn ? ` · ${checkIn}` : ""}`,
            },
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        capture_method: "manual",
        description: `${SITE} · ${itemLabel}`,
        metadata: {
          site: SITE,
          lead_id: leadId,
          kind,
          property_id: propertyId || "",
        },
      },
      metadata: {
        site: SITE,
        lead_id: leadId,
        kind,
        property_id: propertyId || "",
        nights: String(nights),
        guests: String(guests),
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    sessionUrl = session.url;
    await updateLead(leadId, {
      stripe_session_id: session.id,
      stripe_payment_intent_id:
        typeof session.payment_intent === "string" ? session.payment_intent : null,
      stripe_amount_cents: Math.round(total * 100),
      stripe_currency: "usd",
    });
  } catch (e) {
    console.error("Stripe checkout session create error:", e);
    const message = e instanceof Error ? e.message : "stripe_error";
    await updateLead(leadId, {
      notes: notesParts.concat([`Stripe error: ${message}`]).join(" · "),
    });
    redirect(`/checkout?lang=${lang}&error=${encodeURIComponent(message)}`);
  }

  if (!sessionUrl) {
    redirect(`/checkout?lang=${lang}&error=no_session_url`);
  }
  redirect(sessionUrl);
}
