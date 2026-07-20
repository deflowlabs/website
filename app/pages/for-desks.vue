<template>
  <div class="for-desks">
    <!-- Hero -->
    <section class="desks-hero section">
      <div class="desks-hero__bg-glow" />
      <div class="container">
        <div class="section-header">
          <span class="badge badge-premium">White-Label Infrastructure</span>
          <h1>
            Your branded settlement<br />
            <span class="gradient-text">infrastructure</span>.
          </h1>
          <p>
            Deploy a fully compliant OTC settlement platform under your brand.
            Non-custodial escrow, identity verification, and revenue management — out of the box.
          </p>
        </div>
        <div class="desks-hero__actions">
          <NuxtLink to="/contact" class="btn btn-primary btn-lg">
            Request a Demo
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </NuxtLink>
          <NuxtLink to="/product" class="btn btn-secondary btn-lg">
            Explore Product
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Module Grid -->
    <section class="desks-modules section">
      <div class="container">
        <div class="section-header">
          <span class="badge badge-info">Core Modules</span>
          <h2>Everything your desk needs</h2>
          <p>Four integrated modules that cover the full OTC settlement lifecycle.</p>
        </div>
        <div class="desks-modules__grid">
          <div v-for="mod in modules" :key="mod.title" class="desks-module glass-card">
            <div class="desks-module__icon" :style="{ background: mod.bg }">
              <span>{{ mod.icon }}</span>
            </div>
            <h3>{{ mod.title }}</h3>
            <p>{{ mod.desc }}</p>
            <ul class="desks-module__features">
              <li v-for="feat in mod.features" :key="feat">{{ feat }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Who is it for -->
    <section class="desks-audience section">
      <div class="container">
        <div class="section-header">
          <span class="badge badge-premium">Built For</span>
          <h2>Who is DeFlow for?</h2>
        </div>
        <div class="desks-audience__grid">
          <div v-for="aud in audiences" :key="aud.title" class="desks-audience__card glass-card">
            <span class="desks-audience__icon">{{ aud.icon }}</span>
            <h3>{{ aud.title }}</h3>
            <p>{{ aud.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tech Stack Strip -->
    <section class="desks-stack section">
      <div class="container">
        <p class="desks-stack__label">POWERED BY</p>
        <div class="desks-stack__logos">
          <span v-for="tech in techStack" :key="tech" class="desks-stack__logo">{{ tech }}</span>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="desks-cta section">
      <div class="container">
        <div class="desks-cta__card glass-card">
          <h2>Ready to launch your desk?</h2>
          <p>Get started with a personalized demo. Our team will walk you through the full platform.</p>
          <NuxtLink to="/contact" class="btn btn-primary btn-lg">
            Request a Demo
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
/**
 * "For Desks" B2B landing page — targeting institutional trading desks.
 * Module grid, audience targeting, tech stack, and demo CTA.
 */
import { useStructuredData, ORGANIZATION_SCHEMA } from '~/composables/useStructuredData'
useHead({
  title: 'For Desks — DeFlow Labs',
  meta: [
    { name: 'description', content: 'Deploy a fully compliant OTC settlement platform under your brand with DeFlow white-label infrastructure.' },
  ],
})

useStructuredData(ORGANIZATION_SCHEMA)

const modules = [
  {
    title: 'Deal Management',
    icon: '📋',
    bg: 'var(--gradient-purple-nebula)',
    desc: 'Create, track, and settle OTC deals with full lifecycle management.',
    features: ['Multi-party deal rooms', 'Real-time status tracking', 'Automated fee calculation', 'Audit trail'],
  },
  {
    title: 'Identity & Compliance',
    icon: '🛡️',
    bg: 'var(--gradient-blue-nebula)',
    desc: 'KYC/AML verification with zero personal data stored in your database.',
    features: ['L1/L2/L3 verification tiers', 'Sanctions screening (OFAC/EU/UN)', 'Wallet screening via Scorechain', 'Zero-PII architecture'],
  },
  {
    title: 'Smart Escrow',
    icon: '🔐',
    bg: 'var(--gradient-green-live)',
    desc: 'Non-custodial programmable settlement with on-chain finality.',
    features: ['ERC-4337 smart accounts', 'Programmable release conditions', '6-block finality confirmation', 'Transparent on-chain audit'],
  },
  {
    title: 'Revenue Engine',
    icon: '💎',
    bg: 'var(--gradient-amber-trust)',
    desc: 'Automated fee cascading, commissions, discounts, and referral payouts.',
    features: ['Platform + desk + broker fees', 'VIP tier-based discounts', 'Dual-bucket referral system', 'Real-time revenue analytics'],
  },
]

const audiences = [
  { title: 'OTC Desks', icon: '🏢', desc: 'High-volume bilateral trading with institutional-grade settlement and compliance.' },
  { title: 'Brokerages', icon: '📊', desc: 'Multi-tier fee structures and white-label branding for your brokerage clients.' },
  { title: 'Fund Administrators', icon: '🏦', desc: 'Transparent settlement and audit trails for fund operations and LP reporting.' },
  { title: 'Market Makers', icon: '⚡', desc: 'Automated settlement infrastructure with programmatic API access and low latency.' },
]

const techStack = ['Ethereum', 'Safe{Wallet}', 'Privy', 'Google Cloud', 'Drizzle ORM', 'NestJS']
</script>

<style scoped>
/* Hero */
.desks-hero {
  position: relative;
  padding: 8rem 0 4rem;
  overflow: hidden;
}

.desks-hero__bg-glow {
  position: absolute;
  top: -200px;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 600px;
  background: radial-gradient(ellipse, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

.desks-hero__actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

/* Module Grid */
.desks-modules__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.desks-module {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.desks-module__icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-icon);
  font-size: 1.25rem;
}

.desks-module h3 {
  font-size: 1.25rem;
  font-weight: 600;
}

.desks-module p {
  font-size: 0.875rem;
  color: var(--color-muted-fg);
  line-height: 1.6;
}

.desks-module__features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-top: 0.5rem;
}

.desks-module__features li {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.55);
  padding-left: 1.25rem;
  position: relative;
}

.desks-module__features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #22C55E;
  font-size: 0.75rem;
}

/* Audience */
.desks-audience__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.desks-audience__card {
  padding: 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.desks-audience__icon {
  font-size: 2rem;
}

.desks-audience__card h3 {
  font-size: 1rem;
  font-weight: 600;
}

.desks-audience__card p {
  font-size: 0.8125rem;
  color: var(--color-muted-fg);
  line-height: 1.5;
}

/* Tech Stack */
.desks-stack {
  text-align: center;
}

.desks-stack__label {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 1.5rem;
}

.desks-stack__logos {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.desks-stack__logo {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.02em;
}

/* CTA */
.desks-cta__card {
  padding: 4rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.desks-cta__card h2 {
  font-size: 2rem;
  font-weight: 700;
}

.desks-cta__card p {
  font-size: 1rem;
  color: var(--color-muted-fg);
  max-width: 480px;
}

/* Responsive */
@media (max-width: 1024px) {
  .desks-audience__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .desks-modules__grid {
    grid-template-columns: 1fr;
  }

  .desks-audience__grid {
    grid-template-columns: 1fr;
  }

  .desks-hero__actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
