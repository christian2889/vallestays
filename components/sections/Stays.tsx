"use client";

import { useMemo, useState } from "react";
import { COPY } from "@/lib/data";
import { useLang } from "@/components/LangContext";
import { StayCard } from "@/components/StayCard";
import type { UIProperty } from "@/lib/uiprops";

export function Stays({ properties }: { properties: UIProperty[] }) {
  const { lang } = useLang();
  const t = COPY[lang];
  const [filter, setFilter] = useState<string>("all");

  const filters: [string, string][] = [
    ["all", t.stays.filter_all],
    ["villa", t.stays.filter_villa],
    ["casita", t.stays.filter_casita],
    ["ranch", t.stays.filter_ranch],
  ];

  const list = useMemo(() => {
    if (filter === "all") return properties;
    if (filter === "villa") return properties.filter((p) => p.property_type === "villa");
    if (filter === "casita")
      return properties.filter((p) => ["apartment", "cottage", "condo"].includes(p.property_type));
    if (filter === "ranch")
      return properties.filter((p) => ["cabin", "house"].includes(p.property_type));
    return properties;
  }, [filter, properties]);

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
        {list.map((p, i) => (
          <StayCard key={p.id} p={p} index={i} />
        ))}
      </div>

      <div className="vs-stays-foot">
        <a href={`/search?lang=${lang}`} className="vs-btn vs-btn-line">
          {t.stays.see_all} →
        </a>
      </div>
    </section>
  );
}
