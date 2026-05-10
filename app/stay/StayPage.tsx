"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { PROPERTIES, STAY_COPY, getStayDetail, type Property } from "@/lib/data";
import { useLang } from "@/components/LangContext";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Placeholder } from "@/components/Placeholder";
import { StayCard } from "@/components/StayCard";

type CalRange = { start: Date | null; end: Date | null };

function MiniCalendar({
  s,
  range,
  setRange,
  unavailable,
}: {
  s: (typeof STAY_COPY)["en"] | (typeof STAY_COPY)["es"];
  range: CalRange;
  setRange: (r: CalRange) => void;
  unavailable: Date[];
}) {
  const [view, setView] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  function shift(n: number) {
    const d = new Date(view);
    d.setMonth(d.getMonth() + n);
    setView(d);
  }

  function renderMonth(monthDate: Date) {
    const y = monthDate.getFullYear();
    const m = monthDate.getMonth();
    const first = new Date(y, m, 1).getDay();
    const len = new Date(y, m + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < first; i++) cells.push(null);
    for (let d = 1; d <= len; d++) cells.push(new Date(y, m, d));
    while (cells.length < 42) cells.push(null);
    return { y, m, cells };
  }

  function fmt(d: Date | null) {
    return d ? `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` : "";
  }
  function inRange(d: Date | null) {
    if (!range.start || !range.end || !d) return false;
    return d >= range.start && d <= range.end;
  }
  function isStart(d: Date | null) {
    return !!(range.start && d && fmt(d) === fmt(range.start));
  }
  function isEnd(d: Date | null) {
    return !!(range.end && d && fmt(d) === fmt(range.end));
  }
  function isUnavail(d: Date | null) {
    return !!d && unavailable.some((u) => fmt(u) === fmt(d));
  }
  function isPast(d: Date | null) {
    return !!d && d < new Date(new Date().setHours(0, 0, 0, 0));
  }

  function pick(d: Date | null) {
    if (!d || isUnavail(d) || isPast(d)) return;
    if (!range.start || (range.start && range.end)) {
      setRange({ start: d, end: null });
    } else if (d < range.start) {
      setRange({ start: d, end: range.start });
    } else {
      setRange({ start: range.start, end: d });
    }
  }

  const m1 = renderMonth(view);
  const v2 = new Date(view);
  v2.setMonth(v2.getMonth() + 1);
  const m2 = renderMonth(v2);

  const Month = ({ data }: { data: ReturnType<typeof renderMonth> }) => (
    <div className="vsd-cal-month">
      <div className="vsd-cal-h">
        {s.months[data.m]} {data.y}
      </div>
      <div className="vsd-cal-grid">
        {s.days.map((d, i) => (
          <div key={i} className="vsd-cal-dh">
            {d}
          </div>
        ))}
        {data.cells.map((d, i) => {
          const cls = ["vsd-cal-c"];
          if (!d) cls.push("empty");
          else if (isPast(d) || isUnavail(d)) cls.push("off");
          if (isStart(d)) cls.push("start");
          if (isEnd(d)) cls.push("end");
          if (inRange(d) && !isStart(d) && !isEnd(d)) cls.push("in");
          return (
            <div key={i} className={cls.join(" ")} onClick={() => pick(d)}>
              {d ? d.getDate() : ""}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="vsd-cal">
      <div className="vsd-cal-nav">
        <button onClick={() => shift(-1)}>←</button>
        <button onClick={() => shift(1)}>→</button>
      </div>
      <Month data={m1} />
      <Month data={m2} />
      <div className="vsd-cal-legend">
        <span>
          <i className="dot avail" />
          {s.cal_legend_avail}
        </span>
        <span>
          <i className="dot busy" />
          {s.cal_legend_busy}
        </span>
        <span>
          <i className="dot min" />
          {s.cal_legend_min}
        </span>
      </div>
    </div>
  );
}

function BookingWidget({
  p,
  s,
  lang,
}: {
  p: Property;
  s: (typeof STAY_COPY)["en"] | (typeof STAY_COPY)["es"];
  lang: "en" | "es";
}) {
  const unavailable = useMemo(() => {
    const out: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    [3, 4, 5, 14, 15, 22, 23, 24, 25, 38, 39, 40, 55, 56].forEach((off) => {
      const d = new Date(today);
      d.setDate(d.getDate() + off);
      out.push(d);
    });
    return out;
  }, []);

  const [range, setRange] = useState<CalRange>(() => {
    const start = new Date();
    start.setDate(start.getDate() + 9);
    const end = new Date(start);
    end.setDate(end.getDate() + 4);
    return { start, end };
  });
  const [guests, setGuests] = useState(2);

  const nights =
    range.start && range.end
      ? Math.max(1, Math.round((range.end.getTime() - range.start.getTime()) / 86400000))
      : 0;
  const sub = nights * p.nightly;
  const clean = 220;
  const steward = Math.round(sub * 0.06);
  const total = sub + clean + steward;

  function fmt(d: Date | null) {
    if (!d) return "—";
    return `${s.months[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
  }

  return (
    <aside className="vsd-book">
      <div className="vsd-book-h">{s.book_h}</div>
      <div className="vsd-book-price">
        <span className="n">${p.nightly}</span>
        <span className="u">USD / night</span>
      </div>

      <div className="vsd-book-fields">
        <div className="vsd-book-field">
          <span>{s.book_check_in}</span>
          <strong>{fmt(range.start)}</strong>
        </div>
        <div className="vsd-book-field">
          <span>{s.book_check_out}</span>
          <strong>{fmt(range.end)}</strong>
        </div>
        <div className="vsd-book-field vsd-book-field-wide">
          <span>{s.book_guests}</span>
          <div className="vsd-stepper">
            <button onClick={() => setGuests(Math.max(1, guests - 1))}>−</button>
            <strong>{guests}</strong>
            <button onClick={() => setGuests(Math.min(p.sleeps, guests + 1))}>+</button>
          </div>
        </div>
      </div>

      <MiniCalendar s={s} range={range} setRange={setRange} unavailable={unavailable} />

      <div className="vsd-book-totals">
        <div>
          <span>
            ${p.nightly} × {nights} {s.book_nights}
          </span>
          <b>${sub.toLocaleString()}</b>
        </div>
        <div>
          <span>{s.book_clean}</span>
          <b>${clean}</b>
        </div>
        <div>
          <span>{s.book_steward}</span>
          <b>${steward}</b>
        </div>
        <div className="total">
          <span>{s.book_total}</span>
          <b>${total.toLocaleString()} USD</b>
        </div>
      </div>

      <Link
        className="vs-btn vs-btn-dark vsd-book-cta"
        href={`/checkout?kind=stay&id=${p.id}&lang=${lang}&nights=${nights || 4}&guests=${guests}`}
      >
        {s.book_cta} →
      </Link>
      <p className="vsd-book-note">{s.book_note}</p>
    </aside>
  );
}

export function StayPage() {
  const { lang } = useLang();
  const params = useSearchParams();
  const initId = params.get("id") || "casa-de-piedra";

  const s = STAY_COPY[lang];
  const p = PROPERTIES.find((x) => x.id === initId) || PROPERTIES[0];
  const d = getStayDetail(p.id);

  const similar = PROPERTIES.filter((x) => x.id !== p.id).slice(0, 3);

  return (
    <div className="vs-app vsd-app">
      <Nav backHref={`/?lang=${lang}#stays`} backLabel={s.back} showReserve={false} />

      <main>
        <section className="vsd-title">
          <div className="vsd-title-meta">
            <span>
              0{PROPERTIES.indexOf(p) + 1} / {PROPERTIES.length}
            </span>
            <span>{p.locale[lang]}</span>
          </div>
          <h1 className="vsd-title-h">{p.name}</h1>
          <div className="vsd-title-foot">
            <span>
              <b>{p.sleeps}</b> {s.sleeps_n}
            </span>
            <span>
              <b>{p.beds}</b> {s.bed_n}
            </span>
            <span>
              <b>{p.baths}</b> {s.bath_n}
            </span>
            <span>
              <b>{d.sqft.toLocaleString()}</b> {s.sqft_n}
            </span>
            <span>
              <b>{d.year}</b> ·{" "}
              <em>
                {s.restored_n} {d.restored}
              </em>
            </span>
          </div>
        </section>

        <section className="vsd-gallery">
          <div className="vsd-gallery-hero">
            <Placeholder palette={p.palette} shape={d.galleryShapes[0]} aspect="3/2" />
          </div>
          <div className="vsd-gallery-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="vsd-gallery-cell">
                <Placeholder palette={p.palette} shape={d.galleryShapes[i]} aspect="1/1" />
              </div>
            ))}
          </div>
        </section>

        <section className="vsd-body">
          <div className="vsd-body-left">
            <div className="vsd-block">
              <div className="vs-eyebrow">{s.overview}</div>
              <p className="vsd-lede">{p.desc[lang]}</p>
            </div>

            <div className="vsd-block">
              <div className="vs-eyebrow">{s.rooms_h}</div>
              <ul className="vsd-rooms">
                {d.rooms.map((r, i) => (
                  <li key={i}>
                    <span className="vsd-rooms-n">0{i + 1}</span>
                    <span>{r[lang]}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="vsd-block">
              <div className="vs-eyebrow">{s.amen_h}</div>
              <div className="vsd-amen">
                {d.amenities.map(([en, es], i) => (
                  <div key={i} className="vsd-amen-item">
                    <span className="vsd-amen-dot" />
                    <span>{lang === "en" ? en : es}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="vsd-block vsd-host">
              <div className="vsd-host-img">
                <Placeholder palette={["#a06b3a", "#e8d4b0", "#241814"]} shape="circle" aspect="1/1" />
              </div>
              <div className="vsd-host-text">
                <div className="vs-eyebrow">{s.host_h}</div>
                <h3>{d.host.name}</h3>
                <p>&quot;{d.host.quote[lang]}&quot;</p>
                <div className="vsd-host-meta">
                  <span>
                    {s.host_since} {d.host.since}
                  </span>
                  <i>·</i>
                  <span>
                    {s.host_lang} {d.host.lang}
                  </span>
                </div>
              </div>
            </div>

            <div className="vsd-block vsd-map">
              <div className="vs-eyebrow">{s.map_h}</div>
              <p>{s.map_body}</p>
              <div className="vsd-map-canvas">
                <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice">
                  <rect width="600" height="360" fill="var(--vs-paper)" />
                  {Array.from({ length: 12 }).map((_, i) => (
                    <line
                      key={"v" + i}
                      x1={i * 50}
                      y1="0"
                      x2={i * 50}
                      y2="360"
                      stroke="var(--vs-line)"
                      strokeOpacity="0.4"
                    />
                  ))}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <line
                      key={"h" + i}
                      x1="0"
                      y1={i * 50}
                      x2="600"
                      y2={i * 50}
                      stroke="var(--vs-line)"
                      strokeOpacity="0.4"
                    />
                  ))}
                  <path
                    d="M 0 220 Q 200 180 400 200 T 600 180"
                    stroke="var(--vs-ink)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M 280 0 Q 250 180 320 360"
                    stroke="var(--vs-ink)"
                    strokeWidth="1"
                    fill="none"
                    strokeDasharray="3 3"
                  />
                  <path
                    d="M 100 80 Q 250 60 400 100 T 580 130"
                    stroke="var(--vs-muted)"
                    strokeWidth="1"
                    fill="none"
                    opacity="0.6"
                  />
                  <path
                    d="M 80 130 Q 240 110 410 150 T 590 180"
                    stroke="var(--vs-muted)"
                    strokeWidth="1"
                    fill="none"
                    opacity="0.4"
                  />
                  <g transform="translate(310 200)">
                    <circle r="28" fill="var(--vs-accent)" fillOpacity="0.18" />
                    <circle r="14" fill="var(--vs-accent)" fillOpacity="0.32" />
                    <circle r="6" fill="var(--vs-accent)" />
                  </g>
                  {([
                    [180, 160, "Lechuza"],
                    [420, 260, "Decantos"],
                    [480, 140, "Vena Cava"],
                    [150, 260, "Fauna"],
                    [380, 90, "Deckman's"],
                  ] as [number, number, string][]).map(([x, y, l], i) => (
                    <g key={i} transform={`translate(${x} ${y})`}>
                      <circle r="3" fill="var(--vs-ink)" />
                      <text
                        x="8"
                        y="4"
                        fontFamily="var(--vs-mono)"
                        fontSize="10"
                        fill="var(--vs-ink)"
                      >
                        {l}
                      </text>
                    </g>
                  ))}
                </svg>
                <span className="vsd-map-legend">{s.map_legend}</span>
              </div>
            </div>

            <div className="vsd-block">
              <div className="vsd-rev-h">
                <div>
                  <div className="vs-eyebrow">{s.rev_h}</div>
                  <h3 className="vsd-rev-h-stat">
                    ★ 4.97 · 124 {s.reviews_count}
                  </h3>
                </div>
              </div>
              <div className="vsd-rev-grid">
                {d.reviews.map((r, i) => (
                  <article key={i} className="vsd-rev">
                    <div className="vsd-rev-stars">
                      {"★".repeat(r.rating)}
                      {"☆".repeat(5 - r.rating)}
                    </div>
                    <p>&quot;{r.body[lang]}&quot;</p>
                    <div className="vsd-rev-foot">
                      <strong>{r.name}</strong>
                      <span>{r.from[lang]}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <BookingWidget p={p} s={s} lang={lang} />
        </section>

        <section className="vsd-similar">
          <div className="vs-section-head">
            <div>
              <div className="vs-eyebrow">{s.sim_h}</div>
            </div>
          </div>
          <div className="vs-stays-grid">
            {similar.map((sp) => (
              <StayCard key={sp.id} p={sp} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
