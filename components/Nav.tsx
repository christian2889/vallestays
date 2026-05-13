"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { COPY } from "@/lib/data";
import { useLang } from "./LangContext";

type Props = {
  active?: "search" | "stays" | "experiences" | "guide" | "host" | null;
  showReserve?: boolean;
  backHref?: string;
  backLabel?: string;
};

export function Nav({ active = null, showReserve = true, backHref, backLabel }: Props) {
  const { lang, setLang } = useLang();
  const t = COPY[lang];
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  const close = () => setMobileOpen(false);

  return (
    <>
      <header className="vs-nav">
        <Link href={`/?lang=${lang}`} className="vs-logo">
          <span className="vs-logo-mark">v</span>
          <span className="vs-logo-word">
            valle<em>stays</em>
          </span>
        </Link>

        {backHref ? (
          <nav className="vs-nav-links">
            <Link href={backHref}>← {backLabel}</Link>
          </nav>
        ) : (
          <nav className="vs-nav-links">
            <Link href={`/search?lang=${lang}`} className={active === "search" ? "on" : ""}>
              {t.nav.search}
            </Link>
            <Link href={`/?lang=${lang}#stays`} className={active === "stays" ? "on" : ""}>
              {t.nav.stays}
            </Link>
            <Link href={`/?lang=${lang}#experiences`} className={active === "experiences" ? "on" : ""}>
              {t.nav.experiences}
            </Link>
            <Link href={`/guide?lang=${lang}`} className={active === "guide" ? "on" : ""}>
              {t.nav.guide}
            </Link>
            <Link href={`/host?lang=${lang}`} className={active === "host" ? "on" : ""}>
              {t.nav.host}
            </Link>
          </nav>
        )}

        <div className="vs-nav-right">
          <div className="vs-lang">
            <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>
              EN
            </button>
            <span>·</span>
            <button className={lang === "es" ? "on" : ""} onClick={() => setLang("es")}>
              ES
            </button>
          </div>
          {showReserve && (
            <Link href={`/?lang=${lang}#reserve`} className="vs-btn vs-btn-dark">
              {t.nav.reserve}
            </Link>
          )}
          <button
            className="vs-nav-burger"
            aria-label="Menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <div className={"vs-nav-mobile" + (mobileOpen ? " open" : "")} role="dialog" aria-modal="true">
        <button className="vs-nav-mobile-close" onClick={close} aria-label="Close">
          ×
        </button>
        <nav className="vs-nav-mobile-links">
          <Link href={`/search?lang=${lang}`} onClick={close}>
            {t.nav.search}
          </Link>
          <Link href={`/?lang=${lang}#stays`} onClick={close}>
            {t.nav.stays}
          </Link>
          <Link href={`/?lang=${lang}#experiences`} onClick={close}>
            {t.nav.experiences}
          </Link>
          <Link href={`/guide?lang=${lang}`} onClick={close}>
            {t.nav.guide}
          </Link>
          <Link href={`/host?lang=${lang}`} onClick={close}>
            {t.nav.host}
          </Link>
          <Link href={`/?lang=${lang}#reserve`} onClick={close} className="vs-nav-mobile-cta">
            {t.nav.reserve} →
          </Link>
        </nav>
        <div className="vs-nav-mobile-foot">
          <button
            className={lang === "en" ? "on" : ""}
            onClick={() => {
              setLang("en");
              close();
            }}
          >
            EN
          </button>
          <span>·</span>
          <button
            className={lang === "es" ? "on" : ""}
            onClick={() => {
              setLang("es");
              close();
            }}
          >
            ES
          </button>
        </div>
      </div>
    </>
  );
}
