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
  /** The number itd.com publishes on its contact page. Used in the footer, schema and contact page. */
  phone: '+44 (0)1608 676705',
  /** Freephone number quoted across the old site's course pages ("call us on 0800 …"). */
  phoneFreephone: '+44 (0)800 804 8086',
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
  /** itd.com publishes no social profiles; add verified URLs here and they flow into the footer and schema. */
  social: {} as Record<string, string>,
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

/**
 * Where the Work Styles questionnaire posts the respondent's details and
 * scores. Defaults to the contact form relay so one endpoint can serve both.
 * When neither is set the page still scores in the browser and offers a
 * mailto: so results are never lost.
 */
export const quizEndpoint: string | undefined = import.meta.env.PUBLIC_QUIZ_ENDPOINT || formEndpoint;

/**
 * Cloudflare Turnstile site key for the forms. Unset = Cloudflare's public
 * always-pass test key, so the widget renders on staging but protects nothing.
 * See https://developers.cloudflare.com/turnstile/troubleshooting/testing/
 */
const TURNSTILE_TEST_KEY = '1x00000000000000000000AA';
export const turnstileSiteKey: string = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || TURNSTILE_TEST_KEY;
export const turnstileIsTestKey = turnstileSiteKey === TURNSTILE_TEST_KEY;
if (turnstileIsTestKey && import.meta.env.PROD) {
  console.warn('[itd] PUBLIC_TURNSTILE_SITE_KEY is not set: forms use the Turnstile test key (no spam protection).');
}
