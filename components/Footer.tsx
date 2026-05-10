"use client";

import { COPY } from "@/lib/data";
import { useLang } from "./LangContext";

export function Footer() {
  const { lang } = useLang();
  const t = COPY[lang];

  return (
    <footer className="vs-footer">
      <div className="vs-footer-top">
        <div className="vs-footer-brand">
          <div className="vs-logo">
            <span className="vs-logo-mark">v</span>
            <span className="vs-logo-word">
              valle<em>stays</em>
            </span>
          </div>
          <p>{t.footer.tagline}</p>
        </div>
        <div className="vs-footer-col">
          <div className="vs-footer-h">{t.footer.contact}</div>
          <div className="vs-footer-line" style={{ whiteSpace: "pre-line" }}>
            {t.footer.address}
          </div>
          <div className="vs-footer-line">{t.footer.phone}</div>
          <div className="vs-footer-line">{t.footer.email}</div>
        </div>
        <div className="vs-footer-col">
          <div className="vs-footer-h">{t.footer.follow}</div>
          <div className="vs-footer-line">@vallestays</div>
          <div className="vs-footer-line">Are.na / valle-stays</div>
          <div className="vs-footer-line">Substack — Field notes</div>
        </div>
      </div>
      <div className="vs-footer-bot">
        <span>{t.footer.legal}</span>
        <span className="vs-footer-coords">32.0461° N · 116.5861° W</span>
      </div>
    </footer>
  );
}
