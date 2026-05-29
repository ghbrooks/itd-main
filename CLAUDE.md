# itd.com — Astro rebuild

Static rebuild of the WordPress site at `itd.com` for ITD Limited (International Training & Development). Astro 5 + TypeScript (strict) + Tailwind v4 + content collections. Outputs pure static HTML/CSS/JS — no server runtime.

## Stack

- **Framework**: Astro 5 (static output, no SSR)
- **Language**: TypeScript, strict mode
- **Styling**: Tailwind v4 (CSS-first `@theme` in `src/styles/globals.css`), scoped `<style>` blocks per `.astro` component
- **Content**: Astro content collections (`src/content/`) — markdown + JSON
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
  content/
    config.ts                # Zod schemas — the data contract
    courses/*.md             # 139 entries
    caseStudies/*.md         # 160 entries
    sectors/*.md             # 16 entries
    locations/*.md           # 41 entries
    blog/*.md                # 8 entries
    reviews/*.json           # 17 entries
  layouts/
    BaseLayout.astro         # head + header + footer + JSON-LD
    CourseLayout.astro       # course detail (existing pattern)
    CaseStudyLayout.astro    # case study detail
    SectorLayout.astro       # sector detail
    LocationLayout.astro     # location detail
  pages/
    index.astro              # homepage
    [slug].astro             # catch-all: courses, case studies, sectors, locations
    about.astro
    contact.astro
    faqs.astro
    404.astro
    blog/index.astro
    blog/[slug].astro
    case-studies/index.astro
    sectors/index.astro
  components/
    layout/                  # Container, Section, SiteHeader, SiteFooter
    marketing/               # Hero, CourseCard, CaseStudyCard, CTAPanel, FAQAccordion, …
    content/                 # AgendaList, OutcomesList
    seo/                     # BaseHead, JsonLd
    brand/Logo.astro
  lib/
    site.ts                  # company info — name, phone, address, founded
    navigation.ts            # primary nav + footer columns
    seo.ts                   # title/canonical helpers + SeoProps type
    schema.ts                # JSON-LD builders (organization, article, breadcrumb, course, faq, review)
  styles/globals.css         # Tailwind v4 @theme + base + utilities
public/
  favicon.svg
  logo.svg
  robots.txt
  images/clients/*           # 20 client logo files (PNG/WebP)
scripts/
  migrate-content.ts         # one-off WordPress → Astro migration (preserved for reference)
  old-data/                  # snapshot of the prior Next.js intermediate's data
```

## Content collections (`src/content/config.ts`)

Every collection has a strict Zod schema. **Adding new entries**: drop a file in the right folder using the schema; the slug is derived from the filename.

| Collection | Type | Key fields | Routed at |
|---|---|---|---|
| `courses` | markdown | `title, category(enum), outcome, summary, duration, mode[], audience, agenda[], outcomes[], seo` | `/[slug]` |
| `caseStudies` | markdown | `title, client, sector, courseSlug, challenge, approach, outcome, publishedDate, seo` | `/[slug]` |
| `sectors` | markdown | `title, summary, namedClients[], relevantCourses[], seo` | `/[slug]` |
| `locations` | markdown | `title, country, summary, seo` | `/[slug]` |
| `blog` | markdown | `title, description, author, publishedDate, category, seo` | `/blog/[slug]` |
| `reviews` | JSON data | `quote, author, role?, organisation?, courseSlug?, rating(1–5), publishedDate` | embedded |

The category enum in `courses` is: `sales | communication | presentation | leadership | management | personal-development | specialist | format`.

## Routing model

`src/pages/[slug].astro` is the single catch-all for courses, case studies, sectors, and locations. It calls `getStaticPaths()` against all four collections and dispatches to the right layout based on the `kind` prop. Adding a new course/case-study/sector/location automatically gets a route and shows up in the sitemap.

Blog posts are routed separately via `src/pages/blog/[slug].astro`.

## SEO

- Every collection entry requires a `seo: { title, description }` block. `BaseLayout` reads these and renders title + meta + OG + Twitter cards via `src/components/seo/BaseHead.astro`.
- JSON-LD: `Organization` and `WebSite` are emitted on every page from `BaseLayout`. Per-page schemas (`articleSchema`, `breadcrumbSchema`, `courseSchema`, `faqSchema`, `reviewSchema`) are passed via the `schemas` prop and built by helpers in `src/lib/schema.ts`.
- Canonicals derive from `Astro.url` unless overridden.
- Sitemap is auto-built by `@astrojs/sitemap` and surfaced at `/sitemap-index.xml`.

## Company info (`src/lib/site.ts`)

Single source of truth for company-level facts. Update this and the change propagates to schema, footer, contact, and OG.

- `url: https://www.itd.com`
- `founded: 2002`
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

- **Contact form backend**: form posts to nothing. Wire to a Cloudflare Worker or Formspree-style relay.
- **Analytics**: no script tag added. Drop Plausible into `BaseHead.astro`.
- **Redirects**: the WP site has historical URLs (case-study category prefixes, blog categories) that may not all match new slugs. A `public/_redirects` file or hosting-platform redirect config should be generated from the WP `redirection_items` table.
- **Real images**: only client logos exist. Course/case-study/blog hero imagery is not yet sourced. The schemas accept optional image fields ready to receive them.
- **OG image**: `/og-default.png` is referenced but not yet present in `public/`.

## Adding things

**A new course**: drop a `.md` file into `src/content/courses/` with the schema's required frontmatter (title, category from the enum, outcome, summary, duration, mode[], audience, agenda[], outcomes[], seo). It gets a route at `/{slug}` automatically and appears in the sitemap.

**A new case study**: drop into `src/content/caseStudies/`. `courseSlug` must match a real course slug.

**A new sector or location**: drop into `src/content/sectors/` or `src/content/locations/`. Routed via `[slug].astro`.

**A new blog post**: drop into `src/content/blog/`. Routed via `/blog/[slug]`.

**A new top-level page**: add an `.astro` file to `src/pages/`. Use `BaseLayout` and pass `title`, `description`, optionally `schemas`.
