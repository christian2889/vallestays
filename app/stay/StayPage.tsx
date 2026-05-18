"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { STAY_COPY } from "@/lib/data";
import { useLang } from "@/components/LangContext";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Placeholder } from "@/components/Placeholder";
import { StayCard } from "@/components/StayCard";
import {
  type UIProperty,
  nameFor,
  descFor,
  localeFor,
  paletteFor,
  shapeFor,
} from "@/lib/uiprops";

type CalRange = { start: Date | null; end: Date | null };

function MiniCalendar({
  s,
  range,
  setRange,
  occupied,
}: {
  s: (typeof STAY_COPY)["en"] | (typeof STAY_COPY)["es"];
  range: CalRange;
  setRange: (r: CalRange) => void;
  occupied: Set<string>;
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

  function key(d: Date) {
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  }
  function fmt(d: Date | null) {
    return d ? key(d) : "";
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
  // A "night" is occupied when someone is staying that night.
  function nightOccupied(d: Date | null) {
    return !!d && occupied.has(key(d));
  }
  function isPast(d: Date | null) {
    return !!d && d < new Date(new Date().setHours(0, 0, 0, 0));
  }
  // First occupied night strictly after `from` — that date is still a
  // valid checkout (turnover: you leave the morning the next guest arrives).
  function firstBlockAfter(from: Date): Date | null {
    const c = new Date(from);
    for (let i = 0; i < 400; i++) {
      c.setDate(c.getDate() + 1);
      if (occupied.has(key(c))) return new Date(c);
    }
    return null;
  }

  // Can this date be clicked given the current selection state?
  function selectable(d: Date | null): boolean {
    if (!d || isPast(d)) return false;
    if (!range.start || range.end) {
      // Choosing a check-in: that night must be free.
      return !nightOccupied(d);
    }
    if (d <= range.start) {
      // Re-pick the check-in.
      return !nightOccupied(d);
    }
    // Choosing a checkout: every night from start..d-1 must be free.
    // You CAN check out on the first blocked night itself (turnover).
    const block = firstBlockAfter(range.start);
    return !block || d <= block;
  }

  function pick(d: Date | null) {
    if (!selectable(d) || !d) return;
    if (!range.start || range.end) {
      setRange({ start: d, end: null });
    } else if (d <= range.start) {
      setRange({ start: d, end: null });
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
          else if (!isStart(d) && !isEnd(d) && !selectable(d)) cls.push("off");
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
  blockedRanges,
}: {
  p: UIProperty;
  s: (typeof STAY_COPY)["en"] | (typeof STAY_COPY)["es"];
  lang: "en" | "es";
  blockedRanges: { start: string; end: string }[];
}) {
  // Set of occupied NIGHT keys "Y-M-D" (month 0-indexed, matches calendar).
  // A range [start, end) occupies nights start..end-1; the end date is the
  // existing guest's checkout, so that night stays free (turnover).
  const occupied = useMemo(() => {
    const set = new Set<string>();
    for (const r of blockedRanges) {
      const [sy, sm, sd] = r.start.split("-").map(Number);
      const [ey, em, ed] = r.end.split("-").map(Number);
      if (!sy || !ey) continue;
      const cur = new Date(sy, sm - 1, sd);
      const end = new Date(ey, em - 1, ed);
      let guard = 0;
      while (cur < end && guard < 1500) {
        set.add(`${cur.getFullYear()}-${cur.getMonth()}-${cur.getDate()}`);
        cur.setDate(cur.getDate() + 1);
        guard++;
      }
    }
    return set;
  }, [blockedRanges]);

  const [range, setRange] = useState<CalRange>({ start: null, end: null });
  const [guests, setGuests] = useState(2);

  const nights =
    range.start && range.end
      ? Math.max(1, Math.round((range.end.getTime() - range.start.getTime()) / 86400000))
      : 0;
  const nightly = Math.round(p.price_per_night);
  const sub = nights * nightly;
  const clean = Math.round(p.cleaning_fee || 0);
  const total = sub + clean;

  function fmt(d: Date | null) {
    if (!d) return "—";
    return `${s.months[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
  }
  function fmtIso(d: Date | null) {
    if (!d) return "";
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
  }

  const checkoutHref =
    `/checkout?kind=stay&id=${p.id}&lang=${lang}` +
    `&nights=${nights || 4}&guests=${guests}` +
    `&in=${fmtIso(range.start)}&out=${fmtIso(range.end)}`;

  return (
    <aside className="vsd-book">
      <div className="vsd-book-h">{s.book_h}</div>
      <div className="vsd-book-price">
        <span className="n">${nightly}</span>
        <span className="u">{p.currency || "USD"} / night</span>
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
            <button onClick={() => setGuests(Math.min(p.max_guests, guests + 1))}>+</button>
          </div>
        </div>
      </div>

      <MiniCalendar s={s} range={range} setRange={setRange} occupied={occupied} />

      <div className="vsd-book-totals">
        <div>
          <span>
            ${nightly} × {nights} {s.book_nights}
          </span>
          <b>${sub.toLocaleString()}</b>
        </div>
        <div>
          <span>{s.book_clean}</span>
          <b>${clean}</b>
        </div>
        <div className="total">
          <span>{s.book_total}</span>
          <b>${total.toLocaleString()} {p.currency || "USD"}</b>
        </div>
      </div>

      <Link className="vs-btn vs-btn-dark vsd-book-cta" href={checkoutHref}>
        {s.book_cta} →
      </Link>
      <p className="vsd-book-note">{s.book_note}</p>
    </aside>
  );
}

export function StayPage({
  property: p,
  similar,
  blockedRanges = [],
}: {
  property: UIProperty;
  similar: UIProperty[];
  blockedRanges?: { start: string; end: string }[];
}) {
  const { lang } = useLang();
  const s = STAY_COPY[lang];
  const galleryImgs = p.images.slice(0, 5);
  const totalImages = p.images.length;
  const remaining = Math.max(0, totalImages - 5);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const open = lightboxIndex !== null;
  const touchStartX = useRef<number | null>(null);

  const close = useCallback(() => setLightboxIndex(null), []);
  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % totalImages));
  }, [totalImages]);
  const prev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + totalImages) % totalImages));
  }, [totalImages]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, next, prev]);

  return (
    <div className="vs-app vsd-app">
      <Nav backHref={`/?lang=${lang}#stays`} backLabel={s.back} showReserve={false} />

      <main>
        <section className="vsd-title">
          <div className="vsd-title-meta">
            <span>{p.property_type.toUpperCase()}</span>
            <span>{localeFor(p)}</span>
          </div>
          <h1 className="vsd-title-h">{nameFor(p, lang)}</h1>
          <div className="vsd-title-foot">
            <span>
              <b>{p.max_guests}</b> {s.sleeps_n}
            </span>
            <span>
              <b>{p.beds}</b> {s.bed_n}
            </span>
            <span>
              <b>{p.bathrooms}</b> {s.bath_n}
            </span>
            {p.bedrooms > 0 && (
              <span>
                <b>{p.bedrooms}</b> {lang === "en" ? "BR" : "Rec"}
              </span>
            )}
            {p.average_rating != null && (
              <span>
                <b>★ {Number(p.average_rating).toFixed(2)}</b> · <em>{p.review_count || 0} {s.reviews_count}</em>
              </span>
            )}
          </div>
        </section>

        <section className="vsd-gallery">
          <button
            type="button"
            className="vsd-gallery-hero"
            onClick={() => galleryImgs[0] && setLightboxIndex(0)}
            aria-label={lang === "en" ? "Open photo gallery" : "Abrir galería"}
          >
            {galleryImgs[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={galleryImgs[0].url}
                alt={nameFor(p, lang)}
                style={{ width: "100%", aspectRatio: "3/2", objectFit: "cover", borderRadius: 6 }}
              />
            ) : (
              <Placeholder palette={paletteFor(p)} shape={shapeFor(p)} aspect="3/2" />
            )}
          </button>
          <div className="vsd-gallery-grid">
            {[1, 2, 3, 4].map((i) => {
              const img = galleryImgs[i];
              const isLast = i === 4 && remaining > 0;
              return (
                <button
                  type="button"
                  key={i}
                  className="vsd-gallery-cell"
                  onClick={() => img && setLightboxIndex(i)}
                  aria-label={lang === "en" ? `Open photo ${i + 1}` : `Abrir foto ${i + 1}`}
                >
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={img.url}
                      alt=""
                      style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", borderRadius: 6 }}
                    />
                  ) : (
                    <Placeholder palette={paletteFor(p)} shape={shapeFor(p)} aspect="1/1" />
                  )}
                  {isLast && (
                    <span className="vsd-gallery-more">
                      +{remaining} {lang === "en" ? "more" : "más"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {open && lightboxIndex !== null && (
          <div
            className="vsd-lightbox"
            role="dialog"
            aria-modal="true"
            onClick={close}
            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchStartX.current;
              touchStartX.current = null;
              if (Math.abs(dx) < 40) return;
              if (dx < 0) next(); else prev();
            }}
          >
            <button
              type="button"
              className="vsd-lb-close"
              onClick={close}
              aria-label={lang === "en" ? "Close" : "Cerrar"}
            >
              ×
            </button>
            <button
              type="button"
              className="vsd-lb-nav vsd-lb-prev"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label={lang === "en" ? "Previous" : "Anterior"}
            >
              ‹
            </button>
            <div className="vsd-lb-frame" onClick={(e) => e.stopPropagation()}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.images[lightboxIndex].url}
                alt={p.images[lightboxIndex].alt_text || ""}
              />
            </div>
            <button
              type="button"
              className="vsd-lb-nav vsd-lb-next"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label={lang === "en" ? "Next" : "Siguiente"}
            >
              ›
            </button>
            <div className="vsd-lb-counter">
              {lightboxIndex + 1} / {totalImages}
            </div>
          </div>
        )}

        <section className="vsd-body">
          <div className="vsd-body-left">
            <div className="vsd-block">
              <div className="vs-eyebrow">{s.overview}</div>
              <p className="vsd-lede">{descFor(p, lang)}</p>
            </div>

            <div className="vsd-block">
              <div className="vs-eyebrow">{s.rooms_h}</div>
              <ul className="vsd-rooms">
                <li>
                  <span className="vsd-rooms-n">01</span>
                  <span>
                    {p.bedrooms} {lang === "en" ? "bedrooms" : "recámaras"} · {p.beds}{" "}
                    {lang === "en" ? "beds" : "camas"}
                  </span>
                </li>
                <li>
                  <span className="vsd-rooms-n">02</span>
                  <span>
                    {p.bathrooms} {lang === "en" ? "bathrooms" : "baños"}
                  </span>
                </li>
                <li>
                  <span className="vsd-rooms-n">03</span>
                  <span>
                    {lang === "en" ? "Sleeps up to" : "Para hasta"} {p.max_guests}
                  </span>
                </li>
                <li>
                  <span className="vsd-rooms-n">04</span>
                  <span>
                    {lang === "en" ? "Check-in" : "Llegada"} {p.check_in_time || "15:00"} ·{" "}
                    {lang === "en" ? "Check-out" : "Salida"} {p.check_out_time || "11:00"}
                  </span>
                </li>
                <li>
                  <span className="vsd-rooms-n">05</span>
                  <span>{p.address}</span>
                </li>
              </ul>
            </div>

            <div className="vsd-block vsd-host">
              <div className="vsd-host-img">
                <Placeholder palette={["#a06b3a", "#e8d4b0", "#241814"]} shape="circle" aspect="1/1" />
              </div>
              <div className="vsd-host-text">
                <div className="vs-eyebrow">{s.host_h}</div>
                <h3>Fernanda</h3>
                <p>
                  &quot;
                  {lang === "en"
                    ? "We host the way our grandmothers hosted us — with too much food and a fire in the courtyard."
                    : "Recibimos como nos recibían nuestras abuelas — con demasiada comida y una fogata en el patio."}
                  &quot;
                </p>
                <div className="vsd-host-meta">
                  <span>
                    {p.cancellation_policy
                      ? `${lang === "en" ? "Cancellation" : "Cancelación"}: ${p.cancellation_policy}`
                      : ""}
                  </span>
                </div>
              </div>
            </div>

            {p.latitude && p.longitude && (
              <div className="vsd-block vsd-map">
                <div className="vs-eyebrow">{s.map_h}</div>
                <p>{s.map_body}</p>
                <div className="vsd-map-canvas">
                  <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice">
                    <rect width="600" height="360" fill="var(--vs-paper)" />
                    {Array.from({ length: 12 }).map((_, i) => (
                      <line key={"v" + i} x1={i * 50} y1="0" x2={i * 50} y2="360" stroke="var(--vs-line)" strokeOpacity="0.4" />
                    ))}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <line key={"h" + i} x1="0" y1={i * 50} x2="600" y2={i * 50} stroke="var(--vs-line)" strokeOpacity="0.4" />
                    ))}
                    <path d="M 0 220 Q 200 180 400 200 T 600 180" stroke="var(--vs-ink)" strokeWidth="2" fill="none" />
                    <g transform="translate(310 200)">
                      <circle r="28" fill="var(--vs-accent)" fillOpacity="0.18" />
                      <circle r="14" fill="var(--vs-accent)" fillOpacity="0.32" />
                      <circle r="6" fill="var(--vs-accent)" />
                    </g>
                  </svg>
                  <span className="vsd-map-legend">{s.map_legend}</span>
                </div>
              </div>
            )}
          </div>

          <BookingWidget p={p} s={s} lang={lang} blockedRanges={blockedRanges} />
        </section>

        {similar.length > 0 && (
          <section className="vsd-similar">
            <div className="vs-section-head">
              <div>
                <div className="vs-eyebrow">{s.sim_h}</div>
              </div>
            </div>
            <div className="vs-stays-grid">
              {similar.map((sp, i) => (
                <StayCard key={sp.id} p={sp} index={i} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
