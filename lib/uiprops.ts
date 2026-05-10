import type { DBProperty, DBPropertyImage } from "@/lib/database.types";
import type { Lang } from "@/lib/data";

/** Property + cover image + all images, normalized for the UI. Safe to import in client components. */
export type UIProperty = DBProperty & {
  primary_image_url: string | null;
  images: DBPropertyImage[];
};

const FALLBACK_PALETTES: [string, string, string][] = [
  ["#8a4a2a", "#d4b896", "#3a2418"],
  ["#5e6b3a", "#d8d2b8", "#1f2418"],
  ["#3a4a52", "#c8d2d4", "#181f24"],
  ["#a06b3a", "#e8dcc4", "#241814"],
  ["#b56a3a", "#e8d4b0", "#2a1814"],
  ["#c98e5a", "#e8d8b8", "#2a1f17"],
];
const FALLBACK_SHAPES = ["arch", "rect", "rect-tall", "arch-tall", "circle", "circle-large"];

export function paletteFor(p: { id: string }): [string, string, string] {
  let h = 0;
  for (let i = 0; i < p.id.length; i++) h = (h << 5) - h + p.id.charCodeAt(i);
  return FALLBACK_PALETTES[Math.abs(h) % FALLBACK_PALETTES.length];
}

export function shapeFor(p: { id: string }): string {
  let h = 0;
  for (let i = 0; i < p.id.length; i++) h = (h * 31 + p.id.charCodeAt(i)) | 0;
  return FALLBACK_SHAPES[Math.abs(h) % FALLBACK_SHAPES.length];
}

export function nameFor(p: DBProperty, lang: Lang): string {
  return (lang === "es" && p.title_es) || p.title;
}
export function descFor(p: DBProperty, lang: Lang): string {
  return (lang === "es" && p.description_es) || p.description;
}
export function localeFor(p: DBProperty): string {
  return [p.city, p.state].filter(Boolean).join(" · ");
}

export function toUIProperty(
  row: DBProperty & { property_images?: DBPropertyImage[] | null }
): UIProperty {
  const images = (row.property_images ?? [])
    .slice()
    .sort((a, b) => {
      if (a.is_primary && !b.is_primary) return -1;
      if (!a.is_primary && b.is_primary) return 1;
      return (a.sort_order ?? 0) - (b.sort_order ?? 0);
    });
  return {
    ...row,
    primary_image_url: images[0]?.url ?? null,
    images,
  };
}
