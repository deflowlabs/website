import { createClient } from '@sanity/client'

const SITEMAP_QUERY = `{
  "posts": *[
    _type == "post" && !(_id in path("drafts.**")) && defined(publishedAt) &&
    publishedAt <= now() && coalesce(seo.noIndex, false) != true && defined(slug.current)
  ]{"slug": slug.current, _updatedAt},
  "authors": *[
    _type == "author" && !(_id in path("drafts.**")) && defined(slug.current) &&
    count(*[_type == "post" && !(_id in path("drafts.**")) && publishedAt <= now() &&
      coalesce(seo.noIndex, false) != true && references(^._id)]) > 0
  ]{"slug": slug.current, _updatedAt},
  "labs": *[
    _type == "labsProject" && !(_id in path("drafts.**")) &&
    coalesce(seo.noIndex, false) != true && defined(slug.current)
  ]{"slug": slug.current, _updatedAt}
}`

interface SitemapDocument { slug?: string, _updatedAt: string }
interface SitemapResult { posts: SitemapDocument[], authors: SitemapDocument[], labs: SitemapDocument[] }

/** Runtime sitemap source for published, indexable Sanity detail pages. */
export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  if (!config.public.sanityProjectId || config.public.sanityPreviewEnabled) return []

  const client = createClient({
    projectId: config.public.sanityProjectId,
    dataset: config.public.sanityDataset,
    apiVersion: config.public.sanityApiVersion,
    useCdn: true,
    perspective: 'published',
  })
  const result = await client.fetch<SitemapResult>(SITEMAP_QUERY)
  return [
    ...result.posts.map(document => ({ loc: `/blog/${document.slug}`, lastmod: document._updatedAt })),
    ...result.authors.map(document => ({ loc: `/blog/author/${document.slug}`, lastmod: document._updatedAt })),
    ...result.labs.map(document => ({ loc: `/labs/${document.slug}`, lastmod: document._updatedAt })),
  ]
})
