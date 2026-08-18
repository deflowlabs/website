/**
 * RSS 2.0 feed for DeFlow Labs blog.
 *
 * Fetches published blog posts from Sanity and generates a standards-compliant
 * RSS XML feed. Accessible at /rss.xml. Cached for 10 minutes via route rules.
 *
 * @returns XML response with Content-Type application/rss+xml
 */
import { createClient } from '@sanity/client'

const RSS_QUERY = `*[_type == "post" && defined(publishedAt) && !(_id in path("drafts.**")) && publishedAt <= now()] | order(publishedAt desc, _id asc) [0...50] {
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  "author": author->name,
  "category": categories[0]->title
}`

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  if (!config.public.sanityProjectId) {
    setResponseHeader(event, 'Content-Type', 'application/rss+xml; charset=UTF-8')
    return '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>DeFlow Labs Blog</title><link>https://deflowlabs.io/blog</link><description>DeFlow Labs updates</description></channel></rss>'
  }

  const client = createClient({
    projectId: config.public.sanityProjectId as string,
    dataset: config.public.sanityDataset as string || 'production',
    apiVersion: config.public.sanityApiVersion as string,
    useCdn: true,
  })

  const posts = await client.fetch(RSS_QUERY)

  const siteUrl = 'https://deflowlabs.io'
  const now = new Date().toUTCString()

  // Escape XML special characters
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')

  const items = (posts || [])
    .map((post: any) => `
    <item>
      <title>${esc(post.title)}</title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <description>${esc(post.excerpt || '')}</description>
      <pubDate>${post.publishedAt ? new Date(post.publishedAt).toUTCString() : now}</pubDate>
      ${post.category ? `<category>${esc(post.category)}</category>` : ''}
      ${post.author ? `<dc:creator>${esc(post.author)}</dc:creator>` : ''}
    </item>`)
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>DeFlow Labs Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Product updates, research publications, and engineering deep-dives from DeFlow Labs.</description>
    <language>en</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${siteUrl}/deflow-logo.svg</url>
      <title>DeFlow Labs Blog</title>
      <link>${siteUrl}/blog</link>
    </image>${items}
  </channel>
</rss>`

  setResponseHeader(event, 'Content-Type', 'application/rss+xml; charset=UTF-8')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=600, s-maxage=600')
  return xml
})
