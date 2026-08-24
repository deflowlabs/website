import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { resolveBlogEmptyState, resolveBlogPlacements } from '../app/utils/blog-placement.ts'
import { safeExternalUrl } from '../app/utils/safe-url.ts'
import {
  ACTIVE_ANNOUNCEMENT_QUERY,
  BLOG_CATEGORIES_QUERY,
  BLOG_POSTS_QUERY,
  FEATURED_POST_QUERY,
  LABS_PROJECTS_QUERY,
  POST_BY_SLUG_QUERY,
  POSTS_QUERY,
} from '../app/utils/sanity-queries.ts'

test('CMS links reject unsafe schemes', () => {
  assert.equal(safeExternalUrl('javascript:alert(1)'), undefined)
  assert.equal(safeExternalUrl('https://deflowlabs.io/blog'), 'https://deflowlabs.io/blog')
})

test('public post queries exclude drafts and future publication dates', () => {
  for (const query of [POSTS_QUERY, POST_BY_SLUG_QUERY]) {
    assert.match(query, /drafts\.\*\*/)
    assert.match(query, /publishedAt <= now\(\)/)
  }
})

test('Labs projects have deterministic explicit ordering', () => {
  assert.match(LABS_PROJECTS_QUERY, /displayOrder/)
  assert.match(LABS_PROJECTS_QUERY, /_id asc/)
  assert.match(LABS_PROJECTS_QUERY, /isPublic == true/)
  assert.doesNotMatch(LABS_PROJECTS_QUERY, /coalesce\(partnerRef->name, partner\)/)
})

