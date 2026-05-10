"use client";

import { useState } from "react";
import { useLang } from "@/components/LangContext";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Placeholder } from "@/components/Placeholder";

const HOST_COPY = {
  en: {
    eyebrow: "Become a host",
    title_1: "Open your home",
    title_em: "to people",
    title_2: "who'll treat it like one.",
    lede: "We're a small, hand-picked collection — not a marketplace. We visit every property, photograph it ourselves, and answer every guest by hand. If your home or experience belongs in the valley, we'd like to hear from you.",
    why_h: "What hosting with us looks like",
    why: [
      { n: "01", t: "We list, vet and write.", b: "We come spend a day at your property, photograph it on film, and write the listing in your voice. You approve every word." },
      { n: "02", t: "We answer every guest.", b: "Inquiries come through us first. We screen, confirm, and brief the guest before they arrive — so you only meet people who'll respect the place." },
      { n: "03", t: "We help on the ground.", b: "Cleaning, repairs, restocking, last-minute fixes. Our local team handles turnovers and stays on call for guests, in Spanish or English." },
      { n: "04", t: "We pay quickly, plainly.", b: "75% of nightly. Paid the day after checkout, by deposit or transferencia, in MXN or USD. No tiers, no surge fees, no hidden cleanouts." },
    ],
    fits_h: "What we look for",
    fits: [
      "A home of character — adobe, ranch, architect-built, off-grid all welcome.",
      "Located in or near Valle de Guadalupe, El Porvenir, Francisco Zarco, San Antonio.",
      "Sleeps two or more, available at least 60 nights a year.",
      "A real bed, hot water, and one thoughtful detail no one else has.",
    ],
    not_fits_h: "What we don't take",
    not_fits: [
      "Hotel rooms, condo towers, anything with more than 14 keys.",
      "New construction without a story behind it.",
      "Properties run by a management company we don't already know.",
    ],
    splits_h: "What you keep",
    splits: [
      { l: "Nightly rate", v: "75%" },
      { l: "Cleaning fee", v: "100%" },
      { l: "Damage deposit", v: "100%" },
      { l: "Photography & listing", v: "On us" },
      { l: "Channel fees (Booking, Vrbo)", v: "On us" },
    ],
    form_h: "Tell us about your place",
    f: {
      role: "I'd like to host",
      role_stay: "A home or casita",
      role_exp: "An experience",
      role_both: "Both",
      name: "Your name",
      email: "Email",
      phone: "Phone (with country code)",
      where: "Where is it?",
      where_ph: "Town, road, or just \"5 min from Decantos\"",
      kind: "What is it?",
      kind_villa: "Villa",
      kind_casita: "Casita / studio",
      kind_ranch: "Ranch / multi-bedroom",
      kind_off: "Off-grid",
      kind_other: "Something else",
      sleeps: "Sleeps",
      nightly: "Approximate nightly rate (USD)",
      url: "Existing listing URL (Airbnb, Vrbo, your site) — optional",
      photos: "Drop 3–10 photos · or paste a Drive / Dropbox link",
      story: "Tell us the story",
      story_ph: "Who built it, why you bought it, the one thing you tell every first-time guest…",
      submit: "Send to the team",
      reply: "We answer every submission by hand within four business days. If we want to visit, we'll book a flight.",
      consent: "I'm the owner or have written permission to list.",
    },
    proof_h: "Hosts in the collection",
    proof: [
      { name: "Marcela & Tomás", home: "Casa de Piedra", since: "Hosting since 2019", quote: "Valle Stays sends people who notice the things — the light at 6pm, the smell of the wet rosemary. We've never had a guest leave the house worse than they found it." },
      { name: "Don Refugio", home: "Rancho Los Olivos", since: "Hosting since 2017", quote: "I'm a rancher, not a hotelier. They handle the people part. I just pour the wine and saddle the horse." },
    ],
    faq_h: "Common questions",
    faq: [
      { q: "Do I have to be on-site?", a: "No. Most of our hosts live elsewhere. Our local team handles turnovers, restocks, and emergencies." },
      { q: "Can I keep listing on Airbnb?", a: "Yes — we ask for a small set of priority dates per quarter, but you keep your other channels and your existing reviews." },
      { q: "How do you decide what to take?", a: "Honestly, by feeling. We come walk the property. If we'd want to spend a weekend there, we list it." },
      { q: "What does it cost to start?", a: "Nothing. Photography, listing, channel setup — all on us. We only earn when you do." },
    ],
    cta: "Tell us about your place",
  },
  es: {
    eyebrow: "Sé anfitrión",
    title_1: "Abre tu casa",
    title_em: "a gente",
    title_2: "que la tratará como suya.",
    lede: "Somos una colección pequeña y curada — no un marketplace. Visitamos cada propiedad, la fotografiamos nosotros, y respondemos a cada huésped a mano. Si tu casa o experiencia pertenece al valle, queremos saber de ti.",
    why_h: "Cómo es ser anfitrión con nosotros",
    why: [
      { n: "01", t: "Listamos, validamos y escribimos.", b: "Vamos a tu propiedad un día, la fotografiamos en película, y escribimos el listado en tu voz. Tú apruebas cada palabra." },
      { n: "02", t: "Respondemos a cada huésped.", b: "Las solicitudes llegan a nosotros primero. Filtramos, confirmamos y le damos contexto al huésped antes de que llegue — para que solo conozcas gente que respetará el lugar." },
      { n: "03", t: "Apoyamos en tierra.", b: "Limpieza, mantenimiento, reabastecimiento, urgencias. Nuestro equipo local atiende turnovers y está disponible para los huéspedes, en español e inglés." },
      { n: "04", t: "Pagamos rápido y claro.", b: "75% por noche. Pagado al día siguiente del checkout, por depósito o transferencia, en MXN o USD. Sin niveles, sin tarifas sorpresa, sin descuentos ocultos." },
    ],
    fits_h: "Qué buscamos",
    fits: [
      "Una casa con carácter — adobe, rancho, arquitecto, sin red, todas bienvenidas.",
      "En o cerca de Valle de Guadalupe, El Porvenir, Francisco Zarco, San Antonio.",
      "Para dos o más, disponible al menos 60 noches al año.",
      "Una cama de verdad, agua caliente, y un detalle que no tiene nadie más.",
    ],
    not_fits_h: "Qué no aceptamos",
    not_fits: [
      "Hoteles, torres, cualquier cosa con más de 14 llaves.",
      "Obra nueva sin historia detrás.",
      "Propiedades operadas por una administradora que no conocemos.",
    ],
    splits_h: "Lo que recibes",
    splits: [
      { l: "Tarifa por noche", v: "75%" },
      { l: "Limpieza", v: "100%" },
      { l: "Depósito de daños", v: "100%" },
      { l: "Fotografía y listado", v: "Por nuestra cuenta" },
      { l: "Comisiones de canal (Booking, Vrbo)", v: "Por nuestra cuenta" },
    ],
    form_h: "Cuéntanos de tu lugar",
    f: {
      role: "Quiero hospedar",
      role_stay: "Una casa o casita",
      role_exp: "Una experiencia",
      role_both: "Ambas",
      name: "Tu nombre",
      email: "Correo",
      phone: "Teléfono (con clave país)",
      where: "¿Dónde está?",
      where_ph: "Pueblo, calle, o simplemente \"5 min de Decantos\"",
      kind: "¿Qué es?",
      kind_villa: "Villa",
      kind_casita: "Casita / estudio",
      kind_ranch: "Rancho / varias recámaras",
      kind_off: "Sin red",
      kind_other: "Algo más",
      sleeps: "Para",
      nightly: "Tarifa por noche aproximada (USD)",
      url: "URL de listado existente (Airbnb, Vrbo, tu sitio) — opcional",
      photos: "Sube 3–10 fotos · o pega un link a Drive / Dropbox",
      story: "Cuéntanos la historia",
      story_ph: "Quién la construyó, por qué la compraste, el detalle que le cuentas a cada huésped que llega por primera vez…",
      submit: "Enviar al equipo",
      reply: "Respondemos cada solicitud a mano en menos de cuatro días hábiles. Si queremos visitar, reservamos vuelo.",
      consent: "Soy el propietario o tengo permiso por escrito para listar.",
    },
    proof_h: "Anfitriones en la colección",
    proof: [
      { name: "Marcela y Tomás", home: "Casa de Piedra", since: "Anfitriones desde 2019", quote: "Valle Stays nos manda gente que nota detalles — la luz de las 6, el olor del romero mojado. Nunca un huésped ha dejado la casa peor de como la encontró." },
      { name: "Don Refugio", home: "Rancho Los Olivos", since: "Anfitrión desde 2017", quote: "Soy ranchero, no hotelero. Ellos se encargan de la gente. Yo nomás sirvo el vino y ensillo el caballo." },
    ],
    faq_h: "Preguntas frecuentes",
    faq: [
      { q: "¿Tengo que estar en el sitio?", a: "No. La mayoría de nuestros anfitriones vive en otro lugar. Nuestro equipo local atiende turnovers, reabastecimiento y emergencias." },
      { q: "¿Puedo seguir listando en Airbnb?", a: "Sí — pedimos un pequeño bloque de fechas prioritarias por trimestre, pero conservas tus otros canales y tus reseñas." },
      { q: "¿Cómo deciden qué aceptar?", a: "Honestamente, por sensación. Vamos y caminamos la propiedad. Si nos daría gusto pasar un fin de semana ahí, la listamos." },
      { q: "¿Cuánto cuesta empezar?", a: "Nada. Fotografía, listado, configuración de canales — todo por nuestra cuenta. Solo ganamos cuando tú ganas." },
    ],
    cta: "Cuéntanos de tu lugar",
  },
} as const;

