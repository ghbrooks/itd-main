import { site } from './site';

type Json = Record<string, unknown>;

export function organizationSchema(rating?: { average: number; count: number }): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.longName,
    alternateName: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: `${site.url}/logo.svg`,
    email: site.email,
    telephone: site.phone,
    foundingDate: String(site.founded),
    founder: {
      '@type': 'Person',
      name: site.founder,
      url: `${site.url}/about-martin-chapman`,
    },
    address: {
      '@type': 'PostalAddress',
      ...site.address,
    },
    sameAs: Object.values(site.social),
    ...(rating && rating.count > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: rating.average,
            reviewCount: rating.count,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

export function websiteSchema(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.longName,
    url: site.url,
    inLanguage: 'en-GB',
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${site.url}${item.url}`,
    })),
  };
}

export function courseSchema(input: {
  name: string;
  description: string;
  url: string;
  duration?: string;
}): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: input.name,
    description: input.description,
    url: input.url,
    provider: {
      '@type': 'Organization',
      name: site.longName,
      sameAs: site.url,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Onsite, Online',
      ...(input.duration ? { duration: input.duration } : {}),
    },
  };
}

export function faqSchema(faqs: { q: string; a: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  };
}

export function reviewSchema(input: {
  quote: string;
  author: string;
  organisation?: string;
  rating?: number;
  publishedDate?: string;
}): Json {
  return {
    '@type': 'Review',
    reviewBody: input.quote,
    author: {
      '@type': 'Person',
      name: input.author,
      ...(input.organisation ? { worksFor: { '@type': 'Organization', name: input.organisation } } : {}),
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: input.rating ?? 5,
      bestRating: 5,
      worstRating: 1,
    },
    ...(input.publishedDate ? { datePublished: input.publishedDate } : {}),
  };
}

export function articleSchema(input: {
  headline: string;
  description: string;
  url: string;
  publishedDate: Date;
  updatedDate?: Date;
  author: string;
  image?: string;
}): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    url: input.url,
    datePublished: input.publishedDate.toISOString(),
    ...(input.updatedDate ? { dateModified: input.updatedDate.toISOString() } : {}),
    author: {
      '@type': 'Person',
      name: input.author,
    },
    publisher: {
      '@type': 'Organization',
      name: site.longName,
      logo: { '@type': 'ImageObject', url: `${site.url}/logo.svg` },
    },
    ...(input.image ? { image: input.image } : {}),
  };
}

export function personSchema(input: {
  name: string;
  jobTitle?: string;
  description?: string;
  image?: string;
  sameAs?: string[];
}): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: input.name,
    ...(input.jobTitle ? { jobTitle: input.jobTitle } : {}),
    ...(input.description ? { description: input.description } : {}),
    ...(input.image ? { image: input.image } : {}),
    ...(input.sameAs ? { sameAs: input.sameAs } : {}),
    worksFor: {
      '@type': 'Organization',
      name: site.longName,
      url: site.url,
    },
  };
}
