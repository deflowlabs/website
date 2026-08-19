import { defineQuery } from 'groq'

/**
 * Public mode returns only published documents whose publication date has arrived.
 * `$preview` reflects the module's authenticated preview state; draft reads still
 * require the server-only token and protected Visual Editing proxy.
 */
export const POSTS_QUERY = defineQuery(`*[_type == "post" && defined(publishedAt) && ($preview || (!(_id in path("drafts.**")) && publishedAt <= now()))] | order(publishedAt desc, _id asc) {
  _id, _type, title, "slug": slug.current, excerpt, publishedAt, isFeatured, readingTime,
  "category": categories[0]->title,
  "author": author->{name, "avatar": avatar.asset->url},
  "coverImage": coverImage.asset->url, "coverImageAlt": coverImage.alt
}`)

export const FEATURED_POST_QUERY = defineQuery(`*[_type == "post" && defined(publishedAt) && ($preview || (!(_id in path("drafts.**")) && publishedAt <= now()))] | order(isFeatured desc, publishedAt desc, _id asc)[0] {
  _id, _type, title, "slug": slug.current, excerpt, publishedAt, readingTime,
  "category": categories[0]->title,
  "author": author->{name, "avatar": avatar.asset->url},
  "coverImage": coverImage.asset->url, "coverImageAlt": coverImage.alt
}`)

export const PAGINATED_POSTS_QUERY = defineQuery(`*[_type == "post" && defined(publishedAt) && ($preview || (!(_id in path("drafts.**")) && publishedAt <= now())) && _id != $featuredId] | order(publishedAt desc, _id asc) [$start...$end] {
  _id, _type, title, "slug": slug.current, excerpt, publishedAt, readingTime,
  "category": categories[0]->title,
  "author": author->{name, "avatar": avatar.asset->url},
  "coverImage": coverImage.asset->url, "coverImageAlt": coverImage.alt
}`)

export const NON_FEATURED_COUNT_QUERY = defineQuery(`count(*[_type == "post" && defined(publishedAt) && ($preview || (!(_id in path("drafts.**")) && publishedAt <= now())) && _id != $featuredId])`)

export const POST_BY_SLUG_QUERY = defineQuery(`*[_type == "post" && defined(publishedAt) && slug.current == $slug && ($preview || (!(_id in path("drafts.**")) && publishedAt <= now()))] | order(_updatedAt desc)[0] {
  _id, _type, title, "slug": slug.current, excerpt, publishedAt, readingTime,
  body[]{..., _type == "imageWithAlt" => {..., "url": asset->url}},
  "seoTitle": coalesce(seo.title, seoTitle, title),
  "seoDescription": coalesce(seo.description, seoDescription, excerpt),
  "category": categories[0]->title, "categories": categories[]->title,
  "author": author->{name, role, bio, "avatar": avatar.asset->url, linkedin, twitter},
  "coverImage": coverImage.asset->url, "coverImageAlt": coverImage.alt
}`)

export const LABS_PROJECTS_QUERY = defineQuery(`*[_type == "labsProject" && ($preview || !(_id in path("drafts.**")))] | order(coalesce(displayOrder, 100) asc, startDate desc, _id asc) {
  _id, _type, title, "slug": slug.current, status, "partner": coalesce(partnerRef->name, partner),
  description, body[]{..., _type == "imageWithAlt" => {..., "url": asset->url}}, tags,
  startDate, endDate, publicationUrl, cta,
  "coverImage": coverImage.asset->url, "coverImageAlt": coverImage.alt
}`)

export const ACTIVE_ANNOUNCEMENT_QUERY = defineQuery(`*[_type == "announcement" && isActive == true && ($preview || !(_id in path("drafts.**")))] | order(_updatedAt desc, _id asc)[0] {
  _id, _type, text, tone,
  "cta": coalesce(cta, {"label": linkText, "url": link})
}`)
