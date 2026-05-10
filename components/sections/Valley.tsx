"use client";

import { COPY } from "@/lib/data";
import { useLang } from "@/components/LangContext";
import { Placeholder } from "@/components/Placeholder";

export function Valley() {
  const { lang } = useLang();
  const t = COPY[lang];

  return (
    <section className="vs-valley" id="valley">
      <div className="vs-valley-grid">
        <div className="vs-valley-text">
          <div className="vs-eyebrow">{t.valley.eyebrow}</div>
          <h2 className="vs-section-title">
            {t.valley.title} <em>{t.valley.title_em}</em>
          </h2>
          <p>{t.valley.body_1}</p>
          <p>{t.valley.body_2}</p>
        </div>
        <div className="vs-valley-img">
          <Placeholder
            palette={["#8a5a3a", "#e0c890", "#241814"]}
            shape="rect"
            aspect="3/4"
            label="VALLE — VIEW FROM CAÑÓN DE DOÑA PETRA"
          />
        </div>
      </div>

      <div className="vs-valley-stats">
        {[
          [t.valley.stat_1_n, t.valley.stat_1_l],
          [t.valley.stat_2_n, t.valley.stat_2_l],
          [t.valley.stat_3_n, t.valley.stat_3_l],
          [t.valley.stat_4_n, t.valley.stat_4_l],
        ].map(([n, l], i) => (
          <div key={i} className="vs-stat">
            <div className="vs-stat-n">{n}</div>
            <div className="vs-stat-l">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
