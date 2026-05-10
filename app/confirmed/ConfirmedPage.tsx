"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { COPY, PROPERTIES } from "@/lib/data";
import { useLang } from "@/components/LangContext";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Placeholder } from "@/components/Placeholder";

const CONF_COPY = {
  en: {
    crumb: "Booked",
    eyebrow: "Reference",
    h_pre: "You're in.",
    h_em: "See you in the valley.",
    lede:
      "We received your request and confirmed it. A handwritten note from the host is on its way to your inbox. Below is everything you need to land softly.",
    when_h: "When",
    where_h: "Where",
    who_h: "Who",
    arrival_h: "Arrival",
    nights: "nights",
    guests: "guests",
    print: "Print receipt",
    cal: "Add to calendar",
    contact: "Save concierge contact",
    pri_h: "What you paid",
    pri_total: "Total charged",
    pri_method: "Method",
    pri_card: "Visa ····7821 · USD",
    pri_paid: "Paid",
    pri_paid_v: "Today",
    timeline_h: "What happens next",
    timeline: [
      { day: "Today", t: "Confirmation sent", b: "Receipt and house notes are in your inbox. Forward to anyone joining you." },
      { day: "T-7 days", t: "Welcome letter from your host", b: "A short note with a sketch of the property, the gate code, and the host's mobile." },
      { day: "T-2 days", t: "Concierge text", b: "We'll text to ask about arrival time and confirm your add-ons. Reply when you can." },
      { day: "Arrival day", t: "We meet you at the gate", b: "Our local steward greets you, walks the house, and leaves you a bottle of cold Chenin." },
    ],
    arr_h: "Getting there",
    arr: [
      { l: "From San Diego", v: "90 min · I-5 South to Tijuana, follow Carr. Federal 3 to Valle de Guadalupe" },
      { l: "From Tijuana airport", v: "75 min · We can arrange a private driver ($165 USD)" },
      { l: "From Ensenada", v: "30 min · Carr. Federal 3 inland, the road climbs into the valley" },
      { l: "Last leg of road", v: "8 km of dirt road. A sedan can do it in dry weather. SUV in the rain." },
    ],
    pack_h: "Pack the things",
    pack: [
      "A light layer for after sunset — the valley cools fast.",
      "Closed shoes for cellar visits.",
      "Sunscreen and a swim layer if your home has a pool.",
      "A second memory card for the camera.",
    ],
    add_h: "Want to add something?",
    add_b: "There's still time. Reply to your confirmation email and we'll arrange a chef, a driver, or an extra night.",
    add_cta_exp: "Browse experiences",
    add_cta_g: "Open the guidebook",
    bottom: "Saludos desde el valle.",
    bottom_sig: "— Marcela, Tomás & the Valle Stays team",
    contact_h: "Need us?",
    contact_list: [
      ["Concierge (24h, EN/ES)", "+52 646 155 0000"],
      ["WhatsApp", "+52 646 122 0044"],
      ["Email", "concierge@vallestays.mx"],
    ] as [string, string][],
    stay: "Stay",
    experience: "Experience",
    met: "Met at the gate",
  },
  es: {
    crumb: "Reservado",
    eyebrow: "Referencia",
    h_pre: "Listo.",
    h_em: "Nos vemos en el valle.",
    lede:
      "Recibimos y confirmamos tu solicitud. Una nota a mano del anfitrión va camino a tu correo. Abajo está todo lo que necesitas para aterrizar tranquilo.",
    when_h: "Cuándo",
    where_h: "Dónde",
    who_h: "Quién",
    arrival_h: "Llegada",
    nights: "noches",
    guests: "personas",
    print: "Imprimir recibo",
    cal: "Agregar al calendario",
    contact: "Guardar contacto del concierge",
    pri_h: "Lo que pagaste",
    pri_total: "Total cobrado",
    pri_method: "Método",
    pri_card: "Visa ····7821 · USD",
    pri_paid: "Pagado",
    pri_paid_v: "Hoy",
    timeline_h: "Qué sigue",
    timeline: [
      { day: "Hoy", t: "Confirmación enviada", b: "Recibo y notas de la casa en tu correo. Reenvía a quien venga contigo." },
      { day: "T-7 días", t: "Carta de bienvenida del anfitrión", b: "Una nota breve con un croquis de la propiedad, el código del portón y el celular del anfitrión." },
      { day: "T-2 días", t: "Mensaje del concierge", b: "Te escribimos para preguntar la hora de llegada y confirmar tus extras. Responde cuando puedas." },
      { day: "Día de llegada", t: "Te recibimos en el portón", b: "Nuestro anfitrión local te recibe, te muestra la casa, y te deja una botella de Chenin frío." },
    ],
    arr_h: "Cómo llegar",
    arr: [
      { l: "Desde San Diego", v: "90 min · I-5 sur a Tijuana, después Carr. Federal 3 a Valle de Guadalupe" },
      { l: "Desde aeropuerto Tijuana", v: "75 min · Te podemos mandar chofer privado ($165 USD)" },
      { l: "Desde Ensenada", v: "30 min · Carr. Federal 3 tierra adentro, la carretera sube al valle" },
      { l: "Último tramo", v: "8 km de terracería. Un sedán pasa en seco. SUV con lluvia." },
    ],
    pack_h: "Trae esto",
    pack: [
      "Una capa ligera para después del atardecer — el valle enfría rápido.",
      "Zapato cerrado para las catas en cueva.",
      "Bloqueador y traje de baño si tu casa tiene alberca.",
      "Una segunda tarjeta de memoria.",
    ],
    add_h: "¿Quieres agregar algo?",
    add_b: "Aún hay tiempo. Responde a tu correo de confirmación y arreglamos un chef, un chofer o una noche extra.",
    add_cta_exp: "Ver experiencias",
    add_cta_g: "Abrir la guía",
    bottom: "Saludos desde el valle.",
    bottom_sig: "— Marcela, Tomás y el equipo de Valle Stays",
    contact_h: "¿Nos necesitas?",
    contact_list: [
      ["Concierge (24h, EN/ES)", "+52 646 155 0000"],
      ["WhatsApp", "+52 646 122 0044"],
      ["Correo", "concierge@vallestays.mx"],
    ] as [string, string][],
    stay: "Casa",
    experience: "Experiencia",
    met: "Recepción en portón",
  },
} as const;

