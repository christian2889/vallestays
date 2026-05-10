"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { COPY, PROPERTIES } from "@/lib/data";
import { useLang } from "@/components/LangContext";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Placeholder } from "@/components/Placeholder";

const CHECKOUT_COPY = {
  en: {
    crumb: "Checkout",
    step_review: "Review",
    step_who: "Who's coming",
    step_pay: "Payment",
    step_done: "Confirmed",
    h_title_1: "Almost there.",
    h_title_em: "Last few details.",
    h_lede:
      "We confirm by hand within four hours. Your card is held but not charged until we approve.",

    item_h: "What you're booking",
    nights: "nights",
    guests: "guests",
    checkin: "Check-in",
    checkout: "Check-out",
    arrival: "Arrival window",
    arrival_v: "After 4pm",
    addons_h: "Add to your stay",
    addons: [
      { id: "welcome", t: "Welcome basket", b: "Local cheese, bread from La Espiga, bottle of Adobe Guadalupe Tinto.", v: 65 },
      { id: "groceries", t: "Stock the kitchen", b: "We pre-shop based on your menu — sent the day before.", v: 95 },
      { id: "chef", t: "In-home chef · one dinner", b: "Three courses, seasonal, paired. We bring the wine.", v: 240 },
      { id: "driver", t: "Day driver · 8 hours", b: "Your own driver for the day. Speak English & Spanish.", v: 180 },
    ],

    pri_h: "Price detail",
    pri_nights: "× nights",
    pri_clean: "Cleaning",
    pri_steward: "Valle steward fee",
    pri_addons: "Add-ons",
    pri_tax: "Taxes & ISH (4%)",
    pri_total: "Total today",
    pri_charged: "Charged at confirmation",

    who_h: "Who's coming",
    f_first: "First name",
    f_last: "Last name",
    f_email: "Email",
    f_phone: "Phone",
    f_country: "Country",
    f_id: "Government ID number",
    f_id_h: "Required by SECTUR. We never share it.",

    pay_h: "Payment",
    f_card_name: "Cardholder name",
    f_card_n: "Card number",
    f_card_exp: "Expiry",
    f_card_cvc: "CVC",
    f_curr: "Charge in",
    pay_note:
      "We hold your card with Stripe. Charged only after we approve, usually within 4 hours.",

    notes_h: "Anything we should know?",
    notes_ph: "Anniversary, food allergies, dirt-road anxiety…",
    house_h: "House notes",
    house: [
      "Check-in is 4pm. We can hold a 2pm early arrival for $25.",
      "Cancel free up to 14 days before check-in. After that, 50% refundable.",
      "Smoking outside only. Dogs welcome with a note in advance.",
    ],

    consent: "I've read the house notes and cancellation terms.",
    cta: "Request booking",
    foot_note:
      "By requesting, you agree to our cancellation terms. We'll email you within four hours.",

    done_h: "We've got it.",
    done_b:
      "We'll write back within four hours with confirmation. Watch for an email from concierge@vallestays.mx (sometimes lands in promotions).",
    done_ref: "Reference",
    back_home: "Back home",
  },
  es: {
    crumb: "Reserva",
    step_review: "Revisar",
    step_who: "Quién viene",
    step_pay: "Pago",
    step_done: "Confirmado",
    h_title_1: "Casi listo.",
    h_title_em: "Últimos detalles.",
    h_lede:
      "Confirmamos a mano en menos de cuatro horas. Tu tarjeta se reserva pero no se cobra hasta aprobar.",

    item_h: "Qué estás reservando",
    nights: "noches",
    guests: "personas",
    checkin: "Llegada",
    checkout: "Salida",
    arrival: "Ventana de llegada",
    arrival_v: "Después de 4pm",
    addons_h: "Agrega a tu estancia",
    addons: [
      { id: "welcome", t: "Canasta de bienvenida", b: "Queso local, pan de La Espiga, botella de Adobe Guadalupe Tinto.", v: 65 },
      { id: "groceries", t: "Surte la cocina", b: "Compramos antes según tu menú — entrega un día antes.", v: 95 },
      { id: "chef", t: "Chef en casa · una cena", b: "Tres tiempos, temporada, maridaje. Nosotros llevamos el vino.", v: 240 },
      { id: "driver", t: "Chofer del día · 8 horas", b: "Tu propio chofer todo el día. Habla español e inglés.", v: 180 },
    ],

    pri_h: "Detalle del precio",
    pri_nights: "× noches",
    pri_clean: "Limpieza",
    pri_steward: "Anfitrión local",
    pri_addons: "Extras",
    pri_tax: "Impuestos e ISH (4%)",
    pri_total: "Total",
    pri_charged: "Se cobra al confirmar",

    who_h: "Quién viene",
    f_first: "Nombre",
    f_last: "Apellido",
    f_email: "Correo",
    f_phone: "Teléfono",
    f_country: "País",
    f_id: "Número de identificación oficial",
    f_id_h: "Requerido por SECTUR. Nunca lo compartimos.",

    pay_h: "Pago",
    f_card_name: "Nombre del titular",
    f_card_n: "Número de tarjeta",
    f_card_exp: "Vencimiento",
    f_card_cvc: "CVC",
    f_curr: "Cobrar en",
    pay_note:
      "Reservamos tu tarjeta con Stripe. Solo se cobra al aprobar, normalmente en menos de 4 horas.",

    notes_h: "¿Algo que debamos saber?",
    notes_ph: "Aniversario, alergias, miedo a la terracería…",
    house_h: "Notas de la casa",
    house: [
      "Check-in a las 4pm. Podemos reservar entrada a las 2pm por $25.",
      "Cancelación gratis hasta 14 días antes. Después, 50% reembolsable.",
      "Fumar solo afuera. Perros bienvenidos con aviso previo.",
    ],

    consent: "Leí las notas de la casa y los términos de cancelación.",
    cta: "Solicitar reserva",
    foot_note: "Al solicitar aceptas los términos de cancelación. Te escribimos en menos de cuatro horas.",

    done_h: "Recibido.",
    done_b:
      "Te escribimos en menos de cuatro horas con confirmación. Atento al correo de concierge@vallestays.mx (a veces cae en promociones).",
    done_ref: "Referencia",
    back_home: "Volver al inicio",
  },
} as const;

