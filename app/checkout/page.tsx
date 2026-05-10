import "./checkout.css";
import { Suspense } from "react";
import { getProperty } from "@/lib/db";
import { CheckoutPage } from "./CheckoutPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; kind?: string; nights?: string; guests?: string; in?: string; out?: string }>;
}) {
  const sp = await searchParams;
  const kind = sp.kind === "exp" ? "exp" : "stay";
  const property = kind === "stay" && sp.id ? await getProperty(sp.id) : null;

  return (
    <Suspense fallback={null}>
      <CheckoutPage
        property={property}
        kind={kind}
        initialNights={Number(sp.nights || 4)}
        initialGuests={Number(sp.guests || 2)}
        initialCheckIn={sp.in || null}
        initialCheckOut={sp.out || null}
        expId={kind === "exp" ? sp.id || "cellar" : null}
      />
    </Suspense>
  );
}
