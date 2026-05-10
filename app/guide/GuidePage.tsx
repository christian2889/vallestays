"use client";

import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/components/LangContext";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

type GuideKind = "wine" | "food" | "do" | "shop";

type GuidePlace = {
  id: string;
  kind: GuideKind;
  name: string;
  x: number;
  y: number;
  note: { en: string; es: string };
};

const GUIDE_PLACES: GuidePlace[] = [
  { id: "lechuza",   kind: "wine", name: "Lechuza Vineyard",     x: 320, y: 380, note: { en: "Family-run since 2007. Pour by appointment, often by Ray himself.", es: "Familiar desde 2007. Cata con cita, a veces con Ray mismo." } },
  { id: "vena-cava", kind: "wine", name: "Vena Cava",            x: 480, y: 290, note: { en: "Wine cave built from upcycled fishing boats.", es: "Cava construida con botes de pesca reciclados." } },
  { id: "decantos",  kind: "wine", name: "Decantos Vinícola",    x: 620, y: 460, note: { en: "Gravity-fed winery with the best terrace in the valley.", es: "Vinícola por gravedad con la mejor terraza del valle." } },
  { id: "rubio",     kind: "wine", name: "Bodegas F. Rubio",     x: 410, y: 540, note: { en: "Dry-farmed Tempranillo. Quietest tasting room.", es: "Tempranillo de secano. La sala de cata más tranquila." } },
  { id: "monte-xanic", kind: "wine", name: "Monte Xanic",        x: 720, y: 360, note: { en: "The valley's first boutique winery (1987). Reds age beautifully.", es: "La primera vinícola boutique (1987). Tintos que envejecen bonito." } },
  { id: "deckmans",  kind: "food", name: "Deckman's en el Mogor", x: 380, y: 200, note: { en: "Open-fire kitchen in a vineyard. Drew Deckman cooks five nights a week.", es: "Cocina al aire libre en un viñedo. Drew Deckman cocina cinco noches." } },
  { id: "fauna",     kind: "food", name: "Fauna",                x: 560, y: 600, note: { en: "Tasting menu inside Bruma. Twelve courses, six glasses.", es: "Menú degustación en Bruma. Doce tiempos, seis copas." } },
  { id: "corazon",   kind: "food", name: "Corazón de Tierra",    x: 270, y: 460, note: { en: "Garden-to-table at the foot of a hill. Lunch only on Sundays.", es: "De la huerta a la mesa al pie del cerro. Solo comida los domingos." } },
  { id: "malva",     kind: "food", name: "Malva",                x: 660, y: 220, note: { en: "Roberto Alcocer's restaurant inside Mina Penélope. Quiet, perfect.", es: "El restaurante de Roberto Alcocer en Mina Penélope. Silencioso, perfecto." } },
  { id: "popotla",   kind: "food", name: "Mercado de Popotla",   x: 140, y: 700, note: { en: "Fish market 40 min west. Buy a kilo of clams, eat them on the rocks.", es: "Mercado de pescado a 40 min al oeste. Compra un kilo de almejas, cómelas en las rocas." } },
  { id: "olivos",    kind: "do",   name: "Rancho Los Olivos",    x: 480, y: 700, note: { en: "Sunrise horseback rides through olive groves.", es: "Cabalgatas al amanecer entre olivos." } },
  { id: "bahia",     kind: "do",   name: "Bahía Falsa Oysters",  x: 100, y: 540, note: { en: "Oyster farm on the lagoon. Bring a bottle of Chenin.", es: "Granja de ostras en la laguna. Lleva una botella de Chenin." } },
  { id: "pozo",      kind: "do",   name: "Pozo Cuatro Vientos",  x: 540, y: 540, note: { en: "Hot springs above the valley. Best at 4am with a thermos.", es: "Aguas termales sobre el valle. Mejor a las 4am con termo." } },
  { id: "salvador",  kind: "shop", name: "Quesos Ramonetti",     x: 720, y: 580, note: { en: "Three generations of cheesemakers. Aged provolone, fresh queso fresco.", es: "Tres generaciones de queseros. Provolone añejo, queso fresco." } },
  { id: "panera",    kind: "shop", name: "Panadería La Espiga",  x: 240, y: 280, note: { en: "Wood-fired sourdough. Sells out before 10am Saturdays.", es: "Pan de masa madre al horno de leña. Se acaba antes de las 10am los sábados." } },
  { id: "casa-frida-w", kind: "wine", name: "Casa Frida · Bodega", x: 560, y: 410, note: { en: "Boutique winery & restaurant on a single ranch. Try the Nebbiolo before lunch.", es: "Vinícola y restaurante en un mismo rancho. Prueba el Nebbiolo antes de comer." } },
  { id: "casa-frida-f", kind: "food", name: "Casa Frida · Mesa",   x: 590, y: 440, note: { en: "Open-fire kitchen by chef Mariana de la Vega. Mesa larga only — you'll meet your neighbors.", es: "Cocina al fuego de la chef Mariana de la Vega. Solo mesa larga — vas a conocer a tus vecinos." } },
];

