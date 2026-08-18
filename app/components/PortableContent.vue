<template>
  <div class="portable-content">
    <PortableText :value="value" :components="components" />
  </div>
</template>

<script setup lang="ts">
/**
 * Accessible renderer for the Portable Text subset supported by DeFlow.
 * Unknown or incomplete media degrades to visible status text instead of
 * producing broken images or unsafe links.
 */
import { h } from 'vue'
import { PortableText, type PortableTextComponents } from '@portabletext/vue'
import type { TypedObject } from '@portabletext/types'

interface ImageValue {
  url?: string
  alt?: string
  caption?: string
}

interface CodeValue {
  code?: string
  language?: string
  filename?: string
}

interface LinkValue {
  href?: string
}

defineProps<{ value: TypedObject[] }>()

function safeHref(value?: string) {
  if (!value) return undefined
  try {
    const url = new URL(value, 'https://deflowlabs.io')
    return ['http:', 'https:', 'mailto:'].includes(url.protocol) ? value : undefined
  } catch {
    return undefined
  }
}

const components: PortableTextComponents = {
  types: {
    imageWithAlt: ({ value }) => {
      const image = value as ImageValue
      if (!image.url || !image.alt) return h('p', { role: 'status' }, 'Image unavailable.')
      return h('figure', [
        h('img', { src: image.url, alt: image.alt, loading: 'lazy', decoding: 'async' }),
        image.caption ? h('figcaption', image.caption) : null,
      ])
    },
    code: ({ value }) => {
      const block = value as CodeValue
      return h('figure', { class: 'code-block' }, [
        block.filename ? h('figcaption', block.filename) : null,
        h('pre', { tabindex: '0', 'aria-label': block.language ? `${block.language} code` : 'Code sample' }, [
          h('code', { class: block.language ? `language-${block.language}` : undefined }, block.code || ''),
        ]),
      ])
    },
  },
  marks: {
    externalLink: ({ value }, { slots }) => {
      const href = safeHref((value as LinkValue | undefined)?.href)
      if (!href) return h('span', slots.default?.())
      const external = /^https?:\/\//.test(href)
      return h('a', { href, target: external ? '_blank' : undefined, rel: external ? 'noopener noreferrer' : undefined }, slots.default?.())
    },
  },
}
</script>

<style scoped>
.portable-content :deep(figcaption) {
  margin-top: 0.5rem;
  color: var(--color-muted-fg);
  font-size: 0.8125rem;
}

.portable-content :deep(.code-block) {
  margin: 1.5rem 0;
}

.portable-content :deep(pre:focus-visible) {
  outline: 2px solid var(--color-ring);
  outline-offset: 2px;
}
</style>
