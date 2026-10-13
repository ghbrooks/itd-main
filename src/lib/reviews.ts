import { getCollection, type CollectionEntry } from 'astro:content';

export type Review = CollectionEntry<'reviews'>;

export type ReviewStats = {
  count: number;
  /** Mean rating rounded to one decimal place. */
  average: number;
};

let cache: Promise<Review[]> | undefined;

/** All reviews, newest first. Cached per build. */
export function getReviews(): Promise<Review[]> {
  cache ??= getCollection('reviews').then((all) =>
    all.sort((a, b) => b.data.publishedDate.getTime() - a.data.publishedDate.getTime()),
  );
  return cache;
}

export async function getReviewStats(): Promise<ReviewStats> {
  const all = await getReviews();
  const count = all.length;
  const average = count ? Math.round((all.reduce((s, r) => s + r.data.rating, 0) / count) * 10) / 10 : 0;
  return { count, average };
}

/** Reviews linked to a course, most recent first. */
export async function getReviewsForCourse(slug: string, limit = 3): Promise<Review[]> {
  const all = await getReviews();
  return all.filter((r) => r.data.courseSlug === slug).slice(0, limit);
}

/**
 * A small set of strong reviews for the homepage: prefer ones that name a
 * course and have a longer quote, so the cards have substance.
 */
export async function getFeaturedReviews(limit = 4): Promise<Review[]> {
  const all = await getReviews();
  const scored = all
    .filter((r) => r.data.rating === 5 && r.data.quote.length >= 120 && r.data.quote.length <= 320)
    .sort((a, b) => Number(Boolean(b.data.organisation)) - Number(Boolean(a.data.organisation)));
  return scored.slice(0, limit);
}
