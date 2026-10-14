// Second-pass migration from the WordPress snapshot in scripts/wp-data/.
//
// What it does (idempotent — safe to re-run):
//   1. Blog: writes every published WP post to src/content/blog/<slug>.md,
//      converting the HTML body to markdown and carrying Yoast title/description.
//   2. Reviews: replaces src/content/reviews/*.json with the Site Reviews entries.
//   3. Pages: writes Training Fees + the three policy pages to src/content/pages/.
//   4. Frontmatter patches: adds `image`/`imageAlt` to courses, sectors and case
//      studies where a hero image was fetched, and `subject` + a better
//      `courseSlug` to case studies from the original WP categories.
//
// Usage: node scripts/migrate-wp-extras.mjs

import { readFile, writeFile, readdir, unlink, mkdir, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'scripts/wp-data');
const CONTENT = join(ROOT, 'src/content');
const ASSETS = join(ROOT, 'src/assets/images');

const readJson = async (f) => JSON.parse(await readFile(join(DATA, f), 'utf8'));
const exists = async (p) => { try { await access(p); return true; } catch { return false; } };

// ---------------------------------------------------------------------------
// YAML helpers (single-quoted scalars, matching the existing content style)
// ---------------------------------------------------------------------------
const q = (s) => `'${String(s ?? '').replace(/'/g, "''")}'`;
const yamlList = (key, arr, indent = '') =>
  arr.length ? `${indent}${key}:\n${arr.map((v) => `${indent}  - ${q(v)}`).join('\n')}` : `${indent}${key}: []`;

// ---------------------------------------------------------------------------
// Link + text helpers
// ---------------------------------------------------------------------------
const blogSlugs = new Set((await readJson('blog-posts.json')).map((p) => p.slug));

