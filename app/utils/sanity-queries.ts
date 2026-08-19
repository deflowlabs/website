import { defineQuery } from 'groq'

/**
 * Every public query applies the same publication boundary. `$preview` can only
 * become true on the dedicated authenticated preview deployment.
 */
const publishedPost = 'defined(publishedAt) && ($preview || (!(_id in path("drafts.**")) && publishedAt <= now()))'
const publishedDocument = '($preview || !(_id in path("drafts.**")))'

const imageProjection = `{
  ..., asset->{_id, url, metadata{dimensions{width, height, aspectRatio, lqip}}}
}`

const postCardProjection = `{
  _id, _type, _rev, _updatedAt, title, "slug": slug.current, excerpt, publishedAt,
  isFeatured, readingTime,
  "category": categories[0]->{_id, title, "slug": slug.current},
  "categories": categories[]->{_id, title, "slug": slug.current},
  "author": author->{_id, name, "slug": slug.current, role, avatar${imageProjection}},
  coverImage${imageProjection}
}`

export const POSTS_QUERY = defineQuery(`*[_type == "post" && ${publishedPost}] | order(publishedAt desc, _id asc) ${postCardProjection}`)

export const BLOG_CATEGORIES_QUERY = defineQuery(`*[
  _type == "category" && ${publishedDocument} &&
  count(*[_type == "post" && ${publishedPost} && references(^._id)]) > 0
] | order(title asc, _id asc) {
  _id, title, "slug": slug.current
}`)

export const BLOG_TOTAL_COUNT_QUERY = defineQuery(`count(*[_type == "post" && ${publishedPost}])`)

export const ANNOUNCEMENT_STORY_QUERY = defineQuery(`*[
  _type == "post" && ${publishedPost} && "announcements" in categories[]->slug.current
] | order(publishedAt desc, _id asc)[0] ${postCardProjection}`)

export const FEATURED_POST_QUERY = defineQuery(`*[
  _type == "post" && ${publishedPost} && isFeatured == true
] | order(publishedAt desc, _id asc)[0] ${postCardProjection}`)

export const BLOG_POSTS_QUERY = defineQuery(`*[
  _type == "post" && ${publishedPost} && !(_id in $excludeIds) &&
  ($category == "" || $category in categories[]->slug.current) &&
  ($search == "" || lower(title) match $search || lower(excerpt) match $search)
] | order(publishedAt desc, _id asc) [$start...$end] ${postCardProjection}`)

export const BLOG_POST_COUNT_QUERY = defineQuery(`count(*[
  _type == "post" && ${publishedPost} && !(_id in $excludeIds) &&
  ($category == "" || $category in categories[]->slug.current) &&
  ($search == "" || lower(title) match $search || lower(excerpt) match $search)
])`)

export const POST_BY_SLUG_QUERY = defineQuery(`*[
  _type == "post" && slug.current == $slug && ${publishedPost}
] | order(_updatedAt desc)[0] {
  _id, _type, _rev, _updatedAt, title, "slug": slug.current, excerpt, publishedAt,
  isFeatured, readingTime,
  body[]{..., _type == "imageWithAlt" => {..., asset->{_id, url, metadata{dimensions{width, height, aspectRatio, lqip}}}}},
  "seo": {
    "title": coalesce(seo.title, seoTitle, title),
    "description": coalesce(seo.description, seoDescription, excerpt),
    "noIndex": coalesce(seo.noIndex, false),
    "image": seo.image${imageProjection}
  },
  "category": categories[0]->{_id, title, "slug": slug.current},
  "categories": categories[]->{_id, title, "slug": slug.current},
  "author": author->{
    _id, name, "slug": slug.current, role, bio, linkedin, twitter,
    avatar${imageProjection}
  },
  coverImage${imageProjection}
}`)

export const AUTHOR_BY_SLUG_QUERY = defineQuery(`*[
  _type == "author" && slug.current == $slug && ${publishedDocument}
][0] {
  _id, _type, _rev, _updatedAt, name, "slug": slug.current, role, bio, linkedin, twitter,
  avatar${imageProjection}
}`)

export const AUTHOR_POSTS_QUERY = defineQuery(`*[
  _type == "post" && ${publishedPost} && author->slug.current == $slug
] | order(publishedAt desc, _id asc) ${postCardProjection}`)

const partnerProjection = `select(
  partnerRef->isPublic == true => partnerRef->{
    _id, name, url, logo${imageProjection}
  },
  null
)`

export const LABS_PROJECTS_QUERY = defineQuery(`*[
  _type == "labsProject" && ${publishedDocument}
] | order(coalesce(displayOrder, 100) asc, startDate desc, _id asc) {
  _id, _type, _rev, _updatedAt, title, "slug": slug.current, status,
  "partner": ${partnerProjection},
  description, tags, startDate, endDate, publicationUrl, cta,
  coverImage${imageProjection}
}`)

export const LABS_PROJECT_BY_SLUG_QUERY = defineQuery(`*[
  _type == "labsProject" && slug.current == $slug && ${publishedDocument}
] | order(_updatedAt desc)[0] {
  _id, _type, _rev, _updatedAt, title, "slug": slug.current, status,
  "partner": ${partnerProjection},
  description, tags, startDate, endDate, publicationUrl, cta,
  body[]{..., _type == "imageWithAlt" => {..., asset->{_id, url, metadata{dimensions{width, height, aspectRatio, lqip}}}}},
  coverImage${imageProjection},
  "seo": {
    "title": coalesce(seo.title, title),
    "description": coalesce(seo.description, description),
    "noIndex": coalesce(seo.noIndex, false),
    "image": seo.image${imageProjection}
  }
}`)

export const ACTIVE_ANNOUNCEMENT_QUERY = defineQuery(`*[
  _type == "announcement" && isActive == true && ${publishedDocument}
] | order(_updatedAt desc, _id asc)[0] {
  _id, _type, _rev, _updatedAt, text, tone,
  "cta": coalesce(cta, {"label": linkText, "url": link, "style": "link"})
}`)