export function CheckoutPage() {
  const { lang } = useLang();
  const params = useSearchParams();
  const t = COPY[lang];
  const c = CHECKOUT_COPY[lang];

  const kind = params.get("kind") || "stay";
  const id = params.get("id") || (kind === "exp" ? "cellar" : "casa-de-piedra");

  const stay = PROPERTIES.find((p) => p.id === id) || PROPERTIES[0];
  const expItem = t.exp.items.find((it) => it.id === id) || t.exp.items[0];

  const isExp = kind === "exp";
  const item = isExp
    ? {
        name: expItem.title,
        locale: { en: expItem.who, es: expItem.who },
        palette: ["#8a4a2a", "#d4b896", "#3a2418"] as [string, string, string],
        shape: "arch",
        nightly: 180,
      }
    : stay;

  const nights = +(params.get("nights") || 0) || 4;
  const guests = +(params.get("guests") || 0) || 2;
  const checkin = params.get("in") || (lang === "en" ? "Apr 12" : "12 abr");
  const checkout = params.get("out") || (lang === "en" ? "Apr 16" : "16 abr");
  const nightly = item.nightly || 685;

  const [addons, setAddons] = useState<Record<string, boolean>>({});
  const [step, setStep] = useState<1 | 2>(1);

  const subtotal = nightly * (isExp ? 1 : nights);
  const cleaning = isExp ? 0 : 145;
  const steward = Math.round(subtotal * 0.06);
  const addonTotal = c.addons.reduce((s, a) => s + (addons[a.id] ? a.v : 0), 0);
  const tax = Math.round((subtotal + cleaning + steward + addonTotal) * 0.04);
  const total = subtotal + cleaning + steward + addonTotal + tax;

  const ref = useMemo(
    () => "VS-" + (Math.floor(Math.random() * 9000) + 1000),
    []
  );

  const stepLabels = [c.step_review, c.step_who, c.step_pay, c.step_done];
  const activeStep = step === 2 ? 4 : 3;

  return (
    <div className="vs-app vsc-app">
      <Nav showReserve={false} />

      {step === 2 ? (
        <main className="vsc-done">
          <div className="vsc-done-inner">
            <div className="vs-eyebrow">{c.crumb}</div>
            <div className="vsc-done-mark">✓</div>
            <h1 className="vsc-done-h">{c.done_h}</h1>
            <p className="vsc-done-b">{c.done_b}</p>
            <div className="vsc-done-ref">
              <span>{c.done_ref}</span>
              <strong>{ref}</strong>
            </div>
            <Link href={`/?lang=${lang}`} className="vs-btn vs-btn-dark">
              ← {c.back_home}
            </Link>
          </div>
        </main>
      ) : (
        <main>
          <section className="vsc-hero">
            <div className="vs-eyebrow">{c.crumb}</div>
            <h1 className="vsc-h">
              {c.h_title_1} <em>{c.h_title_em}</em>
            </h1>
            <p className="vsc-lede">{c.h_lede}</p>

            <ol className="vsc-steps">
              {stepLabels.map((l, i) => (
                <li
                  key={i}
                  className={i + 1 < activeStep ? "done" : i + 1 === activeStep ? "on" : ""}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <strong>{l}</strong>
                </li>
              ))}
            </ol>
          </section>

          <section className="vsc-body">
            <div className="vsc-form">
              <div className="vsc-block">
                <div className="vsc-block-h">
                  <span>01</span>
                  <h2>{c.item_h}</h2>
                </div>
                <div className="vsc-summary">
                  <div className="vsc-summary-img">
                    <Placeholder palette={item.palette} shape={item.shape} aspect="4/3" />
                  </div>
                  <div className="vsc-summary-text">
                    <h3>{item.name}</h3>
                    <p>{item.locale[lang]}</p>
                    <div className="vsc-summary-row">
                      {!isExp && (
                        <div>
                          <span>{c.checkin}</span>
                          <strong>{checkin}</strong>
                        </div>
                      )}
                      {!isExp && (
                        <div>
                          <span>{c.checkout}</span>
                          <strong>{checkout}</strong>
                        </div>
                      )}
                      <div>
                        <span>{isExp ? c.guests : c.nights}</span>
                        <strong>{isExp ? guests : nights}</strong>
                      </div>
                      <div>
                        <span>{c.arrival}</span>
                        <strong>{c.arrival_v}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="vsc-block">
                <div className="vsc-block-h">
                  <span>02</span>
                  <h2>{c.addons_h}</h2>
                </div>
                <div className="vsc-addons">
                  {c.addons.map((a) => (
                    <label key={a.id} className={"vsc-addon " + (addons[a.id] ? "on" : "")}>
                      <input
                        type="checkbox"
                        checked={!!addons[a.id]}
                        onChange={(e) => setAddons({ ...addons, [a.id]: e.target.checked })}
                      />
                      <div className="vsc-addon-text">
                        <strong>{a.t}</strong>
                        <p>{a.b}</p>
                      </div>
                      <div className="vsc-addon-price">
                        <span>+ ${a.v}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="vsc-block">
                <div className="vsc-block-h">
                  <span>03</span>
                  <h2>{c.who_h}</h2>
                </div>
                <div className="vsc-grid-2">
                  <div className="vsc-field">
                    <label>{c.f_first}</label>
                    <input required defaultValue="" />
                  </div>
                  <div className="vsc-field">
                    <label>{c.f_last}</label>
                    <input required />
                  </div>
                  <div className="vsc-field">
                    <label>{c.f_email}</label>
                    <input type="email" required />
                  </div>
                  <div className="vsc-field">
                    <label>{c.f_phone}</label>
                    <input type="tel" required />
                  </div>
                  <div className="vsc-field">
                    <label>{c.f_country}</label>
                    <select>
                      <option>United States</option>
                      <option>México</option>
                      <option>Canada</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="vsc-field">
                    <label>{c.f_id}</label>
                    <input required />
                    <small>{c.f_id_h}</small>
                  </div>
                </div>
              </div>

              <div className="vsc-block">
                <div className="vsc-block-h">
                  <span>04</span>
                  <h2>{c.pay_h}</h2>
                </div>

                <div className="vsc-cards">
                  <button className="vsc-pay-tab on">VISA · MC · AMEX</button>
                  <button className="vsc-pay-tab">Apple Pay</button>
                  <button className="vsc-pay-tab">Transferencia (MXN)</button>
                </div>

                <div className="vsc-grid-2">
                  <div className="vsc-field vsc-field-wide">
                    <label>{c.f_card_name}</label>
                    <input required />
                  </div>
                  <div className="vsc-field vsc-field-wide">
                    <label>{c.f_card_n}</label>
                    <div className="vsc-card-row">
                      <input required placeholder="0000 0000 0000 0000" />
                      <span className="vsc-brand">VISA</span>
                    </div>
                  </div>
                  <div className="vsc-field">
                    <label>{c.f_card_exp}</label>
                    <input placeholder="MM / YY" />
                  </div>
                  <div className="vsc-field">
                    <label>{c.f_card_cvc}</label>
                    <input placeholder="123" />
                  </div>
                  <div className="vsc-field">
                    <label>{c.f_curr}</label>
                    <select defaultValue="USD">
                      <option>USD</option>
                      <option>MXN</option>
                    </select>
                  </div>
                </div>

                <p className="vsc-pay-note">🔒 {c.pay_note}</p>
              </div>

              <div className="vsc-block">
                <div className="vsc-block-h">
                  <span>05</span>
                  <h2>{c.notes_h}</h2>
                </div>
                <textarea rows={4} placeholder={c.notes_ph} className="vsc-notes"></textarea>

                <div className="vsc-house">
                  <div className="vs-eyebrow">{c.house_h}</div>
                  <ul>
                    {c.house.map((row, i) => (
                      <li key={i}>
                        <span>·</span>
                        {row}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <label className="vsc-consent">
                <input type="checkbox" required />
                <span>{c.consent}</span>
              </label>
            </div>

            <aside className="vsc-aside">
              <div className="vsc-rail">
                <div className="vs-eyebrow">{c.pri_h}</div>
                <div className="vsc-pri">
                  {!isExp && (
                    <div>
                      <span>
                        ${nightly} {c.pri_nights} {nights}
                      </span>
                      <strong>${(nightly * nights).toLocaleString()}</strong>
                    </div>
                  )}
                  {isExp && (
                    <div>
                      <span>{item.name}</span>
                      <strong>${nightly}</strong>
                    </div>
                  )}
                  {!isExp && (
                    <div>
                      <span>{c.pri_clean}</span>
                      <strong>${cleaning}</strong>
                    </div>
                  )}
                  <div>
                    <span>{c.pri_steward}</span>
                    <strong>${steward}</strong>
                  </div>
                  {addonTotal > 0 && (
                    <div>
                      <span>{c.pri_addons}</span>
                      <strong>${addonTotal}</strong>
                    </div>
                  )}
                  <div>
                    <span>{c.pri_tax}</span>
                    <strong>${tax}</strong>
                  </div>
                  <div className="vsc-pri-total">
                    <span>{c.pri_total}</span>
                    <strong>${total.toLocaleString()} USD</strong>
                  </div>
                  <div className="vsc-pri-when">{c.pri_charged}</div>
                </div>

                <button className="vs-btn vs-btn-dark vsc-cta" onClick={() => setStep(2)}>
                  {c.cta} →
                </button>
                <p className="vsc-foot-note">{c.foot_note}</p>
              </div>
            </aside>
          </section>
        </main>
      )}

      <Footer />
    </div>
  );
}