export function ConfirmedPage() {
  const { lang } = useLang();
  const params = useSearchParams();
  const t = COPY[lang];
  const c = CONF_COPY[lang];

  const kind = params.get("kind") || "stay";
  const id = params.get("id") || (kind === "exp" ? "cellar" : "casa-de-piedra");
  const nights = +(params.get("nights") || 0) || 4;
  const guests = +(params.get("guests") || 0) || 2;
  const total = +(params.get("total") || 0) || 3160;
  const refFromUrl = params.get("ref");
  const ref = useMemo(
    () => refFromUrl || "VS-" + (Math.floor(Math.random() * 9000) + 1000),
    [refFromUrl]
  );

  const stay = PROPERTIES.find((p) => p.id === id) || PROPERTIES[0];
  const expItem = t.exp.items.find((it) => it.id === id) || t.exp.items[0];
  const isExp = kind === "exp";
  const item = isExp
    ? {
        name: expItem.title,
        locale: { en: expItem.who, es: expItem.who },
        palette: ["#8a4a2a", "#d4b896", "#3a2418"] as [string, string, string],
        shape: "arch",
      }
    : stay;

  const checkin = params.get("in") || (lang === "en" ? "Apr 12, 2026" : "12 abr 2026");
  const checkout = params.get("out") || (lang === "en" ? "Apr 16, 2026" : "16 abr 2026");

  return (
    <div className="vs-app vsf-app">
      <Nav showReserve={false} />

      <main>
        <section className="vsf-hero">
          <div className="vsf-hero-l">
            <div className="vsf-stamp">
              <svg viewBox="0 0 120 120" width="120" height="120">
                <circle cx="60" cy="60" r="56" fill="none" stroke="#bd5a2a" strokeWidth="1.4" strokeDasharray="3 4" />
                <circle cx="60" cy="60" r="44" fill="none" stroke="#bd5a2a" strokeWidth="0.8" />
                <text x="60" y="50" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="2" fill="#bd5a2a">
                  VALLE STAYS
                </text>
                <text x="60" y="68" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="22" fontStyle="italic" fill="#bd5a2a">
                  Confirmed
                </text>
                <text x="60" y="82" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="8" letterSpacing="1.5" fill="#bd5a2a">
                  {ref}
                </text>
              </svg>
            </div>
            <div className="vs-eyebrow">
              {c.crumb} · {c.eyebrow} {ref}
            </div>
            <h1 className="vsf-h">
              {c.h_pre} <em>{c.h_em}</em>
            </h1>
            <p className="vsf-lede">{c.lede}</p>
            <div className="vsf-actions">
              <button onClick={() => window.print()} className="vsf-action">
                ↓ {c.print}
              </button>
              <button className="vsf-action">⚐ {c.cal}</button>
              <button className="vsf-action">☎ {c.contact}</button>
            </div>
          </div>

          <aside className="vsf-ticket">
            <div className="vsf-ticket-img">
              <Placeholder palette={item.palette} shape={item.shape} aspect="3/2" />
            </div>
            <div className="vsf-ticket-body">
              <div className="vsf-ticket-h">
                <span>{isExp ? c.experience : c.stay}</span>
                <strong>{item.name}</strong>
                <em>{item.locale[lang]}</em>
              </div>
              <div className="vsf-ticket-grid">
                {!isExp && (
                  <div>
                    <span>{c.when_h}</span>
                    <b>{checkin}</b>
                    <i>→ {checkout}</i>
                  </div>
                )}
                {isExp && (
                  <div>
                    <span>{c.when_h}</span>
                    <b>{checkin}</b>
                    <i>11:00 — 15:30</i>
                  </div>
                )}
                <div>
                  <span>{isExp ? c.who_h : c.nights}</span>
                  <b>{isExp ? `${guests} ${c.guests}` : `${nights}`}</b>
                  <i>{isExp ? "" : c.nights}</i>
                </div>
                <div>
                  <span>{c.arrival_h}</span>
                  <b>{isExp ? "11:00" : lang === "en" ? "After 4pm" : "Después 4pm"}</b>
                  <i>{c.met}</i>
                </div>
                <div>
                  <span>{c.who_h}</span>
                  <b>{guests}</b>
                  <i>{c.guests}</i>
                </div>
              </div>
              <div className="vsf-ticket-pri">
                <div>
                  <span>{c.pri_total}</span>
                  <strong>${total.toLocaleString()} USD</strong>
                </div>
                <div>
                  <span>{c.pri_method}</span>
                  <strong>{c.pri_card}</strong>
                </div>
              </div>
              <div className="vsf-ticket-foot">
                <div className="vsf-perf"></div>
                <span className="vsf-paid">
                  {c.pri_paid} · {c.pri_paid_v}
                </span>
                <div className="vsf-perf"></div>
              </div>
            </div>
          </aside>
        </section>

        <section className="vsf-timeline">
          <div className="vs-section-head">
            <div>
              <div className="vs-eyebrow">{c.timeline_h}</div>
            </div>
          </div>
          <ol className="vsf-tl">
            {c.timeline.map((row, i) => (
              <li key={i}>
                <div className="vsf-tl-day">{row.day}</div>
                <div className="vsf-tl-dot">
                  <i></i>
                </div>
                <div className="vsf-tl-text">
                  <h3>{row.t}</h3>
                  <p>{row.b}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="vsf-grid">
          <div className="vsf-block">
            <div className="vs-eyebrow">{c.arr_h}</div>
            <ul className="vsf-arr">
              {c.arr.map((row, i) => (
                <li key={i}>
                  <span>{row.l}</span>
                  <p>{row.v}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="vsf-block">
            <div className="vs-eyebrow">{c.pack_h}</div>
            <ul className="vsf-pack">
              {c.pack.map((row, i) => (
                <li key={i}>
                  <span>·</span>
                  {row}
                </li>
              ))}
            </ul>
          </div>

          <div className="vsf-block vsf-block-dark">
            <div className="vs-eyebrow">{c.contact_h}</div>
            <ul className="vsf-contact">
              {c.contact_list.map((row, i) => (
                <li key={i}>
                  <span>{row[0]}</span>
                  <strong>{row[1]}</strong>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="vsf-add">
          <div className="vsf-add-l">
            <div className="vs-eyebrow">{c.add_h}</div>
            <p>{c.add_b}</p>
          </div>
          <div className="vsf-add-r">
            <Link href={`/?lang=${lang}#experiences`} className="vs-btn vs-btn-dark">
              {c.add_cta_exp} →
            </Link>
            <Link href={`/guide?lang=${lang}`} className="vs-btn vs-btn-ghost">
              {c.add_cta_g} →
            </Link>
          </div>
        </section>

        <section className="vsf-sign">
          <p>{c.bottom}</p>
          <p className="vsf-sign-sig">{c.bottom_sig}</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
