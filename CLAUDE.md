# itd.com — Astro rebuild

Static rebuild of the WordPress site at `itd.com` for ITD Limited (International Training & Development). Astro 7 + TypeScript (strict) + Tailwind v4 + content collections (content layer API with glob loaders). Outputs pure static HTML/CSS/JS — no server runtime.

## Stack

- **Framework**: Astro 7 (static output, no SSR). Requires Node 22.12+ (the deploy workflow uses Node 22).
- **Language**: TypeScript, strict mode
- **Styling**: Tailwind v4 (CSS-first `@theme` in `src/styles/globals.css`), scoped `<style>` blocks per `.astro` component
- **Content**: Astro content collections — schemas + `glob()` loaders in `src/content.config.ts`, files under `src/content/`
- **Sitemap**: `@astrojs/sitemap` integration
- **Locale**: `en-GB` throughout

## Commands

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # static output to ./dist
npm run preview      # serve ./dist locally
npx astro check      # type + content-schema validation
```

## Repo layout

```
src/
  content.config.ts          # Zod schemas + glob loaders — the data contract (Astro 6+ location)
  content/
    courses/*.md             # 154 entries (15 new ones flagged needsReview)
    caseStudies/*.md         # 160 entries
    sectors/*.md             # 16 entries
    locations/*.md           # 41 entries
    blog/*.md                # 36 entries (28 from WordPress + 8 drafts)
    reviews/*.json           # 373 entries, all from WordPress Site Reviews
    pages/*.md               # standalone pages: fees, policies, Martin Chapman, privacy
  layouts/
    BaseLayout.astro         # head + header + footer + JSON-LD
    CourseLayout.astro       # course detail (existing pattern)
    CaseStudyLayout.astro    # case study detail
    SectorLayout.astro       # sector detail
    LocationLayout.astro     # location detail
    PageLayout.astro         # `pages` collection (prose or person layout)
  pages/
    index.astro              # homepage
    [slug].astro             # catch-all: courses, case studies, sectors, locations, pages
    training.astro           # hub: every course grouped by subject area
    coaching.astro           # hub: coaching options
    reviews.astro            # all reviews with subject/year/search filter
    work-styles-model-questionnaire.astro  # 40-statement quiz scored in the browser
    about.astro
    contact.astro
    faqs.astro
    404.astro
    blog/index.astro
    blog/[slug].astro
    case-studies/index.astro # grouped by subject, filterable by sector/client
    sectors/index.astro      # image cards
  components/
    layout/                  # Container, Section, SiteHeader, SiteFooter
    marketing/               # Hero, CourseCard, CaseStudyCard, CTAPanel, FAQAccordion, …
    content/                 # AgendaList, OutcomesList
    seo/                     # BaseHead, JsonLd
    brand/Logo.astro
  lib/
    site.ts                  # company info — name, phone, address, founded, form endpoint
    training.ts              # the sitemap: subject groups → course slugs (drives nav, /training, filters)
    navigation.ts            # primary nav (derived from training.ts) + footer + legal links
    reviews.ts               # review helpers: stats, per-course, featured
    seo.ts                   # title/canonical helpers + SeoProps type
    schema.ts                # JSON-LD builders (organization, article, breadcrumb, course, faq, review, person)
  data/work-styles.ts        # questionnaire statements + style descriptions
  assets/images/{courses,sectors,blog,pages,caseStudies}/*.webp  # hero images from WP, optimised by astro:assets
  styles/globals.css         # Tailwind v4 @theme + base + utilities
public/
  favicon.svg
  logo.svg
  robots.txt
  images/clients/*           # 20 client logo files (PNG/WebP)
scripts/
  migrate-content.ts         # first-pass WordPress → Astro migration (preserved for reference)
  migrate-wp-extras.mjs      # second pass: blog posts, reviews, pages, images, case-study subjects (idempotent)
  fetch-wp-images.mjs        # pulls featured images from the live WP media library into src/assets/images
  make-brand-assets.mjs      # regenerates public/og-default.png and apple-touch-icon.png
  make-portable.mjs          # post-build: relative URLs for GitHub Pages / file://
  old-data/                  # snapshot of the prior Next.js intermediate's data
  wp-data/                   # sanitised JSON snapshot of the WordPress tables the second pass reads
```

## Content collections (`src/content.config.ts`)

Every collection has a strict Zod schema and a `glob()` loader pointing at its folder. **Adding new entries**: drop a file in the right folder using the schema; `entry.id` is the filename without extension and is used as the URL slug (there is no `entry.slug` — that was the pre-Astro-6 API). Files starting with `_` are ignored by the loader. Import `z` from `astro/zod`, not `astro:content` (deprecated, removed in Astro 8).

| Collection | Type | Key fields | Routed at |
|---|---|---|---|
| `courses` | markdown | `title, category(enum), outcome, summary, duration, mode[], audience, agenda[], outcomes[], image?, needsReview?, seo` | `/[slug]` |
| `caseStudies` | markdown | `title, client, sector, subject, courseSlug, challenge, approach, outcome, image?, publishedDate, seo` | `/[slug]` |
| `sectors` | markdown | `title, summary, namedClients[], relevantCourses[], image?, seo` | `/[slug]` |
| `locations` | markdown | `title, country, summary, seo` | `/[slug]` |
| `blog` | markdown | `title, description, author, publishedDate, category, tags[], image?, draft?, seo` | `/blog/[slug]` |
| `reviews` | JSON data | `title?, quote, author, organisation?, courseSlug?, subject?, rating(1–5), publishedDate, sourceId?` | `/reviews` + embedded |
| `pages` | markdown | `title, eyebrow?, description, image?, updatedDate?, layout(prose|person), seo` | `/[slug]` |

Images are referenced relative to the markdown file (`image: '../../assets/images/sectors/law.webp'`) and go through `astro:assets`, so `<Image>` emits responsive WebP at build time.

The category enum in `courses` is: `sales | communication | presentation | leadership | management | personal-development | specialist | format`.

## Routing model

`src/pages/[slug].astro` is the single catch-all for courses, case studies, sectors, locations and pages. It calls `getStaticPaths()` against all five collections, fails the build on a duplicate slug, and dispatches to the right layout based on the `kind` prop. Adding an entry automatically gets a route and shows up in the sitemap.

Blog posts are routed separately via `src/pages/blog/[slug].astro`; entries with `draft: true` are excluded everywhere.

**The navigation is data.** `src/lib/training.ts` holds the agreed sitemap (subject group → course slugs with the client's labels). `navigation.ts`, the Training mega-menu, `/training`, the homepage category cards and the course breadcrumbs all read from it. `/training` throws at build time if a slug there does not resolve to a course.

**Legacy URLs.** `astro.config.mjs` carries `redirects` for the old WordPress paths (blog posts lived at `/slug`, reviews at `/training-reviews`, etc.). Static output turns these into meta-refresh stubs; they are filtered out of the sitemap.

## SEO

- Every collection entry requires a `seo: { title, description }` block. `BaseLayout` reads these and renders title + meta + OG + Twitter cards via `src/components/seo/BaseHead.astro`. Pass `image` to use the entry's hero as the OG image.
- JSON-LD: `Organization` (with `AggregateRating` computed from the reviews collection) and `WebSite` are emitted on every page from `BaseLayout`. Per-page schemas (`articleSchema`, `breadcrumbSchema`, `courseSchema`, `faqSchema`, `reviewSchema`, `personSchema`) are passed via the `schemas` prop and built by helpers in `src/lib/schema.ts`.
- Canonicals derive from `Astro.url` unless overridden. `site.url` in `site.ts` and `site` in `astro.config.mjs` must agree (`https://itd.com`, no www).
- Sitemap is auto-built by `@astrojs/sitemap` and surfaced at `/sitemap-index.xml`.

## Company info (`src/lib/site.ts`)

Single source of truth for company-level facts. Update this and the change propagates to schema, footer, contact, and OG.

- `url: https://itd.com`
- `founded: 2002` (the only year that should appear in "since …" copy)
- `email: info@itd.com`
- `phone: +44 (0)800 804 8086` (freephone), `phoneDirect: +44 (0)1608 676705`
- Postal: PO Box 282, Chipping Norton, Oxfordshire OX7 9EE
- Registered: 3 Bignell Park Barns, Bicester, OX26 1TD

## Conventions

- Content authoring: markdown body uses `##` for section headings; lists become Astro-rendered `<ul>`. The body slot is rendered inside the relevant layout's prose region.
- Scoped CSS lives in `<style>` blocks at the bottom of each `.astro` file. CSS variables (`--c-deep`, `--c-rule`, `--c-text`, etc.) come from `globals.css`.
- All cross-links between content use slugs (e.g. `courseSlug: 'leadership-training'`), never URLs. Build-time references that don't resolve render gracefully.
- Strict TypeScript. Run `npx astro check` before pushing.
- Tailwind v4 — no `tailwind.config.ts`. Tokens live in `globals.css` under `@theme`.

## Migration history

This site replaces a WordPress installation (Spacious theme) previously running at `itd.com`. Content was migrated via `scripts/migrate-content.ts`, which read a TypeScript intermediate of the WP export and emitted the markdown files now in `src/content/`. The original WP database dumps live at `/Users/george.brooks/personal dev/itd/`. See `MIGRATION_REPORT.md` for the full source-to-destination map.

## Things still deferred

- **Contact form backend**: set `PUBLIC_FORM_ENDPOINT` (see `.env.example`) to a Formspree/Worker URL. Until then the form falls back to a `mailto:` submission.
- **Analytics**: no script tag added. Drop Plausible into `BaseHead.astro` and update `/privacy` accordingly.
- **Host-level 301s**: the meta-refresh redirect stubs should become real redirects once the site leaves GitHub Pages.
- **Content sign-off**: see `CONTENT_AUDIT.md` for the 15 new courses, 8 draft posts and pages written without a WordPress source.

## Adding things

**A new course**: drop a `.md` file into `src/content/courses/` with the schema's required frontmatter (title, category from the enum, outcome, summary, duration, mode[], audience, agenda[], outcomes[], seo). It gets a route at `/{slug}` automatically and appears in the sitemap.

**A new case study**: drop into `src/content/caseStudies/`. `courseSlug` must match a real course slug.

**A new sector or location**: drop into `src/content/sectors/` or `src/content/locations/`. Routed via `[slug].astro`.

**A new blog post**: drop into `src/content/blog/`. Routed via `/blog/[slug]`. Use `draft: true` to keep it out of the build.

**A new review**: drop a JSON file into `src/content/reviews/` with `quote, author, rating, publishedDate` and ideally `subject` + `courseSlug`. The rating badge, footer and schema recompute automatically.

**A new standalone page** (policy, person, long-form): drop into `src/content/pages/` with `layout: 'prose'` or `'person'`. Routed at `/[slug]`.

**Changing the menu**: edit `src/lib/training.ts` (subject groups) or `navigation.ts` (everything else). Labels there are the client's wording.

**A new top-level page**: add an `.astro` file to `src/pages/`. Use `BaseLayout` and pass `title`, `description`, optionally `schemas`.
