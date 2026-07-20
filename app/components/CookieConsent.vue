<template>
  <Transition name="cookie-slide">
    <div v-if="visible" class="cookie-banner" role="dialog" aria-label="Cookie consent">
      <div class="cookie-banner__content">
        <p>
          We use essential cookies to ensure the site works properly.
          No tracking or analytics cookies are used.
          <NuxtLink to="/legal/privacy" class="cookie-banner__link">Privacy Policy</NuxtLink>
        </p>
        <div class="cookie-banner__actions">
          <button class="cookie-banner__btn cookie-banner__btn--accept" @click="accept">
            Accept
          </button>
          <button class="cookie-banner__btn cookie-banner__btn--decline" @click="decline">
            Decline
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
/**
 * CookieConsent — GDPR/RGPD compliant cookie consent banner.
 *
 * Stores consent state in localStorage. Shows on first visit only.
 * No analytics are loaded until consent is granted.
 * Essential cookies (session, CSRF) are always allowed per GDPR.
 */
const CONSENT_KEY = 'deflow_cookie_consent'

const visible = ref(false)

onMounted(() => {
  const consent = localStorage.getItem(CONSENT_KEY)
  if (!consent) {
    // Show after a short delay to avoid layout shift on load
    setTimeout(() => { visible.value = true }, 1500)
  }
})

function accept() {
  localStorage.setItem(CONSENT_KEY, 'accepted')
  visible.value = false
  // Future: load analytics here
}

function decline() {
  localStorage.setItem(CONSENT_KEY, 'declined')
  visible.value = false
}
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  padding: 1rem;
  pointer-events: none;
}

.cookie-banner__content {
  max-width: 600px;
  margin: 0 auto;
  padding: 1.25rem 1.5rem;
  background: rgba(18, 18, 25, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-card);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  pointer-events: all;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
}

.cookie-banner__content p {
  font-size: 0.8125rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.cookie-banner__link {
  color: #FFFFFF;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.cookie-banner__actions {
  display: flex;
  gap: 0.75rem;
}

.cookie-banner__btn {
  padding: 0.5rem 1.25rem;
  min-height: 44px;
  border-radius: var(--radius-button);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.cookie-banner__btn--accept {
  background: #FFFFFF;
  color: #0B0B14;
}

.cookie-banner__btn--accept:hover {
  background: rgba(255, 255, 255, 0.9);
}

.cookie-banner__btn--decline {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.cookie-banner__btn--decline:hover {
  background: rgba(255, 255, 255, 0.1);
}

.cookie-banner__btn:focus-visible {
  outline: 2px solid var(--color-ring);
  outline-offset: 2px;
}

/* Slide animation */
.cookie-slide-enter-active,
.cookie-slide-leave-active {
  transition: transform 0.4s ease, opacity 0.4s ease;
}

.cookie-slide-enter-from,
.cookie-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .cookie-slide-enter-active,
  .cookie-slide-leave-active {
    transition: none;
  }
}

@media (max-width: 480px) {
  .cookie-banner__content {
    padding: 1rem;
  }

  .cookie-banner__actions {
    flex-direction: column;
  }

  .cookie-banner__btn {
    width: 100%;
    text-align: center;
  }
}
</style>
