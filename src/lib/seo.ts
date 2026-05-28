import { site } from './site';

export type SeoProps = {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  noindex?: boolean;
  type?: 'website' | 'article';
};

export function buildTitle(title: string): string {
  if (title === site.longName || title.includes(site.longName)) return title;
  return `${title} — ${site.longName}`;
}

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  if (!path.startsWith('/')) path = `/${path}`;
  return `${site.url}${path}`;
}