const GUIDE_COPY = {
  en: {
    eyebrow: "Field guide · Spring 2026",
    title_1: "Two days,",
    title_em: "or twenty.",
    lede: "The places we send our own friends. Hand-curated from a decade of living and eating in the valley. We update this list every season; we never accept comps.",
    filters: [
      ["all", "Everything"], ["wine", "Wineries"], ["food", "Tables"], ["do", "Things to do"], ["shop", "Markets"],
    ] as const,
    kind_label: { wine: "Wine", food: "Table", do: "Outdoors", shop: "Market" } as Record<GuideKind, string>,
    map_h: "The valley, on one page",
    map_sub: "Roughly 18 km from the entrance at El Sauzal to the back of El Tigre.",
    legend_wine: "Winery",
    legend_food: "Restaurant",
    legend_do: "Outdoors",
    legend_shop: "Market",
    iti_h: "Three itineraries we love",
    iti_lede: "Pick one and bend it. The valley rewards a slow morning.",
    iti: [
      { tag: "Long weekend", days: "3 days · 2 nights", title: "First-time tasting", body: "Arrive Friday late, dinner at Deckman's, sleep early. Saturday: three wineries before lunch (Lechuza, Vena Cava, Monte Xanic), long lunch at Corazón de Tierra, swim at the house. Sunday: market in San Antonio, tasting menu at Fauna, drive home Monday." },
      { tag: "For two", days: "5 days · 4 nights", title: "Anniversary, slow", body: "Two wineries a day, never more. Cellar tour at F. Rubio. In-home temazcal one night. Hot-air balloon at dawn the last morning. We pre-book the table at Malva." },
      { tag: "With friends", days: "7 days · 6 nights", title: "A house, six people, no rush", body: "Take Casa Tres Mujeres or Rancho Los Olivos. Cook three nights at the house with a chef we send. Two wine days, two beach days (Ensenada oysters, La Bufadora), one rest day. Drivers all week." },
    ],
    season_h: "When to come",
    season: [
      { mo: "Mar — May", title: "Wildflowers", body: "Coolest mornings, bright afternoons. Vineyards still green. Few tourists." },
      { mo: "Jun — Aug", title: "Long days", body: "Hot at noon, perfect at 7pm. Fiestas de la Vendimia is the big August event — book six months out." },
      { mo: "Sep — Oct", title: "Harvest", body: "Smell of fermenting grapes everywhere. Best for serious wine drinkers. Restaurants at their peak." },
      { mo: "Nov — Feb", title: "Quiet & golden", body: "Vines bare, hills green from the rains. Fireplaces lit. Our personal favorite." },
    ],
    cta_h: "Want this on paper?",
    cta_body: "We mail every confirmed guest a printed copy of the guide, signed and updated, the week before they arrive.",
    cta_btn: "Reserve a stay",
  },
  es: {
    eyebrow: "Guía de campo · Primavera 2026",
    title_1: "Dos días,",
    title_em: "o veinte.",
    lede: "Los lugares a los que mandamos a nuestros propios amigos. Curado a mano por una década viviendo y comiendo aquí. Actualizamos cada temporada; nunca aceptamos cortesías.",
    filters: [
      ["all", "Todo"], ["wine", "Vinícolas"], ["food", "Mesas"], ["do", "Actividades"], ["shop", "Mercados"],
    ] as const,
    kind_label: { wine: "Vino", food: "Mesa", do: "Aire libre", shop: "Mercado" } as Record<GuideKind, string>,
    map_h: "El valle, en una página",
    map_sub: "Unos 18 km desde la entrada en El Sauzal hasta el fondo de El Tigre.",
    legend_wine: "Vinícola",
    legend_food: "Restaurante",
    legend_do: "Aire libre",
    legend_shop: "Mercado",
    iti_h: "Tres itinerarios que amamos",
    iti_lede: "Elige uno y dóblalo. El valle premia las mañanas lentas.",
    iti: [
      { tag: "Fin de semana largo", days: "3 días · 2 noches", title: "Primera cata", body: "Llegan el viernes tarde, cena en Deckman's, a dormir temprano. Sábado: tres vinícolas antes de comer (Lechuza, Vena Cava, Monte Xanic), comida larga en Corazón de Tierra, alberca en la casa. Domingo: mercado en San Antonio, menú en Fauna, regreso el lunes." },
      { tag: "Para dos", days: "5 días · 4 noches", title: "Aniversario, sin prisa", body: "Dos vinícolas al día, nunca más. Tour de cava en F. Rubio. Temazcal en casa una noche. Globo aerostático al amanecer la última mañana. Reservamos la mesa en Malva." },
      { tag: "Con amigos", days: "7 días · 6 noches", title: "Una casa, seis personas, sin prisa", body: "Tomen Casa Tres Mujeres o Rancho Los Olivos. Cocinen tres noches con un chef que mandamos. Dos días de vino, dos de playa (ostras de Ensenada, La Bufadora), uno de descanso. Choferes toda la semana." },
    ],
    season_h: "Cuándo venir",
    season: [
      { mo: "Mar — May", title: "Flores silvestres", body: "Mañanas frescas, tardes brillantes. Viñedos aún verdes. Pocos turistas." },
      { mo: "Jun — Ago", title: "Días largos", body: "Calor al mediodía, perfecto a las 7pm. Las Fiestas de la Vendimia (agosto) son el gran evento — reservar con seis meses." },
      { mo: "Sep — Oct", title: "Vendimia", body: "Olor a mosto en todo el valle. Lo mejor para amantes serios del vino. Restaurantes en su punto." },
      { mo: "Nov — Feb", title: "Quieto y dorado", body: "Vides desnudas, cerros verdes por las lluvias. Chimeneas encendidas. Nuestra temporada favorita." },
    ],
    cta_h: "¿Lo quieres en papel?",
    cta_body: "A cada huésped confirmado le mandamos una copia impresa, firmada y actualizada, la semana antes de su llegada.",
    cta_btn: "Reservar una casa",
  },
} as const;

