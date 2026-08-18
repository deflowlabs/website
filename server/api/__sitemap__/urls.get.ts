import { createClient } from '@sanity/client'

/** Published, non-future blog routes supplied to the Nuxt sitemap module. */
const SLUGS_QUERY = `*[_type == "post" && defined(publishedAt) && !(_id in path("drafts.**")) && publishedAt <= now()]{ "slug": slug.current, _updatedAt }`

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  if (!config.public.sanityProjectId) return []

  const client = createClient({
    projectId: config.public.sanityProjectId,
    dataset: config.public.sanityDataset,
    apiVersion: config.public.sanityApiVersion,
    useCdn: true,
    perspective: 'published',
  })
  const posts = await client.fetch<Array<{ slug?: string, _updatedAt: string }>>(SLUGS_QUERY)
  return posts.filter(post => post.slug).map(post => ({ loc: `/blog/${post.slug}`, lastmod: post._updatedAt }))
})
