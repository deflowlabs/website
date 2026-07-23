<template>
  <div class="waitlist-form">
    <!-- Counter Badge -->
    <div v-if="signupCount > 0" class="waitlist-form__counter badge badge-premium">
      <span class="waitlist-form__counter-dot" />
      {{ signupCount.toLocaleString() }} Currently on Waitlist
    </div>

    <form v-if="!submitted" class="waitlist-form__form" @submit.prevent="handleSubmit">
      <div class="waitlist-form__input-group">
        <input
          id="waitlist-email"
          v-model="email"
          type="email"
          placeholder="Enter your email address"
          required
          autocomplete="email"
          class="waitlist-form__input"
          :disabled="loading"
        />
      </div>

      <!-- Turnstile widget (invisible mode — hidden from UI) -->
      <div ref="turnstileRef" style="display: none;" />

      <button type="submit" class="btn btn-primary" style="width: 100%" :disabled="loading || !agreed || !turnstileToken">
        <span v-if="loading" class="waitlist-form__spinner" />
        {{ loading ? 'Joining...' : 'Join the waitlist' }}
      </button>

      <label class="waitlist-form__checkbox">
        <input v-model="agreed" type="checkbox" required />
        <span>
          I agree to the
          <NuxtLink to="/legal/terms">Terms and Conditions</NuxtLink>
          of DeFlow Labs.
        </span>
      </label>

      <p v-if="error" class="waitlist-form__error">{{ error }}</p>
    </form>

    <!-- Success State -->
    <div v-else class="waitlist-form__success">
      <div class="waitlist-form__success-icon">
        <Icon name="lucide:check" size="20" />
      </div>
      <h3>You're on the list!</h3>
      <p>We'll send you an invitation when your spot opens up.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * WaitlistForm — Email signup with Cloudflare Turnstile bot protection.
 * Stores hashed email in backend (Zero-PII). Shows live counter badge.
 * Turnstile widget renders in managed mode — invisible for most legit users.
 */
const config = useRuntimeConfig()
const email = ref('')
const agreed = ref(false)
const loading = ref(false)
const submitted = ref(false)
const error = ref('')
const signupCount = ref(0)
const turnstileToken = ref('')
const turnstileRef = ref<HTMLElement | null>(null)

// Fetch current waitlist count on mount and initialize Turnstile
onMounted(async () => {
  // Fetch count
  try {
    const data = await $fetch<{ count: number }>('/api/waitlist/count')
    signupCount.value = data.count
  }
  catch {
    // Silently fail — counter is non-critical
  }

  // Load Turnstile script if site key is configured
  if (config.public.turnstileSiteKey) {
    await loadTurnstileScript()
    renderTurnstile()
  }
  else {
    // Dev mode — skip Turnstile, auto-set token
    turnstileToken.value = 'dev-bypass'
  }
})

/**
 * Dynamically loads the Cloudflare Turnstile script.
 * Returns when the script is ready and window.turnstile is available.
 */
function loadTurnstileScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).turnstile) { resolve(); return }
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Turnstile'))
    document.head.appendChild(script)
  })
}

/** Renders the Turnstile widget inside the ref container. */
function renderTurnstile() {
  if (!turnstileRef.value || !(window as any).turnstile) return
  ;(window as any).turnstile.render(turnstileRef.value, {
    sitekey: config.public.turnstileSiteKey,
    theme: 'dark',
    callback: (token: string) => { turnstileToken.value = token },
    'expired-callback': () => { turnstileToken.value = '' },
    'error-callback': () => { turnstileToken.value = '' },
  })
}

/**
 * Submit waitlist signup. Sends email + Turnstile token to server.
 * Server verifies Turnstile, hashes email (Zero-PII), and stores.
 */
async function handleSubmit() {
  if (!email.value || !agreed.value || !turnstileToken.value) return

  loading.value = true
  error.value = ''

  try {
    await $fetch('/api/waitlist', {
      method: 'POST',
      body: {
        email: email.value,
        turnstileToken: turnstileToken.value,
      },
    })

    submitted.value = true
    signupCount.value++
  }
  catch (err: any) {
    error.value = err?.data?.message || 'Something went wrong. Please try again.'
    // Reset Turnstile on failure
    if ((window as any).turnstile && turnstileRef.value) {
      ;(window as any).turnstile.reset(turnstileRef.value)
    }
  }
  finally {
    loading.value = false
  }
}
</script>

<style scoped>
.waitlist-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 440px;
}

.waitlist-form__counter {
  align-self: flex-start;
}

.waitlist-form__counter-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #A78BFA;
  animation: glow-pulse 2s ease-in-out infinite;
}

.waitlist-form__form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.waitlist-form__input-group {
  position: relative;
}

.waitlist-form__input {
  width: 100%;
  min-height: 2.75rem;
  padding: 0.75rem 1rem;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
  color: var(--color-foreground);
  font-family: var(--font-primary);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.waitlist-form__input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.waitlist-form__input:focus {
  border-color: rgba(255, 255, 255, 0.2);
}

.waitlist-form__input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.waitlist-form__checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
}

.waitlist-form__checkbox input[type="checkbox"] {
  margin-top: 2px;
  accent-color: #A78BFA;
}

.waitlist-form__checkbox a {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.waitlist-form__checkbox a:hover {
  color: #FFFFFF;
}

.waitlist-form__error {
  font-size: 0.8125rem;
  color: #F87171;
}

.waitlist-form__spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-top-color: var(--color-primary-fg);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.waitlist-form__success {
  text-align: center;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.waitlist-form__success-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.1);
  border: 2px solid rgba(16, 185, 129, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: #34D399;
}

.waitlist-form__success h3 {
  font-size: 1.125rem;
  color: var(--color-foreground);
}

.waitlist-form__success p {
  font-size: 0.875rem;
  color: var(--color-muted-fg);
}
</style>
