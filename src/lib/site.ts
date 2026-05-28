export const site = {
  name: 'itD',
  longName: 'International Training and Development',
  tagline: 'Soft-skills training that sticks.',
  description:
    'Soft-skills training for the world’s most demanding teams. Sales, communication, presentation, leadership and management. Delivered in-person or virtually since 1999.',
  url: 'https://itd.com',
  defaultOgImage: '/og-default.png',
  email: 'hello@itd.com',
  phone: '+44 (0)20 7060 0666',
  founded: 1999,
  founder: 'Martin Chapman',
  rating: { value: 4.8, count: 220 },
  address: {
    streetAddress: '',
    addressLocality: 'London',
    addressCountry: 'GB',
  },
  social: {
    linkedin: 'https://www.linkedin.com/company/itd-uk',
  },
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
