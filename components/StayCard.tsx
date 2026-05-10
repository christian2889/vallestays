"use client";

import Link from "next/link";
import { COPY } from "@/lib/data";
import { useLang } from "@/components/LangContext";
import { Placeholder } from "@/components/Placeholder";
import {
  type UIProperty,
  nameFor,
  descFor,
  localeFor,
  paletteFor,
  shapeFor,
} from "@/lib/uiprops";

export function StayCard({ p, index }: { p: UIProperty; index: number }) {
  const { lang } = useLang();
  const t = COPY[lang];
  const href = `/stay?id=${p.slug || p.id}&lang=${lang}`;

  return (
    <article className="vs-stay">
      <Link href={href} className="vs-stay-img" style={{ display: "block" }}>
        {p.primary_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.primary_image_url}
            alt={nameFor(p, lang)}
            style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", borderRadius: 6 }}
          />
        ) : (
          <Placeholder palette={paletteFor(p)} shape={shapeFor(p)} aspect="4/5" />
        )}
        <span className="vs-stay-num">0{index + 1}</span>
      </Link>
      <div className="vs-stay-meta">
        <div className="vs-stay-row">
          <h3 className="vs-stay-name">{nameFor(p, lang)}</h3>
          <div className="vs-stay-price">
            <span className="vs-stay-price-from">{t.stays.from}</span>
            <span className="vs-stay-price-n">${Math.round(p.price_per_night)}</span>
            <span className="vs-stay-price-unit">
              {p.currency || "USD"} {t.stays.per_night}
            </span>
          </div>
        </div>
        <div className="vs-stay-locale">{localeFor(p)}</div>
        <p className="vs-stay-desc">{descFor(p, lang)}</p>
        <div className="vs-stay-foot">
          <div className="vs-stay-specs">
            <span>
              {t.stays.sleeps} {p.max_guests}
            </span>
            <i>·</i>
            <span>{p.beds} bd</span>
            <i>·</i>
            <span>{p.bathrooms} ba</span>
          </div>
          <Link className="vs-stay-link" href={href}>
            {t.stays.view_home} →
          </Link>
        </div>
      </div>
    </article>
  );
}
