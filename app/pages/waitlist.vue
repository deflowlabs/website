<template>
  <div class="waitlist-page">
    <section class="waitlist-page__hero section">
      <div class="container">
        <div class="waitlist-page__content">
          <h1>Get Early Access to DeFlow</h1>
          <p>
            Enter your email to join the waitlist and gain early access to
            DeFlow. Invitations will be sent on a first-come, first-served
            basis starting Q4 2026.
          </p>
          <WaitlistForm />
          <p class="waitlist-page__footer-note">
            © {{ currentYear }} DeFlow Labs. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Join the Waitlist — DeFlow Labs',
  meta: [
    { name: 'description', content: 'Sign up for early access to DeFlow — the institutional settlement layer for digital asset dealflows.' },
  ],
})

const currentYear = new Date().getFullYear()
</script>

<style scoped>
.waitlist-page__hero {
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: center;
}

.waitlist-page__content {
  max-width: 480px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.waitlist-page__content h1 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
}

.waitlist-page__content > p {
  font-size: 0.9375rem;
  color: var(--color-muted-fg);
  line-height: 1.7;
}

.waitlist-page__footer-note {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 2rem;
}
</style>
