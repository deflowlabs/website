<template>
  <figure v-if="hasImage" class="sanity-image" :style="{ aspectRatio: String(aspectRatio) }">
    <picture>
      <source type="image/avif" :srcset="avifSrcset" :sizes="sizes">
      <source type="image/webp" :srcset="webpSrcset" :sizes="sizes">
      <img
        :src="fallbackUrl"
        :srcset="fallbackSrcset"
        :sizes="sizes"
        :alt="alt"
        :width="displayWidth"
        :height="displayHeight"
        :loading="priority ? 'eager' : 'lazy'"
        :fetchpriority="priority ? 'high' : 'auto'"
        decoding="async"
      >
    </picture>
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
  <div v-else class="sanity-image sanity-image--fallback" :style="{ aspectRatio: String(aspectRatio) }" aria-hidden="true" />
</template>

<script setup lang="ts">
/** Responsive Sanity CDN image that preserves crop/hotspot metadata. */
import imageUrlBuilder from '@sanity/image-url'
import { stegaClean } from '@sanity/client/stega'

interface SanityImageValue {
  asset?: { _id?: string, _ref?: string, url?: string | null, metadata?: { dimensions?: { width?: number | null, height?: number | null } | null } | null } | null
  crop?: { top?: number, bottom?: number, left?: number, right?: number }
  hotspot?: { x?: number, y?: number, height?: number, width?: number }
}

const props = withDefaults(defineProps<{
  image?: SanityImageValue | null
  alt: string
  caption?: string | null
  aspectRatio?: number
  sizes?: string
  priority?: boolean
}>(), {
  aspectRatio: 16 / 9,
  sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority: false,
  caption: null,
  image: null,
})

const config = useRuntimeConfig()
const builder = imageUrlBuilder({
  projectId: config.public.sanityProjectId,
  dataset: config.public.sanityDataset,
})
const widths = [480, 768, 1024, 1280, 1600]
const cleanImage = computed(() => stegaClean(props.image) as SanityImageValue | null | undefined)
const hasImage = computed(() => Boolean(cleanImage.value?.asset?._id || cleanImage.value?.asset?._ref))
const displayWidth = 1600
const displayHeight = computed(() => Math.round(displayWidth / props.aspectRatio))

function imageUrl(width: number, format: 'avif' | 'webp' | 'jpg') {
  if (!cleanImage.value) return ''
  const baseUrl = builder
    .image(cleanImage.value)
    .width(width)
    .height(Math.round(width / props.aspectRatio))
    .fit('crop')
    .quality(format === 'jpg' ? 82 : 78)
    .url()
  const url = new URL(baseUrl)
  url.searchParams.set('fm', format)
  return url.toString()
}

function srcset(format: 'avif' | 'webp' | 'jpg') {
  return widths.map(width => `${imageUrl(width, format)} ${width}w`).join(', ')
}

const avifSrcset = computed(() => srcset('avif'))
const webpSrcset = computed(() => srcset('webp'))
const fallbackSrcset = computed(() => srcset('jpg'))
const fallbackUrl = computed(() => imageUrl(1280, 'jpg'))
</script>

<style scoped>
.sanity-image {
  width: 100%;
  min-width: 0;
  margin: 0;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.18), rgba(139, 92, 246, 0.18));
}

.sanity-image picture,
.sanity-image img {
  display: block;
  width: 100%;
  height: 100%;
}

.sanity-image img {
  object-fit: cover;
}

.sanity-image figcaption {
  padding: 0.5rem 0;
  color: var(--color-muted-fg);
  font-size: 0.8125rem;
}
</style>
