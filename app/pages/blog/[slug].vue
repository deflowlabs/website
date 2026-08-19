<template>
  <article v-if="article" class="article-page" :data-sanity="encodeDataAttribute('title')">
    <header class="article-hero section">
      <div class="container article-hero__inner">
        <NuxtLink to="/blog" class="article-back">
          <Icon name="lucide:arrow-left" size="16" aria-hidden="true" />
          Back to Blog
        </NuxtLink>
        <span v-if="article.category?.title" class="badge badge-info">{{ article.category.title }}</span>
        <h1>{{ article.title }}</h1>
        <p class="article-summary">{{ article.excerpt }}</p>
        <div class="article-meta">
          <NuxtLink v-if="article.author?.slug" :to="`/blog/author/${clean(article.author.slug)}`" class="article-author">
            <SanityImage
              v-if="article.author.avatar"
              :image="article.author.avatar"
              :alt="article.author.avatar.alt || ''"
              :aspect-ratio="1"
              sizes="40px"
            />
            <span>
              <strong>{{ article.author.name }}</strong>
              <small v-if="article.author.role">{{ article.author.role }}</small>
            </span>
          </NuxtLink>
          <span v-else>{{ article.author?.name || 'DeFlow Labs' }}</span>
          <span aria-hidden="true">·</span>
          <time v-if="article.publishedAt" :datetime="clean(article.publishedAt)">{{ formattedDate }}</time>
          <span v-if="article.readingTime">· {{ article.readingTime }} min read</span>
        </div>
      </div>
    </header>

    <section class="article-body section">
      <div class="container">
        <SanityImage
          v-if="article.coverImage"
          class="article-cover"
          :image="article.coverImage"
          :alt="article.coverImage.alt || ''"
          sizes="(max-width: 960px) 100vw, 960px"
          priority
        />
        <div class="article-content prose">
          <PortableContent v-if="article.body?.length" :value="article.body" />
          <p v-else class="text-muted"><em>Full article content will be published soon.</em></p>
        </div>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
/** Published article page with reactive CMS SEO and linked author attribution. */
import { stegaClean } from '@sanity/client/stega'
import { POST_BY_SLUG_QUERY } from '~/utils/sanity-queries'
import type { POST_BY_SLUG_QUERY_RESULT } from '~/types/sanity.generated'

const route = useRoute()
const slug = stegaClean(String(route.params.slug))
const visualEditing = useSanityVisualEditingState()
const preview = computed(() => visualEditing?.enabled ?? false)
const queryParams = { slug, preview }
const { data: sanityArticle, encodeDataAttribute } = await useSanityQuery<POST_BY_SLUG_QUERY_RESULT>(
  POST_BY_SLUG_QUERY,
  queryParams,
  { key: `post-${slug}` },
)

if (!sanityArticle.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found', fatal: true })
}

const article = computed(() => sanityArticle.value as NonNullable<POST_BY_SLUG_QUERY_RESULT>)
function clean<T>(value: T) { return stegaClean(value) as T }
const imageUrl = useSanityImageUrl()
const config = useRuntimeConfig()
const canonicalUrl = `${config.public.siteUrl}/blog/${slug}`
const sharingImage = computed(() => imageUrl(article.value.seo?.image || article.value.coverImage) || `${config.public.siteUrl}/og-image.png`)
const formattedDate = computed(() => article.value.publishedAt
  ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(clean(article.value.publishedAt)))
  : '')

useHead(() => {
  const title = clean(article.value.seo?.title || article.value.title || 'Article')
  const description = clean(article.value.seo?.description || article.value.excerpt || '')
  return {
    title: `${title} — DeFlow Labs Blog`,
    meta: [
      { name: 'description', content: description },
      { name: 'robots', content: article.value.seo?.noIndex ? 'noindex, follow' : 'index, follow' },
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: sharingImage.value },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: sharingImage.value },
    ],
    script: [{
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description,
        datePublished: clean(article.value.publishedAt || ''),
        dateModified: article.value._updatedAt,
        author: { '@type': 'Person', name: clean(article.value.author?.name || 'DeFlow Labs') },
        publisher: { '@type': 'Organization', name: 'DeFlow Labs', logo: { '@type': 'ImageObject', url: `${config.public.siteUrl}/deflow-logo.svg` } },
        image: sharingImage.value,
        url: canonicalUrl,
        mainEntityOfPage: canonicalUrl,
      }),
    }],
  }
})

useCanonical()
</script>

<style scoped>
.article-hero__inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  max-width: 820px;
}

.article-back,
.article-author {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.55);
  text-decoration: none;
}

.article-back { font-size: 0.8125rem; }
.article-back:hover,
.article-author:hover { color: #fff; }
.article-back:focus-visible,
.article-author:focus-visible { outline: 2px solid var(--color-ring); outline-offset: 3px; }

.article-hero h1 { max-width: 18ch; font-size: clamp(2rem, 5vw, 3.5rem); }
.article-summary { max-width: 65ch; font-size: 1.05rem; line-height: 1.7; }

.article-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.8125rem;
}

.article-author :deep(.sanity-image) { width: 40px; border-radius: 50%; }
.article-author span { display: flex; flex-direction: column; }
.article-author strong { color: rgba(255, 255, 255, 0.85); }
.article-author small { color: rgba(255, 255, 255, 0.45); }

.article-body { padding-top: 0; }
.article-cover { max-width: 960px; margin: 0 auto 3rem; border-radius: var(--radius-card); }
.article-content { max-width: 720px; margin: 0 auto; font-size: 1.0625rem; line-height: 1.8; }

.prose :deep(h2) { margin: 2.5rem 0 0.75rem; font-size: 1.5rem; }
.prose :deep(h3) { margin: 2rem 0 0.5rem; font-size: 1.25rem; }
.prose :deep(p) { margin-bottom: 1.25rem; color: rgba(255, 255, 255, 0.72); }
.prose :deep(a) { color: var(--color-foreground); text-decoration: underline; text-underline-offset: 2px; }
.prose :deep(pre) { overflow-x: auto; margin: 1.5rem 0; padding: 1.25rem; border: 1px solid rgba(255, 255, 255, 0.06); border-radius: var(--radius-card); background: rgba(0, 0, 0, 0.3); }
.prose :deep(blockquote) { margin: 1.5rem 0; padding-left: 1rem; border-left: 3px solid rgba(255, 255, 255, 0.15); color: rgba(255, 255, 255, 0.55); }
.prose :deep(ul), .prose :deep(ol) { margin-bottom: 1.25rem; padding-left: 1.5rem; color: rgba(255, 255, 255, 0.72); }
.prose :deep(li) { margin-bottom: 0.5rem; }
</style>
