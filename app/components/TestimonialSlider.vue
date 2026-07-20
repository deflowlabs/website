<template>
  <section class="testimonials section">
    <div class="container">
      <div class="section-header">
        <span class="badge badge-premium">Trusted By</span>
        <h2>What people are saying</h2>
      </div>

      <div ref="sliderRef" class="testimonials__slider" @mouseenter="pause" @mouseleave="resume">
        <div class="testimonials__track" :style="{ transform: `translateX(-${activeIndex * 100}%)` }">
          <div
            v-for="(t, i) in testimonials"
            :key="i"
            class="testimonials__slide"
          >
            <blockquote class="testimonials__card glass-card">
              <span class="testimonials__quote-mark">"</span>
              <p class="testimonials__text">{{ t.quote }}</p>
              <div class="testimonials__author">
                <div
                  v-if="t.avatar"
                  class="testimonials__avatar"
                  :style="{ backgroundImage: `url(${t.avatar})` }"
                />
                <div class="testimonials__avatar-placeholder" v-else>
                  {{ t.author.charAt(0) }}
                </div>
                <div>
                  <span class="testimonials__name">{{ t.author }}</span>
                  <span class="testimonials__role">
                    {{ t.role }}{{ t.company ? ` · ${t.company}` : '' }}
                  </span>
                </div>
              </div>
            </blockquote>
          </div>
        </div>

        <!-- Navigation -->
        <div class="testimonials__nav">
          <button
            class="testimonials__arrow"
            aria-label="Previous testimonial"
            @click="prev"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div class="testimonials__dots">
            <button
              v-for="(_, i) in testimonials"
              :key="i"
              class="testimonials__dot"
              :class="{ 'testimonials__dot--active': i === activeIndex }"
              :aria-label="`Go to testimonial ${i + 1}`"
              @click="goTo(i)"
            />
          </div>
          <button
            class="testimonials__arrow"
            aria-label="Next testimonial"
            @click="next"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * TestimonialSlider — Auto-rotating carousel of client/partner quotes.
 * Fetches from Sanity CMS, falls back to placeholder testimonials.
 * 5-second auto-rotation, pausable on hover. Swipe support on mobile.
 */
const { sanityFetch } = useSanity()

interface Testimonial {
  quote: string
  author: string
  role?: string
  company?: string
  avatar?: string
}

const TESTIMONIALS_QUERY = `*[_type == "testimonial"] | order(_createdAt desc) {
  quote, author, role, company,
  "avatar": avatar.asset->url
}`

const placeholders: Testimonial[] = [
  {
    quote: 'DeFlow reimagines how institutional settlement should work. Non-custodial, compliant, and transparent.',
    author: 'Sarah Chen',
    role: 'Head of Digital Assets',
    company: 'Meridian Capital',
  },
  {
    quote: 'The Zero-PII architecture is a game-changer. We can verify counterparties without storing any personal data.',
    author: 'Marcus Andersen',
    role: 'CTO',
    company: 'Nordic OTC',
  },
  {
    quote: 'Finally, a settlement layer that understands the needs of institutional trading desks. The fee cascade system alone saved us hours per week.',
    author: 'Elena Vasquez',
    role: 'Managing Director',
    company: 'Atlas Digital',
  },
]

const testimonials = ref<Testimonial[]>(placeholders)
const activeIndex = ref(0)
const sliderRef = ref<HTMLElement | null>(null)
let timer: ReturnType<typeof setInterval> | null = null
let touchStartX = 0

function handleTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0].clientX
}

function handleTouchEnd(e: TouchEvent) {
  const diff = touchStartX - e.changedTouches[0].clientX
  if (Math.abs(diff) > 50) {
    diff > 0 ? next() : prev()
  }
}

onMounted(async () => {
  // Fetch from Sanity
  try {
    const data = await sanityFetch<Testimonial[]>(TESTIMONIALS_QUERY)
    if (data?.length) {
      testimonials.value = data
    }
  } catch {
    // Use placeholders
  }

  startAutoRotation()

  // Touch swipe support via template ref
  if (sliderRef.value) {
    sliderRef.value.addEventListener('touchstart', handleTouchStart, { passive: true })
    sliderRef.value.addEventListener('touchend', handleTouchEnd, { passive: true })
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (sliderRef.value) {
    sliderRef.value.removeEventListener('touchstart', handleTouchStart)
    sliderRef.value.removeEventListener('touchend', handleTouchEnd)
  }
})

function startAutoRotation() {
  timer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % testimonials.value.length
  }, 5000)
}

function pause() {
  if (timer) { clearInterval(timer); timer = null }
}

function resume() {
  if (!timer) startAutoRotation()
}

function next() {
  activeIndex.value = (activeIndex.value + 1) % testimonials.value.length
  resetTimer()
}

function prev() {
  activeIndex.value = (activeIndex.value - 1 + testimonials.value.length) % testimonials.value.length
  resetTimer()
}

function goTo(i: number) {
  activeIndex.value = i
  resetTimer()
}

function resetTimer() {
  pause()
  resume()
}
</script>

<style scoped>
.testimonials__slider {
  position: relative;
  overflow: hidden;
  max-width: 700px;
  margin: 0 auto;
}

.testimonials__track {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.testimonials__slide {
  min-width: 100%;
  padding: 0 1rem;
}

.testimonials__card {
  padding: 2.5rem 2rem;
  position: relative;
  text-align: center;
}

.testimonials__quote-mark {
  position: absolute;
  top: 0.75rem;
  left: 1.5rem;
  font-size: 4rem;
  font-family: Georgia, serif;
  color: rgba(255, 255, 255, 0.06);
  line-height: 1;
  pointer-events: none;
}

.testimonials__text {
  font-size: 1.0625rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.85);
  font-style: italic;
}

.testimonials__author {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.testimonials__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
}

.testimonials__avatar-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--gradient-purple-nebula);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  color: #FFFFFF;
  flex-shrink: 0;
}

.testimonials__name {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #FFFFFF;
}

.testimonials__role {
  display: block;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

/* Navigation */
.testimonials__nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.testimonials__arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.2s ease;
}

.testimonials__arrow:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #FFFFFF;
}

.testimonials__arrow:focus-visible {
  outline: 2px solid var(--color-ring);
  outline-offset: 2px;
}

.testimonials__dots {
  display: flex;
  gap: 0;
}

.testimonials__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 18px;
  background-clip: content-box;
  box-sizing: content-box;
}

.testimonials__dot--active {
  background: #FFFFFF;
  transform: scale(1.2);
}

.testimonials__dot:focus-visible {
  outline: 2px solid var(--color-ring);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .testimonials__track {
    transition: none;
  }
}

@media (max-width: 640px) {
  .testimonials__card {
    padding: 2rem 1.25rem;
  }

  .testimonials__text {
    font-size: 0.9375rem;
  }
}
</style>
