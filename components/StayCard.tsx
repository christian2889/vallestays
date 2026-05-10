"use client";

import Link from "next/link";
import { COPY, PROPERTIES, type Property } from "@/lib/data";
import { useLang } from "@/components/LangContext";
import { Placeholder } from "@/components/Placeholder";

export function StayCard({ p }: { p: Property }) {
  const { lang } = useLang();
  const t = COPY[lang];
  const idx = PROPERTIES.findIndex((x) => x.id === p.id);

  return (
    <article className="vs-stay">
      <div className="vs-stay-img">
        <Placeholder palette={p.palette} shape={p.shape} aspect="4/5" />
        <span className="vs-stay-num">0{idx + 1}</span>
      </div>
      <div className="vs-stay-meta">
        <div className="vs-stay-row">
          <h3 className="vs-stay-name">{p.name}</h3>
          <div className="vs-stay-price">
            <span className="vs-stay-price-from">{t.stays.from}</span>
            <span className="vs-stay-price-n">${p.nightly}</span>
            <span className="vs-stay-price-unit">USD {t.stays.per_night}</span>
          </div>
        </div>
        <div className="vs-stay-locale">{p.locale[lang]}</div>
        <p className="vs-stay-desc">{p.desc[lang]}</p>
        <div className="vs-stay-foot">
          <div className="vs-stay-specs">
            <span>
              {t.stays.sleeps} {p.sleeps}
            </span>
            <i>·</i>
            <span>{p.beds} bd</span>
            <i>·</i>
            <span>{p.baths} ba</span>
          </div>
          <Link className="vs-stay-link" href={`/stay?id=${p.id}&lang=${lang}`}>
            {t.stays.view_home} →
          </Link>
        </div>
      </div>
    </article>
  );
}
