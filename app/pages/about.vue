<template>
  <div class="about-page">
    <section class="about-hero section">
      <div class="container">
        <div class="section-header">
          <span class="badge badge-premium">Company</span>
          <h1>Building the settlement<br />infrastructure of tomorrow</h1>
          <p>
            DeFlow Labs is on a mission to make institutional digital asset
            settlement non-custodial, compliant, and programmable.
          </p>
        </div>
      </div>
    </section>

    <!-- Mission & Values -->
    <section class="about-values section">
      <div class="container">
        <div class="about-values__grid">
          <div v-for="value in values" :key="value.title" class="about-values__card glass-card">
            <div class="about-values__icon-wrap">
              <Icon :name="value.icon" size="22" />
            </div>
            <h3>{{ value.title }}</h3>
            <p>{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Numbers -->
    <section class="about-numbers section">
      <div class="container">
        <div class="section-header">
          <h2>By the numbers</h2>
          <p>Engineering-first, from day one.</p>
        </div>
        <div class="about-numbers__grid">
          <div v-for="num in numbers" :key="num.label" class="about-numbers__item">
            <span class="about-numbers__value font-mono">{{ num.value }}</span>
            <span class="about-numbers__label">{{ num.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section">
      <div class="container" style="text-align: center">
        <h2>Join us on this journey</h2>
        <p style="color: var(--color-muted-fg); margin: 1rem 0 2rem">
          We're building the future of institutional settlement.
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap">
          <NuxtLink to="/waitlist" class="btn btn-primary btn-lg">Join the Waitlist</NuxtLink>
          <NuxtLink to="/contact" class="btn btn-secondary btn-lg">Contact Us</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Company — DeFlow Labs',
  meta: [
    { name: 'description', content: 'Learn about DeFlow Labs — our mission, values, and the team building the institutional settlement layer for digital assets.' },
  ],
})

const values = [
  {
    icon: 'lucide:lock',
    title: 'Non-Custodial by Default',
    description: 'We believe your assets should always remain under your control. Smart contracts, not intermediaries, hold funds during settlement.',
  },
  {
    icon: 'lucide:eye-off',
    title: 'Privacy First',
    description: 'Zero-PII architecture means we verify your identity without ever storing your personal data. What we don\'t have, can\'t be breached.',
  },
  {
    icon: 'lucide:scale',
    title: 'Compliance Without Compromise',
    description: 'Full identity verification with tiered checks. We meet regulatory requirements while protecting privacy through cryptographic hashing.',
  },
  {
    icon: 'lucide:flask-conical',
    title: 'Research-Driven',
    description: 'DeFlow Labs collaborates with top universities and PhD researchers. Our technology is grounded in academic rigor and peer-reviewed research.',
  },
  {
    icon: 'lucide:globe',
    title: 'Open & Transparent',
    description: 'On-chain settlement means every transaction is verifiable. Event sourcing ensures a complete, immutable audit trail.',
  },
  {
    icon: 'lucide:accessibility',
    title: 'Accessible to All',
    description: 'WCAG 2 AA compliant. We build for everyone, regardless of ability, device, or connection speed.',
  },
]

const numbers = [
  { value: '25+', label: 'Backend Modules' },
  { value: '48+', label: 'Database Tables' },
  { value: '3', label: 'Smart Contracts' },
  { value: '14', label: 'CI/CD Workflows' },
  { value: '11', label: 'Architecture Decisions' },
  { value: '0', label: 'PII Stored' },
]
</script>

<style scoped>
.about-hero h1 {
  font-size: clamp(2rem, 4vw, 3rem);
}

.about-values__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.about-values__card {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.about-values__icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-icon);
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
}

.about-values__card p {
  font-size: 0.875rem;
  line-height: 1.6;
}

.about-numbers__grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 2rem;
}

.about-numbers__item {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.about-numbers__value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-foreground);
}

.about-numbers__label {
  font-size: 0.6875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-muted-fg);
}

@media (max-width: 768px) {
  .about-values__grid {
    grid-template-columns: 1fr;
  }

  .about-numbers__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
