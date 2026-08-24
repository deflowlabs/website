<template>
  <NuxtLink
    :to="`/blog/${cleanSlug}`"
    class="blog-card glass-card"
    :class="`blog-card--${variant}`"
  >
    <SanityImage
      class="blog-card__image"
      :image="post.coverImage"
      :alt="post.coverImage?.alt || ''"
      :priority="priority"
      :sizes="variant === 'lead' ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'"
    />
    <div class="blog-card__body">
      <div class="blog-card__meta">
        <span v-if="eyebrow" class="badge" :class="eyebrowClass">{{ eyebrow }}</span>
        <span v-else-if="post.category?.title" class="badge badge-info">{{ post.category.title }}</span>
        <time v-if="post.publishedAt" :datetime="cleanDate">{{ formattedDate }}</time>
        <span v-if="post.readingTime">{{ post.readingTime }} min read</span>
      </div>
      <h2>{{ post.title }}</h2>
      <p>{{ post.excerpt }}</p>
      <div class="blog-card__footer">
        <Icon name="lucide:arrow-right" size="18" aria-hidden="true" />
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import type { BLOG_POSTS_QUERY_RESULT } from '~/types/sanity.generated'

type BlogPost = BLOG_POSTS_QUERY_RESULT[number]

const props = withDefaults(defineProps<{
  post: BlogPost
  variant?: 'lead' | 'grid'
  eyebrow?: string
  eyebrowClass?: string
  priority?: boolean
}>(), {
  variant: 'grid',
  eyebrow: '',
  eyebrowClass: 'badge-info',
  priority: false,
})

const cleanSlug = computed(() => stegaClean(props.post.slug || ''))
const cleanDate = computed(() => stegaClean(props.post.publishedAt || ''))
const formattedDate = computed(() => cleanDate.value
  ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(cleanDate.value))
  : '')
</script>

<style scoped>
.blog-card {
  overflow: hidden;
  min-width: 0;
  text-decoration: none;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.blog-card:hover {
  border-color: rgba(255, 255, 255, 0.16);
  transform: translateY(-2px);
}

.blog-card:focus-visible {
  outline: 2px solid var(--color-ring);
  outline-offset: 3px;
}

.blog-card--lead {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
}

.blog-card--grid {
  display: flex;
  flex-direction: column;
}

.blog-card__image {
  height: 100%;
}

.blog-card__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.9rem;
  min-width: 0;
  padding: 1.5rem;
}

.blog-card--lead .blog-card__body {
  justify-content: center;
  padding: clamp(1.5rem, 4vw, 3rem);
}

.blog-card__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.65rem;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.75rem;
}

.blog-card h2 {
  overflow-wrap: anywhere;
  font-size: 1.125rem;
  line-height: 1.35;
}

.blog-card--lead h2 {
  font-size: clamp(1.5rem, 3vw, 2.25rem);
}

.blog-card p {
  display: -webkit-box;
  overflow: hidden;
  color: var(--color-muted-fg);
  font-size: 0.875rem;
  line-height: 1.65;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.blog-card__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: auto;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8125rem;
}

@media (max-width: 768px) {
  .blog-card--lead {
    grid-template-columns: 1fr;
  }
}
</style>
