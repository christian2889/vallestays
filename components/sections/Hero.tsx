"use client";

import Link from "next/link";
import { COPY } from "@/lib/data";
import { useLang } from "@/components/LangContext";
import { Placeholder } from "@/components/Placeholder";
import {
  type UIProperty,
  nameFor,
  localeFor,
  paletteFor,
  shapeFor,
} from "@/lib/uiprops";

export function Hero({ featured }: { featured: UIProperty | null }) {
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

          {featured && (
            <Link
              href={`/stay?id=${featured.slug || featured.id}&lang=${lang}`}
              className="vs-hero-feature"
            >
              <div className="vs-hero-feature-img">
                {featured.primary_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={featured.primary_image_url}
                    alt={nameFor(featured, lang)}
                    style={{ width: "100%", aspectRatio: "5/6", objectFit: "cover", borderRadius: 4 }}
                  />
                ) : (
                  <Placeholder
                    palette={paletteFor(featured)}
                    shape={shapeFor(featured)}
                    aspect="5/6"
                  />
                )}
                <span className="vs-hero-feature-tag">{t.hero.featured}</span>
              </div>
              <div className="vs-hero-feature-meta">
                <div className="vs-hero-feature-name">{nameFor(featured, lang)}</div>
                <div className="vs-hero-feature-desc">
                  {localeFor(featured)} · {featured.max_guests} guests
                </div>
                <div className="vs-hero-feature-price">
                  <span>${Math.round(featured.price_per_night)}</span> {featured.currency || "USD"} / night
                </div>
              </div>
            </Link>
          )}
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
