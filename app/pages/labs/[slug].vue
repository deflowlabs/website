<template>
  <article v-if="project" class="project-page">
    <header class="project-hero section">
      <div class="container project-hero__inner">
        <div class="project-hero__content">
          <NuxtLink to="/labs" class="project-back"><Icon name="lucide:arrow-left" size="16" /> Back to Labs</NuxtLink>
          <span class="badge" :class="statusClass">{{ formatStatus(project.status) }}</span>
          <h1>{{ project.title }}</h1>
          <p class="project-summary">{{ project.description }}</p>
          <div v-if="project.partner?.name" class="project-partner">
            <SanityImage
              v-if="project.partner.logo"
              class="project-partner__logo"
              :image="project.partner.logo"
              :alt="project.partner.logo.alt || ''"
              :aspect-ratio="1"
              sizes="36px"
            />
            <div>
            <span>In collaboration with</span>
            <a v-if="safeExternalUrl(clean(project.partner.url))" :href="safeExternalUrl(clean(project.partner.url))" target="_blank" rel="noopener noreferrer">{{ project.partner.name }}</a>
            <strong v-else>{{ project.partner.name }}</strong>
            </div>
          </div>
          <div class="project-actions">
            <a
              v-if="ctaUrl"
              :href="ctaUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn"
              :class="ctaClass"
            >{{ project.cta?.label || 'Open project' }} <Icon name="lucide:arrow-up-right" size="15" /></a>
            <a v-if="publicationUrl && publicationUrl !== ctaUrl" :href="publicationUrl" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">View publication</a>
          </div>
        </div>
        <SanityImage v-if="project.coverImage" class="project-cover" :image="project.coverImage" :alt="project.coverImage.alt || ''" priority />
      </div>
    </header>

    <section class="project-detail section">
      <div class="container project-detail__grid">
        <aside class="project-facts glass-card" aria-label="Project facts">
          <div v-if="project.startDate"><span>Started</span><strong>{{ formatDate(project.startDate) }}</strong></div>
          <div v-if="project.endDate"><span>Completed</span><strong>{{ formatDate(project.endDate) }}</strong></div>
          <div v-if="project.tags?.length"><span>Topics</span><div class="project-tags"><span v-for="tag in project.tags" :key="tag">{{ tag }}</span></div></div>
        </aside>
        <div class="project-body prose">
          <PortableContent v-if="project.body?.length" :value="project.body" />
          <p v-else>{{ project.description }}</p>
        </div>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import { LABS_PROJECT_BY_SLUG_QUERY } from '~/utils/sanity-queries'
import { safeExternalUrl } from '~/utils/safe-url'
import type { LABS_PROJECT_BY_SLUG_QUERY_RESULT } from '~/types/sanity.generated'

const route = useRoute()
const slug = stegaClean(String(route.params.slug))
const visualEditing = useSanityVisualEditingState()
const preview = computed(() => visualEditing?.enabled ?? false)
const params = { slug, preview }
const { data } = await useSanityQuery<LABS_PROJECT_BY_SLUG_QUERY_RESULT>(LABS_PROJECT_BY_SLUG_QUERY, params, { key: `labs-${slug}` })

if (!data.value) throw createError({ statusCode: 404, statusMessage: 'Labs project not found', fatal: true })

const project = computed(() => data.value as NonNullable<LABS_PROJECT_BY_SLUG_QUERY_RESULT>)
function clean<T>(value: T) { return stegaClean(value) as T }
const config = useRuntimeConfig()
const imageUrl = useSanityImageUrl()
const sharingImage = computed(() => imageUrl(project.value.seo?.image || project.value.coverImage) || `${config.public.siteUrl}/og-image.png`)
const ctaUrl = computed(() => safeExternalUrl(clean(project.value.cta?.url)))
const publicationUrl = computed(() => safeExternalUrl(clean(project.value.publicationUrl)))
const ctaClass = computed(() => ({ primary: 'btn-primary', secondary: 'btn-secondary', link: 'project-action--link' }[clean(project.value.cta?.style || 'primary') as string] || 'btn-primary'))
const statusClass = computed(() => ({ active: 'badge-success', upcoming: 'badge-warning', completed: 'badge-info' }[clean(project.value.status || 'upcoming') as string]))
const formatStatus = (status: string | null) => {
  const value = clean(status || 'upcoming')
  return value.charAt(0).toUpperCase() + value.slice(1)
}
const formatDate = (date: string) => new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(new Date(clean(date)))

