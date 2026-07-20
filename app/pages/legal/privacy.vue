<template>
  <div class="legal-page">
    <section class="section">
      <div class="container">
        <div class="legal-content">
          <h1>Privacy Policy</h1>
          <p class="legal-updated">Last updated: July 2026</p>
          <div class="legal-body">
            <p>
              DeFlow Labs is committed to protecting your privacy. This policy describes
              how we collect, use, and protect information when you use the DeFlow platform.
            </p>
            <h3>Zero-PII Architecture</h3>
            <p>
              DeFlow uses a Zero-PII (Personally Identifiable Information) architecture.
              Your identity is verified through our KYC/AML partner but personal data
              (emails, names) are never stored in our database. We use HMAC-SHA256 hashing
              to create irreversible identifiers — raw PII is discarded at the authentication edge.
            </p>
            <p style="color: rgba(255,255,255,0.5); font-style: italic; margin-top: 2rem">
              Full privacy policy will be published prior to launch.
              Please contact <a href="mailto:contact@deflowlabs.io">contact@deflowlabs.io</a> for inquiries.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Privacy Policy — DeFlow Labs' })
</script>

<style scoped>
.legal-content { max-width: 720px; }
.legal-content h1 { margin-bottom: 0.5rem; font-size: clamp(1.75rem, 3vw, 2.25rem); }
.legal-updated { font-size: 0.8125rem; color: rgba(255,255,255,0.5); margin-bottom: 2rem; }
.legal-body { font-size: 1rem; line-height: 1.8; }
.legal-body h3 { margin-top: 2rem; margin-bottom: 0.75rem; }
.legal-body p { color: rgba(255,255,255,0.7); margin-bottom: 1rem; }
.legal-body a { color: var(--color-foreground); text-decoration: underline; text-underline-offset: 2px; }
</style>
