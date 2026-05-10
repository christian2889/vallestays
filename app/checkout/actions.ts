"use server";

import { redirect } from "next/navigation";
import { createLead } from "@/lib/db";

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

  if (!email || !firstName) {
    redirect(`/checkout?lang=${lang}&error=missing`);
  }

  const notesParts = [
    `Site: vallestays`,
    `Kind: ${kind}`,
    expTitle ? `Experience: ${expTitle}` : "",
    `Nights: ${nights}`,
    `Total: $${total} USD`,
    country ? `Country: ${country}` : "",
    govId ? `Gov ID: ${govId}` : "",
    phone ? `Phone: ${phone}` : "",
    guestNotes ? `Guest note: ${guestNotes}` : "",
  ].filter(Boolean);

  const result = await createLead({
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

  if (!result.ok) {
    redirect(`/checkout?lang=${lang}&error=${encodeURIComponent(result.error)}`);
  }

  const params = new URLSearchParams({
    kind,
    lang,
    ...(propertyId ? { id: propertyId } : {}),
    ...(checkIn ? { in: checkIn } : {}),
    ...(checkOut ? { out: checkOut } : {}),
    nights: String(nights),
    guests: String(guests),
    total: String(total),
  });
  redirect(`/confirmed?${params.toString()}`);
}
