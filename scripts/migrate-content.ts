// One-off migration script: reads ./old-data/*.ts (copied from the previous
// itd.com Next.js intermediate) and writes Astro markdown into src/content/.
//
// Run with:  npx tsx scripts/migrate-content.ts

import { writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { courses as oldCourses } from './old-data/courses.ts';
import { sectors as oldSectors } from './old-data/sectors.ts';
import { locations as oldLocations } from './old-data/locations.ts';
import { caseStudies as oldCaseStudies } from './old-data/case-studies.ts';
import { trainingCategories as oldServices } from './old-data/services.ts';
import { blogPosts as oldBlog } from './old-data/pages/blog-posts.ts';
import { reviews as oldReviews } from './old-data/reviews.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const CONTENT = join(REPO_ROOT, 'src', 'content');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function yamlEscape(s: string): string {
  // Single-quote YAML: escape single quotes by doubling.
  return `'${String(s).replace(/'/g, "''")}'`;
}

function yamlBlock(s: string): string {
  // For multi-line strings — use literal block style with indent.
  const lines = String(s).split('\n');
  return '|\n' + lines.map((l) => '  ' + l).join('\n');
}

function yamlArray(arr: string[]): string {
  if (arr.length === 0) return ' []';
  return '\n' + arr.map((s) => `  - ${yamlEscape(s)}`).join('\n');
}

function yamlObjArray(arr: Record<string, string>[]): string {
  if (arr.length === 0) return '[]';
  return (
    '\n' +
    arr
      .map((o) => {
        const entries = Object.entries(o)
          .map(([k, v], i) => `${i === 0 ? '  - ' : '    '}${k}: ${yamlEscape(v)}`)
          .join('\n');
        return entries;
      })
      .join('\n')
  );
}

function writeMd(file: string, frontmatter: string, body: string) {
  mkdirSync(dirname(file), { recursive: true });
  const content = `---\n${frontmatter.trim()}\n---\n\n${body.trim()}\n`;
  writeFileSync(file, content, 'utf8');
}

function existingSlugs(dir: string): Set<string> {
  if (!existsSync(dir)) return new Set();
  return new Set(
    readdirSync(dir)
      .filter((f) => f.endsWith('.md'))
      .map((f) => f.replace(/\.md$/, '')),
  );
}

// Convert old section { heading, body: string | string[] } to markdown.
function sectionsToMd(
  sections: Array<{ heading: string; body: string | string[]; image?: string; imageAlt?: string }>,
): string {
  return sections
    .map((s) => {
      const head = `## ${s.heading}`;
      const body = Array.isArray(s.body)
        ? s.body.map((line) => `- ${line}`).join('\n')
        : s.body;
      return `${head}\n\n${body}`;
    })
    .join('\n\n');
}

// ---------------------------------------------------------------------------
// Category mapping  (old free-text -> new enum)
// ---------------------------------------------------------------------------

const CATEGORY_MAP: Record<string, string> = {
  'Communication Skills Training': 'communication',
  'Presentation Skills Training': 'presentation',
  'Management Training': 'management',
  'Leadership Training': 'leadership',
  'Sales Training': 'sales',
  'Sales Management Training': 'sales',
  'Nudge Training': 'specialist',
  'Personal Development Training': 'personal-development',
  'Personal Development': 'personal-development',
  'Project Management Training': 'specialist',
  'Team Training': 'specialist',
  'Coaching Skills Training': 'specialist',
  'Customer Service Training': 'specialist',
  'Financial Awareness Training': 'specialist',
  'Change Management Training': 'management',
  'Virtual Training': 'format',
  'Bespoke Training': 'format',
  'Tailored Training': 'format',
  'Open Training': 'format',
  'Law Firm Training': 'specialist',
  'Training Consultancy': 'specialist',
  'Executive Coaching': 'specialist',
  'Keynote Speaker': 'specialist',
  'Consultancy Projects': 'specialist',
  'Soft Skills Training': 'specialist',
};

function mapCategory(old: string): string {
  const mapped = CATEGORY_MAP[old];
  if (mapped) return mapped;
  // Fallback heuristic
  const lc = old.toLowerCase();
  if (lc.includes('communication')) return 'communication';
  if (lc.includes('presentation')) return 'presentation';
  if (lc.includes('leadership')) return 'leadership';
  if (lc.includes('management')) return 'management';
  if (lc.includes('sales')) return 'sales';
  if (lc.includes('personal')) return 'personal-development';
  if (lc.includes('virtual') || lc.includes('bespoke') || lc.includes('tailored')) return 'format';
  return 'specialist';
}

