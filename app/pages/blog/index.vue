<template>
  <div class="blog-page">
    <section class="blog-hero section">
      <div class="container">
        <div class="section-header">
          <span class="badge badge-info">Blog</span>
          <h1>News &amp; Insights</h1>
          <p>Product updates, research publications, and engineering deep-dives from DeFlow Labs.</p>
        </div>

        <!-- Search + Category Tabs -->
        <div class="blog-controls">
          <div class="blog-search">
            <svg class="blog-search__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              class="blog-search__input"
              placeholder="Search articles..."
              aria-label="Search articles"
            >
          </div>
          <div class="blog-tabs" role="tablist">
            <button
              v-for="cat in categories"
              :key="cat"
              role="tab"
              :aria-selected="activeCategory === cat"
              class="blog-tab"
              :class="{ 'blog-tab--active': activeCategory === cat }"
              @click="activeCategory = cat"
            >
              {{ cat }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Post -->
    <section v-if="featuredPost && !searchQuery && activeCategory === 'All'" class="blog-featured section" style="padding-top: 0">
      <div class="container">
        <NuxtLink
          :to="`/blog/${featuredPost.slug}`"
          class="blog-featured__card glass-card"
          :data-sanity="featuredDataAttribute('title')"
        >
          <div
            class="blog-featured__image"
            :style="{
              background: featuredPost.coverImage
                ? `url(${featuredPost.coverImage}) center/cover`
                : 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))'
            }"
          />
          <div class="blog-featured__body">
            <div class="blog-featured__meta">
              <span class="badge badge-premium">Featured</span>
              <span class="blog-featured__date">{{ formatDate(featuredPost.publishedAt) }}</span>
              <span v-if="featuredPost.readingTime" class="blog-featured__reading">
                {{ featuredPost.readingTime }} min read
              </span>
            </div>
            <h2>{{ featuredPost.title }}</h2>
            <p>{{ featuredPost.excerpt }}</p>
            <div class="blog-featured__author">
              <span>{{ featuredPost.author?.name || 'DeFlow Labs' }}</span>
              <span class="blog-featured__arrow">→</span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Articles Grid -->
    <section class="blog-articles section" style="padding-top: 0">
      <div class="container">
        <div v-if="displayedArticles.length" class="blog-articles__grid">
          <NuxtLink
            v-for="article in displayedArticles"
            :key="article.slug || article._id"
            :to="`/blog/${article.slug}`"
            class="blog-article glass-card"
          >
            <div
              class="blog-article__image"
              :style="{
                background: article.coverImage
                  ? `url(${article.coverImage}) center/cover`
                  : article.color || 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))'
              }"
            />
            <div class="blog-article__body">
              <div class="blog-article__meta">
                <span class="badge badge-info">{{ article.category || 'Product' }}</span>
                <span class="blog-article__date">{{ formatDate(article.publishedAt) }}</span>
              </div>
              <h3>{{ article.title }}</h3>
              <p>{{ article.excerpt }}</p>
              <div class="blog-article__footer">
                <span class="blog-article__author-name">{{ article.author?.name || 'DeFlow Labs' }}</span>
                <span v-if="article.readingTime" class="blog-article__reading">
                  {{ article.readingTime }} min read
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Load More -->
        <div v-if="hasMore && !searchQuery" class="blog-load-more">
          <button class="btn btn-secondary" @click="loadMore">
            Load more articles
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>

        <!-- Empty State -->
        <div v-if="!displayedArticles.length && !loading" class="blog-empty glass-card">
          <span class="blog-empty__icon"><Icon name="lucide:file-text" size="32" /></span>
          <h3 v-if="searchQuery">No articles found</h3>
          <h3 v-else>Coming Soon</h3>
          <p v-if="searchQuery">Try a different search term or browse all categories.</p>
          <p v-else>Our first articles are being written. Check back soon or join the waitlist for updates.</p>
          <NuxtLink v-if="!searchQuery" to="/waitlist" class="btn btn-secondary">Join Waitlist</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
/**
 * Blog listing page v2.
 * Features: Featured post hero card, search filtering, category tabs,
 * paginated "Load more" with GROQ offset queries.
 * Falls back to placeholder content when Sanity has no published posts.
 */
import {
  FEATURED_POST_QUERY,
  PAGINATED_POSTS_QUERY,
  NON_FEATURED_COUNT_QUERY,
} from '~/utils/sanity-queries'
import type {
  FEATURED_POST_QUERY_RESULT,
  NON_FEATURED_COUNT_QUERY_RESULT,
  PAGINATED_POSTS_QUERY_RESULT,
} from '~/types/sanity.generated'

