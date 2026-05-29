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
      { label: 'Communication', href: '/communication-skills-training' },
      { label: 'Presentation', href: '/presentation-skills-training' },
      { label: 'Leadership', href: '/leadership-training' },
      { label: 'Management', href: '/management-training' },
      { label: 'Personal development', href: '/personal-development-training' },
      { label: 'Nudge for Lawyers', href: '/nudge-training-for-lawyers' },
      { label: 'ITD Work Styles', href: '/work-styles-model' },
    ],
  },
  {
    label: 'Sectors',
    href: '/sectors',
  },
  {
    label: 'Case studies',
    href: '/case-studies',
  },
  {
    label: 'About',
    href: '/about',
    children: [
      { label: 'About ITD', href: '/about' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Tailored training', href: '/tailored-training' },
      { label: 'Bespoke training', href: '/bespoke-training' },
      { label: 'Open courses', href: '/open-training' },
      { label: 'Where we train', href: '/where-have-itd-trained-in-the-world' },
    ],
  },
  {
    label: 'Resources',
    href: '/blog',
    children: [
      { label: 'Blog', href: '/blog' },
      { label: 'Keynote speaker', href: '/keynote-speaker' },
      { label: 'Asynchronous training', href: '/asynchronous-training' },
      { label: 'Bite-size learning', href: '/bite-size-learning' },
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
      { label: 'Account management', href: '/account-management-training-2' },
      { label: 'Key account management', href: '/key-account-management-training' },
      { label: 'Sales management', href: '/sales-management-training' },
      { label: 'Client care', href: '/client-care-training' },
    ],
  },
  {
    heading: 'Communication',
    items: [
      { label: 'Communication', href: '/communication-skills-training' },
      { label: 'Written communication', href: '/written-communication-skills-training' },
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
      { label: 'ITD Work Styles', href: '/work-styles-model' },
      { label: 'Diversity & Inclusion', href: '/diversity-and-inclusion-training' },
      { label: 'Project management', href: '/project-management-training' },
      { label: 'Financial awareness', href: '/financial-awareness-training' },
    ],
  },
  {
    heading: 'Company',
    items: [
      { label: 'About ITD', href: '/about' },
      { label: 'Sectors', href: '/sectors' },
      { label: 'Case studies', href: '/case-studies' },
      { label: 'Blog', href: '/blog' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Keynote speaker', href: '/keynote-speaker' },
      { label: 'Where we train', href: '/where-have-itd-trained-in-the-world' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];
