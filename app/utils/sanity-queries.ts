/**
 * Sanity GROQ queries for the DeFlow Labs marketing site.
 * Centralized query definitions for blog posts, authors, labs projects.
 */

/** Fetch all published blog posts, ordered by date descending. */
export const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  isFeatured,
  readingTime,
  "category": categories[0]->title,
  "author": author->{name, "avatar": avatar.asset->url},
  "coverImage": coverImage.asset->url,
  "coverImageAlt": coverImage.alt
}`

/**
 * Fetch the featured blog post (flagged isFeatured, or latest as fallback).
 * GROQ sorts featured=true first, then by date. Picks [0].
 */
export const FEATURED_POST_QUERY = `*[_type == "post"] | order(isFeatured desc, publishedAt desc)[0] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  readingTime,
  "category": categories[0]->title,
  "author": author->{name, "avatar": avatar.asset->url},
  "coverImage": coverImage.asset->url,
  "coverImageAlt": coverImage.alt
}`

/**
 * Fetch paginated blog posts (excluding featured), ordered by date descending.
 * Params: $start (number), $end (number), $featuredId (string, optional)
 */
export const PAGINATED_POSTS_QUERY = `*[_type == "post" && _id != $featuredId] | order(publishedAt desc) [$start...$end] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  readingTime,
  "category": categories[0]->title,
  "author": author->{name, "avatar": avatar.asset->url},
  "coverImage": coverImage.asset->url,
  "coverImageAlt": coverImage.alt
}`

/** Count all non-featured posts (for pagination total). */
export const NON_FEATURED_COUNT_QUERY = `count(*[_type == "post" && _id != $featuredId])`

/** Fetch a single blog post by slug with full body content. */
export const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  readingTime,
  body,
  seoTitle,
  seoDescription,
  "category": categories[0]->title,
  "categories": categories[]->title,
  "author": author->{name, role, bio, "avatar": avatar.asset->url, linkedin, twitter},
  "coverImage": coverImage.asset->url,
  "coverImageAlt": coverImage.alt
}`

/** Fetch all labs projects, ordered by status then start date. */
export const LABS_PROJECTS_QUERY = `*[_type == "labsProject"] | order(status asc, startDate desc) {
  _id,
  title,
  "slug": slug.current,
  status,
  partner,
  description,
  tags,
  startDate,
  endDate,
  publicationUrl,
  "coverImage": coverImage.asset->url
}`

/** Fetch total post count (for pagination). */
export const POST_COUNT_QUERY = `count(*[_type == "post"])`

/** Fetch all post slugs for sitemap and RSS generation. */
export const POST_SLUGS_QUERY = `*[_type == "post"]{ "slug": slug.current, publishedAt, _updatedAt }`
