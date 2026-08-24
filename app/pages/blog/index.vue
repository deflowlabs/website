<template>
  <div class="blog-page">
    <section class="blog-hero section">
      <div class="container">
        <div class="section-header">
          <span class="badge badge-info">Blog</span>
          <h1>News &amp; Insights</h1>
          <p>Product updates, research publications, and engineering deep-dives from DeFlow Labs.</p>
        </div>

        <div class="blog-controls" aria-label="Filter articles">
          <label class="blog-search">
            <span class="sr-only">Search articles</span>
            <Icon class="blog-search__icon" name="lucide:search" size="16" aria-hidden="true" />
            <input
              v-model="searchInput"
              type="search"
              class="blog-search__input"
              placeholder="Search articles…"
            >
          </label>
          <div class="blog-tabs" aria-label="Article categories">
            <button
              type="button"
              class="blog-tab"
              :class="{ 'blog-tab--active': !activeCategory }"
              :aria-pressed="!activeCategory"
              @click="selectCategory('')"
            >
              All
            </button>
            <button
              v-for="category in categories"
              :key="category._id"
              type="button"
              class="blog-tab"
              :class="{ 'blog-tab--active': activeCategory === clean(category.slug || '') }"
              :aria-pressed="activeCategory === clean(category.slug || '')"
              @click="selectCategory(clean(category.slug || ''))"
            >
              {{ category.title }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <template v-if="!hasFilters">
      <section v-if="announcementStory" class="blog-section section blog-section--first">
        <div class="container">
          <div class="blog-section__heading">
            <span class="badge badge-warning">Announcements</span>
          </div>
          <BlogPostCard
            :post="announcementStory"
            variant="lead"
            eyebrow="Announcement"
            eyebrow-class="badge-warning"
            priority
          />
        </div>
      </section>

      <section v-if="featuredStory" class="blog-section section" :class="{ 'blog-section--first': !announcementStory }">
        <div class="container">
          <div class="blog-section__heading">
            <h2>Featured</h2>
          </div>
          <div class="blog-grid">
            <BlogPostCard :post="featuredStory" :priority="!announcementStory" />
          </div>
        </div>
      </section>
    </template>

    <section class="blog-section section" :class="{ 'blog-section--first': hasFilters || (!announcementStory && !featuredStory) }">
      <div class="container">
        <div v-if="totalPublished > 0" class="blog-section__heading">
          <span v-if="hasFilters" class="badge badge-info">Results</span>
          <h2>{{ hasFilters ? 'Articles' : 'Most recent' }}</h2>
        </div>

        <div v-if="posts.length" class="blog-grid">
          <BlogPostCard v-for="post in posts" :key="post._id" :post="post" />
        </div>

        <div v-if="hasMore" class="blog-load-more">
          <button type="button" class="btn btn-secondary" :disabled="loading" @click="loadMore">
            {{ loading ? 'Loading…' : 'Load more articles' }}
            <Icon name="lucide:chevron-down" size="14" aria-hidden="true" />
          </button>
        </div>

        <div v-if="emptyState === 'coming-soon' && !loading" class="blog-empty glass-card">
          <Icon name="lucide:file-text" size="32" aria-hidden="true" />
          <h2>Coming Soon</h2>
          <p>Our first articles are being written. Check back soon or join the waitlist for updates.</p>
          <NuxtLink to="/waitlist" class="btn btn-secondary">Join Waitlist</NuxtLink>
        </div>

        <div v-else-if="emptyState === 'no-results' && !loading" class="blog-empty glass-card" role="status">
          <Icon name="lucide:search-x" size="32" aria-hidden="true" />
          <h2>No articles found</h2>
          <p>Try another search term or clear the selected category.</p>
          <button type="button" class="btn btn-secondary" @click="clearFilters">Clear filters</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
/** Query-driven blog index with announcement, explicit featured and recent placement precedence. */
import { stegaClean } from '@sanity/client/stega'
import { resolveBlogEmptyState, resolveBlogPlacements } from '~/utils/blog-placement'
import {
  ANNOUNCEMENT_STORY_QUERY,
  BLOG_CATEGORIES_QUERY,
  BLOG_POST_COUNT_QUERY,
  BLOG_POSTS_QUERY,
  BLOG_TOTAL_COUNT_QUERY,
  FEATURED_POST_QUERY,
} from '~/utils/sanity-queries'
import type {
  ANNOUNCEMENT_STORY_QUERY_RESULT,
  BLOG_CATEGORIES_QUERY_RESULT,
  BLOG_POST_COUNT_QUERY_RESULT,
  BLOG_POSTS_QUERY_RESULT,
  BLOG_TOTAL_COUNT_QUERY_RESULT,
  FEATURED_POST_QUERY_RESULT,
} from '~/types/sanity.generated'

definePageMeta({ key: route => route.fullPath })

useHead({
  title: 'Blog — DeFlow Labs',
  meta: [{ name: 'description', content: 'Product updates, research publications, and engineering insights from DeFlow Labs.' }],
})
useCanonical()

const route = useRoute()
const router = useRouter()
const visualEditing = useSanityVisualEditingState()
const preview = computed(() => visualEditing?.enabled ?? false)
const PAGE_SIZE = 9
type BlogPost = BLOG_POSTS_QUERY_RESULT[number]

function clean<T>(value: T) { return stegaClean(value) as T }
const activeCategory = ref(clean(String(route.query.category || '')))
const searchInput = ref(clean(String(route.query.q || '')))
const searchQuery = ref(searchInput.value.trim())
const currentPage = Math.max(1, Number.parseInt(clean(String(route.query.page || '1')), 10) || 1)
const hasFilters = computed(() => Boolean(activeCategory.value || searchQuery.value))

const baseParams = { preview }
const [categoriesResult, totalResult, announcementResult, featuredResult] = await Promise.all([
  useSanityQuery<BLOG_CATEGORIES_QUERY_RESULT>(BLOG_CATEGORIES_QUERY, baseParams, { key: 'blog-categories' }),
  useSanityQuery<BLOG_TOTAL_COUNT_QUERY_RESULT>(BLOG_TOTAL_COUNT_QUERY, baseParams, { key: 'blog-total' }),
  useSanityQuery<ANNOUNCEMENT_STORY_QUERY_RESULT>(ANNOUNCEMENT_STORY_QUERY, baseParams, { key: 'blog-announcement-story' }),
  useSanityQuery<FEATURED_POST_QUERY_RESULT>(FEATURED_POST_QUERY, baseParams, { key: 'blog-featured-story' }),
])

const categories = computed(() => categoriesResult.data.value || [])
const totalPublished = computed(() => totalResult.data.value || 0)
const placements = computed(() => hasFilters.value
  ? resolveBlogPlacements<BlogPost>(null, null)
  : resolveBlogPlacements<BlogPost>(announcementResult.data.value, featuredResult.data.value))
const announcementStory = computed(() => placements.value.announcementStory)
const featuredStory = computed(() => placements.value.featuredStory)
const excludedIds = computed(() => placements.value.excludedIds)

const searchParam = computed(() => searchQuery.value ? `*${searchQuery.value.toLowerCase()}*` : '')
const queryParams = {
  preview,
  category: activeCategory.value,
  search: searchParam.value,
  excludeIds: excludedIds.value,
  start: 0,
  end: currentPage * PAGE_SIZE - 1,
}
const countParams = {
  preview,
  category: activeCategory.value,
  search: searchParam.value,
  excludeIds: excludedIds.value,
}
const resultKey = [activeCategory.value || 'all', searchQuery.value || 'all', currentPage, ...excludedIds.value].join('-')

const [postsResult, countResult] = await Promise.all([
  useSanityQuery<BLOG_POSTS_QUERY_RESULT>(BLOG_POSTS_QUERY, queryParams, { key: `blog-posts-${resultKey}` }),
  useSanityQuery<BLOG_POST_COUNT_QUERY_RESULT>(BLOG_POST_COUNT_QUERY, countParams, { key: `blog-filtered-count-${resultKey}` }),
])

const loading = computed(() => postsResult.status.value === 'pending')
const filteredCount = computed(() => countResult.data.value || 0)
const emptyState = computed(() => resolveBlogEmptyState(totalPublished.value, filteredCount.value, hasFilters.value))
const posts = computed(() => postsResult.data.value || [])
const hasMore = computed(() => posts.value.length < filteredCount.value)

let searchTimer: ReturnType<typeof setTimeout> | undefined
watch(searchInput, value => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { searchQuery.value = clean(value).trim() }, 250)
})
onUnmounted(() => clearTimeout(searchTimer))