function parseMode(format: string | undefined): string[] {
  if (!format) return ['virtual', 'in-person'];
  const lc = format.toLowerCase();
  const modes: string[] = [];
  if (lc.includes('virtual')) modes.push('virtual');
  if (lc.includes('in-person') || lc.includes('in person')) modes.push('in-person');
  if (modes.length === 0) modes.push('virtual', 'in-person');
  return modes;
}

// Sector inference for case studies from category string.
function inferSector(category: string, client: string): string {
  const lc = (category + ' ' + client).toLowerCase();
  if (lc.includes('law') || lc.includes('legal') || lc.includes('chance') || lc.includes('clyde'))
    return 'Law';
  if (lc.includes('financ') || lc.includes('bank') || lc.includes('insur'))
    return 'Financial Services';
  if (lc.includes('charit') || lc.includes('cruk') || lc.includes('research')) return 'Charity';
  if (lc.includes('pharma') || lc.includes('biotech') || lc.includes('lundbeck'))
    return 'Pharma & Biotech';
  if (lc.includes('tech') || lc.includes('software')) return 'Technology';
  if (lc.includes('hilton') || lc.includes('travel') || lc.includes('hospitality')) return 'Travel';
  if (lc.includes('media')) return 'Media';
  if (lc.includes('manufactur')) return 'Manufacturing';
  if (lc.includes('maritime') || lc.includes('shipping')) return 'Maritime';
  if (lc.includes('school') || lc.includes('univers')) return 'Education';
  if (lc.includes('government') || lc.includes('council')) return 'Local Government';
  if (lc.includes('utilit') || lc.includes('energy')) return 'Utilities';
  return 'General Business';
}

// Map case-study category to a course slug for `courseSlug` linkage.
function inferCourseSlug(category: string, allCourseSlugs: Set<string>): string {
  const c = category.toLowerCase();
  const guesses = [
    c.replace(/\s+/g, '-'),
    c.replace(/\s*training\s*$/, '').replace(/\s+/g, '-') + '-training',
    'leadership-training',
  ];
  for (const g of guesses) {
    if (allCourseSlugs.has(g)) return g;
  }
  return 'leadership-training'; // safe default that exists
}

// ---------------------------------------------------------------------------
// Existing slugs in new site (we don't overwrite)
// ---------------------------------------------------------------------------

const existingCourses = existingSlugs(join(CONTENT, 'courses'));
const existingCaseStudies = existingSlugs(join(CONTENT, 'caseStudies'));
const existingSectors = existingSlugs(join(CONTENT, 'sectors'));
const existingBlog = existingSlugs(join(CONTENT, 'blog'));

console.log('Existing — courses:', existingCourses.size,
  'caseStudies:', existingCaseStudies.size,
  'sectors:', existingSectors.size,
  'blog:', existingBlog.size);

// ---------------------------------------------------------------------------
// 1. COURSES  (old courses + old training categories merged into one collection)
// ---------------------------------------------------------------------------

const stats = { courses: 0, services: 0, caseStudies: 0, sectors: 0, locations: 0, blog: 0, reviews: 0, skipped: 0 };

const allFutureCourseSlugs = new Set<string>(existingCourses);

function writeCourse(c: any, isCategory = false) {
  if (existingCourses.has(c.slug)) {
    stats.skipped++;
    return;
  }
  allFutureCourseSlugs.add(c.slug);
  const category = mapCategory(c.category ?? 'Soft Skills Training');
  const mode = parseMode(c.format);
  const intro: string = c.intro ?? c.hero?.subheading ?? c.title;
  const summary = intro;
  const outcome = intro.split('.')[0] + (intro.endsWith('.') || intro.includes('.') ? '.' : '');
  const audience =
    'Professionals looking to develop their skills in ' + c.title.toLowerCase() + '.';

  // Build agenda + outcomes from sections.
  const sections = c.sections ?? [];
  const learnSection = sections.find(
    (s: any) =>
      typeof s.heading === 'string' &&
      (s.heading.toLowerCase().includes("what you'll learn") ||
        s.heading.toLowerCase().includes('what you will learn')),
  );
  const items: string[] = learnSection
    ? Array.isArray(learnSection.body)
      ? learnSection.body
      : [String(learnSection.body)]
    : [];
  const agenda = items.length > 0 ? items : ['Introduction and objectives', 'Core concepts', 'Practical exercises', 'Application planning', 'Wrap-up and next steps'];
  const outcomes = items.length > 0
    ? items.map((i: string) => `Confidence and capability in: ${i.toLowerCase()}`)
    : ['Practical skills you can apply immediately'];

  // SEO
  const seoTitle = c.meta?.title ?? c.title;
  const seoDesc =
    c.meta?.description ?? `${c.title} from ITD. ${intro.slice(0, 140)}`;

  // Frontmatter
  const fm: string[] = [];
  fm.push(`title: ${yamlEscape(c.title)}`);
  fm.push(`category: ${yamlEscape(category)}`);
  if (isCategory) fm.push(`eyebrow: ${yamlEscape('Training overview')}`);
  fm.push(`outcome: ${yamlEscape(outcome)}`);
  fm.push(`summary: ${yamlEscape(summary)}`);
  fm.push(`duration: ${yamlEscape(c.duration ?? 'Full day')}`);
  fm.push(`mode:${yamlArray(mode)}`);
  fm.push(`audience: ${yamlEscape(audience)}`);
  fm.push(`agenda:${yamlArray(agenda)}`);
  fm.push(`outcomes:${yamlArray(outcomes)}`);
  if (c.relatedCourses && c.relatedCourses.length > 0)
    fm.push(`relatedCourses:${yamlArray(c.relatedCourses)}`);
  fm.push(`seo:\n  title: ${yamlEscape(seoTitle)}\n  description: ${yamlEscape(seoDesc)}`);

  // Body = sections rendered as markdown (excluding the "What You'll Learn" one which is now agenda).
  const bodySections = sections.filter(
    (s: any) =>
      !(
        typeof s.heading === 'string' &&
        (s.heading.toLowerCase().includes("what you'll learn") ||
          s.heading.toLowerCase().includes('what you will learn'))
      ),
  );
  const body = bodySections.length > 0 ? sectionsToMd(bodySections) : intro;

  const file = join(CONTENT, 'courses', `${c.slug}.md`);
  writeMd(file, fm.join('\n'), body);

  if (isCategory) stats.services++;
  else stats.courses++;
}

