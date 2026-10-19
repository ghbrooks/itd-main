import { trainingGroups, coachingLinks, nudgeLinks } from './training';

export type NavItem = {
  label: string;
  href: string;
  description?: string;
  /** Second level. For the Training item these are groups with their own children. */
  children?: NavItem[];
};

const toNav = (links: { label: string; slug: string }[]): NavItem[] =>
  links.map((l) => ({ label: l.label, href: `/${l.slug}` }));

/**
 * Primary navigation, in the order the client specified.
 * Training is a three-level mega-menu (item → group → course); every other
 * dropdown is a flat list.
 */
export const primaryNav: NavItem[] = [
  {
    label: 'Training',
    href: '/training',
    description: 'Every course, grouped by subject area. All tailored, all available virtually or in person.',
    children: trainingGroups.map((g) => ({
      label: g.label,
      href: `/training#${g.id}`,
      description: g.blurb,
      children: toNav(g.courses),
    })),
  },
  {
    label: 'Coaching',
    href: '/coaching',
    description: 'One-to-one development for leaders, specialists and sales managers.',
    children: toNav(coachingLinks),
  },
  {
    label: 'Consultancy',
    href: '/consultancy-projects',
    description: 'Longer-term projects: culture, behavioural assessment and training needs.',
    children: [
      { label: 'Culture Development', href: '/culture-leadership-training' },
      { label: 'Nudge Assessment of your organisation', href: '/nudge-consultancy' },
      { label: 'Training Needs Analysis', href: '/training-needs-analysis' },
    ],
  },
  {
    label: 'Sectors',
    href: '/sectors',
  },
  {
    label: 'Nudge',
    href: '/nudge-training',
    description: 'Behavioural science you can use on Monday morning.',
    children: toNav(nudgeLinks),
  },
  {
    label: 'Case Studies',
    href: '/case-studies',
  },
  {
    label: 'Reviews',
    href: '/reviews',
  },
  {
    label: 'About',
    href: '/about',
    description: 'Who we are, how we work and what it costs.',
    children: [
      { label: 'About ITD', href: '/about' },
      { label: 'About Martin Chapman', href: '/about-martin-chapman' },
      { label: 'Training Fees', href: '/training-fees' },
      { label: 'Bespoke Training', href: '/bespoke-training' },
      { label: 'Bite Size Learning', href: '/bite-size-learning' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Where in the World?', href: '/where-have-itd-trained-in-the-world' },
      { label: 'Asynchronous Training', href: '/asynchronous-training' },
    ],
  },
  {
    label: 'Blog',
    href: '/blog',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];

export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: 'Leadership & management',
    items: [
      { label: 'Management training', href: '/management-training' },
      { label: 'Leadership training', href: '/leadership-training' },
      { label: 'Line manager training', href: '/line-manager-training' },
      { label: 'Coaching skills', href: '/coaching-skills-training' },
      { label: 'Delegation skills', href: '/delegation-skills-training' },
      { label: 'Team building', href: '/team-building-training' },
      { label: 'Executive coaching', href: '/executive-coaching' },
    ],
  },
  {
    heading: 'Communication',
    items: [
      { label: 'Communication skills', href: '/communication-skills-training' },
      { label: 'Presentation skills', href: '/presentation-skills-training' },
      { label: 'Virtual presentation skills', href: '/virtual-presentation-skills-training-2' },
      { label: 'Public speaking', href: '/public-speaking-training' },
      { label: 'Written communication', href: '/written-communication-skills-training' },
      { label: 'Assertiveness', href: '/assertiveness-training' },
    ],
  },
  {
    heading: 'Sales & personal development',
    items: [
      { label: 'Sales training', href: '/sales-training' },
      { label: 'Key account management', href: '/key-account-management-training' },
      { label: 'Negotiation', href: '/negotiation-skills-training' },
      { label: 'Time management', href: '/time-management-training' },
      { label: 'Personal efficiency', href: '/personal-efficiency-training' },
      { label: 'Resilience', href: '/resilience-training' },
    ],
  },
  {
    heading: 'Specialist',
    items: [
      { label: 'Nudge training', href: '/nudge-training' },
      { label: 'Nudge for lawyers', href: '/nudge-training-for-lawyers' },
      { label: 'ITD Work Styles Model', href: '/work-styles-model' },
      { label: 'Work Styles questionnaire', href: '/work-styles-model-questionnaire' },
      { label: 'Project management', href: '/project-management-training' },
      { label: 'Finance for non-finance', href: '/finance-for-non-finance-training' },
      { label: 'Keynote speaker', href: '/keynote-speaker' },
    ],
  },
  {
    heading: 'Company',
    items: [
      { label: 'About ITD', href: '/about' },
      { label: 'About Martin Chapman', href: '/about-martin-chapman' },
      { label: 'Training fees', href: '/training-fees' },
      { label: 'Sectors', href: '/sectors' },
      { label: 'Case studies', href: '/case-studies' },
      { label: 'Reviews', href: '/reviews' },
      { label: 'Blog', href: '/blog' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Where in the world?', href: '/where-have-itd-trained-in-the-world' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];

/** Small print links in the footer bar. All resolve to entries in the `pages` collection. */
export const legalNav: NavItem[] = [
  { label: 'Privacy & cookies', href: '/privacy' },
  { label: 'Equality & diversity', href: '/equality-and-diversity-policy' },
  { label: 'Modern slavery', href: '/modern-slavery-policy' },
  { label: 'Supplier code of conduct', href: '/supplier-code-of-conduct-compliance-policy' },
];
