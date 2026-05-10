"use client";

import { useState } from "react";
import { COPY, PROPERTIES } from "@/lib/data";
import { useLang } from "@/components/LangContext";
import { StayCard } from "@/components/StayCard";

export function Stays() {
  const { lang } = useLang();
  const t = COPY[lang];
  const [filter, setFilter] = useState<string>("all");

  const filters: [string, string][] = [
    ["all", t.stays.filter_all],
    ["villa", t.stays.filter_villa],
    ["casita", t.stays.filter_casita],
    ["ranch", t.stays.filter_ranch],
    ["off-grid", t.stays.filter_off_grid],
  ];

  const list = filter === "all" ? PROPERTIES : PROPERTIES.filter((p) => p.tags.includes(filter));

  return (
    <section className="vs-stays" id="stays">
      <div className="vs-section-head">
        <div>
          <div className="vs-eyebrow">{t.stays.eyebrow}</div>
          <h2 className="vs-section-title">
            {t.stays.title} <em>{t.stays.title_em}</em>
          </h2>
        </div>
        <p className="vs-section-lede">{t.stays.lede}</p>
      </div>

      <div className="vs-filters">
        {filters.map(([k, label]) => (
          <button
            key={k}
            className={"vs-chip " + (filter === k ? "on" : "")}
            onClick={() => setFilter(k)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="vs-stays-grid">
        {list.map((p) => (
          <StayCard key={p.id} p={p} />
        ))}
      </div>

      <div className="vs-stays-foot">
        <a href="#" className="vs-btn vs-btn-line">
          {t.stays.see_all} →
        </a>
      </div>
    </section>
  );
}
