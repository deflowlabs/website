<template>
  <div class="product-page">
    <!-- Hero -->
    <section class="product-hero section">
      <div class="container">
        <div class="section-header">
          <span class="badge badge-info">Product</span>
          <h1>The settlement layer<br />your deals deserve</h1>
          <p>
            DeFlow combines non-custodial smart escrow, compliant identity verification,
            and programmable settlement into a single, institutional-grade platform.
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                {{ item }}
              </li>
            </ul>
          </div>
          <div class="product-feature__visual glass-card">
            <div class="product-feature__mock">
              <span class="product-feature__mock-icon">{{ feat.icon }}</span>
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
            <span class="product-security__icon">{{ sec.icon }}</span>
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
useHead({
  title: 'Product — DeFlow Labs',
  meta: [
    { name: 'description', content: 'Explore DeFlow\'s institutional settlement features — smart escrow, Zero-PII identity, VIP tiers, and programmable settlement.' },
  ],
})

const deepFeatures = [
  {
    icon: '🔐',
    badge: 'Smart Escrow',
    badgeClass: 'badge-info',
    title: 'Programmable smart contract escrow',
    description: 'Funds are locked in audited EscrowFactory contracts. No third party holds your assets — only the smart contract. Release conditions are deterministic and verified on-chain.',
    points: [
      'ERC-4337 smart accounts via Pimlico',
      'EscrowFactory + FeeRouter contracts',
      'Foundry fuzz testing + Slither analysis',
      '6-block finality confirmation',
    ],
  },
  {
    icon: '🛡️',
    badge: 'Zero-PII Identity',
    badgeClass: 'badge-success',
    title: 'Compliance without compromise',
    description: 'Your identity is verified but never stored. We use HMAC-SHA256 to hash personal data at the edge — raw PII is discarded immediately. Our database has literally zero personal information.',
    points: [
      'HMAC-SHA256 identity hashing',
      'Tiered KYC: L1, L2, L3 (KYB)',
      'Real-time OFAC/EU/UN sanctions screening',
      'Wallet screening via Scorechain',
    ],
  },
  {
    icon: '⭐',
    badge: 'VIP Program',
    badgeClass: 'badge-premium',
    title: '19 milestones. Unlimited rewards.',
    description: 'From your first deal to Diamond+ status — every settled deal earns you fee discounts, priority access, and exclusive features. Volume-based progression with transparent thresholds.',
    points: [
      'Bronze → Silver → Gold → Platinum → Diamond',
      'Volume-based fee discounts up to 7%',
      'Priority settlement queue',
      'Custom desk branding at higher tiers',
    ],
  },
  {
    icon: '🤝',
    badge: 'Referral Engine',
    badgeClass: 'badge-warning',
    title: 'Earn on every referred deal',
    description: 'Dual-bucket referral system splits rewards into fee credits and cash. Standard referrers earn 5% of platform fees; Genesis partners earn 10%. Monthly caps scale with your tier.',
    points: [
      'Fee credits + cash bucket split',
      'Shadow identity for unregistered referrals',
      'Anti-wash trade protection',
      '12-month credit expiry, $100 min withdrawal',
    ],
  },
]

const securityItems = [
  { icon: '🔒', title: 'Non-Custodial', description: 'DeFlow never holds your assets. Smart contracts are the only custodians.' },
  { icon: '🕵️', title: 'Zero-PII', description: 'No emails, names, or personal data in our database. Ever.' },
  { icon: '🔍', title: 'Audited Contracts', description: 'Slither static analysis + Foundry fuzz testing on every deployment.' },
  { icon: '🌐', title: 'Sanctions Screening', description: 'OFAC, EU, UN, OFSI, MOFA watchlists. 24h TTL auto-refresh.' },
  { icon: '♿', title: 'WCAG 2 AA', description: 'Full accessibility compliance with automated Axe testing.' },
  { icon: '📊', title: 'Sentry Monitoring', description: '100% error tracking, 20% transaction sampling, Zero-PII scrubbing.' },
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
  font-size: 4rem;
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

.product-security__icon {
  font-size: 1.5rem;
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
