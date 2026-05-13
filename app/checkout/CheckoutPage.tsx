"use client";

import { useState } from "react";
import { COPY } from "@/lib/data";
import { useLang } from "@/components/LangContext";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Placeholder } from "@/components/Placeholder";
import {
  type UIProperty,
  nameFor,
  localeFor,
  paletteFor,
  shapeFor,
} from "@/lib/uiprops";
import { createCheckoutSession } from "./actions";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";
import { validateCoupon } from "@/app/actions/coupon";

const MXN_RATE = Number(process.env.NEXT_PUBLIC_MXN_RATE || 17.5);

const CHECKOUT_COPY = {
  en: {
    crumb: "Checkout",
    step_review: "Review",
    step_who: "Who's coming",
    step_pay: "Payment",
    step_done: "Confirmed",
    h_title_1: "Almost there.",
    h_title_em: "Pay now, instant confirm.",
    h_lede:
      "Pay securely with Stripe — your stay is confirmed the moment your payment goes through. A confirmation lands in your inbox in under a minute.",
    item_h: "What you're booking",
    nights: "nights",
    guests: "guests",
    checkin: "Check-in",
    checkout: "Check-out",
    arrival: "Arrival window",
    arrival_v: "After 3pm",
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
    pri_addons: "Add-ons",
    pri_discount: "Discount",
    pri_total: "Total",
    pri_charged: "Charged now via Stripe",
    coupon_rec: "Use VALLE15 for 15% off →",
    coupon_ph: "Promo code",
    coupon_apply: "Apply",
    coupon_applied: "Applied",
    coupon_remove: "Remove",
    coupon_err_invalid: "Invalid or expired code.",
    curr_label: "Charge in",
    who_h: "Who's coming",
    f_first: "First name",
    f_last: "Last name",
    f_email: "Email",
    f_phone: "Phone",
    f_country: "Country",
    pay_h: "Payment",
    pay_note: "Enter your card below — payment is processed securely by Stripe. Confirmation is instant.",
    notes_h: "Anything we should know?",
    notes_ph: "Anniversary, food allergies, dirt-road anxiety…",
    house_h: "House notes",
    house: [
      "Check-in is 3pm. We can hold a 2pm early arrival for $25.",
      "Cancel free up to 14 days before check-in. After that, 50% refundable.",
      "Smoking outside only. Dogs welcome with a note in advance.",
    ],
    cta: "Pay & confirm",
    cta_busy: "Redirecting to Stripe…",
    foot_note:
      "By paying, you agree to our cancellation terms. Confirmation arrives by email within seconds of payment.",
  },
  es: {
    crumb: "Reserva",
    step_review: "Revisar",
    step_who: "Quién viene",
    step_pay: "Pago",
    step_done: "Confirmado",
    h_title_1: "Casi listo.",
    h_title_em: "Paga ahora, confirmación instantánea.",
    h_lede:
      "Paga con Stripe — tu reservación se confirma en cuanto pase el pago. La confirmación te llega al correo en menos de un minuto.",
    item_h: "Qué estás reservando",
    nights: "noches",
    guests: "personas",
    checkin: "Llegada",
    checkout: "Salida",
    arrival: "Ventana de llegada",
    arrival_v: "Después de 3pm",
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
    pri_addons: "Extras",
    pri_discount: "Descuento",
    pri_total: "Total",
    pri_charged: "Se cobra ahora con Stripe",
    coupon_rec: "Usa VALLE15 y obtén 15% de descuento →",
    coupon_ph: "Código de promoción",
    coupon_apply: "Aplicar",
    coupon_applied: "Aplicado",
    coupon_remove: "Quitar",
    coupon_err_invalid: "Código inválido o expirado.",
    curr_label: "Cobrar en",
    who_h: "Quién viene",
    f_first: "Nombre",
    f_last: "Apellido",
    f_email: "Correo",
    f_phone: "Teléfono",
    f_country: "País",
    pay_h: "Pago",
    pay_note:
      "Ingresa tu tarjeta abajo — el pago lo procesa Stripe de forma segura. Confirmación instantánea.",
    notes_h: "¿Algo que debamos saber?",
    notes_ph: "Aniversario, alergias, miedo a la terracería…",
    house_h: "Notas de la casa",
    house: [
      "Check-in a las 3pm. Podemos reservar entrada a las 2pm por $25.",
      "Cancelación gratis hasta 14 días antes. Después, 50% reembolsable.",
      "Fumar solo afuera. Perros bienvenidos con aviso previo.",
    ],
    cta: "Pagar y confirmar",
    cta_busy: "Redirigiendo a Stripe…",
    foot_note:
      "Al pagar aceptas los términos de cancelación. La confirmación llega por correo en segundos.",
  },
} as const;

