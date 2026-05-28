export type NavItem = {
  label: string;
  href: string;
  description?: string;
  children?: NavItem[];
};

export const primaryNav: NavItem[] = [
  {
    label: 'Training',
    href: '/soft-skills-training',
    description: 'Every course, by category.',
    children: [
      { label: 'Sales', href: '/sales-training' },
      { label: 'Communication', href: '/communication-training' },
      { label: 'Presentation', href: '/presentation-skills-training' },
      { label: 'Leadership', href: '/leadership-training' },
      { label: 'Management', href: '/management-training' },
      { label: 'Personal development', href: '/personal-development-training' },
      { label: 'Nudge for Lawyers', href: '/nudge-training-for-lawyers' },
      { label: 'ITD Work Styles', href: '/itd-work-styles-model-training' },
    ],
  },
  {
    label: 'Sectors',
    href: '/market-sector-specific-training',
  },
  {
    label: 'Case studies',
    href: '/case-studies',
  },
  {
    label: 'Approach',
    href: '/approach',
    children: [
      { label: 'Tailored training', href: '/tailored-training' },
      { label: 'Asynchronous training', href: '/asynchronous-training' },
      { label: 'Public open courses', href: '/public-open-training-courses' },
      { label: 'Training fees', href: '/training-fees' },
    ],
  },
  {
    label: 'Resources',
    href: '/resources',
    children: [
      { label: 'Free downloads', href: '/free-downloads' },
      { label: 'Blog', href: '/category/blog' },
      { label: 'Reviews', href: '/reviews' },
      { label: 'Keynote speaker', href: '/keynote-speaker' },
    ],
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];

export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: 'Sales',
    items: [
      { label: 'Sales training', href: '/sales-training' },
      { label: 'Advanced sales', href: '/advanced-sales-training' },
      { label: 'Telesales', href: '/telesales-training' },
      { label: 'Account management', href: '/account-management-training' },
      { label: 'Key account management', href: '/key-account-management-training' },
      { label: 'Sales management', href: '/sales-management-training' },
      { label: 'Client care', href: '/client-care-training' },
    ],
  },
  {
    heading: 'Communication',
    items: [
      { label: 'Communication', href: '/communication-training' },
      { label: 'Written communication', href: '/written-communication-training' },
      { label: 'Assertiveness', href: '/assertiveness-training' },
      { label: 'Presentation skills', href: '/presentation-skills-training' },
      { label: 'Virtual presentation', href: '/virtual-presentation-skills-training-2' },
      { label: 'Pimp My Slides', href: '/pimp-my-slides' },
    ],
  },
  {
    heading: 'Leadership & management',
    items: [
      { label: 'Leadership', href: '/leadership-training' },
      { label: 'Management', href: '/management-training' },
      { label: 'People management', href: '/people-management-training' },
      { label: 'Managing upwards', href: '/managing-upwards-training' },
      { label: 'Executive coaching', href: '/executive-coaching' },
    ],
  },
  {
    heading: 'Specialist',
    items: [
      { label: 'Nudge training', href: '/nudge-training' },
      { label: 'Nudge for Lawyers', href: '/nudge-training-for-lawyers' },
      { label: 'ITD Work Styles', href: '/itd-work-styles-model-training' },
      { label: 'D&I', href: '/diversity-inclusion-training' },
      { label: 'Project management', href: '/project-management-training' },
      { label: 'Finance', href: '/finance-training' },
    ],
  },
  {
    heading: 'Company',
    items: [
      { label: 'Approach', href: '/approach' },
      { label: 'Sectors', href: '/market-sector-specific-training' },
      { label: 'Case studies', href: '/case-studies' },
      { label: 'Reviews', href: '/reviews' },
      { label: 'Keynote speaker', href: '/keynote-speaker' },
      { label: 'Free downloads', href: '/free-downloads' },
      { label: 'Training fees', href: '/training-fees' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];
