import "server-only";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_GUEST =
  process.env.RESEND_FROM_GUEST ?? "Valle Stays <concierge@vallestays.app>";
const FROM_HOST =
  process.env.RESEND_FROM_HOST ?? "Valle Stays <concierge@vallestays.app>";
const REPLY_TO = process.env.RESEND_REPLY_TO ?? "concierge@vallestays.app";
const HOST_BCC = process.env.RESEND_HOST_BCC; // Optional: ops/admin inbox
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vallestays-jade.vercel.app";

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export type ConfirmationEmailInput = {
  guestEmail: string;
  guestName: string;
  hostEmail?: string | null;
  propertyName: string;
  propertyLocale: string;
  checkIn: string | null;
  checkOut: string | null;
  nights: number;
  guests: number;
  total: number;
  currency: string;
  reference: string;
  lang: "en" | "es";
};

function fmtCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `$${Math.round(amount)} ${currency.toUpperCase()}`;
  }
}

function guestSubject(p: ConfirmationEmailInput) {
  return p.lang === "es"
    ? `Confirmado · ${p.propertyName} · ${p.reference}`
    : `Confirmed · ${p.propertyName} · ${p.reference}`;
}

function hostSubject(p: ConfirmationEmailInput) {
  return p.lang === "es"
    ? `Nueva reserva · ${p.propertyName}`
    : `New booking · ${p.propertyName}`;
}

function guestHtml(p: ConfirmationEmailInput) {
  const labels =
    p.lang === "es"
      ? {
          h1: "¡Listo! Nos vemos en el valle.",
          lede:
            "Recibimos tu pago y confirmamos tu reservación. Una nota a mano del anfitrión va camino a tu correo.",
          when: "Cuándo",
          to: "→",
          guests: "Huéspedes",
          nights: "noches",
          total: "Total cobrado",
          ref: "Referencia",
          help: "¿Necesitas algo? Responde a este correo o escríbenos a concierge@vallestays.app.",
          sig: "— El equipo de Valle Stays",
        }
      : {
          h1: "You're in. See you in the valley.",
          lede:
            "We received your payment and confirmed your stay. A handwritten note from the host is on its way to your inbox.",
          when: "When",
          to: "→",
          guests: "Guests",
          nights: "nights",
          total: "Total charged",
          ref: "Reference",
          help: "Need anything? Reply to this email or write us at concierge@vallestays.app.",
          sig: "— The Valle Stays team",
        };

  return `<!doctype html>
<html><body style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#f1ebe0;padding:40px;color:#1f1812;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #cfc5b3;border-radius:8px;padding:32px;">
    <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-weight:400;font-size:32px;line-height:1.1;letter-spacing:-0.02em;margin:0 0 16px;">${labels.h1}</h1>
    <p style="font-size:15px;line-height:1.55;color:#4a4338;margin:0 0 24px;">${labels.lede}</p>
    <div style="border:1px solid #cfc5b3;border-radius:6px;padding:20px;margin:0 0 24px;">
      <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:22px;letter-spacing:-0.01em;margin-bottom:4px;">${escapeHtml(p.propertyName)}</div>
      <div style="font-size:11px;color:#6b6356;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:20px;">${escapeHtml(p.propertyLocale)}</div>
      <table cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;">
        <tr><td style="color:#6b6356;padding:6px 0;">${labels.when}</td><td style="text-align:right;font-weight:500;">${escapeHtml(p.checkIn ?? "—")} ${p.checkOut ? `${labels.to} ${escapeHtml(p.checkOut)}` : ""}</td></tr>
        <tr><td style="color:#6b6356;padding:6px 0;">${labels.nights}</td><td style="text-align:right;font-weight:500;">${p.nights}</td></tr>
        <tr><td style="color:#6b6356;padding:6px 0;">${labels.guests}</td><td style="text-align:right;font-weight:500;">${p.guests}</td></tr>
        <tr><td style="color:#6b6356;padding:6px 0;">${labels.ref}</td><td style="text-align:right;font-family:Menlo,monospace;font-size:12px;">${escapeHtml(p.reference)}</td></tr>
        <tr><td colspan="2" style="border-top:1px solid #cfc5b3;padding-top:12px;"></td></tr>
        <tr><td style="color:#6b6356;padding:6px 0;">${labels.total}</td><td style="text-align:right;font-family:'Cormorant Garamond',Georgia,serif;font-size:22px;color:#b04a2f;">${fmtCurrency(p.total, p.currency)}</td></tr>
      </table>
    </div>
    <p style="font-size:13px;line-height:1.55;color:#6b6356;margin:0 0 16px;">${labels.help}</p>
    <p style="font-style:italic;color:#1f1812;font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;margin:24px 0 0;">${labels.sig}</p>
  </div>
</body></html>`;
}