for (const c of oldCourses) writeCourse(c, false);
for (const slug of Object.keys(oldServices)) {
  const svc = oldServices[slug];
  // Map service to a course-like shape so writeCourse works.
  writeCourse(
    {
      slug: svc.slug,
      title: svc.title,
      category: svc.title, // self-map via fallback heuristic
      intro: svc.intro,
      meta: svc.meta,
      hero: svc.hero,
      sections: svc.sections,
      relatedCourses: svc.relatedCourses,
      duration: 'Tailored to your needs',
      format: 'Virtual & In-Person',
    },
    true,
  );
}

// ---------------------------------------------------------------------------
// 2. SECTORS
// ---------------------------------------------------------------------------

for (const s of oldSectors) {
  if (existingSectors.has(s.slug)) {
    stats.skipped++;
    continue;
  }
  const summary = s.intro ?? s.hero?.subheading ?? s.title;
  const namedClients: string[] = (s as any).namedClients ?? [];
  const relevantCourses: string[] = (s as any).relevantCourses ?? [];

  const seoTitle = s.meta?.title ?? s.title;
  const seoDesc = s.meta?.description ?? summary.slice(0, 160);

  const fm: string[] = [];
  fm.push(`title: ${yamlEscape(s.title)}`);
  fm.push(`summary: ${yamlEscape(summary)}`);
  fm.push(`namedClients:${yamlArray(namedClients)}`);
  fm.push(`relevantCourses:${yamlArray(relevantCourses)}`);
  fm.push(`seo:\n  title: ${yamlEscape(seoTitle)}\n  description: ${yamlEscape(seoDesc)}`);

  const body = sectionsToMd(s.sections ?? []);

  writeMd(join(CONTENT, 'sectors', `${s.slug}.md`), fm.join('\n'), body || summary);
  stats.sectors++;
}

// ---------------------------------------------------------------------------
// 3. LOCATIONS  (write into NEW collection 'locations')
// ---------------------------------------------------------------------------

for (const l of oldLocations) {
  const summary = l.intro ?? l.hero?.subheading ?? l.title;
  const seoTitle = l.meta?.title ?? l.title;
  const seoDesc = l.meta?.description ?? summary.slice(0, 160);

  const fm: string[] = [];
  fm.push(`title: ${yamlEscape(l.title)}`);
  fm.push(`country: ${yamlEscape(l.country)}`);
  fm.push(`summary: ${yamlEscape(summary)}`);
  fm.push(`seo:\n  title: ${yamlEscape(seoTitle)}\n  description: ${yamlEscape(seoDesc)}`);

  const body = sectionsToMd(l.sections ?? []);

  writeMd(join(CONTENT, 'locations', `${l.slug}.md`), fm.join('\n'), body || summary);
  stats.locations++;
}

// ---------------------------------------------------------------------------
// 4. CASE STUDIES
// ---------------------------------------------------------------------------