const COLORS: Record<GuideKind, string> = {
  wine: "#b04a2f",
  food: "#5b6b3a",
  do: "#3a5e7e",
  shop: "#8a5a2a",
};

function GuideMap({
  filter,
  hover,
  setHover,
}: {
  filter: string;
  hover: string | null;
  setHover: (id: string | null) => void;
}) {
  const visible = filter === "all" ? GUIDE_PLACES : GUIDE_PLACES.filter((p) => p.kind === filter);

  return (
    <div className="vsg-map">
      <svg viewBox="0 0 900 800" preserveAspectRatio="xMidYMid meet">
        <rect width="900" height="800" fill="var(--vs-paper)" />
        {[120, 180, 240, 300, 360].map((y, i) => (
          <path
            key={i}
            d={`M -20 ${y} Q 200 ${y - 30 - i * 5} 450 ${y} T 920 ${y - 10}`}
            stroke="var(--vs-line)"
            fill="none"
            opacity={0.6 - i * 0.08}
          />
        ))}
        <path
          d="M 0 80 L 100 50 L 180 100 L 260 40 L 340 90 L 440 30 L 520 80 L 620 50 L 720 100 L 820 60 L 900 90 L 900 0 L 0 0 Z"
          fill="var(--vs-line)"
          opacity="0.35"
        />
        <path
          d="M 20 320 Q 220 280 460 340 T 880 360"
          stroke="var(--vs-ink)"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M 20 320 Q 220 280 460 340 T 880 360"
          stroke="var(--vs-bg)"
          strokeWidth="1"
          fill="none"
          strokeDasharray="6 6"
        />
        <text x="40" y="310" fontFamily="var(--vs-mono)" fontSize="10" fill="var(--vs-muted)" letterSpacing="2">
          CARRETERA FEDERAL 3
        </text>

        <path d="M 280 340 Q 270 480 360 600" stroke="var(--vs-muted)" strokeWidth="1" strokeDasharray="3 4" fill="none" opacity="0.7" />
        <path d="M 540 340 Q 580 500 620 680" stroke="var(--vs-muted)" strokeWidth="1" strokeDasharray="3 4" fill="none" opacity="0.7" />
        <path d="M 700 350 Q 760 460 800 600" stroke="var(--vs-muted)" strokeWidth="1" strokeDasharray="3 4" fill="none" opacity="0.7" />

        {([
          [400, 420],
          [600, 460],
          [200, 540],
          [700, 540],
        ] as [number, number][]).map(([cx, cy], i) => (
          <g key={i} transform={`translate(${cx} ${cy}) rotate(${i * 8 - 12})`}>
            {Array.from({ length: 6 }).map((_, j) => (
              <line
                key={j}
                x1={-40}
                y1={-12 + j * 5}
                x2={40}
                y2={-12 + j * 5}
                stroke="var(--vs-line)"
                strokeWidth="0.7"
                opacity="0.6"
              />
            ))}
          </g>
        ))}

        <text x="60" y="180" fontFamily="var(--vs-display)" fontSize="22" fill="var(--vs-muted)" fontStyle="italic">
          Sierra de San Pedro Mártir
        </text>
        <text x="60" y="760" fontFamily="var(--vs-display)" fontSize="18" fill="var(--vs-muted)" fontStyle="italic">
          Pacífico
        </text>
        <text x="80" y="368" fontFamily="var(--vs-mono)" fontSize="9" fill="var(--vs-muted)" letterSpacing="1.5">
          EL SAUZAL →
        </text>
        <text x="800" y="380" fontFamily="var(--vs-mono)" fontSize="9" fill="var(--vs-muted)" letterSpacing="1.5">
          → TECATE
        </text>

        {visible.map((p) => {
          const c = COLORS[p.kind];
          const active = hover === p.id;
          return (
            <g
              key={p.id}
              transform={`translate(${p.x} ${p.y})`}
              onMouseEnter={() => setHover(p.id)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: "pointer" }}
            >
              <circle r={active ? 28 : 18} fill={c} fillOpacity="0.18" />
              <circle r={active ? 14 : 9} fill={c} fillOpacity="0.4" />
              <circle r="4" fill={c} />
              <text
                x="10"
                y="4"
                fontFamily="var(--vs-mono)"
                fontSize={active ? "12" : "10"}
                fontWeight={active ? "500" : "400"}
                fill="var(--vs-ink)"
              >
                {p.name}
              </text>
            </g>
          );
        })}

        <g transform="translate(820 700)">
          <circle r="22" fill="none" stroke="var(--vs-line)" />
          <line x1="0" y1="-18" x2="0" y2="18" stroke="var(--vs-ink)" />
          <line x1="-18" y1="0" x2="18" y2="0" stroke="var(--vs-line)" />
          <text x="0" y="-26" textAnchor="middle" fontFamily="var(--vs-mono)" fontSize="10" fill="var(--vs-ink)">
            N
          </text>
        </g>
      </svg>
    </div>
  );
}

