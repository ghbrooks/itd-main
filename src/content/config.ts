import { defineCollection, z } from 'astro:content';

const seo = z.object({
  title: z.string(),
  description: z.string(),
});

const courses = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: z.enum([
        'sales',
        'communication',
        'presentation',
        'leadership',
        'management',
        'personal-development',
        'specialist',
        'format',
      ]),
      eyebrow: z.string().optional(),
      outcome: z.string(),
      summary: z.string(),
      duration: z.string(),
      mode: z.array(z.enum(['virtual', 'in-person'])),
      audience: z.string(),
      agenda: z.array(z.string()),
      outcomes: z.array(z.string()),
      methodology: z.string().optional(),
      /** Hero image, relative to the markdown file. Optimised by astro:assets. */
      image: image().optional(),
      imageAlt: z.string().optional(),
      relatedCourses: z.array(z.string()).optional(),
      relatedCaseStudies: z.array(z.string()).optional(),
      faqs: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
      /** Entries awaiting client sign-off. Still built, but labelled in the content audit. */
      needsReview: z.boolean().default(false),
      seo,
    }),
});

const caseStudies = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      client: z.string(),
      clientLogo: z.string().optional(),
      sector: z.string(),
      /** Subject area, e.g. "Presentation Skills". Drives the default grouping on /case-studies. */
      subject: z.string(),
      courseSlug: z.string(),
      challenge: z.string(),
      approach: z.string(),
      outcome: z.string(),
      image: image().optional(),
      imageAlt: z.string().optional(),
      testimonial: z.object({ quote: z.string(), author: z.string() }).optional(),
      publishedDate: z.coerce.date(),
      seo,
    }),
});

const sectors = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      namedClients: z.array(z.string()),
      relevantCourses: z.array(z.string()),
      image: image().optional(),
      imageAlt: z.string().optional(),
      seo,
    }),
});

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      author: z.string().default('Martin Chapman'),
      publishedDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      category: z.string(),
      tags: z.array(z.string()).default([]),
      image: image().optional(),
      imageAlt: z.string().optional(),
      /** Drafts are excluded from routes, listings and the sitemap. */
      draft: z.boolean().default(false),
      seo,
    }),
});

const reviews = defineCollection({
  type: 'data',
  schema: z.object({
    /** Headline the reviewer gave, e.g. "Presenting with Impact Virtually". */
    title: z.string().optional(),
    quote: z.string(),
    author: z.string(),
    role: z.string().optional(),
    organisation: z.string().optional(),
    courseSlug: z.string().optional(),
    /** Subject-area label used by the /reviews filter. */
    subject: z.string().optional(),
    rating: z.number().min(1).max(5).default(5),
    publishedDate: z.coerce.date(),
    /** Original WordPress post ID, for traceability. */
    sourceId: z.string().optional(),
  }),
});

const locations = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    country: z.string(),
    summary: z.string(),
    seo,
  }),
});

/** Long-form standalone pages: fees, policies, people. Routed at /[slug]. */
const pages = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      eyebrow: z.string().optional(),
      description: z.string(),
      image: image().optional(),
      imageAlt: z.string().optional(),
      updatedDate: z.coerce.date().optional(),
      /** 'prose' = narrow reading column; 'person' = portrait + bio layout. */
      layout: z.enum(['prose', 'person']).default('prose'),
      noindex: z.boolean().default(false),
      seo,
    }),
});

export const collections = { courses, caseStudies, sectors, blog, reviews, locations, pages };