function hostHtml(p: ConfirmationEmailInput) {
  const labels =
    p.lang === "es"
      ? {
          h1: "Nueva reserva confirmada",
          lede: "Un huésped acaba de pagar y confirmar una estancia.",
          guest: "Huésped",
          when: "Cuándo",
          guests: "Personas",
          total: "Total",
          ref: "Referencia",
          link: "Ver en panel",
        }
      : {
          h1: "New booking confirmed",
          lede: "A guest just paid and confirmed a stay.",
          guest: "Guest",
          when: "When",
          guests: "Guests",
          total: "Total",
          ref: "Reference",
          link: "Open dashboard",
        };

  return `<!doctype html>
<html><body style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#f1ebe0;padding:40px;color:#1f1812;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #cfc5b3;border-radius:8px;padding:28px;">
    <h2 style="margin:0 0 8px;font-family:'Cormorant Garamond',Georgia,serif;font-weight:400;font-size:26px;letter-spacing:-0.01em;">${labels.h1}</h2>
    <p style="font-size:14px;color:#4a4338;margin:0 0 20px;">${labels.lede}</p>
    <table cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;">
      <tr><td style="color:#6b6356;padding:6px 0;width:120px;">${labels.guest}</td><td style="font-weight:500;">${escapeHtml(p.guestName)} · ${escapeHtml(p.guestEmail)}</td></tr>
      <tr><td style="color:#6b6356;padding:6px 0;">Property</td><td>${escapeHtml(p.propertyName)}</td></tr>
      <tr><td style="color:#6b6356;padding:6px 0;">${labels.when}</td><td>${escapeHtml(p.checkIn ?? "—")} → ${escapeHtml(p.checkOut ?? "—")} (${p.nights}n)</td></tr>
      <tr><td style="color:#6b6356;padding:6px 0;">${labels.guests}</td><td>${p.guests}</td></tr>
      <tr><td style="color:#6b6356;padding:6px 0;">${labels.total}</td><td style="font-family:'Cormorant Garamond',Georgia,serif;font-size:22px;color:#b04a2f;">${fmtCurrency(p.total, p.currency)}</td></tr>
      <tr><td style="color:#6b6356;padding:6px 0;">${labels.ref}</td><td style="font-family:Menlo,monospace;font-size:12px;">${escapeHtml(p.reference)}</td></tr>
    </table>
    <p style="margin:24px 0 0;font-size:13px;"><a href="${SITE_URL}" style="color:#b04a2f;">${labels.link} →</a></p>
  </div>
</body></html>`;
}

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type InquiryEmailInput = {
  name: string;
  email: string;
  dates: string;
  party: string;
  notes: string;
  notifyTo: string;
};

export async function sendInquiryNotification(input: InquiryEmailInput) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping inquiry notification.");
    return { ok: false as const, error: "resend_not_configured" };
  }

  const html = `<!doctype html>
<html><body style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#f1ebe0;padding:40px;color:#1f1812;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #cfc5b3;border-radius:8px;padding:28px;">
    <h2 style="margin:0 0 8px;font-family:'Cormorant Garamond',Georgia,serif;font-weight:400;font-size:26px;">New inquiry — Valle Stays</h2>
    <p style="font-size:14px;color:#4a4338;margin:0 0 20px;">A visitor submitted the contact form.</p>
    <table cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;">
      <tr><td style="color:#6b6356;padding:6px 0;width:90px;">Name</td><td style="font-weight:500;">${escapeHtml(input.name)}</td></tr>
      <tr><td style="color:#6b6356;padding:6px 0;">Email</td><td><a href="mailto:${escapeHtml(input.email)}" style="color:#b04a2f;">${escapeHtml(input.email)}</a></td></tr>
      <tr><td style="color:#6b6356;padding:6px 0;">Dates</td><td>${escapeHtml(input.dates)}</td></tr>
      <tr><td style="color:#6b6356;padding:6px 0;">Party</td><td>${escapeHtml(input.party)}</td></tr>
      ${input.notes ? `<tr><td style="color:#6b6356;padding:6px 0;vertical-align:top;">Notes</td><td>${escapeHtml(input.notes)}</td></tr>` : ""}
    </table>
  </div>
</body></html>`;

  try {
    const result = await resend.emails.send({
      from: FROM_HOST,
      to: input.notifyTo,
      replyTo: input.email,
      subject: `New inquiry from ${input.name}`,
      html,
    });
    if (result.error) console.error("Resend inquiry error:", result.error);
    return { ok: true as const };
  } catch (e) {
    console.error("sendInquiryNotification error:", e);
    return { ok: false as const, error: e instanceof Error ? e.message : "unknown" };
  }
}

export async function sendConfirmationEmails(input: ConfirmationEmailInput) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping confirmation emails.");
    return { ok: false as const, error: "resend_not_configured" };
  }

  const guestSend = resend.emails.send({
    from: FROM_GUEST,
    to: input.guestEmail,
    replyTo: REPLY_TO,
    subject: guestSubject(input),
    html: guestHtml(input),
  });

  const hostSend = input.hostEmail
    ? resend.emails.send({
        from: FROM_HOST,
        to: input.hostEmail,
        bcc: HOST_BCC ? [HOST_BCC] : undefined,
        replyTo: REPLY_TO,
        subject: hostSubject(input),
        html: hostHtml(input),
      })
    : Promise.resolve(null);

  try {
    const [guestResult, hostResult] = await Promise.all([guestSend, hostSend]);
    if (guestResult?.error) console.error("Resend guest email error:", guestResult.error);
    if (hostResult && "error" in hostResult && hostResult.error)
      console.error("Resend host email error:", hostResult.error);
    return { ok: true as const };
  } catch (e) {
    console.error("Resend send error:", e);
    return { ok: false as const, error: e instanceof Error ? e.message : "unknown" };
  }
}
