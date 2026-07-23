<template>
  <div class="product-page">
    <!-- Hero -->
    <section class="product-hero section">
      <div class="container">
        <div class="section-header">
          <span class="badge badge-info">Platform Overview</span>
          <h1>The settlement layer<br />your deals deserve</h1>
          <p>
            DeFlow combines non-custodial smart escrow, compliant identity verification,
            and programmable settlement into a single, institutional-grade platform.
            From OTC trades to syndicate raises, every dealflow type is covered.
          </p>
        </div>
      </div>
    </section>

    <!-- Deep Features -->
    <section id="features" class="product-features section">
      <div class="container">
        <div v-for="(feat, i) in deepFeatures" :key="feat.title" class="product-feature" :class="{ 'product-feature--reverse': i % 2 === 1 }">
          <div class="product-feature__content">
            <span class="badge" :class="feat.badgeClass">{{ feat.badge }}</span>
            <h2>{{ feat.title }}</h2>
            <p>{{ feat.description }}</p>
            <ul class="product-feature__list">
              <li v-for="item in feat.points" :key="item">
                <Icon name="lucide:check" size="14" style="color: #22C55E; flex-shrink: 0;" />
                {{ item }}
              </li>
            </ul>
          </div>
          <div class="product-feature__visual glass-card">
            <div class="product-feature__mock">
              <!-- Placeholder: Designer will provide custom illustrations -->
              <div class="product-feature__mock-icon">
                <Icon :name="feat.icon" size="48" style="color: rgba(255,255,255,0.25);" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Security Section -->
    <section id="security" class="product-security section">
      <div class="container">
        <div class="section-header">
          <span class="badge badge-success">Security</span>
          <h2>Security isn't a feature.<br />It's the foundation.</h2>
          <p>Every layer of DeFlow is designed with zero-trust principles.</p>
        </div>
        <div class="product-security__grid">
          <div v-for="sec in securityItems" :key="sec.title" class="product-security__item glass-card">
            <div class="product-security__icon-wrap">
              <Icon :name="sec.icon" size="20" />
            </div>
            <h4>{{ sec.title }}</h4>
            <p>{{ sec.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section">
      <div class="container" style="text-align: center">
        <h2>Ready to get started?</h2>
        <p style="color: var(--color-muted-fg); margin: 1rem 0 2rem">Join the waitlist for early access.</p>
        <NuxtLink to="/waitlist" class="btn btn-primary btn-lg">
          Join the Waitlist
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
/**
 * Platform Overview — Deep-dive into DeFlow's capabilities.
 * Jargon-free descriptions for multi-audience accessibility.
 * All emojis replaced with Lucide icons.
 */
useHead({
  title: 'Platform Overview — DeFlow Labs',
  meta: [
    { name: 'description', content: 'Explore DeFlow\'s institutional settlement platform: smart escrow, Zero-PII identity, VIP tiers, referral engine, and multi-asset settlement.' },
  ],
})

const deepFeatures = [
  {
    icon: 'lucide:lock',
    badge: 'Smart Escrow',
    badgeClass: 'badge-info',
    title: 'Programmable smart contract escrow',
    description: 'Funds are locked in audited escrow contracts. No third party holds your assets. Release conditions are deterministic and verified on-chain.',
    points: [
      'Smart wallet accounts for gasless transactions',
      'Audited escrow and fee routing contracts',
      'Rigorous smart contract security testing',
      'Deterministic on-chain finality',
    ],
  },
  {
    icon: 'lucide:shield-check',
    badge: 'Zero-PII Identity',
    badgeClass: 'badge-success',
    title: 'Compliance without compromise',
    description: 'Your identity is verified but never stored. Personal data is cryptographically hashed at the authentication edge and discarded immediately. Our database holds zero personal information.',
    points: [
      'Cryptographic identity verification',
      'Tiered verification: Basic, Enhanced, Corporate',
      'Real-time OFAC, EU, UN sanctions screening',
      'Wallet risk analysis and screening',
    ],
  },
  {
    icon: 'lucide:star',
    badge: 'VIP Program',
    badgeClass: 'badge-premium',
    title: '19 milestones. Unlimited rewards.',
    description: 'From your first deal to Diamond+ status. Every settled deal earns you fee discounts, priority access, and exclusive features. Volume-based progression with transparent thresholds.',
    points: [
      'Bronze through Silver, Gold, Platinum, Diamond',
      'Volume-based fee discounts up to 7%',
      'Priority settlement queue',
      'Custom desk branding at higher tiers',
    ],
  },
  {
    icon: 'lucide:handshake',
    badge: 'Referral Engine',
    badgeClass: 'badge-warning',
    title: 'Earn on every referred deal',
    description: 'Dual-bucket referral system splits rewards into fee credits and cash. Standard referrers earn 5% of platform fees. Genesis partners earn 10%. Monthly caps scale with your tier.',
    points: [
      'Fee credits and cash bucket split',
      'Automatic linking for unregistered referrals',
      'Anti-wash trade protection',
      '$100 minimum withdrawal, 30-day cooldown',
    ],
  },
]

const securityItems = [
  { icon: 'lucide:lock', title: 'Non-Custodial', description: 'DeFlow never holds your assets. Smart contracts are the only custodians.' },
  { icon: 'lucide:eye-off', title: 'Zero-PII', description: 'No emails, names, or personal data in our database. Ever.' },
  { icon: 'lucide:search-code', title: 'Audited Contracts', description: 'Static analysis and fuzz testing on every smart contract deployment.' },
  { icon: 'lucide:globe', title: 'Sanctions Screening', description: 'OFAC, EU, UN, OFSI watchlists with automatic refresh every 24 hours.' },
  { icon: 'lucide:accessibility', title: 'WCAG 2 AA', description: 'Full accessibility compliance with automated testing on every build.' },
  { icon: 'lucide:activity', title: 'Real-time Monitoring', description: '100% error tracking with privacy-preserving observability. No PII in logs.' },
]
</script>

<style scoped>
.product-hero {
  padding-top: 4rem;
}

.product-hero h1 {
  font-size: clamp(2rem, 4vw, 3rem);
}

.product-feature {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  margin-bottom: 6rem;
}

.product-feature--reverse {
  direction: rtl;
}

.product-feature--reverse > * {
  direction: ltr;
}

.product-feature__content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}

.product-feature__content h2 {
  font-size: 1.75rem;
}

.product-feature__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.product-feature__list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-muted-fg);
}

.product-feature__visual {
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.product-feature__mock-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-icon);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.product-security__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.product-security__item {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.product-security__icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-icon);
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
}

.product-security__item h4 {
  font-size: 0.9375rem;
}

.product-security__item p {
  font-size: 0.8125rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .product-feature {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .product-feature--reverse {
    direction: ltr;
  }

  .product-security__grid {
    grid-template-columns: 1fr;
  }
}
</style>
