export const site = {
  name: 'ITD',
  longName: 'International Training and Development',
  legalName: 'ITD Limited',
  companyNumber: '4534876',
  tagline: 'Virtual & In-Person Soft Skills Training & Coaching Tailored to Your Needs',
  description:
    'ITD delivers virtual and in-person soft skills training and coaching, tailored to your needs. Founded in 2002, with experience across more than 30 countries.',
  /** Canonical origin. Must match `site` in astro.config.mjs (no trailing slash, no www). */
  url: 'https://itd.com',
  defaultOgImage: '/og-default.png',
  email: 'info@itd.com',
  phone: '+44 (0)800 804 8086',
  phoneDirect: '+44 (0)1608 676705',
  founded: 2002,
  founder: 'Martin Chapman',
  address: {
    streetAddress: 'PO Box 282',
    addressLocality: 'Chipping Norton',
    addressRegion: 'Oxfordshire',
    postalCode: 'OX7 9EE',
    addressCountry: 'GB',
  },
  registeredAddress: {
    streetAddress: '3 Bignell Park Barns',
    addressLocality: 'Bicester',
    postalCode: 'OX26 1TD',
    addressCountry: 'GB',
  },
  social: {
    linkedin: 'https://www.linkedin.com/company/itd-uk',
  },
  videoLearningUrl: 'https://video-learning.vhx.tv/',
  namedClients: [
    'Clifford Chance',
    'Cancer Research UK',
    'Hilton',
    'Workday',
    'SSE',
    'The Charity Commission',
    'Malvern Panalytical',
    'Corpag',
    'IAM RoadSmart',
    'Sinosky',
  ],
} as const;

export type SiteConfig = typeof site;

/**
 * Contact form relay. Set PUBLIC_FORM_ENDPOINT at build time (e.g. a Formspree
 * or Cloudflare Worker URL). When unset the form falls back to a mailto: link
 * so enquiries are never silently dropped.
 */
export const formEndpoint: string | undefined = import.meta.env.PUBLIC_FORM_ENDPOINT || undefined;