for (const cs of oldCaseStudies) {
  if (existingCaseStudies.has(cs.slug)) {
    stats.skipped++;
    continue;
  }
  const sector = inferSector(cs.category, cs.client);
  const courseSlug = inferCourseSlug(cs.category, allFutureCourseSlugs);
  const challenge = cs.challenge ?? '';
  const approach = cs.solution ?? '';
  const outcome = cs.result ?? '';
  const testimonial = cs.testimonial;

  const seoTitle = cs.meta?.title ?? `${cs.title} | ITD Case Study`;
  const seoDesc = cs.meta?.description ?? `${cs.title}. ${challenge.slice(0, 120)}`;

  const fm: string[] = [];
  fm.push(`title: ${yamlEscape(cs.title)}`);
  fm.push(`client: ${yamlEscape(cs.client)}`);
  fm.push(`sector: ${yamlEscape(sector)}`);
  fm.push(`courseSlug: ${yamlEscape(courseSlug)}`);
  fm.push(`challenge: ${yamlEscape(challenge)}`);
  fm.push(`approach: ${yamlEscape(approach)}`);
  fm.push(`outcome: ${yamlEscape(outcome)}`);
  if (testimonial) {
    fm.push(
      `testimonial:\n  quote: ${yamlEscape(testimonial.quote)}\n  author: ${yamlEscape(
        testimonial.author + (testimonial.company ? `, ${testimonial.company}` : ''),
      )}`,
    );
  }
  fm.push(`publishedDate: 2024-01-15`);
  fm.push(`seo:\n  title: ${yamlEscape(seoTitle)}\n  description: ${yamlEscape(seoDesc)}`);

  const body = `## Challenge\n\n${challenge}\n\n## Approach\n\n${approach}\n\n## Outcome\n\n${outcome}`;

  writeMd(join(CONTENT, 'caseStudies', `${cs.slug}.md`), fm.join('\n'), body);
  stats.caseStudies++;
}

// ---------------------------------------------------------------------------
// 5. BLOG POSTS
// ---------------------------------------------------------------------------

for (const post of oldBlog) {
  if (existingBlog.has(post.slug)) {
    stats.skipped++;
    continue;
  }
  const seoTitle = post.meta?.title ?? post.title;
  const seoDesc = post.meta?.description ?? post.excerpt;

  const fm: string[] = [];
  fm.push(`title: ${yamlEscape(post.title)}`);
  fm.push(`description: ${yamlEscape(post.excerpt)}`);
  fm.push(`author: ${yamlEscape(post.author ?? 'ITD')}`);
  fm.push(`publishedDate: ${yamlEscape(post.date)}`);
  fm.push(`category: ${yamlEscape((post.categories && post.categories[0]) ?? 'Insight')}`);
  fm.push(`seo:\n  title: ${yamlEscape(seoTitle)}\n  description: ${yamlEscape(seoDesc)}`);

  // post.content is HTML — convert minimally
  const body = (post.content as string)
    .replace(/<h2>/g, '\n\n## ')
    .replace(/<\/h2>/g, '\n')
    .replace(/<h3>/g, '\n\n### ')
    .replace(/<\/h3>/g, '\n')
    .replace(/<p>/g, '\n\n')
    .replace(/<\/p>/g, '\n')
    .replace(/<ul>/g, '\n')
    .replace(/<\/ul>/g, '\n')
    .replace(/<li>/g, '- ')
    .replace(/<\/li>/g, '')
    .replace(/<strong>/g, '**')
    .replace(/<\/strong>/g, '**')
    .replace(/<em>/g, '_')
    .replace(/<\/em>/g, '_')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  writeMd(join(CONTENT, 'blog', `${post.slug}.md`), fm.join('\n'), body);
  stats.blog++;
}

// ---------------------------------------------------------------------------
// 6. REVIEWS  (data JSON — existing 8 entries kept, add any not already present)
// ---------------------------------------------------------------------------

const existingReviewIds = new Set(
  existingSlugs(join(CONTENT, 'reviews')),
);

for (let i = 0; i < oldReviews.length; i++) {
  const r = oldReviews[i];
  const id = `r-old-${String(i + 1).padStart(3, '0')}`;
  if (existingReviewIds.has(id)) continue;
  const obj: Record<string, any> = {
    quote: r.text,
    author: r.author,
    rating: r.rating ?? 5,
    publishedDate: r.date ?? '2024-01-01',
  };
  if (r.role) obj.role = r.role;
  if (r.company) obj.organisation = r.company;
  if (r.course) {
    // Try to map course title → slug
    const slug = r.course.toLowerCase().replace(/\s+/g, '-');
    obj.courseSlug = slug;
  }
  mkdirSync(join(CONTENT, 'reviews'), { recursive: true });
  writeFileSync(
    join(CONTENT, 'reviews', `${id}.json`),
    JSON.stringify(obj, null, 2) + '\n',
    'utf8',
  );
  stats.reviews++;
}

// ---------------------------------------------------------------------------
console.log('\nDone.');
console.log(stats);
