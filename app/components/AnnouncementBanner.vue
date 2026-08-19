<template>
  <Transition name="slide-up">
    <div
      v-if="announcement && !isDismissed"
      class="announcement"
      :class="`announcement--${announcement.tone || 'info'}`"
      :data-sanity="encodeDataAttribute('text')"
      role="banner"
      aria-label="Announcement"
    >
      <div class="announcement__inner container">
        <component
          :is="announcementUrl ? 'a' : 'span'"
          :href="announcementUrl"
          :target="announcementUrl ? '_blank' : undefined"
          :rel="announcementUrl ? 'noopener noreferrer' : undefined"
          class="announcement__content"
        >
          <span class="announcement__dot" />
          <span class="announcement__text">{{ announcement.text }}</span>
          <span v-if="announcement.cta?.label" class="announcement__cta">
            {{ announcement.cta.label }}
          </span>
        </component>
        <button
          class="announcement__dismiss"
          aria-label="Dismiss announcement"
          @click="dismiss"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
/**
 * AnnouncementBanner — Persistent dark banner above the navbar.
 * Fetches active announcement from Sanity CMS.
 * Dismissible per-session via sessionStorage keyed by announcement ID.
 *
 * Emits `visibility-change` to parent layout for padding/offset coordination.
 */
import { ACTIVE_ANNOUNCEMENT_QUERY } from '~/utils/sanity-queries'
import type { ACTIVE_ANNOUNCEMENT_QUERY_RESULT } from '~/types/sanity.generated'
import { safeExternalUrl } from '~/utils/safe-url'

const emit = defineEmits<{
  'visibility-change': [visible: boolean]
}>()

const visualEditing = useSanityVisualEditingState()
const previewParams = reactive({ preview: visualEditing?.enabled ?? false })
const {
  data: announcement,
  encodeDataAttribute,
} = await useSanityQuery<ACTIVE_ANNOUNCEMENT_QUERY_RESULT>(ACTIVE_ANNOUNCEMENT_QUERY, previewParams)

const isDismissed = ref(false)
const announcementUrl = computed(() => safeExternalUrl(announcement.value?.cta?.url))

// Emit visibility state whenever it changes
const isVisible = computed(() => !!announcement.value && !isDismissed.value)
watch(isVisible, (val) => emit('visibility-change', val), { immediate: true })

watch(
  () => visualEditing?.enabled,
  enabled => { previewParams.preview = enabled ?? false },
)

watch(announcement, (data) => {
  if (!import.meta.client || !data) return
  const key = `deflow-announcement-dismissed-${data._id}`
  isDismissed.value = sessionStorage.getItem(key) === 'true'
}, { immediate: true })

/**
 * Dismiss the banner for the current session.
 * Stores dismissal state in sessionStorage keyed by announcement ID.
 */
function dismiss() {
  if (announcement.value) {
    sessionStorage.setItem(
      `deflow-announcement-dismissed-${announcement.value._id}`,
      'true',
    )
  }
  isDismissed.value = true
}
</script>

<style scoped>
.announcement {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 101;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.announcement--info { background: #1e293b; }
.announcement--success { background: #14532d; }
.announcement--warning { background: #713f12; }

.announcement__inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  height: 40px;
  position: relative;
}

.announcement__content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.8125rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

a.announcement__content:hover {
  color: #FFFFFF;
}

.announcement__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22C55E;
  flex-shrink: 0;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.announcement__text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.announcement__cta {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  white-space: nowrap;
  text-decoration: underline;
  text-underline-offset: 2px;
}

a.announcement__content:hover .announcement__cta {
  color: #FFFFFF;
}

.announcement__dismiss {
  position: absolute;
  right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.announcement__dismiss:hover {
  color: #FFFFFF;
  background: rgba(255, 255, 255, 0.1);
}

.announcement__dismiss:focus-visible {
  outline: 2px solid var(--color-ring);
  outline-offset: 2px;
}

/* Transition */
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

/* Responsive */
@media (max-width: 768px) {
  .announcement__inner {
    padding: 0 2.5rem 0 1rem;
  }

  .announcement__text {
    max-width: 200px;
  }

  .announcement__cta {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .announcement__dot {
    animation: none;
  }
}
</style>