function normaliseHref(href) {
  if (!href) return null;
  href = href.trim();
  if (/^mailto:|^tel:/i.test(href)) return href;
  const m = href.match(/^https?:\/\/(?:www\.)?itd\.com(\/[^?#]*)?(?:[?#].*)?$/i);
  if (m) {
    let path = (m[1] ?? '/').replace(/\/+$/, '') || '/';
    if (path.startsWith('/wp-content/')) return null; // media we did not migrate
    // WP nested pages (/parent/child) are flat in the new site: keep the leaf slug.
    if (path.split('/').length > 2) path = `/${path.split('/').pop()}`;
    const slug = path.replace(/^\//, '');
    if (blogSlugs.has(slug)) path = `/blog/${slug}`;
    if (slug === 'training-reviews' || slug === 'reviews') path = '/reviews';
    if (slug === 'about-itd') path = '/about';
    if (slug === 'training-case-studies') path = '/case-studies';
    // Old WP URLs that no longer exist (itd.com itself redirects or 404s on them).
    const aliases = {
      'presenting-with-impact-virtually': '/presenting-with-impact-virtually-coaching',
      'professional-business-communication': '/professional-business-communication-training',
      'writing-for-non-academic-audiences': '/business-writing-course', // WP page never migrated; see CONTENT_AUDIT
    };
    if (aliases[slug]) path = aliases[slug];
    return path;
  }
  if (/itdmirror|dreamhosters|localhost/i.test(href)) return null;
  if (/^https?:\/\//i.test(href)) return href;
  if (href.startsWith('/')) return href;
  return null;
}

const collapse = (s) => s.replace(/\s+/g, ' ');

// ---------------------------------------------------------------------------
// HTML → Markdown
// ---------------------------------------------------------------------------
function htmlToMarkdown(html, { dropFirstHeading } = {}) {
  const cleaned = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\[\/?[a-z_-]+[^\]]*\]/gi, '') // shortcodes
    .replace(/<br\s*\/?>/gi, '\n');
  const $ = cheerio.load(`<div id="wp-root">${cleaned}</div>`, null, false);
  // Elementor "image box" calls to action: an <a> that wraps only an <img>, often
  // inside a <figure> with a caption. Keep them as text links (caption, else alt)
  // rather than losing them with the image. The bare home-page logo link is dropped.
  $('a').each((_, el) => {
    const a = $(el);
    if (a.text().trim() || !a.find('img').length) return;
    const rawHref = a.attr('href') || '';
    if (/^https?:\/\/(?:www\.)?itd\.com\/?$/i.test(rawHref)) return;
    const fig = a.closest('figure');
    const label = (fig.find('figcaption').text() || a.find('img').first().attr('alt') || '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!label) return;
    const link = `<p><a href="${rawHref}">${label}</a></p>`;
    if (fig.length) fig.replaceWith(link);
    else a.replaceWith(link);
  });
  $('script, style, img, figure, iframe, video, form, input, button').remove();
  $('span, div:not(#wp-root), section, article, header, footer, font').each((_, el) => {
    $(el).replaceWith($(el).contents());
  });

  function inline(node) {
    if (node.type === 'text') return node.data.replace(/\s+/g, ' ');
    if (node.type !== 'tag') return '';
    const el = $(node);
    const tag = node.name.toLowerCase();
    const inner = () => node.children.map(inline).join('');
    switch (tag) {
      case 'strong':
      case 'b': {
        const t = inner().trim();
        return t ? ` **${t}** ` : '';
      }
      case 'em':
      case 'i': {
        const t = inner().trim();
        return t ? ` _${t}_ ` : '';
      }
      case 'a': {
        const t = inner().trim();
        const href = normaliseHref(el.attr('href'));
        if (!t) return '';
        return href ? `[${t}](${href})` : t;
      }
      case 'code':
        return `\`${inner()}\``;
      default:
        return inner();
    }
  }

  const tidyPara = (s) =>
    collapse(s).replace(/\s+([.,;:!?])/g, '$1').replace(/\*\* \*\*/g, '').trim();

  const blocks = [];
  function block(node, depth = 0) {
    if (node.type === 'text') {
      const t = tidyPara(node.data);
      if (t) blocks.push(t);
      return;
    }
    if (node.type !== 'tag') return;
    const tag = node.name.toLowerCase();
    const el = $(node);
    if (/^h[1-6]$/.test(tag)) {
      const level = tag === 'h1' || tag === 'h2' ? '##' : tag === 'h3' || tag === 'h4' ? '###' : '####';
      const t = tidyPara(node.children.map(inline).join(''));
      if (t) blocks.push(`${level} ${t}`);
      return;
    }
    if (tag === 'p') {
      const t = tidyPara(node.children.map(inline).join(''));
      if (t) blocks.push(t);
      return;
    }
    if (tag === 'ul' || tag === 'ol') {
      const items = [];
      el.children('li').each((i, li) => {
        const parts = [];
        const nested = [];
        li.children.forEach((c) => {
          if (c.type === 'tag' && (c.name === 'ul' || c.name === 'ol')) nested.push(c);
          else parts.push(inline(c));
        });
        const text = tidyPara(parts.join(''));
        const marker = tag === 'ol' ? `${i + 1}.` : '-';
        if (text) items.push(`${'  '.repeat(depth)}${marker} ${text}`);
        nested.forEach((n) => {
          const before = blocks.length;
          block(n, depth + 1);
          items.push(...blocks.splice(before));
        });
      });
      if (items.length) blocks.push(items.join('\n'));
      return;
    }
    if (tag === 'blockquote') {
      const t = tidyPara(node.children.map(inline).join(''));
      if (t) blocks.push(`> ${t}`);
      return;
    }
    if (tag === 'hr') return;
    if (tag === 'table') {
      const rows = [];
      el.find('tr').each((_, tr) => {
        const cells = [];
        $(tr).children('td, th').each((__, td) => cells.push(tidyPara($(td).text())));
        rows.push(`| ${cells.join(' | ')} |`);
      });
      if (rows.length) {
        const cols = rows[0].split('|').length - 2;
        rows.splice(1, 0, `|${' --- |'.repeat(cols)}`);
        blocks.push(rows.join('\n'));
      }
      return;
    }
    // Unknown container: recurse.
    node.children.forEach((c) => block(c, depth));
  }
  $('#wp-root')[0].children.forEach((c) => block(c));

  let out = blocks.filter(Boolean);
  if (dropFirstHeading && out[0] && out[0].startsWith('##')) {
    // Drop a leading heading that restates the post title, including the Elementor
    // pattern where the heading is the title plus a subtitle ("Title: Why It Matters").
    const norm = (t) => t.toLowerCase().replace(/^the\s+/, '').replace(/[^a-z0-9]+/g, ' ').trim();
    const h = norm(out[0].replace(/^#+\s*/, ''));
    const t = norm(dropFirstHeading);
    if (h === t || h.startsWith(t) || t.startsWith(h)) out = out.slice(1);
  }
  // WP editors often butt a link straight against the preceding word ("our<a>").
  return out.join('\n\n').replace(/(\w)\[([^\]]+)\]\(/g, '$1 [$2](').trim() + '\n';
}

function firstParagraph(md, max = 158) {
  const p = md.split('\n\n').find((b) => !b.startsWith('#') && !b.startsWith('-') && !b.startsWith('>'));
  if (!p) return '';
  const plain = p.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_]/g, '');
  return plain.length <= max ? plain : plain.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
}

function resolveYoastTitle(t, fallback) {
  if (!t) return fallback;
  const r = t
    .replace(/%%title%%/g, fallback)
    .replace(/%%[a-z_]+%%/g, '')
    // Yoast appends the WP site name when the title comes from the REST API.
    .replace(/\s*[-|–—]\s*Soft Skills Training & Coaching Tailored to Your Needs\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  return r.replace(/[\s|–—-]+$/g, '').trim() || fallback;
}

// ---------------------------------------------------------------------------
// Subject / course inference (shared by reviews and case studies)
// ---------------------------------------------------------------------------
const GROUP = {
  LM: 'Leadership & Management',
  COMM: 'Communication',
  PD: 'Personal Development',
  SALES: 'Sales Training',
  COACH: 'Coaching',
  NUDGE: 'Nudge',
  OTHER: 'Other',
};

// Old WP case-study category → [subject label, course slug, group]
const CASE_STUDY_CATEGORY = {
  'Nudge Training': ['Nudge', 'nudge-training', GROUP.NUDGE],
  'Presentation Skills Training': ['Presentation Skills', 'presentation-skills-training', GROUP.COMM],
  'Communication Skills Training': ['Communication Skills', 'communication-skills-training', GROUP.COMM],
  'Written Communication Training': ['Written Communication', 'written-communication-skills-training', GROUP.COMM],
  'Management Training': ['Management', 'management-training', GROUP.LM],
  'Personality At Work Training': ['Personality at Work', 'personality-at-work-training', GROUP.PD],
  'Virtual Presentation Skills Training': ['Virtual Presentation Skills', 'virtual-presentation-skills-training-2', GROUP.COMM],
  'Time Management Training': ['Time Management', 'time-management-training', GROUP.PD],
  'Project Planning & Management Training': ['Project Management', 'project-management-training', GROUP.PD],
  'Delegation Skills Training': ['Delegation Skills', 'delegation-skills-training', GROUP.LM],
  'Teamworking Training': ['Teamwork & Team Building', 'team-building-training', GROUP.LM],
  'Personal Efficiency Training': ['Personal Efficiency', 'personal-efficiency-training', GROUP.PD],
  'Sales Training': ['Sales', 'sales-training', GROUP.SALES],
  'Consultancy Projects': ['Consultancy', 'consultancy-projects', GROUP.OTHER],
  'People Management Training': ['People Management', 'people-management-training', GROUP.LM],
  'Telephone Sales Training': ['Telesales', 'telesales-training', GROUP.SALES],
  'Coaching Projects': ['Coaching', 'one-to-one-coaching', GROUP.COACH],
  'Fee Negotiation Training': ['Fee Negotiation', 'negotiating-fees-training', GROUP.SALES],
  'Sales Management Training': ['Sales Management', 'sales-management-training', GROUP.LM],
  'Finance For Non Finance Training': ['Finance for Non-Finance', 'finance-for-non-finance-training', GROUP.PD],
  'Networking Training': ['Networking', 'networking-training', GROUP.SALES],
  'Customer Service Training': ['Customer Service', 'customer-service-training', GROUP.PD],
  'Client Care Training': ['Client Care', 'client-care-training', GROUP.PD],
  'Diversity, Equality & Inclusion Training': ['Diversity & Inclusion', 'diversity-and-inclusion-training', GROUP.PD],
  'Taking Witness Statements Training': ['Taking Instructions', 'taking-instructions-training', GROUP.COMM],
  'Consultative Sales Training': ['Sales', 'advanced-sales-training', GROUP.SALES],
  'Negotiation Training': ['Negotiation', 'negotiation-skills-training', GROUP.PD],
  'Mentoring Training': ['Mentoring', 'mentoring-training', GROUP.LM],
  'Assertiveness Training': ['Assertiveness', 'assertiveness-training', GROUP.PD],
  'Leadership Training': ['Leadership', 'leadership-training', GROUP.LM],
  'Impact & Influence Training': ['Communication Skills', 'communication-skills-training', GROUP.COMM],
  'Supervisor Training': ['Supervisor Skills', 'supervisor-training', GROUP.LM],
  'Coaching Training': ['Coaching Skills', 'coaching-skills-training', GROUP.LM],
  'Advanced Sales Negotiation Training': ['Negotiation', 'negotiation-skills-training', GROUP.SALES],
  'Team Leader Training': ['Team Leadership', 'team-leadership-training', GROUP.LM],
  'Business Development Training': ['Sales', 'sales-training', GROUP.SALES],
  'Executive Coaching': ['Executive Coaching', 'executive-coaching', GROUP.COACH],
  'Problem Solving & Decision Making Training': ['Problem Solving', 'problem-solving-training', GROUP.PD],
};

// Keyword rules for reviews, first match wins. Order matters: specific before generic.
const REVIEW_RULES = [
  [/presenting (with impact )?virtually|virtual presentation|presenting virtually|virtual event/i, 'presenting-with-impact-virtually-training', 'Virtual Presentation Skills', GROUP.COMM],
  [/professional business communication|business communication/i, 'professional-business-communication-training', 'Professional Business Communication', GROUP.COMM],
  [/written communication|writing skills|writing workshop|email/i, 'written-communication-skills-training', 'Written Communication', GROUP.COMM],
  [/presentation|presenting|public speaking/i, 'presentation-skills-training', 'Presentation Skills', GROUP.COMM],
  [/nudge/i, 'nudge-training', 'Nudge', GROUP.NUDGE],
  [/project (planning|management)|tiger/i, 'project-management-training', 'Project Management', GROUP.PD],
  [/personal efficiency|personal impact|working effectively|efficien/i, 'personal-efficiency-training', 'Personal Efficiency', GROUP.PD],
  [/fee negotiat|negotiat/i, 'negotiating-fees-training', 'Negotiation', GROUP.SALES],
  [/finance/i, 'finance-for-non-finance-training', 'Finance for Non-Finance', GROUP.PD],
  [/time management/i, 'time-management-training', 'Time Management', GROUP.PD],
  [/delegat/i, 'delegation-skills-training', 'Delegation Skills', GROUP.LM],
  [/taking instructions|witness statement/i, 'taking-instructions-training', 'Taking Instructions', GROUP.COMM],
  [/problem.solving|decision making/i, 'problem-solving-training', 'Problem Solving', GROUP.PD],
  [/unconscious bias|diversity|inclusion/i, 'unconscious-bias-training', 'Unconscious Bias', GROUP.PD],
  [/assertive/i, 'assertiveness-training', 'Assertiveness', GROUP.PD],
  [/personality|work styles?/i, 'personality-at-work-training', 'Personality at Work', GROUP.PD],
  [/mentor/i, 'mentoring-training', 'Mentoring', GROUP.LM],
  [/coaching/i, 'coaching-skills-training', 'Coaching', GROUP.COACH],
  [/supervis/i, 'supervisor-training', 'Supervisor Skills', GROUP.LM],
  [/team ?work|team building|teamwork/i, 'team-building-training', 'Teamwork & Team Building', GROUP.LM],
  [/leadership|leader/i, 'leadership-training', 'Leadership', GROUP.LM],
  [/manag/i, 'management-training', 'Management', GROUP.LM],
  [/networking/i, 'networking-training', 'Networking', GROUP.SALES],
  [/customer service|client care|client service/i, 'customer-service-training', 'Customer Service', GROUP.PD],
  [/sales|selling/i, 'sales-training', 'Sales', GROUP.SALES],
  [/resilien|stress|wellbeing|mental/i, 'resilience-training', 'Resilience', GROUP.PD],
  [/difficult conversation/i, 'handling-difficult-conversations-training', 'Difficult Conversations', GROUP.PD],
  [/communicat/i, 'communication-skills-training', 'Communication Skills', GROUP.COMM],
];

function classifyReview(r) {
  const hay = `${r.title} ${r.content}`;
  for (const [re, slug, subject, group] of REVIEW_RULES) {
    if (re.test(hay)) return { slug, subject, group };
  }
  return { slug: undefined, subject: 'Soft Skills Training', group: GROUP.OTHER };
}

// ---------------------------------------------------------------------------
// 1. Blog
// ---------------------------------------------------------------------------
async function migrateBlog() {
  const posts = await readJson('blog-posts.json');
  const dir = join(CONTENT, 'blog');
  let n = 0;
  for (const p of posts) {
    const body = htmlToMarkdown(p.content, { dropFirstHeading: p.title });
    const description = (p.yoast_desc || p.excerpt || firstParagraph(body)).replace(/\s+/g, ' ').trim();
    const cats = p.cats.filter(([t]) => t === 'category').map(([, n]) => n).filter((c) => !/uncategorized|^blog$/i.test(c));
    const tags = [...new Set(p.cats.filter(([t]) => t === 'post_tag').map(([, n]) => n))].slice(0, 8);
    const category = cats[0] ?? 'Training';
    const imgPath = join(ASSETS, 'blog', `${p.slug}.webp`);
    const hasImage = await exists(imgPath);
    const fm = [
      '---',
      `title: ${q(p.title)}`,
      `description: ${q(description)}`,
      `author: 'Martin Chapman'`,
      `publishedDate: ${p.date}`,
      ...(p.modified > p.date ? [`updatedDate: ${p.modified}`] : []),
      `category: ${q(category)}`,
      yamlList('tags', tags),
      ...(hasImage ? [`image: '../../assets/images/blog/${p.slug}.webp'`, `imageAlt: ${q(p.featured?.alt || p.title)}`] : []),
      'seo:',
      `  title: ${q(resolveYoastTitle(p.yoast_title, p.title))}`,
      `  description: ${q(description)}`,
      '---',
      '',
    ].join('\n');
    await writeFile(join(dir, `${p.slug}.md`), fm + body);
    n++;
  }
  console.log(`blog: wrote ${n} posts`);
}

// ---------------------------------------------------------------------------
// 2. Reviews
// ---------------------------------------------------------------------------
function splitAuthor(raw) {
  const s = raw.replace(/\.$/, '').trim();
  const m = s.match(/^(.+?),\s*(.+)$/);
  if (!m) return { author: s };
  return { author: m[1].trim(), organisation: m[2].trim() };
}

async function migrateReviews() {
  const dir = join(CONTENT, 'reviews');
  for (const f of await readdir(dir)) await unlink(join(dir, f));
  const reviews = await readJson('site-reviews.json');
  let n = 0;
  const groups = {};
  for (const r of reviews) {
    const { slug, subject, group } = classifyReview(r);
    groups[group] = (groups[group] ?? 0) + 1;
    const { author, organisation } = splitAuthor(r.author);
    const data = {
      ...(r.title && !/^(great|excellent|good|very|really|loved|brilliant|positive|impeccable|enjoyable|informative|interesting|helpful|insightful|engaging|fun)/i.test(r.title) ? { title: r.title } : {}),
      quote: collapse(r.content),
      author,
      ...(organisation ? { organisation } : {}),
      ...(slug ? { courseSlug: slug } : {}),
      subject,
      rating: r.rating,
      publishedDate: r.date,
      sourceId: r.id,
    };
    // Keep the headline when it names the course; generic praise headlines are redundant.
    if (r.title && !data.title && !/^(great|excellent|good|very|really|loved|brilliant|positive|impeccable|enjoyable|informative|interesting|helpful|insightful|engaging|fun)/i.test(r.title)) {
      data.title = r.title;
    }
    await writeFile(join(dir, `wp-${r.id}.json`), JSON.stringify(data, null, 2) + '\n');
    n++;
  }
  console.log(`reviews: wrote ${n}`, groups);
}

// ---------------------------------------------------------------------------
// 3. Pages
// ---------------------------------------------------------------------------
async function migratePages() {
  const pages = await readJson('pages.json');
  const dir = join(CONTENT, 'pages');
  await mkdir(dir, { recursive: true });
  const specs = {
    'training-fees': {
      eyebrow: 'About',
      description: 'How we structure training fees — daily rates, hourly rates, project fees and how fees relate to the value you get back.',
      seoTitle: 'Training Fees — how ITD structures its fees',
      seoDescription: 'Read about how we structure our training fees and the options available: workshop fees, day rates, project fees and return on investment.',
    },
    'equality-and-diversity-policy': { eyebrow: 'Policy', description: 'Our commitment to equality, diversity and fair treatment for everyone who works with or for ITD.' },
    'modern-slavery-policy': { eyebrow: 'Policy', description: 'Our zero-tolerance approach to modern slavery and human trafficking in our business and supply chain.' },
    'supplier-code-of-conduct-compliance-policy': { eyebrow: 'Policy', description: 'How ITD complies with, and supports, the UK Government Supplier Code of Conduct.' },
  };
  let n = 0;
  for (const p of pages) {
    const spec = specs[p.slug];
    if (!spec || p.status !== 'publish') continue;
    const body = htmlToMarkdown(p.content, { dropFirstHeading: p.title });
    const imgPath = join(ASSETS, 'pages', `${p.slug}.webp`);
    const hasImage = await exists(imgPath);
    const fm = [
      '---',
      `title: ${q(p.title)}`,
      `eyebrow: ${q(spec.eyebrow)}`,
      `description: ${q(spec.description)}`,
      ...(hasImage ? [`image: '../../assets/images/pages/${p.slug}.webp'`, `imageAlt: ${q(p.featured?.alt || p.title)}`] : []),
      `updatedDate: ${p.modified}`,
      'seo:',
      `  title: ${q(spec.seoTitle ?? p.title)}`,
      `  description: ${q(spec.seoDescription ?? spec.description)}`,
      '---',
      '',
    ].join('\n');
    await writeFile(join(dir, `${p.slug}.md`), fm + body);
    n++;
  }
  console.log(`pages: wrote ${n}`);
}

// ---------------------------------------------------------------------------
// 4. Frontmatter patches
// ---------------------------------------------------------------------------
function upsertFrontmatter(src, key, valueLine) {
  // Replace an existing top-level `key:` line, or insert before `seo:`.
  const re = new RegExp(`^${key}:.*$`, 'm');
  if (re.test(src)) return src.replace(re, valueLine);
  return src.replace(/^seo:/m, `${valueLine}\nseo:`);
}

async function patchCollection(collection, assetDir, extra = async () => []) {
  const images = (await readJson('featured-images.json'))[assetDir] ?? {};
  const dir = join(CONTENT, collection);
  let patched = 0;
  for (const f of await readdir(dir)) {
    if (!f.endsWith('.md')) continue;
    const slug = f.slice(0, -3);
    const path = join(dir, f);
    let src = await readFile(path, 'utf8');
    const before = src;
    const titleMatch = src.match(/^title:\s*'((?:[^']|'')*)'/m);
    const title = titleMatch ? titleMatch[1].replace(/''/g, "'") : slug;
    if (await exists(join(ASSETS, assetDir, `${slug}.webp`))) {
      src = upsertFrontmatter(src, 'image', `image: '../../assets/images/${assetDir}/${slug}.webp'`);
      src = upsertFrontmatter(src, 'imageAlt', `imageAlt: ${q(images[slug]?.alt || title)}`);
    }
    for (const [key, line] of await extra(slug, src)) src = upsertFrontmatter(src, key, line);
    if (src !== before) { await writeFile(path, src); patched++; }
  }
  console.log(`${collection}: patched ${patched}`);
}

async function patchAll() {
  const cats = await readJson('case-study-categories.json');
  await patchCollection('courses', 'courses');
  await patchCollection('sectors', 'sectors');
  await patchCollection('caseStudies', 'caseStudies', async (slug) => {
    const cat = cats[slug]?.category;
    const m = cat ? CASE_STUDY_CATEGORY[cat] : undefined;
    if (!m) return [['subject', `subject: 'Soft Skills Training'`]];
    return [
      ['subject', `subject: ${q(m[0])}`],
      ['courseSlug', `courseSlug: ${q(m[1])}`],
    ];
  });
}

// ---------------------------------------------------------------------------
// 5. Non-WordPress blog posts become drafts (they came from an intermediate
//    build, not from itd.com, and need editorial sign-off before publishing).
// ---------------------------------------------------------------------------
async function draftSyntheticPosts() {
  const wp = new Set((await readJson('blog-posts.json')).map((p) => p.slug));
  const dir = join(CONTENT, 'blog');
  let n = 0;
  for (const f of await readdir(dir)) {
    const slug = f.replace(/\.md$/, '');
    if (!f.endsWith('.md') || wp.has(slug)) continue;
    const path = join(dir, f);
    let src = await readFile(path, 'utf8');
    if (/^draft:/m.test(src)) continue;
    src = src.replace(/^seo:/m, 'draft: true\nseo:');
    await writeFile(path, src);
    n++;
  }
  console.log(`blog: marked ${n} non-WordPress posts as draft`);
}

await migrateBlog();
await migrateReviews();
await migratePages();
await patchAll();
await draftSyntheticPosts();
