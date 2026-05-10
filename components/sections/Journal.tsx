"use client";

import { COPY } from "@/lib/data";
import { useLang } from "@/components/LangContext";

export function Journal() {
  const { lang } = useLang();
  const t = COPY[lang];

  return (
    <section className="vs-journal" id="journal">
      <div className="vs-section-head">
        <div>
          <div className="vs-eyebrow">{t.journal.eyebrow}</div>
          <h2 className="vs-section-title">{t.journal.title}</h2>
        </div>
      </div>
      <div className="vs-journal-list">
        {t.journal.posts.map((p, i) => (
          <a key={i} className="vs-journal-row" href="#">
            <span className="vs-journal-num">0{i + 1}</span>
            <span className="vs-journal-kind">{p.kind}</span>
            <span className="vs-journal-title">{p.title}</span>
            <span className="vs-journal-date">{p.date}</span>
            <span className="vs-journal-arrow">→</span>
          </a>
        ))}
      </div>
    </section>
  );
}
