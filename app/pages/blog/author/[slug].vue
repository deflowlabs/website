<template>
  <div v-if="author" class="author-page">
    <section class="author-hero section">
      <div class="container author-hero__inner">
        <SanityImage
          v-if="author.avatar"
          class="author-portrait"
          :image="author.avatar"
          :alt="author.avatar.alt || ''"
          :aspect-ratio="1"
          sizes="160px"
          priority
        />
        <div>
          <NuxtLink to="/blog" class="author-back"><Icon name="lucide:arrow-left" size="16" /> Back to Blog</NuxtLink>
          <span class="badge badge-info">Author</span>
          <h1>{{ author.name }}</h1>
          <p class="author-role">{{ author.role }}</p>
          <p class="author-bio">{{ author.bio }}</p>
          <div class="author-links" aria-label="Author links">
            <a v-if="safeExternalUrl(clean(author.linkedin))" :href="safeExternalUrl(clean(author.linkedin))" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a v-if="safeExternalUrl(clean(author.twitter))" :href="safeExternalUrl(clean(author.twitter))" target="_blank" rel="noopener noreferrer">X</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section author-articles">
      <div class="container">
        <div class="section-header"><h2>Articles by {{ author.name }}</h2></div>
        <div v-if="posts?.length" class="author-grid">
          <BlogPostCard v-for="post in posts" :key="post._id" :post="post" />
        </div>
        <p v-else class="author-empty">No published articles yet.</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import { AUTHOR_BY_SLUG_QUERY, AUTHOR_POSTS_QUERY } from '~/utils/sanity-queries'
import { safeExternalUrl } from '~/utils/safe-url'
import type { AUTHOR_BY_SLUG_QUERY_RESULT, AUTHOR_POSTS_QUERY_RESULT } from '~/types/sanity.generated'

const route = useRoute()
const slug = stegaClean(String(route.params.slug))
const visualEditing = useSanityVisualEditingState()
const preview = computed(() => visualEditing?.enabled ?? false)
const params = { slug, preview }
const [authorResult, postsResult] = await Promise.all([
  useSanityQuery<AUTHOR_BY_SLUG_QUERY_RESULT>(AUTHOR_BY_SLUG_QUERY, params, { key: `author-${slug}` }),
  useSanityQuery<AUTHOR_POSTS_QUERY_RESULT>(AUTHOR_POSTS_QUERY, params, { key: `author-posts-${slug}` }),
])
if (!authorResult.data.value) throw createError({ statusCode: 404, statusMessage: 'Author not found', fatal: true })

const author = computed(() => authorResult.data.value as NonNullable<AUTHOR_BY_SLUG_QUERY_RESULT>)
const posts = computed(() => postsResult.data.value || [])
function clean<T>(value: T) { return stegaClean(value) as T }

useHead(() => ({
  title: `${clean(author.value.name)} — DeFlow Labs Blog`,
  meta: [
    { name: 'description', content: clean(author.value.bio || `Articles by ${author.value.name}.`) },
    { property: 'og:type', content: 'profile' },
  ],
}))
useCanonical()
</script>

<style scoped>
.author-hero__inner { display: grid; grid-template-columns: 160px minmax(0, 680px); align-items: start; gap: 2rem; }
.author-portrait { border-radius: 50%; }
.author-back { display: flex; align-items: center; gap: 0.4rem; margin-bottom: 1.25rem; color: rgba(255,255,255,.5); text-decoration: none; font-size: .8125rem; }
.author-hero h1 { margin-top: .75rem; font-size: clamp(2rem, 5vw, 3rem); }
.author-role { margin-top: .4rem; color: rgba(255,255,255,.55); }
.author-bio { margin-top: 1rem; line-height: 1.7; }
.author-links { display: flex; gap: 1rem; margin-top: 1rem; }
.author-links a { color: #fff; text-underline-offset: 3px; }
.author-articles { padding-top: 0; }
.author-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.25rem; }
.author-empty { text-align: center; color: var(--color-muted-fg); }
@media (max-width: 900px) { .author-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 640px) { .author-hero__inner { grid-template-columns: 1fr; } .author-portrait { width: 120px; } .author-grid { grid-template-columns: 1fr; } }
</style>