test('blog categories, featured state and filters are CMS-driven', () => {
  assert.match(BLOG_CATEGORIES_QUERY, /references\(\^\._id\)/)
  assert.match(BLOG_CATEGORIES_QUERY, /count\(/)
  assert.match(FEATURED_POST_QUERY, /isFeatured == true/)
  assert.match(BLOG_POSTS_QUERY, /\$category/)
  assert.match(BLOG_POSTS_QUERY, /\$search/)
})

test('blog placements never duplicate announcement and featured stories', () => {
  const shared = { _id: 'post-1' }
  assert.deepEqual(resolveBlogPlacements(shared, shared), {
    announcementStory: shared,
    featuredStory: null,
    excludedIds: ['post-1'],
  })
  assert.deepEqual(resolveBlogPlacements({ _id: 'post-1' }, { _id: 'post-2' }).excludedIds, ['post-1', 'post-2'])
})

test('blog empty states distinguish an empty catalogue from empty filters', () => {
  assert.equal(resolveBlogEmptyState(0, 0, false), 'coming-soon')
  assert.equal(resolveBlogEmptyState(0, 0, true), 'no-results')
  assert.equal(resolveBlogEmptyState(2, 0, true), 'no-results')
  assert.equal(resolveBlogEmptyState(2, 2, false), null)
})

test('blog filters and pagination have stable route contracts', async () => {
  const blog = await readFile(new URL('../app/pages/blog/index.vue', import.meta.url), 'utf8')
  assert.match(blog, /key:\s*route => route\.fullPath/)
  assert.match(blog, /PAGE_SIZE = 9/)
  assert.match(blog, /currentPage \* PAGE_SIZE - 1/)
  assert.match(blog, /page: String\(currentPage \+ 1\)/)
})

test('Blog presentation uses the approved headings and omits card authors', async () => {
  const [blog, card] = await Promise.all([
    readFile(new URL('../app/pages/blog/index.vue', import.meta.url), 'utf8'),
    readFile(new URL('../app/components/BlogPostCard.vue', import.meta.url), 'utf8'),
  ])
  assert.doesNotMatch(blog, /Latest announcement|Featured insight/)
  assert.doesNotMatch(blog, />Latest</)
  assert.match(blog, /<h2>Featured<\/h2>/)
  assert.match(blog, /<h2>\{\{ hasFilters \? 'Articles' : 'Most recent' \}\}<\/h2>/)
  assert.doesNotMatch(card, /post\.author/)
})

test('Sanity images use supported CDN formats and expose an accessible fallback', async () => {
  const image = await readFile(new URL('../app/components/SanityImage.vue', import.meta.url), 'utf8')
  assert.doesNotMatch(image, /avif/i)
  assert.match(image, /image\/webp/)
  assert.match(image, /'webp' \| 'jpg'/)
  assert.match(image, /@error="renderFailed = true"/)
  assert.match(image, /aria-label="alt \|\| 'Image unavailable'"/)
})

test('Labs projects are presented only on the index route', () => {
  assert.equal(existsSync(new URL('../app/pages/labs.vue', import.meta.url)), false)
  assert.equal(existsSync(new URL('../app/pages/labs/index.vue', import.meta.url)), true)
  assert.equal(existsSync(new URL('../app/pages/labs/[slug].vue', import.meta.url)), false)
})

test('Labs cards are non-interactive and detail-only queries are absent', async () => {
  const [labs, queries] = await Promise.all([
    readFile(new URL('../app/pages/labs/index.vue', import.meta.url), 'utf8'),
    readFile(new URL('../app/utils/sanity-queries.ts', import.meta.url), 'utf8'),
  ])
  assert.match(labs, /<article/)
  assert.doesNotMatch(labs, /Explore project|`\/labs\/\$\{/)
  assert.doesNotMatch(queries, /LABS_PROJECT_BY_SLUG_QUERY/)
})

test('all public CMS consumers require authenticated preview state for drafts', () => {
  for (const query of [POSTS_QUERY, POST_BY_SLUG_QUERY, LABS_PROJECTS_QUERY, ACTIVE_ANNOUNCEMENT_QUERY]) {
    assert.match(query, /\$preview/)
    assert.match(query, /drafts\.\*\*/)
  }
})

test('official visual editing replaces the custom query and cookie endpoints', async () => {
  const config = await readFile(new URL('../nuxt.config.ts', import.meta.url), 'utf8')
  assert.match(config, /@nuxtjs\/sanity/)
  assert.match(config, /mode:\s*'live-visual-editing'/)
  assert.match(config, /keepStegaOnCopy:\s*false/)
  assert.match(config, /NUXT_SANITY_PREVIEW_ENABLED/)
  assert.match(config, /Production must not define SANITY_API_READ_TOKEN/)
  assert.match(config, /private, no-store/)
  assert.match(config, /Content-Security-Policy.*frame-ancestors/s)
  assert.match(config, /data-ruffle-optout/)
  assert.doesNotMatch(config, /X-Frame-Options|SANITY_PREVIEW_COOKIE_SECRET/)

  assert.equal(existsSync(new URL('../server/api/sanity/query.post.ts', import.meta.url)), false)
  assert.equal(existsSync(new URL('../server/utils/sanity-preview.ts', import.meta.url)), false)
  assert.equal(existsSync(new URL('../app/components/AnnouncementBanner.client.vue', import.meta.url)), true)
})

test('SEO and publish freshness are runtime-aware', async () => {
  const [sitemap, webhook, article] = await Promise.all([
    readFile(new URL('../server/api/__sitemap__/urls.get.ts', import.meta.url), 'utf8'),
    readFile(new URL('../server/api/sanity/revalidate.post.ts', import.meta.url), 'utf8'),
    readFile(new URL('../app/pages/blog/[slug].vue', import.meta.url), 'utf8'),
  ])
  assert.match(sitemap, /seo\.noIndex/)
  assert.match(sitemap, /\/blog\/author\//)
  assert.doesNotMatch(sitemap, /\/labs\//)
  assert.match(webhook, /isValidSignature/)
  assert.match(webhook, /sanity-project-id/)
  assert.match(webhook, /x-prerender-revalidate/)
  assert.match(article, /noindex, follow/)
})
