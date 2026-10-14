import { site } from './site';

export type SeoProps = {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  noindex?: boolean;
  type?: 'website' | 'article';
};

/** Google shows roughly 60–70 characters of a title; keep the brand suffix short. */
export const TITLE_MAX = 70;
export const DESCRIPTION_MAX = 160;

export function buildTitle(title: string): string {
  const t = title.trim();
  if (/\bITD\b/.test(t) || t.includes(site.longName)) return t;
  const withBrand = `${t} | ${site.name}`;
  return withBrand.length <= TITLE_MAX ? withBrand : t;
}

/** Trim a description to the length search engines display, on a word boundary. */
export function clampDescription(text: string, max = DESCRIPTION_MAX): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const atWord = cut.slice(0, Math.max(cut.lastIndexOf(' '), max - 30));
  return `${atWord.replace(/[\s,;:–—-]+$/, '')}…`;
}

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  if (!path.startsWith('/')) path = `/${path}`;
  return `${site.url}${path}`;
}
