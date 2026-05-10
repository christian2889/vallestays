"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PROPERTIES } from "@/lib/data";
import { useLang } from "@/components/LangContext";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Placeholder } from "@/components/Placeholder";

const SEARCH_COPY = {
  en: {
    h_eyebrow: "Find a stay",
    h_title_1: "Twelve homes,",
    h_title_em: "filtered by feeling.",
    h_lede:
      "Use the filters or browse the whole valley. Every home is hand-visited and hand-photographed by us.",
    f_when: "When",
    f_when_v: "Apr 12 — Apr 16 · 4 nights",
    f_who: "Who",
    f_who_v: "2 adults",
    f_kind: "Kind of home",
    f_view: "Views",
    f_price: "Nightly under",
    sort_by: "Sort by",
    sort_pick: "Our picks",
    sort_low: "Lowest nightly",
    sort_high: "Highest nightly",
    sort_size: "Most beds",
    results: "homes",
    none: "No homes match. Loosen a filter.",
    map_label: "Map of the valley",
    reset: "Reset filters",
    nightly: "/ night",
    sleeps: "Sleeps",
    bookable: "Available these dates",
    waitlist: "Waitlist",
  },
  es: {
    h_eyebrow: "Buscar casa",
    h_title_1: "Doce casas,",
    h_title_em: "filtradas por sensación.",
    h_lede:
      "Usa los filtros o pasea por todo el valle. Cada casa la visitamos y fotografiamos en persona.",
    f_when: "Cuándo",
    f_when_v: "12 abr — 16 abr · 4 noches",
    f_who: "Quién",
    f_who_v: "2 adultos",
    f_kind: "Tipo de casa",
    f_view: "Vistas",
    f_price: "Por noche bajo",
    sort_by: "Ordenar por",
    sort_pick: "Selección Valle",
    sort_low: "Precio menor",
    sort_high: "Precio mayor",
    sort_size: "Más camas",
    results: "casas",
    none: "Ninguna casa coincide. Suelta un filtro.",
    map_label: "Mapa del valle",
    reset: "Limpiar filtros",
    nightly: "/ noche",
    sleeps: "Para",
    bookable: "Disponible esas fechas",
    waitlist: "Lista de espera",
  },
} as const;

const KINDS = [
  { id: "all", label_en: "All", label_es: "Todas" },
  { id: "villa", label_en: "Villas", label_es: "Villas" },
  { id: "casita", label_en: "Casitas", label_es: "Casitas" },
  { id: "ranch", label_en: "Ranches", label_es: "Ranchos" },
];

const VIEWS = [
  { id: "any", label_en: "Any", label_es: "Cualquiera" },
  { id: "vineyard", label_en: "Vineyard", label_es: "Viñedo" },
  { id: "view", label_en: "Valley view", label_es: "Vista al valle" },
  { id: "off-grid", label_en: "Off-grid", label_es: "Sin red" },
];

const SORTS = ["pick", "low", "high", "size"] as const;