useHead(() => {
  const title = clean(project.value.seo?.title || project.value.title)
  const description = clean(project.value.seo?.description || project.value.description)
  const url = `${config.public.siteUrl}/labs/${slug}`
  return {
    title: `${title} — DeFlow Labs`,
    meta: [
      { name: 'description', content: description },
      { name: 'robots', content: project.value.seo?.noIndex ? 'noindex, follow' : 'index, follow' },
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: sharingImage.value },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: sharingImage.value },
    ],
    script: [{ type: 'application/ld+json', innerHTML: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'CreativeWork', name: title, description,
      dateCreated: clean(project.value.startDate || ''), dateModified: project.value._updatedAt,
      image: sharingImage.value, url, creator: { '@type': 'Organization', name: 'DeFlow Labs' },
    }) }],
  }
})
useCanonical()
</script>

<style scoped>
.project-hero__inner { display: grid; grid-template-columns: minmax(0, 1fr) minmax(360px, .85fr); align-items: center; gap: 4rem; }
.project-hero__content { display: flex; flex-direction: column; align-items: flex-start; gap: 1rem; }
.project-back { display: flex; align-items: center; gap: .4rem; color: rgba(255,255,255,.5); text-decoration: none; font-size: .8125rem; }
.project-hero h1 { font-size: clamp(2rem, 5vw, 3.5rem); }
.project-summary { max-width: 62ch; font-size: 1rem; line-height: 1.7; }
.project-cover { border-radius: var(--radius-card); }
.project-partner { display: flex; align-items: center; gap: .65rem; color: rgba(255,255,255,.5); font-size: .875rem; }
.project-partner > div { display: flex; flex-direction: column; gap: .15rem; }
.project-partner__logo { width: 36px; border-radius: .4rem; }
.project-partner a, .project-partner strong { color: #fff; }
.project-actions { display: flex; flex-wrap: wrap; gap: .75rem; }
.project-actions .btn { display: inline-flex; align-items: center; gap: .4rem; }
.project-action--link { padding-inline: 0; border-color: transparent; background: transparent; color: #fff; text-decoration: underline; text-underline-offset: 4px; }
.project-detail { padding-top: 0; }
.project-detail__grid { display: grid; grid-template-columns: 240px minmax(0, 720px); gap: 3rem; justify-content: center; align-items: start; }
.project-facts { display: flex; flex-direction: column; gap: 1rem; padding: 1.25rem; }
.project-facts > div { display: flex; flex-direction: column; gap: .25rem; }
.project-facts span { color: rgba(255,255,255,.45); font-size: .75rem; }
.project-tags { display: flex; flex-wrap: wrap; gap: .35rem; }
.project-tags span { padding: .25rem .5rem; border-radius: var(--radius-pill); background: rgba(255,255,255,.05); }
.project-body { line-height: 1.8; }
.prose :deep(h2) { margin: 2.25rem 0 .75rem; font-size: 1.5rem; }
.prose :deep(h3) { margin: 1.75rem 0 .5rem; font-size: 1.25rem; }
.prose :deep(p) { margin-bottom: 1.2rem; color: rgba(255,255,255,.72); }
@media (max-width: 900px) { .project-hero__inner, .project-detail__grid { grid-template-columns: 1fr; gap: 2rem; } .project-facts { order: 2; } }
</style>
