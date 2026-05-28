# itd-website

Static rebuild of itd.com. Astro 5 + TypeScript (strict) + Tailwind v4 + content collections. Outputs pure static HTML/CSS/JS — no server runtime needed.

## Quick start

```bash
npm install
npm run dev      # local server at http://localhost:4321
npm run build    # static output to ./dist
npm run preview  # serve ./dist locally
```

## What's here (v0)

Visual/structural pass — backend wiring (contact form, analytics) deferred.

### Pages
- `/` — homepage
- `/contact` — visual-only contact form (no submission handler)
- `/404` — friendly 404
- 6 sample courses: `/sales-training`, `/presentation-skills-training`, `/leadership-training`, `/assertiveness-training`, `/nudge-training-for-lawyers`, `/itd-work-styles-model-training`
- 3 sample case studies: Clifford Chance, Cancer Research UK, Hilton EMEA

### Content collections
- `src/content/courses/` — Markdown frontmatter per the brief's schema
- `src/content/caseStudies/`
- `src/content/sectors/`
- `src/content/blog/` — empty
- `src/content/reviews/` — JSON

Add new entries by dropping files into these folders; the slug is derived from the filename.

### Components
- `src/components/layout/` — `SiteHeader`, `SiteFooter`, `Container`, `Section`
- `src/components/marketing/` — `Hero`, `ClientLogoStrip`, `CourseCard`, `CaseStudyCard`, `SectorCard`, `Testimonial`, `ReviewSummary`, `FAQAccordion`, `CTAPanel`, `PullQuote`, `Callout`
- `src/components/content/` — `AgendaList`, `OutcomesList`
- `src/components/seo/` — `BaseHead`, `JsonLd`
- `src/components/brand/Logo.astro` — wraps `/public/logo.svg`

### SEO
- Per-page title, description, canonical, OG, Twitter
- Organization + WebSite schema site-wide
- Course / Article / Breadcrumb / FAQ schemas on relevant pages
- Sitemap auto-generated to `/sitemap-index.xml`
- `lang="en-GB"` throughout

### Design tokens
Defined in `src/styles/globals.css` via Tailwind v4 `@theme`. Brand colours, type scale, easing, radii. Override there.

## Next steps (deferred)

These are stubbed visually but need wiring:

1. **Contact form** — wire to a Cloudflare Worker + Resend / Postmark / SES (see brief section 10).
2. **Analytics** — drop a Plausible script tag into `BaseLayout.astro`.
3. **Remaining course pages** — 30+ courses listed in the brief still need content files. Pattern matches the six existing courses; just copy the frontmatter shape.
4. **Sector pages** — sample `law.md` exists; add the rest.
5. **Blog migration** — empty for now; create files in `src/content/blog/`.
6. **Redirect map** — write `public/_redirects` once the URL audit from the old site is complete.
7. **Real client logos** — currently rendered as styled wordmarks. Drop SVGs into `public/images/clients/` and update `ClientLogoStrip.astro`.

## File map

```
src/
  components/
    brand/Logo.astro
    content/{AgendaList,OutcomesList}.astro
    layout/{Container,Section,SiteHeader,SiteFooter}.astro
    marketing/{Hero,ClientLogoStrip,CourseCard,CaseStudyCard,SectorCard,Testimonial,ReviewSummary,FAQAccordion,CTAPanel,PullQuote,Callout}.astro
    seo/{BaseHead,JsonLd}.astro
  content/
    config.ts                # Zod schemas
    courses/*.md
    caseStudies/*.md
    sectors/*.md
    reviews/*.json
  layouts/
    BaseLayout.astro         # shared head + header + footer
    CourseLayout.astro
    CaseStudyLayout.astro
  lib/
    navigation.ts            # primary nav + footer columns
    schema.ts                # JSON-LD builders
    seo.ts                   # title/canonical helpers
    site.ts                  # site-wide config (name, rating, clients)
  pages/
    index.astro
    contact.astro
    404.astro
    [slug].astro             # dispatches courses + case studies
  styles/globals.css         # design tokens, base, utilities, components
public/
  logo.svg                   # optimised brand logo
  favicon.svg
  robots.txt
```

## Build notes

- Strict TypeScript. Run `npm run typecheck` to verify.
- Tailwind v4 uses CSS-first config in `globals.css` (no `tailwind.config.ts`).
- Content collections use `type: 'content'` (legacy mode) — slug is auto-derived from filename. Don't add `slug:` to frontmatter; it's reserved.
- 95% of CSS is in scoped `<style>` blocks per component; Tailwind is for ad-hoc utilities and `@theme` tokens.
