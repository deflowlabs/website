<template>
  <div class="legal-page">
    <section class="section">
      <div class="container">
        <div class="legal-content">
          <h1>Risk Disclosure</h1>
          <p class="legal-updated">Last updated: July 2026</p>
          <div class="legal-body">
            <p>
              Digital asset trading involves significant risk. This disclosure outlines the
              risks associated with using the DeFlow platform.
            </p>
            <p style="color: rgba(255,255,255,0.5); font-style: italic; margin-top: 2rem">
              Full risk disclosure will be published prior to launch.
              Please contact <a href="mailto:contact@deflowlabs.io">contact@deflowlabs.io</a> for inquiries.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Risk Disclosure — DeFlow Labs' })
</script>

<style scoped>
.legal-content { max-width: 720px; }
.legal-content h1 { margin-bottom: 0.5rem; font-size: clamp(1.75rem, 3vw, 2.25rem); }
.legal-updated { font-size: 0.8125rem; color: rgba(255,255,255,0.5); margin-bottom: 2rem; }
.legal-body { font-size: 1rem; line-height: 1.8; }
.legal-body p { color: rgba(255,255,255,0.7); margin-bottom: 1rem; }
.legal-body a { color: var(--color-foreground); text-decoration: underline; text-underline-offset: 2px; }
</style>