export function SearchPage() {
  const { lang } = useLang();
  const s = SEARCH_COPY[lang];

  const [kind, setKind] = useState<string>("all");
  const [view, setView] = useState<string>("any");
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [sort, setSort] = useState<(typeof SORTS)[number]>("pick");
  const [hover, setHover] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let r = PROPERTIES.filter(
      (p) =>
        (kind === "all" || p.type === kind) &&
        (view === "any" || p.tags.includes(view)) &&
        p.nightly <= maxPrice
    );
    if (sort === "low") r = [...r].sort((a, b) => a.nightly - b.nightly);
    if (sort === "high") r = [...r].sort((a, b) => b.nightly - a.nightly);
    if (sort === "size") r = [...r].sort((a, b) => b.beds - a.beds);
    return r;
  }, [kind, view, maxPrice, sort]);

  const points = useMemo(() => {
    const seed = (str: string) => {
      let h = 0;
      for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
      return Math.abs(h);
    };
    return PROPERTIES.map((p) => ({
      id: p.id,
      x: 80 + (seed(p.id) % 540),
      y: 80 + (seed(p.id + "y") % 320),
    }));
  }, []);

  const reset = () => {
    setKind("all");
    setView("any");
    setMaxPrice(1500);
    setSort("pick");
  };

  return (
    <div className="vs-app vss-app">
      <Nav active="search" showReserve={false} />

      <main>
        <section className="vss-hero">
          <div className="vs-eyebrow">{s.h_eyebrow}</div>
          <h1 className="vss-h">
            {s.h_title_1} <em>{s.h_title_em}</em>
          </h1>
          <p className="vss-lede">{s.h_lede}</p>

          <div className="vss-quickbar">
            <div className="vss-qb-cell">
              <span>{s.f_when}</span>
              <strong>{s.f_when_v}</strong>
            </div>
            <div className="vss-qb-cell">
              <span>{s.f_who}</span>
              <strong>{s.f_who_v}</strong>
            </div>
            <div className="vss-qb-cell">
              <span>{s.f_view}</span>
              <select value={view} onChange={(e) => setView(e.target.value)}>
                {VIEWS.map((v) => (
                  <option key={v.id} value={v.id}>
                    {lang === "en" ? v.label_en : v.label_es}
                  </option>
                ))}
              </select>
            </div>
            <div className="vss-qb-cell">
              <span>{s.f_kind}</span>
              <select value={kind} onChange={(e) => setKind(e.target.value)}>
                {KINDS.map((k) => (
                  <option key={k.id} value={k.id}>
                    {lang === "en" ? k.label_en : k.label_es}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="vss-body">
          <aside className="vss-rail">
            <div className="vss-rail-h">
              <span>
                {filtered.length} {s.results}
              </span>
              <button className="vss-reset" onClick={reset}>
                {s.reset}
              </button>
            </div>

            <div className="vss-rail-block">
              <div className="vs-eyebrow">{s.f_kind}</div>
              <div className="vss-chips">
                {KINDS.map((k) => (
                  <button
                    key={k.id}
                    className={"vss-chip " + (kind === k.id ? "on" : "")}
                    onClick={() => setKind(k.id)}
                  >
                    {lang === "en" ? k.label_en : k.label_es}
                  </button>
                ))}
              </div>
            </div>

            <div className="vss-rail-block">
              <div className="vs-eyebrow">{s.f_view}</div>
              <div className="vss-chips">
                {VIEWS.map((v) => (
                  <button
                    key={v.id}
                    className={"vss-chip " + (view === v.id ? "on" : "")}
                    onClick={() => setView(v.id)}
                  >
                    {lang === "en" ? v.label_en : v.label_es}
                  </button>
                ))}
              </div>
            </div>

            <div className="vss-rail-block">
              <div className="vs-eyebrow">{s.f_price}</div>
              <input
                type="range"
                min={200}
                max={1500}
                step={25}
                value={maxPrice}
                onChange={(e) => setMaxPrice(+e.target.value)}
                className="vss-range"
              />
              <div className="vss-range-vals">
                <span>$200</span>
                <strong>${maxPrice}</strong>
                <span>$1,500</span>
              </div>
            </div>

            <div className="vss-rail-block">
              <div className="vs-eyebrow">{s.map_label}</div>
              <div className="vss-map">
                <svg viewBox="0 0 700 480" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <pattern id="vss-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M40 0H0V40" fill="none" stroke="#0000000a" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="700" height="480" fill="#f7f3ec" />
                  <rect width="700" height="480" fill="url(#vss-grid)" />
                  <path
                    d="M60 120 Q 200 60 380 90 T 660 180 Q 600 360 380 380 T 80 320 Z"
                    fill="#e8d4a8"
                    stroke="#0003"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                  />
                  <path
                    d="M40 240 Q 220 220 380 250 T 680 230"
                    fill="none"
                    stroke="#bd5a2a"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                  />
                  {points.map((p) => {
                    const prop = PROPERTIES.find((x) => x.id === p.id)!;
                    const inResults = filtered.some((x) => x.id === p.id);
                    const isHover = hover === p.id;
                    return (
                      <g key={p.id} opacity={inResults ? 1 : 0.22}>
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={isHover ? 14 : 9}
                          fill={isHover ? "#bd5a2a" : "#f7f3ec"}
                          stroke="#1a1814"
                          strokeWidth="1.2"
                        />
                        <text
                          x={p.x}
                          y={p.y + 4}
                          textAnchor="middle"
                          fontSize="10"
                          fontFamily="JetBrains Mono, monospace"
                          fill="#1a1814"
                        >
                          ${prop.nightly}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </aside>

          <div className="vss-results">
            <div className="vss-results-h">
              <div>
                <strong>{filtered.length}</strong>
                <span> {s.results}</span>
              </div>
              <div className="vss-sort">
                <span>{s.sort_by}</span>
                <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
                  {SORTS.map((k) => (
                    <option key={k} value={k}>
                      {s["sort_" + k as keyof typeof s] as string}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filtered.length === 0 && <div className="vss-none">{s.none}</div>}

            <div className="vss-list">
              {filtered.map((p, i) => {
                const avail = i % 5 !== 2;
                return (
                  <Link
                    key={p.id}
                    href={`/stay?id=${p.id}&lang=${lang}`}
                    className="vss-card"
                    onMouseEnter={() => setHover(p.id)}
                    onMouseLeave={() => setHover(null)}
                  >
                    <div className="vss-card-img">
                      <Placeholder palette={p.palette} shape={p.shape} aspect="4/3" />
                      <div className="vss-card-tag">
                        <i style={{ background: avail ? "#5b9b5b" : "#bd5a2a" }}></i>
                        {avail ? s.bookable : s.waitlist}
                      </div>
                    </div>
                    <div className="vss-card-body">
                      <div className="vss-card-meta">
                        <span>{String(i + 1).padStart(2, "0")}</span>
                        <span>{p.locale[lang]}</span>
                      </div>
                      <h3 className="vss-card-name">{p.name}</h3>
                      <p className="vss-card-desc">{p.desc[lang]}</p>
                      <div className="vss-card-foot">
                        <div className="vss-card-stats">
                          <span>
                            {s.sleeps} {p.sleeps}
                          </span>
                          <span>·</span>
                          <span>
                            {p.beds} {lang === "en" ? "beds" : "camas"}
                          </span>
                          <span>·</span>
                          <span>
                            {p.baths} {lang === "en" ? "baths" : "baños"}
                          </span>
                        </div>
                        <div className="vss-card-price">
                          <strong>${p.nightly}</strong>
                          <span> USD {s.nightly}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
