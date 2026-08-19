<template>
  <Transition name="slide-up">
    <div
      v-if="announcement && !isDismissed"
      ref="bannerElement"
      class="announcement"
      :class="toneClass"
      :data-sanity="encodeDataAttribute('text')"
      role="banner"
      aria-label="Website announcement"
    >
      <div class="announcement__inner container">
        <span class="announcement__dot" aria-hidden="true" />
        <p class="announcement__text">{{ announcement.text }}</p>
        <a
          v-if="announcementUrl && announcement.cta?.label"
          :href="announcementUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="announcement__cta"
          :class="ctaClass"
        >
          {{ announcement.cta.label }}
          <Icon name="lucide:arrow-up-right" size="13" aria-hidden="true" />
        </a>
        <button class="announcement__dismiss" type="button" aria-label="Dismiss announcement" @click="dismiss">
          <Icon name="lucide:x" size="16" aria-hidden="true" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
/** Client-fetched banner, intentionally excluded from every ISR page payload. */
import { stegaClean } from '@sanity/client/stega'
import { ACTIVE_ANNOUNCEMENT_QUERY } from '~/utils/sanity-queries'
import type { ACTIVE_ANNOUNCEMENT_QUERY_RESULT } from '~/types/sanity.generated'
import { safeExternalUrl } from '~/utils/safe-url'

const emit = defineEmits<{ 'height-change': [height: number] }>()
const visualEditing = useSanityVisualEditingState()
const preview = computed(() => visualEditing?.enabled ?? false)
const params = { preview }
const { data: announcement, encodeDataAttribute } = await useSanityQuery<ACTIVE_ANNOUNCEMENT_QUERY_RESULT>(
  ACTIVE_ANNOUNCEMENT_QUERY,
  params,
  { key: 'active-website-banner' },
)

function clean<T>(value: T) { return stegaClean(value) as T }
const isDismissed = ref(false)
const bannerElement = ref<HTMLElement | null>(null)
const dismissalKey = computed(() => announcement.value
  ? `deflow-banner-dismissed-${announcement.value._id}-${announcement.value._rev}`
  : '')
const announcementUrl = computed(() => safeExternalUrl(clean(announcement.value?.cta?.url)))
const toneClass = computed(() => {
  const tone = clean(announcement.value?.tone || 'info')
  return ['info', 'success', 'warning'].includes(tone) ? `announcement--${tone}` : 'announcement--info'
})
const ctaClass = computed(() => {
  const style = clean(announcement.value?.cta?.style || 'link')
  return ['primary', 'secondary', 'link'].includes(style) ? `announcement__cta--${style}` : 'announcement__cta--link'
})

watch(announcement, data => {
  isDismissed.value = Boolean(data && sessionStorage.getItem(dismissalKey.value) === 'true')
}, { immediate: true })

let observer: ResizeObserver | undefined
watch(bannerElement, element => {
  observer?.disconnect()
  if (!element) {
    emit('height-change', 0)
    return
  }
  observer = new ResizeObserver(entries => emit('height-change', Math.ceil(entries[0]?.contentRect.height || 0)))
  observer.observe(element)
  emit('height-change', Math.ceil(element.getBoundingClientRect().height))
}, { flush: 'post' })
onUnmounted(() => { observer?.disconnect(); emit('height-change', 0) })

function dismiss() {
  if (dismissalKey.value) sessionStorage.setItem(dismissalKey.value, 'true')
  isDismissed.value = true
  emit('height-change', 0)
}
</script>

<style scoped>
.announcement { position: fixed; inset: 0 0 auto; z-index: 101; border-bottom: 1px solid rgba(255,255,255,.1); }
.announcement--info { background: #1e293b; }
.announcement--success { background: #14532d; }
.announcement--warning { background: #713f12; }
.announcement__inner { display: flex; align-items: center; justify-content: center; gap: .65rem; min-height: 42px; padding-block: .45rem; padding-inline: 3rem; }
.announcement__dot { width: 6px; height: 6px; flex: 0 0 auto; border-radius: 50%; background: #fff; opacity: .8; }
.announcement__text { margin: 0; color: rgba(255,255,255,.9); font-size: .8125rem; font-weight: 500; line-height: 1.4; text-align: center; }
.announcement__cta { display: inline-flex; align-items: center; flex: 0 0 auto; gap: .25rem; border-radius: var(--radius-pill); color: #fff; font-size: .75rem; font-weight: 600; text-decoration: none; }
.announcement__cta--primary { padding: .3rem .65rem; background: #fff; color: #181820; }
.announcement__cta--secondary { padding: .3rem .65rem; border: 1px solid rgba(255,255,255,.35); background: rgba(255,255,255,.08); }
.announcement__cta--link { text-decoration: underline; text-underline-offset: 3px; }
.announcement__cta:focus-visible, .announcement__dismiss:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
.announcement__dismiss { position: absolute; right: 1rem; display: grid; place-items: center; padding: .3rem; border: 0; border-radius: .25rem; background: transparent; color: rgba(255,255,255,.7); cursor: pointer; }
.announcement__dismiss:hover { background: rgba(255,255,255,.1); color: #fff; }
.slide-up-leave-active { transition: opacity .2s ease, transform .2s ease; }
.slide-up-leave-to { opacity: 0; transform: translateY(-100%); }
@media (max-width: 640px) {
  .announcement__inner { align-items: flex-start; justify-content: flex-start; flex-wrap: wrap; gap: .35rem .5rem; padding-inline: 1rem 3rem; }
  .announcement__text { flex: 1 1 calc(100% - 1rem); text-align: left; }
  .announcement__cta { margin-left: .9rem; }
  .announcement__dismiss { top: .45rem; }
}
@media (prefers-reduced-motion: reduce) { .slide-up-leave-active { transition: none; } }
</style>
