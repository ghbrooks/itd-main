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