export function HostPage() {
  const { lang } = useLang();
  const h = HOST_COPY[lang];
  const [role, setRole] = useState<"stay" | "exp" | "both">("stay");
  const [kind, setKind] = useState<string>("villa");
  const [openFaq, setOpenFaq] = useState<number>(0);

  return (
    <div className="vs-app vsh-app">
      <Nav active="host" showReserve={false} />

      <main>
        <section className="vsh-hero">
          <div className="vsh-hero-l">
            <div className="vs-eyebrow">{h.eyebrow}</div>
            <h1 className="vsh-h">
              {h.title_1} <em>{h.title_em}</em> {h.title_2}
            </h1>
            <p className="vsh-lede">{h.lede}</p>
            <a href="#form" className="vs-btn vs-btn-dark vsh-cta">
              {h.cta} →
            </a>
          </div>
          <div className="vsh-hero-r">
            <div className="vsh-card vsh-card-1">
              <Placeholder palette={["#8a4a2a", "#d4b896", "#3a2418"]} shape="arch" aspect="3/4" />
            </div>
            <div className="vsh-card vsh-card-2">
              <Placeholder palette={["#5b6b3a", "#d8d2b8", "#1f2418"]} shape="rect" aspect="4/3" />
            </div>
            <div className="vsh-card vsh-card-3">
              <Placeholder palette={["#a06b3a", "#e8d4b0", "#2a1814"]} shape="circle" aspect="1/1" />
            </div>
          </div>
        </section>

        <section className="vsh-why">
          <div className="vs-section-head">
            <div>
              <div className="vs-eyebrow">{h.why_h}</div>
            </div>
          </div>
          <div className="vsh-why-grid">
            {h.why.map((w, i) => (
              <div key={i} className="vsh-why-cell">
                <div className="vsh-why-n">{w.n}</div>
                <h3 className="vsh-why-t">{w.t}</h3>
                <p className="vsh-why-b">{w.b}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="vsh-fit">
          <div className="vsh-fit-col">
            <div className="vs-eyebrow">{h.fits_h}</div>
            <ul className="vsh-fit-list good">
              {h.fits.map((row, i) => (
                <li key={i}>
                  <span className="tick">✓</span>
                  {row}
                </li>
              ))}
            </ul>
          </div>
          <div className="vsh-fit-col">
            <div className="vs-eyebrow">{h.not_fits_h}</div>
            <ul className="vsh-fit-list bad">
              {h.not_fits.map((row, i) => (
                <li key={i}>
                  <span className="cross">×</span>
                  {row}
                </li>
              ))}
            </ul>
          </div>
          <div className="vsh-fit-col">
            <div className="vs-eyebrow">{h.splits_h}</div>
            <ul className="vsh-splits">
              {h.splits.map((row, i) => (
                <li key={i}>
                  <span>{row.l}</span>
                  <strong>{row.v}</strong>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="vsh-proof">
          <div className="vs-section-head">
            <div>
              <div className="vs-eyebrow">{h.proof_h}</div>
            </div>
          </div>
          <div className="vsh-proof-grid">
            {h.proof.map((p, i) => (
              <figure key={i} className="vsh-proof-cell">
                <blockquote>&quot;{p.quote}&quot;</blockquote>
                <figcaption>
                  <strong>{p.name}</strong>
                  <span>{p.home}</span>
                  <span>{p.since}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section id="form" className="vsh-form">
          <div className="vsh-form-l">
            <div className="vs-eyebrow">{h.form_h}</div>
            <h2 className="vsh-form-h">
              {lang === "en"
                ? "We'll write back within four business days."
                : "Te escribimos en menos de cuatro días hábiles."}
            </h2>
            <p className="vsh-form-note">{h.f.reply}</p>
          </div>
          <form
            className="vsh-form-r"
            onSubmit={(e) => {
              e.preventDefault();
              alert(
                lang === "en"
                  ? "Submitted — we'll be in touch."
                  : "Enviado — te contactamos pronto."
              );
            }}
          >
            <div className="vsh-field">
              <label>{h.f.role}</label>
              <div className="vsh-radios">
                {(
                  [
                    ["stay", h.f.role_stay],
                    ["exp", h.f.role_exp],
                    ["both", h.f.role_both],
                  ] as const
                ).map(([id, l]) => (
                  <button
                    type="button"
                    key={id}
                    className={"vsh-radio " + (role === id ? "on" : "")}
                    onClick={() => setRole(id as "stay" | "exp" | "both")}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="vsh-row">
              <div className="vsh-field">
                <label>{h.f.name}</label>
                <input required />
              </div>
              <div className="vsh-field">
                <label>{h.f.email}</label>
                <input type="email" required />
              </div>
            </div>
            <div className="vsh-row">
              <div className="vsh-field">
                <label>{h.f.phone}</label>
                <input type="tel" />
              </div>
              <div className="vsh-field">
                <label>{h.f.where}</label>
                <input placeholder={h.f.where_ph} />
              </div>
            </div>
            {role !== "exp" && (
              <>
                <div className="vsh-field">
                  <label>{h.f.kind}</label>
                  <div className="vsh-radios">
                    {(
                      [
                        ["villa", h.f.kind_villa],
                        ["casita", h.f.kind_casita],
                        ["ranch", h.f.kind_ranch],
                        ["off", h.f.kind_off],
                        ["other", h.f.kind_other],
                      ] as const
                    ).map(([id, l]) => (
                      <button
                        type="button"
                        key={id}
                        className={"vsh-radio " + (kind === id ? "on" : "")}
                        onClick={() => setKind(id)}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="vsh-row">
                  <div className="vsh-field">
                    <label>{h.f.sleeps}</label>
                    <input type="number" min={1} defaultValue={4} />
                  </div>
                  <div className="vsh-field">
                    <label>{h.f.nightly}</label>
                    <input type="number" min={0} placeholder="450" />
                  </div>
                </div>
              </>
            )}
            <div className="vsh-field">
              <label>{h.f.url}</label>
              <input type="url" placeholder="https://" />
            </div>
            <div className="vsh-field vsh-field-drop">
              <label>{h.f.photos}</label>
              <div className="vsh-drop">
                <span>↑ {lang === "en" ? "drag photos or click" : "arrastra fotos o haz clic"}</span>
              </div>
            </div>
            <div className="vsh-field">
              <label>{h.f.story}</label>
              <textarea rows={5} placeholder={h.f.story_ph}></textarea>
            </div>
            <label className="vsh-consent">
              <input type="checkbox" required />
              <span>{h.f.consent}</span>
            </label>
            <button className="vs-btn vs-btn-dark vsh-submit" type="submit">
              {h.f.submit} →
            </button>
          </form>
        </section>

        <section className="vsh-faq">
          <div className="vs-section-head">
            <div>
              <div className="vs-eyebrow">{h.faq_h}</div>
            </div>
          </div>
          <ul className="vsh-faq-list">
            {h.faq.map((row, i) => (
              <li
                key={i}
                className={openFaq === i ? "open" : ""}
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
              >
                <div className="vsh-faq-q">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <strong>{row.q}</strong>
                  <em>{openFaq === i ? "−" : "+"}</em>
                </div>
                {openFaq === i && <div className="vsh-faq-a">{row.a}</div>}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
