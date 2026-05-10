"use client";

import Link from "next/link";
import { COPY } from "@/lib/data";
import { useLang } from "@/components/LangContext";
import { Placeholder } from "@/components/Placeholder";

export function Hero() {
  const { lang } = useLang();
  const t = COPY[lang];

  return (
    <section className="vs-hero" id="top">
      <div className="vs-hero-inner">
        <div className="vs-hero-meta">
          <span className="vs-hero-eyebrow">{t.hero.eyebrow}</span>
          <span className="vs-hero-coords">32.0461° N · 116.5861° W</span>
        </div>

        <h1 className="vs-hero-title">
          {t.hero.title_1} <em>{t.hero.title_em}</em>
          <br />
          {t.hero.title_2}
        </h1>

        <p className="vs-hero-lede">{t.hero.lede}</p>

        <div className="vs-hero-grid">
          <div className="vs-search">
            <div className="vs-search-row">
              <div className="vs-search-field">
                <span className="vs-search-label">{t.hero.search_dates}</span>
                <span className="vs-search-value">{t.hero.search_dates_v}</span>
              </div>
              <div className="vs-search-field">
                <span className="vs-search-label">{t.hero.search_guests}</span>
                <span className="vs-search-value">{t.hero.search_guests_v}</span>
              </div>
              <div className="vs-search-field">
                <span className="vs-search-label">{t.hero.search_taste}</span>
                <span className="vs-search-value">{t.hero.search_taste_v}</span>
              </div>
              <Link className="vs-btn vs-btn-dark vs-search-cta" href={`/search?lang=${lang}`}>
                {t.hero.search_cta} →
              </Link>
            </div>
          </div>

          <div className="vs-hero-feature">
            <div className="vs-hero-feature-img">
              <Placeholder palette={["#8a4a2a", "#d4b896", "#2a1814"]} shape="arch" aspect="5/6" />
              <span className="vs-hero-feature-tag">{t.hero.featured}</span>
            </div>
            <div className="vs-hero-feature-meta">
              <div className="vs-hero-feature-name">Casa de Piedra</div>
              <div className="vs-hero-feature-desc">El Porvenir · 6 guests · vineyard view</div>
              <div className="vs-hero-feature-price">
                <span>$685</span> USD / night
              </div>
            </div>
          </div>
        </div>

        <div className="vs-hero-marquee">
          <span>Vineyard view</span><i>·</i>
          <span>Off-grid casita</span><i>·</i>
          <span>Architect-built villa</span><i>·</i>
          <span>Working olive ranch</span><i>·</i>
          <span>Open-fire kitchen</span><i>·</i>
          <span>Private cellar</span><i>·</i>
          <span>Stargazing platform</span><i>·</i>
          <span>Cold pool</span><i>·</i>
          <span>Outdoor copper tub</span><i>·</i>
          <span>Full chef on call</span><i>·</i>
        </div>
      </div>
    </section>
  );
}