useHead({
  title: 'Blog — DeFlow Labs',
  meta: [
    { name: 'description', content: 'Product updates, research publications, and engineering insights from DeFlow Labs.' },
  ],
})

useCanonical()

const categories = ['All', 'Product', 'Research', 'Engineering', 'Ecosystem', 'Company']
const activeCategory = ref('All')
const searchQuery = ref('')
const PAGE_SIZE = 6

// Featured post
type SanityPost = PAGINATED_POSTS_QUERY_RESULT[number]
type BlogCard = Omit<SanityPost, '_id' | '_type' | 'coverImage' | 'coverImageAlt'> & {
  _id: string
  coverImage?: string | null
  coverImageAlt?: string | null
  color?: string
}

const allPosts = ref<BlogCard[]>([])

// Placeholder articles (shown when Sanity has no content yet)
const placeholderArticles: BlogCard[] = [
  {
    _id: 'placeholder-introducing-deflow',
    slug: 'introducing-deflow',
    title: 'Introducing DeFlow — The Institutional Settlement Layer',
    excerpt: 'Why we built a non-custodial, compliant settlement engine for digital asset dealflows.',
    category: 'Product',
    author: { name: 'DeFlow Labs', avatar: null },
    coverImage: null,
    coverImageAlt: null,
    publishedAt: null,
    readingTime: 8,
    color: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
  },
  {
    _id: 'placeholder-zero-pii',
    slug: 'zero-pii-architecture',
    title: 'Zero-PII: How We Verify Identity Without Storing It',
    excerpt: 'A deep dive into HMAC-SHA256 identity hashing and privacy-preserving compliance.',
    category: 'Engineering',
    author: { name: 'DeFlow Labs', avatar: null },
    coverImage: null,
    coverImageAlt: null,
    publishedAt: null,
    readingTime: 12,
    color: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(52, 211, 153, 0.2))',
  },
  {
    _id: 'placeholder-settlement',
    slug: 'settlement-explained',
    title: 'How Settlement Works on DeFlow',
    excerpt: 'From deal creation to final settlement — understanding the five-step process.',
    category: 'Product',
    author: { name: 'DeFlow Labs', avatar: null },
    coverImage: null,
    coverImageAlt: null,
    publishedAt: null,
    readingTime: 6,
    color: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(96, 165, 250, 0.2))',
  },
]

const visualEditing = useSanityVisualEditingState()
const featuredParams = reactive({ preview: visualEditing?.enabled ?? false })
const {
  data: featuredPost,
  encodeDataAttribute: featuredDataAttribute,
} = await useSanityQuery<FEATURED_POST_QUERY_RESULT>(FEATURED_POST_QUERY, featuredParams)

const pageParams = reactive({
  start: 0,
  end: PAGE_SIZE,
  featuredId: featuredPost.value?._id || '',
  preview: visualEditing?.enabled ?? false,
})
const countParams = reactive({
  featuredId: featuredPost.value?._id || '',
  preview: visualEditing?.enabled ?? false,
})

const [pageQuery, countQuery] = await Promise.all([
  useSanityQuery<PAGINATED_POSTS_QUERY_RESULT>(PAGINATED_POSTS_QUERY, pageParams, { key: 'blog-page' }),
  useSanityQuery<NON_FEATURED_COUNT_QUERY_RESULT>(NON_FEATURED_COUNT_QUERY, countParams, { key: 'blog-count' }),
])

const {
  data: currentPage,
  status: pageStatus,
} = pageQuery
const { data: totalCount } = countQuery
const loadingMore = ref(false)
const loading = computed(() => loadingMore.value || pageStatus.value === 'pending')
const totalNonFeatured = computed(() => totalCount.value || 0)

watch(currentPage, (posts) => {
  if (!posts) return
  if (pageParams.start === 0) {
    allPosts.value = [...posts]
    return
  }

  const merged = new Map(allPosts.value.map(post => [post._id, post]))
  for (const post of posts) merged.set(post._id, post)
  allPosts.value = [...merged.values()]
}, { immediate: true })

watch(pageStatus, status => {
  if (status !== 'pending') loadingMore.value = false
})

watch(() => visualEditing?.enabled, (enabled) => {
  const preview = enabled ?? false
  featuredParams.preview = preview
  pageParams.preview = preview
  countParams.preview = preview
  pageParams.start = 0
  pageParams.end = PAGE_SIZE
  allPosts.value = []
})

