import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe/server";
import { getLead, updateLead } from "@/lib/db";
import { SITE } from "@/lib/supabase/server";

// Stripe needs the raw body for signature verification — don't let Next parse it.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json({ error: "webhook_not_configured" }, { status: 500 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    console.error("Webhook signature verification failed:", e);
    return NextResponse.json({ error: "bad_signature" }, { status: 400 });
  }

  // Only process events that belong to this site (defense-in-depth in case the
  // same Stripe account fires webhooks at multiple deploys).
  const metadata =
    (event.data.object as { metadata?: Record<string, string> | null }).metadata ?? {};
  if (metadata.site && metadata.site !== SITE) {
    // Different tenant — ignore quietly with a 200 so Stripe doesn't retry.
    return NextResponse.json({ received: true, skipped: "wrong_site" });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const leadId = session.metadata?.lead_id;
        if (!leadId) break;

        const intentId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id ?? null;

        await updateLead(leadId, {
          status: "qualified",
          stripe_session_id: session.id,
          stripe_payment_intent_id: intentId,
          stripe_amount_cents: session.amount_total ?? null,
          stripe_currency: session.currency ?? null,
        });
        break;
      }

      case "payment_intent.succeeded": {
        const intent = event.data.object as Stripe.PaymentIntent;
        const leadId = intent.metadata?.lead_id;
        if (!leadId) break;
        // Captured (post-approval). Mark as converted.
        await updateLead(leadId, {
          status: "converted",
          stripe_payment_intent_id: intent.id,
        });
        break;
      }

      case "payment_intent.amount_capturable_updated": {
        // Card was authorized in manual-capture mode and is ready to capture.
        const intent = event.data.object as Stripe.PaymentIntent;
        const leadId = intent.metadata?.lead_id;
        if (!leadId) break;
        const lead = await getLead(leadId);
        if (lead && lead.status === "new") {
          await updateLead(leadId, {
            status: "qualified",
            stripe_payment_intent_id: intent.id,
            stripe_amount_cents: intent.amount_capturable,
            stripe_currency: intent.currency,
          });
        }
        break;
      }

      case "payment_intent.canceled":
      case "payment_intent.payment_failed": {
        const intent = event.data.object as Stripe.PaymentIntent;
        const leadId = intent.metadata?.lead_id;
        if (!leadId) break;
        await updateLead(leadId, {
          status: "lost",
          stripe_payment_intent_id: intent.id,
        });
        break;
      }

      default:
        // No-op for the events we don't care about.
        break;
    }
  } catch (e) {
    console.error("Webhook handler error:", event.type, e);
    return NextResponse.json({ error: "handler_error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
