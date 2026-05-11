"use server";

import { sendInquiryNotification } from "@/lib/email";
import { createLead } from "@/lib/db";

const NOTIFY_EMAIL = process.env.INQUIRY_NOTIFY_EMAIL ?? "casadomoglamping@gmail.com";

export async function submitInquiry(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const dates = String(formData.get("dates") || "").trim();
  const party = String(formData.get("party") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

  if (!name || !email) return { ok: false as const, error: "missing_fields" };

  await createLead({
    name,
    email,
    notes: [dates && `Dates: ${dates}`, party && `Party: ${party}`, notes && `Notes: ${notes}`]
      .filter(Boolean)
      .join(" · "),
    source: "form",
    status: "new",
  });

  await sendInquiryNotification({ name, email, dates, party, notes, notifyTo: NOTIFY_EMAIL });

  return { ok: true as const };
}
