import "./confirmed.css";
import { Suspense } from "react";
import { getLead, getProperty } from "@/lib/db";
import { stripe } from "@/lib/stripe/server";
import { ConfirmedPage } from "./ConfirmedPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    id?: string;
    kind?: string;
    nights?: string;
    guests?: string;
    in?: string;
    out?: string;
    total?: string;
    ref?: string;
    lead_id?: string;
    session_id?: string;
  }>;
}) {
  const sp = await searchParams;
  const kind = sp.kind === "exp" ? "exp" : "stay";

  // If a Stripe session_id came back from the redirect, pull the canonical
  // amount + lead_id from Stripe (the URL params can be tampered with).
  let stripeTotal: number | null = null;
  let stripeLeadId: string | null = null;
  if (sp.session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sp.session_id);
      stripeTotal = session.amount_total != null ? session.amount_total / 100 : null;
      stripeLeadId = (session.metadata?.lead_id as string | undefined) ?? null;
    } catch (e) {
      console.error("Failed to retrieve Stripe session:", e);
    }
  }

  const leadId = stripeLeadId || sp.lead_id || null;
  const lead = leadId ? await getLead(leadId) : null;

  const propertyFromLead = lead?.property ?? null;
  const propertyFromUrl =
    !propertyFromLead && kind === "stay" && sp.id ? await getProperty(sp.id) : null;
  const property = propertyFromLead || propertyFromUrl;

  const total =
    stripeTotal ??
    (lead?.stripe_amount_cents != null ? lead.stripe_amount_cents / 100 : null) ??
    Number(sp.total || 0);

  return (
    <Suspense fallback={null}>
      <ConfirmedPage
        property={property}
        kind={kind}
        nights={Number(sp.nights || 4)}
        guests={Number(sp.guests || 2)}
        checkIn={lead?.check_in || sp.in || null}
        checkOut={lead?.check_out || sp.out || null}
        total={total || 0}
        reference={leadId || sp.ref || null}
        expId={kind === "exp" ? sp.id || "cellar" : null}
      />
    </Suspense>
  );
}
