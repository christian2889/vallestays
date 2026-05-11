"use client";

import { useEffect, useMemo } from "react";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

let stripePromise: Promise<Stripe | null> | null = null;

function getStripe() {
  if (!stripePromise) {
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!pk) {
      console.error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set");
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(pk);
  }
  return stripePromise;
}

export function StripeEmbeddedCheckout({
  clientSecret,
  onScrollIntoView = true,
}: {
  clientSecret: string;
  onScrollIntoView?: boolean;
}) {
  useEffect(() => {
    if (onScrollIntoView) {
      const el = document.getElementById("vsc-stripe-mount");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [clientSecret, onScrollIntoView]);

  const options = useMemo(() => ({ clientSecret }), [clientSecret]);

  return (
    <div id="vsc-stripe-mount" className="vsc-stripe-mount">
      <EmbeddedCheckoutProvider stripe={getStripe()} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
