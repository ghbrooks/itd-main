import { defineCollection, z } from 'astro:content';

const courses = defineCollection({
  type: 'content',
  schema: z.object({
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
    relatedCourses: z.array(z.string()).optional(),
    relatedCaseStudies: z.array(z.string()).optional(),
    faqs: z
      .array(
        z.object({
          q: z.string(),
          a: z.string(),
        }),
      )
      .optional(),
    seo: z.object({
      title: z.string(),
      description: z.string(),
    }),
  }),
});

const caseStudies = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    client: z.string(),
    clientLogo: z.string().optional(),
    sector: z.string(),
    courseSlug: z.string(),
    challenge: z.string(),
    approach: z.string(),
    outcome: z.string(),
    testimonial: z
      .object({
        quote: z.string(),
        author: z.string(),
      })
      .optional(),
    publishedDate: z.coerce.date(),
    seo: z.object({
      title: z.string(),
      description: z.string(),
    }),
  }),
});

const sectors = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    namedClients: z.array(z.string()),
    relevantCourses: z.array(z.string()),
    seo: z.object({
      title: z.string(),
      description: z.string(),
    }),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string().default('Martin Chapman'),
    publishedDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string(),
    image: z.string().optional(),
    seo: z.object({
      title: z.string(),
      description: z.string(),
    }),
  }),
});

const reviews = defineCollection({
  type: 'data',
  schema: z.object({
    quote: z.string(),
    author: z.string(),
    role: z.string().optional(),
    organisation: z.string().optional(),
    courseSlug: z.string().optional(),
    rating: z.number().min(1).max(5).default(5),
    publishedDate: z.coerce.date(),
  }),
});

const locations = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    country: z.string(),
    summary: z.string(),
    seo: z.object({
      title: z.string(),
      description: z.string(),
    }),
  }),
});

export const collections = { courses, caseStudies, sectors, blog, reviews, locations };