watch(() => featuredPost.value?._id, (featuredId) => {
  const id = featuredId || ''
  pageParams.featuredId = id
  countParams.featuredId = id
  pageParams.start = 0
  pageParams.end = PAGE_SIZE
  allPosts.value = []
})

const usePlaceholders = computed(() => !featuredPost.value && allPosts.value.length === 0)

const articles = computed<BlogCard[]>(() => usePlaceholders.value ? placeholderArticles : allPosts.value)

/**
 * Filters articles by active category and search query.
 * Search matches against title and excerpt (case-insensitive).
 */
const filteredArticles = computed(() => {
  let result = articles.value
  if (activeCategory.value !== 'All') {
    result = result.filter(a => a.category === activeCategory.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      a =>
        a.title?.toLowerCase().includes(q) ||
        a.excerpt?.toLowerCase().includes(q),
    )
  }
  return result
})

const displayedArticles = computed(() => filteredArticles.value)

const hasMore = computed(() => {
  if (usePlaceholders.value || searchQuery.value) return false
  return allPosts.value.length < totalNonFeatured.value
})

/**
 * Load next page of articles from Sanity via GROQ offset pagination.
 */
function loadMore() {
  if (loading.value || !hasMore.value) return
  loadingMore.value = true
  pageParams.start += PAGE_SIZE
  pageParams.end += PAGE_SIZE
}

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
/* ===== Controls ===== */
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
  max-width: 400px;
}

.blog-search__icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.3);
  pointer-events: none;
}

.blog-search__input {
  width: 100%;
  padding: 0.625rem 1rem 0.625rem 2.5rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-pill);
  color: var(--color-foreground);
  font-size: 0.8125rem;
  font-family: var(--font-primary);
  outline: none;
  transition: all 0.2s ease;
}

.blog-search__input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.blog-search__input:focus {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.06);
}

/* ===== Category Tabs ===== */
.blog-tabs {
  display: flex;
  justify-content: center;
  gap: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-wrap: wrap;
}

.blog-tab {
  padding: 0.5rem 1.25rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.45);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: -1px;
}

.blog-tab:hover {
  color: rgba(255, 255, 255, 0.8);
}

.blog-tab--active {
  color: #FFFFFF;
  border-bottom-color: #FFFFFF;
}

.blog-tab:focus-visible {
  outline: 2px solid var(--color-ring);
  outline-offset: -2px;
}

/* ===== Featured Post ===== */
.blog-featured__card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  text-decoration: none;
  transition: all 0.3s ease;
}

.blog-featured__card:hover {
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.blog-featured__image {
  min-height: 320px;
}

.blog-featured__body {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
}

.blog-featured__meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.blog-featured__date,
.blog-featured__reading {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.35);
}

.blog-featured__body h2 {
  font-size: 1.5rem;
  line-height: 1.3;
  font-weight: 600;
}

.blog-featured__body p {
  font-size: 0.9375rem;
  color: var(--color-muted-fg);
  line-height: 1.6;
}

.blog-featured__author {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.5);
}

.blog-featured__arrow {
  font-size: 1.25rem;
  transition: transform 0.2s ease;
}

.blog-featured__card:hover .blog-featured__arrow {
  transform: translateX(4px);
}

/* ===== Articles Grid ===== */
.blog-articles__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.blog-article {
  overflow: hidden;
  transition: all 0.3s ease;
  text-decoration: none;
  display: flex;
  flex-direction: column;
}

.blog-article:hover {
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.blog-article__image {
  height: 180px;
}

.blog-article__body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

.blog-article__meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.blog-article__date {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.3);
}

.blog-article h3 {
  font-size: 1.0625rem;
  line-height: 1.4;
}

.blog-article p {
  font-size: 0.8125rem;
  line-height: 1.6;
}

.blog-article__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.blog-article__author-name {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
}

.blog-article__reading {
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.25);
  font-family: var(--font-mono);
}

/* ===== Load More ===== */
.blog-load-more {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.blog-load-more .btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* ===== Empty State ===== */
.blog-empty {
  padding: 4rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.blog-empty__icon {
  font-size: 3rem;
}

/* ===== Responsive ===== */
@media (max-width: 1024px) {
  .blog-featured__card {
    grid-template-columns: 1fr;
  }

  .blog-featured__image {
    min-height: 200px;
  }

  .blog-articles__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .blog-articles__grid {
    grid-template-columns: 1fr;
  }

  .blog-tabs {
    justify-content: flex-start;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .blog-tabs::-webkit-scrollbar {
    display: none;
  }
}
</style>