export function GuidePage() {
  const { lang } = useLang();
  const [filter, setFilter] = useState<string>("all");
  const [hover, setHover] = useState<string | null>(null);
  const g = GUIDE_COPY[lang];

  const list =
    filter === "all"
      ? GUIDE_PLACES
      : GUIDE_PLACES.filter((p) => p.kind === filter);

  return (
    <div className="vs-app vsg-app">
      <Nav active="guide" />

      <main>
        <section className="vsg-hero">
          <div className="vs-eyebrow">{g.eyebrow}</div>
          <h1 className="vsg-title">
            {g.title_1} <em>{g.title_em}</em>
          </h1>
          <p className="vsg-lede">{g.lede}</p>
        </section>

        <section className="vsg-map-block">
          <div className="vsg-map-h">
            <div>
              <div className="vs-eyebrow">{g.map_h}</div>
              <p>{g.map_sub}</p>
            </div>
            <div className="vsg-map-legend">
              {(["wine", "food", "do", "shop"] as GuideKind[]).map((k) => (
                <span key={k}>
                  <i style={{ background: COLORS[k] }} />
                  {g[`legend_${k}` as keyof typeof g] as string}
                </span>
              ))}
            </div>
          </div>
          <GuideMap filter={filter} hover={hover} setHover={setHover} />
        </section>

        <section className="vsg-list-block">
          <div className="vs-filters">
            {g.filters.map(([k, label]) => (
              <button
                key={k}
                className={"vs-chip " + (filter === k ? "on" : "")}
                onClick={() => setFilter(k)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="vsg-list">
            {list.map((p, i) => (
              <article
                key={p.id}
                className={"vsg-row " + (hover === p.id ? "on" : "")}
                onMouseEnter={() => setHover(p.id)}
                onMouseLeave={() => setHover(null)}
              >
                <span className="vsg-row-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="vsg-row-kind" style={{ color: COLORS[p.kind] }}>
                  <i style={{ background: COLORS[p.kind] }} />
                  {g.kind_label[p.kind]}
                </span>
                <h3 className="vsg-row-name">{p.name}</h3>
                <p className="vsg-row-note">{p.note[lang]}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="vsg-iti-block">
          <div className="vs-section-head">
            <div>
              <div className="vs-eyebrow">{g.iti_h}</div>
              <h2 className="vs-section-title">{g.iti_lede}</h2>
            </div>
          </div>
          <div className="vsg-iti-grid">
            {g.iti.map((it, i) => (
              <article key={i} className="vsg-iti">
                <div className="vsg-iti-head">
                  <span className="vsg-iti-tag">
                    {String(i + 1).padStart(2, "0")} · {it.tag}
                  </span>
                  <span className="vsg-iti-days">{it.days}</span>
                </div>
                <h3 className="vsg-iti-title">{it.title}</h3>
                <p className="vsg-iti-body">{it.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="vsg-season-block">
          <div className="vs-section-head">
            <div>
              <div className="vs-eyebrow">{g.season_h}</div>
            </div>
          </div>
          <div className="vsg-season-grid">
            {g.season.map((s, i) => (
              <div key={i} className="vsg-season">
                <div className="vsg-season-mo">{s.mo}</div>
                <h4 className="vsg-season-t">{s.title}</h4>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="vsg-cta-block">
          <div className="vsg-cta">
            <div className="vs-eyebrow">{g.cta_h}</div>
            <p>{g.cta_body}</p>
            <Link href={`/?lang=${lang}#reserve`} className="vs-btn vs-btn-line">
              {g.cta_btn} →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