watch([activeCategory, searchQuery], ([category, search]) => {
  const query: Record<string, string> = {}
  if (category) query.category = category
  if (search) query.q = search
  if (String(route.query.category || '') !== category || String(route.query.q || '') !== search) {
    void router.replace({ path: route.path, query })
  }
})

watch(() => route.query, query => {
  const category = clean(String(query.category || ''))
  const search = clean(String(query.q || ''))
  if (category !== activeCategory.value) activeCategory.value = category
  if (search !== searchInput.value) searchInput.value = search
}, { deep: true })

function selectCategory(slug: string) {
  activeCategory.value = clean(slug)
}

function clearFilters() {
  activeCategory.value = ''
  searchInput.value = ''
  searchQuery.value = ''
}

function loadMore() {
  if (loading.value || !hasMore.value) return
  const query = { ...route.query, page: String(currentPage + 1) }
  void router.replace({ path: route.path, query })
}
</script>

<style scoped>
.blog-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.blog-search {
  position: relative;
  width: 100%;
  max-width: 420px;
}

.blog-search__icon {
  position: absolute;
  top: 50%;
  left: 0.85rem;
  color: rgba(255, 255, 255, 0.35);
  pointer-events: none;
  transform: translateY(-50%);
}

.blog-search__input {
  width: 100%;
  padding: 0.7rem 1rem 0.7rem 2.6rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-pill);
  outline: none;
  background: rgba(255, 255, 255, 0.04);
  color: var(--color-foreground);
  font: inherit;
  font-size: 0.875rem;
}

.blog-search__input:focus-visible {
  border-color: var(--color-ring);
  box-shadow: 0 0 0 2px rgba(212, 212, 216, 0.16);
}

.blog-tabs {
  display: flex;
  max-width: 100%;
  gap: 0.25rem;
  overflow-x: auto;
  scrollbar-width: thin;
}

.blog-tab {
  flex: 0 0 auto;
  padding: 0.55rem 0.9rem;
  border: 1px solid transparent;
  border-radius: var(--radius-pill);
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  font: inherit;
  font-size: 0.8125rem;
}

.blog-tab:hover,
.blog-tab--active {
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

.blog-tab:focus-visible {
  outline: 2px solid var(--color-ring);
  outline-offset: 2px;
}

.blog-section--first {
  padding-top: 0;
}

.blog-section__heading {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.blog-section__heading h2 {
  font-size: clamp(1.35rem, 2.5vw, 1.85rem);
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
}

.blog-load-more {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.blog-load-more .btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.blog-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem 2rem;
  text-align: center;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 1024px) {
  .blog-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 640px) {
  .blog-grid { grid-template-columns: 1fr; }
  .blog-tabs { width: 100%; }
}
</style>
