"use client";

import Link from "next/link";
import { COPY } from "@/lib/data";
import { useLang } from "@/components/LangContext";

export function Experiences() {
  const { lang } = useLang();
  const t = COPY[lang];

  return (
    <section className="vs-exp" id="experiences">
      <div className="vs-section-head">
        <div>
          <div className="vs-eyebrow">{t.exp.eyebrow}</div>
          <h2 className="vs-section-title">
            {t.exp.title} <em>{t.exp.title_em}</em>
          </h2>
        </div>
        <p className="vs-section-lede">{t.exp.lede}</p>
      </div>

      <div className="vs-exp-grid">
        {t.exp.items.map((it, i) => (
          <Link
            key={it.id}
            href={`/experience?id=${it.id}&lang=${lang}`}
            className="vs-exp-item"
          >
            <div className="vs-exp-tag">
              {String(i + 1).padStart(2, "0")} · {it.tag}
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
  );
}
