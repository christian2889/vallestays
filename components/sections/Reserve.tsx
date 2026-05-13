"use client";

import { useRef, useState } from "react";
import { COPY } from "@/lib/data";
import { useLang } from "@/components/LangContext";
import { submitInquiry } from "@/app/actions/inquiry";

const RESERVE_IMG =
  "https://ex6thmhdsdxhmmgd.public.blob.vercel-storage.com/properties/2f279dce-bf74-4124-90c6-ed3e26cad5c0/imported-1769586591492-0.jpg";

export function Reserve() {
  const { lang } = useLang();
  const t = COPY[lang];
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await submitInquiry(fd);
    setSent(true);
    setLoading(false);
    formRef.current?.reset();
  }

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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={RESERVE_IMG}
              alt="Valle Stays property"
              style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", borderRadius: 4 }}
            />
          </div>
        </div>

        <form ref={formRef} className="vs-form" onSubmit={handleSubmit}>
          <label className="vs-field">
            <span>{t.reserve.f_name}</span>
            <input type="text" name="name" required />
          </label>
          <label className="vs-field">
            <span>{t.reserve.f_email}</span>
            <input type="email" name="email" required />
          </label>
          <label className="vs-field">
            <span>{t.reserve.f_dates}</span>
            <input type="text" name="dates" defaultValue="" />
          </label>
          <label className="vs-field">
            <span>{t.reserve.f_party}</span>
            <input type="text" name="party" defaultValue="" />
          </label>
          <label className="vs-field vs-field-wide">
            <span>{t.reserve.f_notes}</span>
            <textarea name="notes" rows={3} placeholder={t.reserve.f_notes_ph}></textarea>
          </label>
          <div className="vs-form-foot">
            <button type="submit" className="vs-btn vs-btn-dark" disabled={loading || sent}>
              {sent ? "✓ " : ""}{loading ? "…" : t.reserve.submit}
            </button>
            <span className="vs-form-note">{sent ? (lang === "en" ? "Message received — we'll reply shortly." : "Recibido — te contestamos pronto.") : t.reserve.reply}</span>
          </div>
        </form>
      </div>
    </section>
  );
}
