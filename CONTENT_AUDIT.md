# Content audit — items awaiting client sign-off

Generated 2026-10-13 after the second-pass WordPress migration. Nothing here blocks the build; it lists content that was created or changed without a WordPress source and should be checked by ITD before launch.

## New course entries (written to fill the agreed sitemap)

These courses were named in the new sitemap but did not exist on itd.com. Copy was written from the matching case studies, the WordPress draft page where one existed (Finance for Non-Finance), and the house style of neighbouring courses. Each has `needsReview: true` in its frontmatter; remove the flag once approved.

- `/delegation-skills-training`
- `/effective-one-to-ones-training`
- `/finance-for-non-finance-training`
- `/giving-and-receiving-feedback-training`
- `/managing-your-workload-training`
- `/mentoring-training`
- `/networking-training`
- `/one-to-one-coaching`
- `/personal-brand-training`
- `/questioning-skills-training`
- `/sales-for-non-sales-training`
- `/sales-management-coaching`
- `/supervisor-training`
- `/team-building-training`
- `/train-the-trainer-training`

## Blog posts held as drafts

These eight posts were in the Astro repo but have no counterpart on itd.com (they came from an earlier intermediate build). They are marked `draft: true`, so they are not built, listed or in the sitemap. Delete the files or remove the flag to publish.

- `src/content/blog/building-resilience-at-work.md`
- `src/content/blog/effective-delegation-guide.md`
- `src/content/blog/leadership-vs-management.md`
- `src/content/blog/nudge-theory-workplace.md`
- `src/content/blog/presentation-skills-guide.md`
- `src/content/blog/remote-team-communication-tips.md`
- `src/content/blog/sales-training-roi.md`
- `src/content/blog/why-soft-skills-training-matters.md`

## Reviews

The reviews collection now holds the 373 published Site Reviews entries from WordPress (`src/content/reviews/wp-*.json`). The 17 reviews previously in the repo had no WordPress source and were removed. Each review was assigned a `subject` and, where the text names a course, a `courseSlug`, by keyword rules in `scripts/migrate-wp-extras.mjs`; 120 generic reviews are filed under "Soft Skills Training". Reviewer names are published as they were on itd.com.

## Pages written without a WordPress source

- `/about-martin-chapman` — assembled from the Training Consultants and Keynote Speaker pages, plus the book title. Photo is the one used on itd.com/training-consultants.
- `/privacy` — a plain privacy and cookies notice reflecting what the site actually does (no analytics, no tracking cookies, contact form data). It should be checked by whoever handles ITD's data protection.

## Things that still need a decision

- **Contact form relay.** The form posts to `PUBLIC_FORM_ENDPOINT` when set (Formspree, a Cloudflare Worker, etc.); until then it falls back to opening the visitor's email client. Set the variable in the GitHub Actions environment before launch.
- **Work Styles questionnaire video.** The WordPress page embedded an MP4 introduction. It was not migrated; add it to `public/` and embed if wanted.
- **Case-study hero images.** 88 case studies have images fetched from WordPress; they are stored but not yet shown on the case-study page, since many are small stock images.
- **Legacy redirects.** `astro.config.mjs` lists the old WordPress URLs (blog posts at `/slug`, `/training-reviews`, `/about-itd`, etc.). On GitHub Pages these are meta-refresh stubs; convert them to real 301s when DNS moves to a host that supports them.

## 8. SEO audit — 14 Oct 2026

Automated pass over the built site (454 HTML files). Fixed in code: title suffix shortened to "| ITD" (304 titles were over 70 characters because of the long brand suffix), client name added to every case-study title (18 groups of identical titles), meta descriptions clamped at 160 characters, homepage title now "Soft Skills Training & Coaching | ITD". Canonicals, Open Graph, sitemap coverage, JSON-LD and internal links all pass. Remaining items need content decisions:

- **Two near-duplicate courses**: `/networking-training-for-lawyers` and `/how-to-do-more-networking-training-workshop-for-lawyers` describe the same workshop. The second now has a distinct title, but one should probably redirect to the other.
- **22 very short titles** (e.g. "Nudge Course | ITD", "Team Training | ITD"). Not an error, but a descriptive phrase after the name (what it is for, who it is for) would earn more clicks.
- **Location pages are thin** (120–130 words each across 41 pages, e.g. `/training-in-pakistan`). Search engines may treat them as doorway pages. Either add genuine local detail (clients, languages, delivery notes) or fold them into one "Where in the world" page.
- **Four titles are 71–74 characters** (`/law`, `/nudge-training-for-lawyers`, two long case-study names). Acceptable; shorten if convenient.

## 9. Contact details and external links — 14 Oct 2026

- **Phone**: itd.com's contact page publishes +44 (0)1608 676705, so that is now the primary number (footer, schema, contact page). The freephone 0800 804 8086 appears in 123 old course pages ("call us on 0800 …") and is shown on the contact page as a secondary number. Martin to confirm both are still live.
- **Email**: info@itd.com (used 75 times in the old content). The live site shows no email address; confirm this inbox is monitored.
- **LinkedIn**: the live site and the WordPress database contain no LinkedIn URL, so the footer link to linkedin.com/company/itd-uk had no source and has been removed. Add a verified profile to `social` in `src/lib/site.ts` and it reappears in the footer and schema.
- **External links** now open in a new tab (`rel="noopener noreferrer"`), both in migrated markdown and in templates.

## 10. Questionnaire lead capture — 14 Oct 2026

`/work-styles-model-questionnaire` now mirrors the WordPress quiz: name and email are required before scoring, a Cloudflare Turnstile spam check sits above the submit button, and the respondent's details and scores are posted to the form relay. Until `PUBLIC_TURNSTILE_SITE_KEY` and `PUBLIC_QUIZ_ENDPOINT` (or `PUBLIC_FORM_ENDPOINT`) are set, the widget runs on Cloudflare's test key and nothing is sent to ITD; the visitor still sees their scores and gets a mailto button.

## 11. Blog posts published after the database dump — 14 Oct 2026

The WordPress dump is from 27 Feb 2026 and Martin has kept publishing. Five posts (23 Sep – 12 Oct 2026) were pulled from the live site's REST API and migrated through the same script as the other 28, so the blog now carries all 33 live posts:

- `/blog/how-to-say-no-at-work-assertively` (WordPress had this at `/elementor-37392`; that URL redirects)
- `/blog/examples-of-microaggression-at-work`
- `/blog/negotiation-skills-training-why-it-matters-and-how-it-improves-results-at-work`
- `/blog/practical-benefits-of-management-training`
- `/blog/the-impact-of-virtual-presentation-skills-training`

Side effects of the converter improvements made for them, worth a glance:

- **Recovered calls to action in 20 older posts.** Elementor "image box" links (a course image that links to the course page) were previously dropped with the image. They now render as text links under the post's closing "Training on…" heading, using the caption or alt text as the link text.
- **Three old links re-pointed** because their WordPress pages no longer exist: `/presenting-with-impact-virtually` → the virtual presenting coaching page (itd.com redirects there too), `/professional-business-communication` → the training page of the same name, and `/writing-for-non-academic-audiences` → `/business-writing-course`.
- **"Writing for Non-Academic Audiences"** is still a live, published WordPress page (2020) that was never migrated as a course because it is not in the agreed sitemap. Decide whether it should become a course or stay retired.
- **Category labels** come from WordPress as-is, so two of the new posts show "microaggression" and "Presentation skills" in lower case alongside older "Presentation Skills". Tidy in the frontmatter if it matters.
- One caption typo from the live site ("Presenitng") was corrected in the snapshot.

Before launch, check `https://itd.com/wp-json/wp/v2/posts?after=2026-10-12T00:00:00` for anything newer and repeat the process.
