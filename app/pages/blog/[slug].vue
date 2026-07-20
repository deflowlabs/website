<template>
  <div class="article-page">
    <section class="article-hero section">
      <div class="container">
        <div class="article-hero__inner">
          <NuxtLink to="/blog" class="article-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Blog
          </NuxtLink>

          <template v-if="article">
            <span class="badge badge-info">{{ article.category || 'Product' }}</span>
            <h1>{{ article.title }}</h1>
            <div class="article-meta">
              <span>{{ article.author?.name || 'DeFlow Labs' }}</span>
              <span>·</span>
              <span>{{ formatDate(article.publishedAt) }}</span>
            </div>
          </template>
          <template v-else>
            <h1>Article not found</h1>
          </template>
        </div>
      </div>
    </section>

    <section v-if="article" class="article-body section" style="padding-top: 0">
      <div class="container">
        <div class="article-content">
          <!-- Sanity Portable Text body -->
          <div v-if="article.body" class="prose">
            <!-- Portable text body will render here when content is published -->
            <p v-for="(block, i) in article.body" :key="i">
              <template v-if="block._type === 'block'">
                <span v-for="(child, j) in (block.children || [])" :key="j">{{ child.text }}</span>
              </template>
            </p>
          </div>

          <!-- Fallback for placeholder articles -->
          <template v-else>
            <p>{{ article.excerpt }}</p>
            <p style="color: rgba(255,255,255,0.5); font-style: italic; margin-top: 2rem">
              Full article content will be published soon.
            </p>
          </template>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
/**
 * Single blog article page.
 * Fetches full article by slug from Sanity CMS via GROQ.
 * Falls back to slug-derived title for placeholder articles.
 */
import { POST_BY_SLUG_QUERY } from '~/utils/sanity-queries'

const route = useRoute()
const slug = route.params.slug as string

const { sanityFetch } = useSanity()
const { data: sanityArticle } = await useAsyncData(`post-${slug}`, () =>
  sanityFetch(POST_BY_SLUG_QUERY, { slug }),
)

// Fallback for when Sanity has no content
const fallbackArticle = {
  title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
  excerpt: 'This article is coming soon. Full content will be published shortly.',
  category: 'Product',
  author: { name: 'DeFlow Labs' },
  publishedAt: null,
  body: null,
}

const article = computed(() => sanityArticle.value || fallbackArticle)

useHead({
  title: `${article.value.title} — DeFlow Labs Blog`,
  meta: [
    {
      name: 'description',
      content: article.value.seoDescription || article.value.excerpt || '',
    },
  ],
})

defineOgImage({
  component: 'OgImageBlog',
  title: article.value.title,
  category: article.value.category || 'Product',
  author: article.value.author?.name || 'DeFlow Labs',
  date: article.value.publishedAt
    ? new Date(article.value.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : undefined,
})

useStructuredData(createBlogPostSchema({
  title: article.value.title,
  excerpt: article.value.excerpt,
  publishedAt: article.value.publishedAt,
  author: article.value.author,
  slug,
}))

/**
 * Formats a date string into a human-readable format.
 * Returns 'Coming Soon' if no date is provided.
 */
function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Coming Soon'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>

<style scoped>
.article-hero__inner {
  max-width: 720px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.article-back {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.4);
  text-decoration: none;
  transition: color 0.2s ease;
}

.article-back:hover {
  color: #FFFFFF;
}

.article-hero h1 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
}

.article-meta {
  display: flex;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.4);
}

.article-content {
  max-width: 720px;
  font-size: 1.0625rem;
  line-height: 1.8;
}

.article-content p {
  color: rgba(255, 255, 255, 0.7);
}

/* Portable text prose styling */
.prose :deep(h2) {
  font-size: 1.5rem;
  margin-top: 2.5rem;
  margin-bottom: 0.75rem;
}

.prose :deep(h3) {
  font-size: 1.25rem;
  margin-top: 2rem;
  margin-bottom: 0.5rem;
}

.prose :deep(p) {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.25rem;
}

.prose :deep(a) {
  color: var(--color-foreground);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.prose :deep(code) {
  font-family: var(--font-mono);
  background: rgba(255, 255, 255, 0.06);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.9em;
}

.prose :deep(pre) {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-card);
  padding: 1.25rem;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.prose :deep(blockquote) {
  border-left: 3px solid rgba(255, 255, 255, 0.15);
  padding-left: 1rem;
  margin: 1.5rem 0;
  color: rgba(255, 255, 255, 0.5);
}

.prose :deep(ul), .prose :deep(ol) {
  padding-left: 1.5rem;
  margin-bottom: 1.25rem;
  color: rgba(255, 255, 255, 0.7);
}

.prose :deep(li) {
  margin-bottom: 0.5rem;
}

.prose :deep(img) {
  border-radius: var(--radius-card);
  margin: 1.5rem 0;
  max-width: 100%;
}
</style>
