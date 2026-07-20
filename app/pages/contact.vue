<template>
  <div class="contact-page">
    <section class="contact-hero section">
      <div class="container">
        <div class="contact-inner">
          <div class="contact-info">
            <span class="badge badge-info">Contact</span>
            <h1>Get in touch</h1>
            <p>
              Whether you're interested in partnerships, investment, research
              collaboration, or have a general inquiry — we'd love to hear from you.
            </p>
            <div class="contact-channels">
              <div class="contact-channel">
                <span class="contact-channel__icon">✉️</span>
                <div>
                  <h4>Email</h4>
                  <a href="mailto:contact@deflowlabs.io">contact@deflowlabs.io</a>
                </div>
              </div>
              <div class="contact-channel">
                <span class="contact-channel__icon">💼</span>
                <div>
                  <h4>LinkedIn</h4>
                  <a href="https://linkedin.com/company/deflowlabs" target="_blank" rel="noopener">DeFlow Labs</a>
                </div>
              </div>
              <div class="contact-channel">
                <span class="contact-channel__icon">🐙</span>
                <div>
                  <h4>GitHub</h4>
                  <a href="https://github.com/DeFlowLabs" target="_blank" rel="noopener">DeFlowLabs</a>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="contact-form-wrapper glass-card">
            <form v-if="!submitted" class="contact-form" @submit.prevent="handleSubmit">
              <div class="contact-form__field">
                <label for="contact-name">Full Name *</label>
                <input id="contact-name" v-model="form.name" type="text" required placeholder="John Doe" />
              </div>

              <div class="contact-form__field">
                <label for="contact-email">Email *</label>
                <input id="contact-email" v-model="form.email" type="email" required placeholder="john@company.com" />
              </div>

              <div class="contact-form__field">
                <label for="contact-company">Company / Organization</label>
                <input id="contact-company" v-model="form.company" type="text" placeholder="Acme Capital" />
              </div>

              <div class="contact-form__field">
                <label for="contact-type">Inquiry Type *</label>
                <select id="contact-type" v-model="form.type" required>
                  <option value="" disabled>Select inquiry type</option>
                  <option v-for="t in inquiryTypes" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>

              <div class="contact-form__field">
                <label for="contact-message">Message *</label>
                <textarea id="contact-message" v-model="form.message" required rows="5" placeholder="Tell us more..." />
              </div>

              <!-- Turnstile widget (managed mode — invisible for most users) -->
              <div ref="turnstileRef" class="contact-form__turnstile" />

              <button type="submit" class="btn btn-primary" style="width: 100%" :disabled="loading || !turnstileToken">
                {{ loading ? 'Sending...' : 'Send Message' }}
              </button>

              <p v-if="error" class="contact-form__error">{{ error }}</p>
            </form>

            <div v-else class="contact-form__success">
              <div class="contact-form__success-icon">✓</div>
              <h3>Message sent!</h3>
              <p>We'll get back to you within 24-48 hours.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
/**
 * Contact page — multi-category form with Turnstile bot protection.
 * Sends notification email via Resend. All user input is HTML-escaped server-side.
 */
const config = useRuntimeConfig()

useHead({
  title: 'Contact — DeFlow Labs',
  meta: [
    { name: 'description', content: 'Get in touch with DeFlow Labs for partnerships, investment, research collaborations, or general inquiries.' },
  ],
})

const inquiryTypes = [
  'General Inquiry',
  'Partnership / Integration',
  'Investment / Business Development',
  'Labs / Research Collaboration',
  'Press / Media',
  'Support',
]

const form = reactive({
  name: '',
  email: '',
  company: '',
  type: '',
  message: '',
})

const loading = ref(false)
const submitted = ref(false)
const error = ref('')
const turnstileToken = ref('')
const turnstileRef = ref<HTMLElement | null>(null)

// Initialize Turnstile on mount
onMounted(async () => {
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

async function handleSubmit() {
  loading.value = true
  error.value = ''

  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: { ...form, turnstileToken: turnstileToken.value },
    })
    submitted.value = true
  }
  catch (err: any) {
    error.value = err?.data?.message || 'Failed to send message. Please try again.'
  }
  finally {
    loading.value = false
  }
}
</script>

<style scoped>
.contact-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: flex-start;
}

.contact-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  padding-top: 2rem;
}

.contact-info h1 {
  font-size: clamp(2rem, 4vw, 2.75rem);
}

.contact-channels {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 1.5rem;
}

.contact-channel {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.contact-channel__icon {
  font-size: 1.25rem;
  margin-top: 2px;
}

.contact-channel h4 {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
}

.contact-channel a {
  font-size: 0.875rem;
  color: var(--color-foreground);
  text-decoration: none;
}

.contact-channel a:hover {
  text-decoration: underline;
  text-underline-offset: 2px;
}

.contact-form-wrapper {
  padding: 2rem;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.contact-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.contact-form__field label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
}

.contact-form__field input,
.contact-form__field select,
.contact-form__field textarea {
  width: 100%;
  padding: 0.625rem 0.875rem;
  background: var(--color-obsidian);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
  color: var(--color-foreground);
  font-family: var(--font-primary);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.contact-form__field input:focus,
.contact-form__field select:focus,
.contact-form__field textarea:focus {
  border-color: rgba(255, 255, 255, 0.2);
}

.contact-form__field input::placeholder,
.contact-form__field textarea::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.contact-form__field select {
  appearance: none;
  cursor: pointer;
}

.contact-form__field textarea {
  resize: vertical;
  min-height: 120px;
}

.contact-form__error {
  font-size: 0.8125rem;
  color: #F87171;
}

.contact-form__success {
  text-align: center;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.contact-form__success-icon {
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

.contact-form__success h3 {
  color: var(--color-foreground);
}

.contact-form__success p {
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .contact-inner {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
