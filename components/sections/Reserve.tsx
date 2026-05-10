"use client";

import { useState } from "react";
import { COPY } from "@/lib/data";
import { useLang } from "@/components/LangContext";
import { Placeholder } from "@/components/Placeholder";

export function Reserve() {
  const { lang } = useLang();
  const t = COPY[lang];
  const [sent, setSent] = useState(false);

  return (
    <section className="vs-reserve" id="reserve">
      <div className="vs-reserve-grid">
        <div className="vs-reserve-text">
          <div className="vs-eyebrow">{t.reserve.eyebrow}</div>
          <h2 className="vs-section-title">
            {t.reserve.title} <em>{t.reserve.title_em}</em>
          </h2>
          <p>{t.reserve.lede}</p>
          <div className="vs-reserve-aside">
            <Placeholder
              palette={["#a06b3a", "#e8d4b0", "#241814"]}
              shape="arch-tall"
              aspect="3/4"
              label="HOST — ANA & DIEGO"
            />
          </div>
        </div>

        <form
          className="vs-form"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <label className="vs-field">
            <span>{t.reserve.f_name}</span>
            <input type="text" defaultValue="" />
          </label>
          <label className="vs-field">
            <span>{t.reserve.f_email}</span>
            <input type="email" defaultValue="" />
          </label>
          <label className="vs-field">
            <span>{t.reserve.f_dates}</span>
            <input type="text" defaultValue="Apr 12 — Apr 16, 2026" />
          </label>
          <label className="vs-field">
            <span>{t.reserve.f_party}</span>
            <input type="text" defaultValue="2 adults" />
          </label>
          <label className="vs-field vs-field-wide">
            <span>{t.reserve.f_notes}</span>
            <textarea rows={3} placeholder={t.reserve.f_notes_ph} defaultValue=""></textarea>
          </label>
          <div className="vs-form-foot">
            <button type="submit" className="vs-btn vs-btn-dark">
              {sent ? "✓ " : ""}
              {t.reserve.submit}
            </button>
            <span className="vs-form-note">{t.reserve.reply}</span>
          </div>
        </form>
      </div>
    </section>
  );
}
