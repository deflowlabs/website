<template>
  <div class="for-institutions">
    <!-- Hero -->
    <section class="inst-hero section">
      <div class="inst-hero__bg-glow" />
      <div class="container">
        <div class="section-header">
          <span class="badge badge-premium">White-Label Infrastructure</span>
          <h1>
            Your branded settlement<br />
            <span class="gradient-text">infrastructure</span>.
          </h1>
          <p>
            Deploy a fully compliant settlement platform under your brand.
            Non-custodial escrow, identity verification, and revenue management
            for banks, desks, funds, and asset managers.
          </p>
        </div>
        <div class="inst-hero__actions">
          <NuxtLink to="/contact" class="btn btn-primary btn-lg">
            Request a Demo
            <Icon name="lucide:chevron-right" size="16" />
          </NuxtLink>
          <NuxtLink to="/product" class="btn btn-secondary btn-lg">
            Platform Overview
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Module Grid -->
    <section class="inst-modules section">
      <div class="container">
        <div class="section-header">
          <span class="badge badge-info">Core Modules</span>
          <h2>Everything your institution needs</h2>
          <p>Four integrated modules that cover the full settlement lifecycle.</p>
        </div>
        <div class="inst-modules__grid">
          <div v-for="mod in modules" :key="mod.title" class="inst-module glass-card">
            <div class="inst-module__icon" :style="{ background: mod.bg }">
              <Icon :name="mod.icon" size="20" />
            </div>
            <h3>{{ mod.title }}</h3>
            <p>{{ mod.desc }}</p>
            <ul class="inst-module__features">
              <li v-for="feat in mod.features" :key="feat">{{ feat }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Who is it for -->
    <section class="inst-audience section">
      <div class="container">
        <div class="section-header">
          <span class="badge badge-premium">Built For</span>
          <h2>Who is DeFlow for?</h2>
          <p>Banks, desks, funds, and any institution that settles high-value digital asset deals.</p>
        </div>
        <div class="inst-audience__grid">
          <div v-for="aud in audiences" :key="aud.title" class="inst-audience__card glass-card">
            <div class="inst-audience__icon-wrap">
              <Icon :name="aud.icon" size="24" />
            </div>
            <h3>{{ aud.title }}</h3>
            <p>{{ aud.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tech Stack Strip -->
    <section class="inst-stack section">
      <div class="container">
        <p class="inst-stack__label">POWERED BY</p>
        <div class="inst-stack__logos">
          <span v-for="tech in techStack" :key="tech" class="inst-stack__logo">{{ tech }}</span>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="inst-cta section">
      <div class="container">
        <div class="inst-cta__card glass-card">
          <h2>Ready to launch your platform?</h2>
          <p>Get started with a personalized demo. Our team will walk you through the full settlement infrastructure.</p>
          <NuxtLink to="/contact" class="btn btn-primary btn-lg">
            Request a Demo
            <Icon name="lucide:chevron-right" size="16" />
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
/**
 * For Institutions — B2B landing page targeting banks, desks, funds, and asset managers.
 * Broadened from "For Desks" to cover all institutional audiences.
 * All emojis replaced with Lucide icons. Jargon-free descriptions.
 */
import { useStructuredData, ORGANIZATION_SCHEMA } from '~/composables/useStructuredData'
useHead({
  title: 'For Institutions — DeFlow Labs',
  meta: [
    { name: 'description', content: 'Deploy a fully compliant settlement platform under your brand. White-label infrastructure for banks, trading desks, funds, and asset managers.' },
  ],
})

useStructuredData(ORGANIZATION_SCHEMA)

const modules = [
  {
    title: 'Deal Management',
    icon: 'lucide:file-check',
    bg: 'var(--gradient-purple-nebula)',
    desc: 'Create, track, and settle deals with full lifecycle management across all dealflow types.',
    features: ['Multi-party deal rooms', 'Real-time status tracking', 'Automated fee calculation', 'Full audit trail'],
  },
  {
    title: 'Identity & Compliance',
    icon: 'lucide:shield-check',
    bg: 'var(--gradient-blue-nebula)',
    desc: 'Identity verification with zero personal data stored in your database.',
    features: ['Basic, Enhanced, Corporate verification tiers', 'Sanctions screening (OFAC, EU, UN)', 'Wallet risk analysis', 'Zero-PII architecture'],
  },
  {
    title: 'Smart Escrow',
    icon: 'lucide:lock',
    bg: 'var(--gradient-green-live)',
    desc: 'Non-custodial programmable settlement with on-chain finality.',
    features: ['Smart wallet accounts', 'Programmable release conditions', 'Deterministic finality confirmation', 'Transparent on-chain audit'],
  },
  {
    title: 'Revenue Engine',
    icon: 'lucide:gem',
    bg: 'var(--gradient-amber-trust)',
    desc: 'Automated fee cascading, commissions, discounts, and referral payouts.',
    features: ['Platform, desk, and broker fees', 'VIP tier-based discounts', 'Dual-bucket referral system', 'Real-time revenue analytics'],
  },
]

const audiences = [
  { title: 'Trading Desks', icon: 'lucide:building-2', desc: 'High-volume bilateral trading with institutional-grade settlement and compliance.' },
  { title: 'Brokerages', icon: 'lucide:bar-chart-3', desc: 'Multi-tier fee structures and white-label branding for your brokerage clients.' },
  { title: 'Banks & Funds', icon: 'lucide:landmark', desc: 'Transparent settlement and audit trails for fund operations and LP reporting.' },
  { title: 'Family Offices', icon: 'lucide:wallet', desc: 'Private, compliant deal settlement with portfolio tracking and cost basis.' },
  { title: 'Asset Managers', icon: 'lucide:briefcase', desc: 'Post-settlement portfolio visibility with compliance-verified provenance.' },
  { title: 'Market Makers', icon: 'lucide:zap', desc: 'Automated settlement infrastructure with programmatic API access.' },
]

const techStack = ['Ethereum', 'Safe{Wallet}', 'Privy', 'Google Cloud', 'Drizzle ORM', 'NestJS']
</script>

<style scoped>
/* Hero */
.inst-hero {
  position: relative;
  padding: 8rem 0 4rem;
  overflow: hidden;
}

.inst-hero__bg-glow {
  position: absolute;
  top: -200px;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 600px;
  background: radial-gradient(ellipse, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

.inst-hero__actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

/* Module Grid */
.inst-modules__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.inst-module {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.inst-module__icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-icon);
  color: rgba(255, 255, 255, 0.9);
}

.inst-module h3 {
  font-size: 1.25rem;
  font-weight: 600;
}

.inst-module p {
  font-size: 0.875rem;
  color: var(--color-muted-fg);
  line-height: 1.6;
}

.inst-module__features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-top: 0.5rem;
}

.inst-module__features li {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.55);
  padding-left: 1.25rem;
  position: relative;
}

.inst-module__features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #22C55E;
  font-size: 0.75rem;
}

/* Audience */
.inst-audience__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.inst-audience__card {
  padding: 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.inst-audience__icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-icon);
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
}

.inst-audience__card h3 {
  font-size: 1rem;
  font-weight: 600;
}

.inst-audience__card p {
  font-size: 0.8125rem;
  color: var(--color-muted-fg);
  line-height: 1.5;
}

/* Tech Stack */
.inst-stack {
  text-align: center;
}

.inst-stack__label {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 1.5rem;
}

.inst-stack__logos {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.inst-stack__logo {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.02em;
}

/* CTA */
.inst-cta__card {
  padding: 4rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.inst-cta__card h2 {
  font-size: 2rem;
  font-weight: 700;
}

.inst-cta__card p {
  font-size: 1rem;
  color: var(--color-muted-fg);
  max-width: 480px;
}

/* Responsive */
@media (max-width: 1024px) {
  .inst-audience__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .inst-modules__grid {
    grid-template-columns: 1fr;
  }

  .inst-audience__grid {
    grid-template-columns: 1fr;
  }

  .inst-hero__actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