export function CheckoutPage({
  property,
  kind,
  initialNights,
  initialGuests,
  initialCheckIn,
  initialCheckOut,
  expId,
}: {
  property: UIProperty | null;
  kind: "stay" | "exp";
  initialNights: number;
  initialGuests: number;
  initialCheckIn: string | null;
  initialCheckOut: string | null;
  expId: string | null;
}) {
  const { lang } = useLang();
  const t = COPY[lang];
  const c = CHECKOUT_COPY[lang];

  const isExp = kind === "exp";
  const expItem = isExp
    ? t.exp.items.find((it) => it.id === expId) || t.exp.items[0]
    : null;

  const itemName = property ? nameFor(property, lang) : expItem?.title || "—";
  const itemLocale = property ? localeFor(property) : expItem?.who || "";
  const itemPalette = property ? paletteFor(property) : ["#8a4a2a", "#d4b896", "#3a2418"] as [string, string, string];
  const itemShape = property ? shapeFor(property) : "arch";
  const itemImg = property?.primary_image_url ?? null;

  const nightly = property ? Math.round(property.price_per_night) : 180;
  const cleaning = isExp ? 0 : Math.round(property?.cleaning_fee || 145);

  // Core state
  const [addons, setAddons] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Currency
  const [currency, setCurrency] = useState<"usd" | "mxn">("usd");

  // Coupon
  const [couponInput, setCouponInput] = useState("");
  const [couponApplying, setCouponApplying] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [discountPct, setDiscountPct] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [couponId, setCouponId] = useState("");

  // Pricing (all in USD)
  const subtotal = nightly * (isExp ? 1 : initialNights);
  const addonTotal = c.addons.reduce((s, a) => s + (addons[a.id] ? a.v : 0), 0);
  // Discount applies to nights + cleaning, NOT to add-ons
  const discountableBase = subtotal + cleaning;
  const discountAmount = Math.round(discountableBase * discountPct / 100);
  const totalUsd = discountableBase - discountAmount + addonTotal;

  // Display helpers
  function fmt(usdAmount: number) {
    if (currency === "mxn") return `$${Math.round(usdAmount * MXN_RATE).toLocaleString()}`;
    return `$${usdAmount.toLocaleString()}`;
  }
  const currLabel = currency.toUpperCase();

  const stepLabels = [c.step_review, c.step_who, c.step_pay, c.step_done];
  const activeStep = clientSecret ? 3 : 2;

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    setCouponApplying(true);
    setCouponError(null);
    const result = await validateCoupon(couponInput.trim());
    setCouponApplying(false);
    if (result.ok) {
      setDiscountPct(result.discountPct);
      setCouponCode(couponInput.trim().toUpperCase());
      setCouponId(result.couponId);
      setCouponError(null);
    } else {
      setCouponError(c.coupon_err_invalid);
      setDiscountPct(0);
      setCouponCode("");
      setCouponId("");
    }
  }

  function handleRemoveCoupon() {
    setDiscountPct(0);
    setCouponCode("");
    setCouponId("");
    setCouponInput("");
    setCouponError(null);
  }

  return (
    <div className="vs-app vsc-app">
      <Nav showReserve={false} />

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

        <form
          className="vsc-body"
          action={async (formData) => {
            setSubmitting(true);
            setErrorMsg(null);
            formData.set("total", String(totalUsd));
            formData.set("currency", currency);
            formData.set("coupon_code", couponCode);
            formData.set("coupon_id", couponId);
            formData.set("discount_amount", String(discountAmount));
            const result = await createCheckoutSession(formData);
            setSubmitting(false);
            if (result.ok) {
              setClientSecret(result.clientSecret);
            } else {
              setErrorMsg(result.error);
            }
          }}
        >
          <input type="hidden" name="kind" value={kind} />
          <input type="hidden" name="lang" value={lang} />
          <input type="hidden" name="property_id" value={property?.id || ""} />
          <input type="hidden" name="exp_title" value={isExp ? expItem?.title || "" : ""} />
          <input type="hidden" name="check_in" value={initialCheckIn || ""} />
          <input type="hidden" name="check_out" value={initialCheckOut || ""} />
          <input type="hidden" name="nights" value={initialNights} />
          <input type="hidden" name="guests" value={initialGuests} />

          <div className="vsc-form">
            {/* 01 What you're booking */}
            <div className="vsc-block">
              <div className="vsc-block-h">
                <span>01</span>
                <h2>{c.item_h}</h2>
              </div>
              <div className="vsc-summary">
                <div className="vsc-summary-img">
                  {itemImg ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={itemImg}
                      alt={itemName}
                      style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", borderRadius: 6 }}
                    />
                  ) : (
                    <Placeholder palette={itemPalette} shape={itemShape} aspect="4/3" />
                  )}
                </div>
                <div className="vsc-summary-text">
                  <h3>{itemName}</h3>
                  <p>{itemLocale}</p>
                  <div className="vsc-summary-row">
                    {!isExp && initialCheckIn && (
                      <div>
                        <span>{c.checkin}</span>
                        <strong>{initialCheckIn}</strong>
                      </div>
                    )}
                    {!isExp && initialCheckOut && (
                      <div>
                        <span>{c.checkout}</span>
                        <strong>{initialCheckOut}</strong>
                      </div>
                    )}
                    <div>
                      <span>{isExp ? c.guests : c.nights}</span>
                      <strong>{isExp ? initialGuests : initialNights}</strong>
                    </div>
                    <div>
                      <span>{c.arrival}</span>
                      <strong>{c.arrival_v}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 02 Add-ons */}
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

            {/* 03 Who's coming */}
            <div className="vsc-block">
              <div className="vsc-block-h">
                <span>03</span>
                <h2>{c.who_h}</h2>
              </div>
              <div className="vsc-grid-2">
                <div className="vsc-field">
                  <label>{c.f_first}</label>
                  <input name="first_name" required />
                </div>
                <div className="vsc-field">
                  <label>{c.f_last}</label>
                  <input name="last_name" required />
                </div>
                <div className="vsc-field">
                  <label>{c.f_email}</label>
                  <input name="email" type="email" required />
                </div>
                <div className="vsc-field">
                  <label>{c.f_phone}</label>
                  <input name="phone" type="tel" required />
                </div>
                <div className="vsc-field">
                  <label>{c.f_country}</label>
                  <select name="country" defaultValue="United States">
                    <option>United States</option>
                    <option>México</option>
                    <option>Canada</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 04 Payment */}
            <div className="vsc-block">
              <div className="vsc-block-h">
                <span>04</span>
                <h2>{c.pay_h}</h2>
              </div>
              {clientSecret ? (
                <StripeEmbeddedCheckout clientSecret={clientSecret} />
              ) : (
                <p className="vsc-pay-note">🔒 {c.pay_note}</p>
              )}
              {errorMsg && (
                <div className="vsc-error">
                  {lang === "en" ? "Payment couldn't start" : "No se pudo iniciar el pago"}: {errorMsg}
                </div>
              )}
            </div>

            {/* 05 Notes */}
            <div className="vsc-block">
              <div className="vsc-block-h">
                <span>05</span>
                <h2>{c.notes_h}</h2>
              </div>
              <textarea
                name="guest_notes"
                rows={4}
                placeholder={c.notes_ph}
                className="vsc-notes"
              ></textarea>

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
          </div>

          {/* Pricing rail */}
          <aside className="vsc-aside">
            <div className="vsc-rail">
              <div className="vs-eyebrow">{c.pri_h}</div>

              {/* Currency toggle */}
              <div className="vsc-currency-toggle">
                <span className="vsc-currency-label">{c.curr_label}</span>
                <div className="vsc-currency-btns">
                  {(["usd", "mxn"] as const).map((cur) => (
                    <button
                      key={cur}
                      type="button"
                      className={"vsc-curr-btn" + (currency === cur ? " on" : "")}
                      onClick={() => setCurrency(cur)}
                    >
                      {cur.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="vsc-pri">
                {!isExp && (
                  <div>
                    <span>
                      {fmt(nightly)} {c.pri_nights} {initialNights}
                    </span>
                    <strong>{fmt(nightly * initialNights)}</strong>
                  </div>
                )}
                {isExp && (
                  <div>
                    <span>{itemName}</span>
                    <strong>{fmt(nightly)}</strong>
                  </div>
                )}
                {!isExp && (
                  <div>
                    <span>{c.pri_clean}</span>
                    <strong>{fmt(cleaning)}</strong>
                  </div>
                )}
                {addonTotal > 0 && (
                  <div>
                    <span>{c.pri_addons}</span>
                    <strong>{fmt(addonTotal)}</strong>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="vsc-pri-discount">
                    <span>{c.pri_discount} ({couponCode})</span>
                    <strong>−{fmt(discountAmount)}</strong>
                  </div>
                )}
                <div className="vsc-pri-total">
                  <span>{c.pri_total}</span>
                  <strong>{fmt(totalUsd)} {currLabel}</strong>
                </div>
                <div className="vsc-pri-when">{c.pri_charged}</div>
              </div>

              {/* Coupon */}
              <div className="vsc-coupon">
                {!couponCode ? (
                  <>
                    <button
                      type="button"
                      className="vsc-coupon-rec"
                      onClick={() => setCouponInput("VALLE15")}
                    >
                      {c.coupon_rec}
                    </button>
                    <div className="vsc-coupon-row">
                      <input
                        type="text"
                        className="vsc-coupon-input"
                        placeholder={c.coupon_ph}
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value.toUpperCase());
                          setCouponError(null);
                        }}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleApplyCoupon(); } }}
                      />
                      <button
                        type="button"
                        className="vsc-coupon-apply"
                        disabled={couponApplying || !couponInput.trim()}
                        onClick={handleApplyCoupon}
                      >
                        {couponApplying ? "…" : c.coupon_apply}
                      </button>
                    </div>
                    {couponError && <div className="vsc-coupon-err">{couponError}</div>}
                  </>
                ) : (
                  <div className="vsc-coupon-applied">
                    <span>✓ {couponCode} · −{discountPct}%</span>
                    <button type="button" onClick={handleRemoveCoupon} className="vsc-coupon-remove">
                      {c.coupon_remove}
                    </button>
                  </div>
                )}
              </div>

              {!clientSecret && (
                <button
                  type="submit"
                  disabled={submitting}
                  className="vs-btn vs-btn-dark vsc-cta"
                >
                  {submitting ? c.cta_busy : c.cta} →
                </button>
              )}
              <p className="vsc-foot-note">{c.foot_note}</p>
            </div>
          </aside>
        </form>
      </main>

      <Footer />
    </div>
  );
}
