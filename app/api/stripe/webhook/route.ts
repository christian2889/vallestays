import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe/server";
import {
  getLead,
  getProperty,
  updateLead,
  findBookingByStripePI,
} from "@/lib/db";
import { getSupabaseAdminClient, findOrCreateGuestUser } from "@/lib/supabase/admin";
import { sendConfirmationEmails } from "@/lib/email";
import { SITE } from "@/lib/supabase/server";
import { localeFor, nameFor } from "@/lib/uiprops";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json({ error: "webhook_not_configured" }, { status: 500 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "missing_signature" }, { status: 400 });

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    console.error("Webhook signature verification failed:", e);
    return NextResponse.json({ error: "bad_signature" }, { status: 400 });
  }

  // Skip events from a different tenant (defense-in-depth: same Stripe account
  // can fire webhooks at multiple deploys).
  const metadata =
    (event.data.object as { metadata?: Record<string, string> | null }).metadata ?? {};
  if (metadata.site && metadata.site !== SITE) {
    return NextResponse.json({ received: true, skipped: "wrong_site" });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      }

      case "payment_intent.succeeded": {
        // Embedded Checkout always fires checkout.session.completed first, which
        // is the canonical place we create the booking. We only use this event
        // to make sure the lead has the PI id recorded — never to create a
        // second booking (that's what caused duplicate emails + rows).
        const intent = event.data.object as Stripe.PaymentIntent;
        const leadId = intent.metadata?.lead_id;
        if (leadId) {
          await updateLead(leadId, {
            stripe_payment_intent_id: intent.id,
          });
        }
        break;
      }

      case "payment_intent.canceled":
      case "payment_intent.payment_failed": {
        const intent = event.data.object as Stripe.PaymentIntent;
        const leadId = intent.metadata?.lead_id;
        if (leadId) {
          await updateLead(leadId, {
            status: "lost",
            stripe_payment_intent_id: intent.id,
          });
        }
        break;
      }

      default:
        break;
    }
  } catch (e) {
    console.error("Webhook handler error:", event.type, e);
    return NextResponse.json({ error: "handler_error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const leadId = session.metadata?.lead_id;
  if (!leadId) {
    console.warn("checkout.session.completed without lead_id in metadata");
    return;
  }

  const intentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  // Idempotency: if we already created a booking for this PI, just update lead.
  if (intentId) {
    const existing = await findBookingByStripePI(intentId);
    if (existing) {
      await updateLead(leadId, {
        status: "converted",
        stripe_session_id: session.id,
        stripe_payment_intent_id: intentId,
      });
      return;
    }
  }

  await convertLeadToBooking({
    leadId,
    sessionId: session.id,
    paymentIntentId: intentId,
    amountTotalCents: session.amount_total ?? null,
    currency: (session.currency ?? "usd").toLowerCase(),
    customerEmail: session.customer_details?.email ?? null,
    kind: (session.metadata?.kind as "stay" | "exp" | undefined) ?? "stay",
    nightsFromMeta: Number(session.metadata?.nights ?? 0) || 0,
    guestsFromMeta: Number(session.metadata?.guests ?? 0) || 0,
    couponCode: session.metadata?.coupon_code || "",
    couponId: session.metadata?.coupon_id || null,
    discountAmountUsd: Number(session.metadata?.discount_amount_usd || 0),
  });
}

async function convertLeadToBooking(args: {
  leadId: string;
  sessionId: string | null;
  paymentIntentId: string | null;
  amountTotalCents: number | null;
  currency: string;
  customerEmail: string | null;
  kind: "stay" | "exp";
  nightsFromMeta: number;
  guestsFromMeta: number;
  couponCode?: string;
  couponId?: string | null;
  discountAmountUsd?: number;
}) {
  const lead = await getLead(args.leadId);
  if (!lead) {
    console.error("convertLeadToBooking: lead not found", args.leadId);
    return;
  }

  const totalUsd = (args.amountTotalCents ?? 0) / 100;

  // 1) Find or create the guest auth user (silent — they can later log in via magic link)
  const guestEmail = args.customerEmail || lead.email;
  const guestUser = await findOrCreateGuestUser({
    email: guestEmail,
    fullName: lead.name || "",
    phone: lead.phone ?? "",
  });

  if ("error" in guestUser) {
    console.error("findOrCreateGuestUser failed:", guestUser.error);
    // We still want to mark the lead as paid even if user provisioning fails.
    await updateLead(args.leadId, {
      status: "qualified",
      stripe_session_id: args.sessionId,
      stripe_payment_intent_id: args.paymentIntentId,
      stripe_amount_cents: args.amountTotalCents,
      stripe_currency: args.currency,
      notes: appendNote(lead.notes, `Guest user creation failed: ${guestUser.error}`),
    });
    return;
  }

  // 2) For experiences (no property), just mark the lead as converted.
  if (args.kind !== "stay" || !lead.property_id) {
    await updateLead(args.leadId, {
      status: "converted",
      stripe_session_id: args.sessionId,
      stripe_payment_intent_id: args.paymentIntentId,
      stripe_amount_cents: args.amountTotalCents,
      stripe_currency: args.currency,
    });
    await sendBookingEmails({
      lead,
      guestUserId: guestUser.id,
      total: totalUsd,
      currency: args.currency,
      reference: shortRef(args.leadId),
    });
    return;
  }

  // 3) For stays: build a booking row that mirrors the Stripe payment.
  const property = lead.property ?? (await getProperty(lead.property_id));
  if (!property) {
    console.error("convertLeadToBooking: property not found", lead.property_id);
    await updateLead(args.leadId, {
      status: "qualified",
      stripe_session_id: args.sessionId,
      stripe_payment_intent_id: args.paymentIntentId,
      stripe_amount_cents: args.amountTotalCents,
      stripe_currency: args.currency,
      notes: appendNote(lead.notes, "Property not found at booking creation."),
    });
    return;
  }

  const nights =
    args.nightsFromMeta ||
    nightsBetween(lead.check_in, lead.check_out) ||
    Number(extractFromNotes(lead.notes, "Nights")) ||
    1;

  const nightly = Number(property.price_per_night) || 0;
  const subtotal = nightly * nights;
  const cleaning = Number(property.cleaning_fee || 0);
  const hostPayout = Math.round((subtotal * 0.75 + cleaning) * 100) / 100;

  // Coupon from session metadata
  const couponCode = args.couponCode || "";
  const couponId = args.couponId || null;
  const discountAmountUsd = args.discountAmountUsd || 0;

  const admin = getSupabaseAdminClient();
  const { data: bookingRow, error: bookingErr } = await admin
    .from("bookings")
    .insert([
      {
        site: SITE,
        property_id: property.id,
        guest_id: guestUser.id,
        host_id: property.host_id,
        check_in: lead.check_in!,
        check_out: lead.check_out!,
        guests_count: args.guestsFromMeta || lead.guests_count || 1,
        nights,
        price_per_night: nightly,
        subtotal,
        cleaning_fee: cleaning,
        service_fee: 0,
        total_price: totalUsd,
        host_payout: hostPayout,
        currency: (args.currency || "usd").toUpperCase(),
        status: "confirmed",
        payment_status: "paid",
        payment_method: "stripe",
        stripe_payment_intent_id: args.paymentIntentId,
        guest_notes: lead.notes,
        ...(couponId ? { coupon_id: couponId } : {}),
        ...(discountAmountUsd > 0 ? { discount_amount: discountAmountUsd } : {}),
      },
    ] as never)
    .select("id")
    .single<{ id: string }>();

  if (bookingErr || !bookingRow) {
    console.error("Booking insert failed:", bookingErr);
    await updateLead(args.leadId, {
      status: "qualified",
      stripe_session_id: args.sessionId,
      stripe_payment_intent_id: args.paymentIntentId,
      stripe_amount_cents: args.amountTotalCents,
      stripe_currency: args.currency,
      notes: appendNote(
        lead.notes,
        `Booking insert failed: ${bookingErr?.message ?? "unknown"}`
      ),
    });
    return;
  }

  // 4) Mark the lead as converted with the booking id reference.
  await updateLead(args.leadId, {
    status: "converted",
    stripe_session_id: args.sessionId,
    stripe_payment_intent_id: args.paymentIntentId,
    stripe_amount_cents: args.amountTotalCents,
    stripe_currency: args.currency,
    notes: appendNote(lead.notes, `Booking: ${bookingRow.id}`),
  });

  // 5) Fire the confirmation emails.
  await sendBookingEmails({
    lead,
    guestUserId: guestUser.id,
    total: totalUsd,
    currency: args.currency,
    reference: bookingRow.id,
  });
}

async function sendBookingEmails(args: {
  lead: NonNullable<Awaited<ReturnType<typeof getLead>>>;
  guestUserId: string;
  total: number;
  currency: string;
  reference: string;
}) {
  const lang: "en" | "es" = "en";
  const property = args.lead.property;

  // Look up host email if we have a property
  let hostEmail: string | null = null;
  if (property?.host_id) {
    const admin = getSupabaseAdminClient();
    const { data } = await admin
      .from("profiles")
      .select("email")
      .eq("id", property.host_id)
      .maybeSingle();
    hostEmail = (data as { email?: string } | null)?.email ?? null;
  }

  await sendConfirmationEmails({
    guestEmail: args.lead.email,
    guestName: args.lead.name || args.lead.email,
    hostEmail,
    propertyName: property ? nameFor(property, lang) : "Valle Stays experience",
    propertyLocale: property ? localeFor(property) : "Valle de Guadalupe",
    checkIn: args.lead.check_in,
    checkOut: args.lead.check_out,
    nights:
      nightsBetween(args.lead.check_in, args.lead.check_out) ||
      Number(extractFromNotes(args.lead.notes, "Nights")) ||
      1,
    guests: args.lead.guests_count || 1,
    total: args.total,
    currency: args.currency,
    reference: shortRef(args.reference),
    lang,
  });
}

function nightsBetween(a: string | null | undefined, b: string | null | undefined): number {
  if (!a || !b) return 0;
  const ms = Date.parse(b) - Date.parse(a);
  if (isNaN(ms) || ms <= 0) return 0;
  return Math.round(ms / 86400000);
}

function extractFromNotes(notes: string | null | undefined, key: string): string {
  if (!notes) return "";
  const m = notes.match(new RegExp(`${key}: ([^·]+)`));
  return m ? m[1].trim() : "";
}

function appendNote(notes: string | null | undefined, addition: string): string {
  return [notes, addition].filter(Boolean).join(" · ");
}

function shortRef(s: string): string {
  return "VS-" + s.slice(0, 8).toUpperCase();
}
