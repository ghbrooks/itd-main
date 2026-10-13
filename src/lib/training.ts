/**
 * The training catalogue as the client wants it presented.
 *
 * This is the single source for the Training mega-menu, the /training hub,
 * the homepage category cards and the "subject area" filters. Labels are the
 * client's wording from the agreed sitemap; `slug` must be a real entry in
 * `src/content/courses/`. A build-time check in /training reports any slug
 * that does not resolve, so a typo here fails loudly rather than 404ing.
 */

export type TrainingLink = { label: string; slug: string };

export type TrainingGroup = {
  id: string;
  label: string;
  /** Short line used on hub pages and the homepage cards. */
  blurb: string;
  courses: TrainingLink[];
};

export const trainingGroups: TrainingGroup[] = [
  {
    id: 'leadership-management',
    label: 'Leadership & Management',
    blurb: 'Practical programmes for people who lead, manage, coach and supervise others.',
    courses: [
      { label: 'Management Training', slug: 'management-training' },
      { label: 'Managing Gen Z Training', slug: 'managing-gen-z-training' },
      { label: 'Change Management Training', slug: 'change-management-training' },
      { label: 'Coaching Skills Training', slug: 'coaching-skills-training' },
      { label: 'Mentoring Training', slug: 'mentoring-training' },
      { label: 'Team Leadership Training', slug: 'team-leadership-training' },
      { label: 'Culture Leadership Training', slug: 'culture-leadership-training' },
      { label: 'Delegation Skills Training', slug: 'delegation-skills-training' },
      { label: 'Supervisor Training', slug: 'supervisor-training' },
      { label: 'Managing Remote Employees Training', slug: 'managing-remote-employees-training' },
      { label: 'Giving and Receiving Feedback Training', slug: 'giving-and-receiving-feedback-training' },
      { label: 'Line Manager Training', slug: 'line-manager-training' },
      { label: 'Sales Management Training', slug: 'sales-management-training' },
      { label: 'How to Run Effective One-to-Ones Training', slug: 'effective-one-to-ones-training' },
      { label: 'Team Building Training', slug: 'team-building-training' },
    ],
  },
  {
    id: 'communication',
    label: 'Communication',
    blurb: 'Speak, present and write so that people listen, remember and act.',
    courses: [
      { label: 'Communication Skills Training', slug: 'communication-skills-training' },
      { label: 'Presentation Skills Training', slug: 'presentation-skills-training' },
      { label: 'Presenting a Webinar Training', slug: 'presenting-a-webinar' },
      { label: 'Advanced Presentation Skills Training', slug: 'advanced-presentation-skills-training' },
      { label: 'Virtual Presentation Skills Training', slug: 'virtual-presentation-skills-training-2' },
      { label: 'Public Speaking Training', slug: 'public-speaking-training' },
      { label: 'Written Communication Training', slug: 'written-communication-skills-training' },
    ],
  },
  {
    id: 'personal-development',
    label: 'Personal Development',
    blurb: 'The habits and skills that make individuals more effective, resilient and confident.',
    courses: [
      { label: 'Assertiveness Training', slug: 'assertiveness-training' },
      { label: 'Client Care Training', slug: 'client-care-training' },
      { label: 'Customer Service Training', slug: 'customer-service-training' },
      { label: 'Personality At Work Training', slug: 'personality-at-work-training' },
      { label: 'Difficult Conversations Training', slug: 'handling-difficult-conversations-training' },
      { label: 'Microaggression Training', slug: 'microaggression-training' },
      { label: 'Micro-misogyny Training', slug: 'micro-misogyny-training' },
      { label: 'Unconscious Bias Training', slug: 'unconscious-bias-training' },
      { label: 'Personal Efficiency Training', slug: 'personal-efficiency-training' },
      { label: 'Managing Your Workload Training', slug: 'managing-your-workload-training' },
      { label: 'Time Management Training', slug: 'time-management-training' },
      { label: 'Project Management Training', slug: 'project-management-training' },
      { label: 'Finance for Non-Finance Training', slug: 'finance-for-non-finance-training' },
      { label: 'Financial Awareness Training', slug: 'financial-awareness-training' },
      { label: 'Resilience Training', slug: 'resilience-training' },
      { label: 'Stress Management Training', slug: 'stress-management-training-course' },
      { label: 'Questioning Skills Training', slug: 'questioning-skills-training' },
      { label: 'Train The Trainer Training', slug: 'train-the-trainer-training' },
      { label: 'Train The Virtual Trainer Training', slug: 'train-the-virtual-trainer' },
      { label: 'Negotiation Training', slug: 'negotiation-skills-training' },
      { label: 'Managing Upwards Training', slug: 'managing-upwards-training' },
      { label: 'Personal Brand Training', slug: 'personal-brand-training' },
    ],
  },
  {
    id: 'sales',
    label: 'Sales Training',
    blurb: 'From first call to key account: selling that is consultative, confident and measurable.',
    courses: [
      { label: 'Account Management Training', slug: 'account-management-training-2' },
      { label: 'Key Account Management Training', slug: 'key-account-management-training' },
      { label: 'Territory Management Training', slug: 'territory-management-training' },
      { label: 'Basic Sales Training', slug: 'basic-sales-training' },
      { label: 'Cold Calling Training', slug: 'cold-calling-training' },
      { label: 'Telesales Training', slug: 'telesales-training' },
      { label: 'Advanced Sales Training', slug: 'advanced-sales-training' },
      { label: 'International Sales Training', slug: 'international-sales-training' },
      { label: 'Networking Training', slug: 'networking-training' },
      { label: 'Sales for Non-Sales Training', slug: 'sales-for-non-sales-training' },
      { label: 'Sales Presentation Training', slug: 'sales-presentation-skills-training' },
    ],
  },
];

export const coachingLinks: TrainingLink[] = [
  { label: 'Executive Coaching', slug: 'executive-coaching' },
  { label: 'One-to-One Coaching', slug: 'one-to-one-coaching' },
  { label: 'Sales Management Coaching', slug: 'sales-management-coaching' },
];

export const nudgeLinks: TrainingLink[] = [
  { label: 'Nudge Training', slug: 'nudge-training' },
  { label: 'Nudge in Design Training', slug: 'nudge-in-design' },
  { label: 'Nudge Sales Training', slug: 'nudge-sales-training' },
  { label: 'Nudge Consultancy', slug: 'nudge-consultancy' },
];

/** Reverse index: course slug → group id, for labelling and filters. */
export const groupBySlug: Record<string, TrainingGroup> = Object.fromEntries(
  trainingGroups.flatMap((g) => g.courses.map((c) => [c.slug, g])),
);

export function groupForSlug(slug: string): TrainingGroup | undefined {
  return groupBySlug[slug];
}
