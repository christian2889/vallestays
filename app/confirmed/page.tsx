import "./confirmed.css";
import { Suspense } from "react";
import { getProperty } from "@/lib/db";
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
  }>;
}) {
  const sp = await searchParams;
  const kind = sp.kind === "exp" ? "exp" : "stay";
  const property = kind === "stay" && sp.id ? await getProperty(sp.id) : null;

  return (
    <Suspense fallback={null}>
      <ConfirmedPage
        property={property}
        kind={kind}
        nights={Number(sp.nights || 4)}
        guests={Number(sp.guests || 2)}
        checkIn={sp.in || null}
        checkOut={sp.out || null}
        total={Number(sp.total || 0)}
        ref={sp.ref || null}
        expId={kind === "exp" ? sp.id || "cellar" : null}
      />
    </Suspense>
  );
}
