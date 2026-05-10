"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { COPY } from "@/lib/data";
import { EXP_DETAIL, EXP_COPY, type ExperienceDetail } from "@/lib/exp-data";
import { useLang } from "@/components/LangContext";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Placeholder } from "@/components/Placeholder";

function ExpMiniCal({
  s,
  value,
  setValue,
}: {
  s: (typeof EXP_COPY)["en"] | (typeof EXP_COPY)["es"];
  value: Date;
  setValue: (d: Date) => void;
}) {
  const [view, setView] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const fmt = (d: Date | null) => (d ? `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` : "");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const y = view.getFullYear();
  const m = view.getMonth();
  const first = new Date(y, m, 1).getDay();
  const len = new Date(y, m + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= len; d++) cells.push(new Date(y, m, d));
  while (cells.length < 42) cells.push(null);
  const unavail = [4, 11, 12, 19, 26];

  return (
    <div className="vsd-cal">
      <div className="vsd-cal-nav">
        <button
          onClick={() => {
            const d = new Date(view);
            d.setMonth(d.getMonth() - 1);
            setView(d);
          }}
        >
          ←
        </button>
        <button
          onClick={() => {
            const d = new Date(view);
            d.setMonth(d.getMonth() + 1);
            setView(d);
          }}
        >
          →
        </button>
      </div>
      <div className="vsd-cal-month">
        <div className="vsd-cal-h">
          {s.months[m].toUpperCase()} {y}
        </div>
        <div className="vsd-cal-grid">
          {s.days.map((d, i) => (
            <div key={i} className="vsd-cal-dh">
              {d}
            </div>
          ))}
          {cells.map((d, i) => {
            const off = !d || (d && (d < today || unavail.includes(d.getDate())));
            const sel = d && fmt(d) === fmt(value);
            return (
              <div
                key={i}
                className={
                  "vsd-cal-c " + (!d ? "empty " : "") + (off ? "off " : "") + (sel ? "start" : "")
                }
                onClick={() => !off && d && setValue(d)}
              >
                {d ? d.getDate() : ""}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ExpBooking({
  x,
  s,
  id,
  lang,
}: {
  x: ExperienceDetail;
  s: (typeof EXP_COPY)["en"] | (typeof EXP_COPY)["es"];
  id: string;
  lang: "en" | "es";
}) {
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d;
  });
  const [time, setTime] = useState(x.times[0]);
  const [party, setParty] = useState(2);

  const sub = x.nightly * Math.max(1, Math.ceil(party / 2));
  const stew = Math.round(sub * 0.06);
  const total = sub + stew;

  return (
    <aside className="vsd-book vse-book">
      <div className="vsd-book-h">{s.book_h}</div>
      <div className="vsd-book-price">
        <span className="n">${x.nightly}</span>
        <span className="u">USD {x.unit && x.unit.en}</span>
      </div>

      <div className="vsd-book-fields">
        <div className="vsd-book-field">
          <span>{s.book_when}</span>
          <strong>
            {s.months[date.getMonth()]} {date.getDate()}
          </strong>
        </div>
        <div className="vsd-book-field">
          <span>{s.book_time}</span>
          <strong>{time}</strong>
        </div>
        <div className="vsd-book-field vsd-book-field-wide">
          <span>{s.book_party}</span>
          <div className="vsd-stepper">
            <button onClick={() => setParty(Math.max(1, party - 1))}>−</button>
            <strong>{party}</strong>
            <button onClick={() => setParty(party + 1)}>+</button>
          </div>
        </div>
      </div>

      {x.times.length > 1 && (
        <div className="vse-times">
          {x.times.map((t) => (
            <button
              key={t}
              className={"vse-time " + (time === t ? "on" : "")}
              onClick={() => setTime(t)}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <ExpMiniCal s={s} value={date} setValue={setDate} />

      <div className="vsd-book-totals">
        <div>
          <span>{s.book_subtotal}</span>
          <b>${sub.toLocaleString()}</b>
        </div>
        <div>
          <span>{s.book_steward}</span>
          <b>${stew}</b>
        </div>
        <div className="total">
          <span>{s.book_total}</span>
          <b>${total.toLocaleString()} USD</b>
        </div>
      </div>

      <Link
        className="vs-btn vs-btn-dark vsd-book-cta"
        href={`/checkout?kind=exp&id=${id}&lang=${lang}&guests=${party}`}
      >
        {s.book_cta} →
      </Link>
      <p className="vsd-book-note">{s.book_note}</p>
    </aside>
  );
}

export function ExperiencePage() {
  const { lang } = useLang();
  const params = useSearchParams();
  const initId = params.get("id") || "cellar";

  const t = COPY[lang];
  const s = EXP_COPY[lang];
  const item = t.exp.items.find((it) => it.id === initId) || t.exp.items[0];
  const x = EXP_DETAIL[item.id] || EXP_DETAIL.cellar;
  const others = t.exp.items.filter((it) => it.id !== item.id).slice(0, 3);

  return (
    <div className="vs-app vsd-app">
      <Nav backHref={`/?lang=${lang}#experiences`} backLabel={s.back} showReserve={false} />

      <main>
        <section className="vsd-title">
          <div className="vsd-title-meta">
            <span>{item.tag.toUpperCase()}</span>
            <span>
              {x.host.name} · {x.host.role[lang]}
            </span>
          </div>
          <h1 className="vsd-title-h">{item.title}</h1>
          <div className="vsd-title-foot vse-facts">
            {[x.duration[lang], x.party[lang], x.when[lang], x.pickup[lang]].map((v, i) => (
              <span key={i}>
                <b>{s.facts[i]}</b> · {v}
              </span>
            ))}
          </div>
        </section>

        <section className="vsd-gallery vse-gallery">
          <div className="vsd-gallery-hero">
            <Placeholder palette={x.palette} shape={x.shape} aspect="3/2" />
          </div>
          <div className="vsd-gallery-grid">
            {["arch", "rect", "circle", "arch-tall"].map((sh, i) => (
              <div key={i} className="vsd-gallery-cell">
                <Placeholder palette={x.palette} shape={sh} aspect="1/1" />
              </div>
            ))}
          </div>
        </section>

        <section className="vsd-body">
          <div className="vsd-body-left">
            <div className="vsd-block">
              <div className="vs-eyebrow">{s.overview}</div>
              <p className="vsd-lede">{x.body[lang]}</p>
            </div>

            <div className="vsd-block">
              <div className="vs-eyebrow">{s.schedule_h}</div>
              <ol className="vse-sched">
                {x.schedule.map((row, i) => (
                  <li key={i}>
                    <span className="vse-sched-t">{row.t}</span>
                    <span className="vse-sched-l">{row[lang]}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="vsd-block vse-incl">
              <div>
                <div className="vs-eyebrow">{s.includes_h}</div>
                <ul className="vse-incl-list">
                  {x.includes.map(([en, es], i) => (
                    <li key={i}>
                      <span className="vse-tick">✓</span>
                      {lang === "en" ? en : es}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="vs-eyebrow">{s.excludes_h}</div>
                <ul className="vse-incl-list">
                  {x.excludes.map(([en, es], i) => (
                    <li key={i}>
                      <span className="vse-cross">×</span>
                      {lang === "en" ? en : es}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="vsd-block vsd-host">
              <div className="vsd-host-img">
                <Placeholder palette={x.palette} shape="circle" aspect="1/1" />
              </div>
              <div className="vsd-host-text">
                <div className="vs-eyebrow">{s.host_h}</div>
                <h3>{x.host.name}</h3>
                <p>
                  {x.host.role[lang]} · {lang === "en" ? "since" : "desde"} {x.host.since}
                </p>
              </div>
            </div>
          </div>

          <ExpBooking x={x} s={s} id={item.id} lang={lang} />
        </section>

        <section className="vsd-similar">
          <div className="vs-section-head">
            <div>
              <div className="vs-eyebrow">{s.sim_h}</div>
            </div>
          </div>
          <div className="vse-other-grid">
            {others.map((it) => (
              <Link
                key={it.id}
                href={`/experience?id=${it.id}&lang=${lang}`}
                className="vs-exp-item"
              >
                <div className="vs-exp-tag">
                  {String(
                    (t.exp.items as readonly { id: string }[]).findIndex(
                      (x) => x.id === it.id
                    ) + 1
                  ).padStart(2, "0")}{" "}
                  · {it.tag}
                </div>
                <h3 className="vs-exp-title">{it.title}</h3>
                <div className="vs-exp-who">{it.who}</div>
                <div className="vs-exp-foot">
                  <span className="vs-exp-price">{it.price}</span>
                  <span className="vs-exp-arrow">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
