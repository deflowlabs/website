<template>
  <div class="home">
    <!-- ===== HERO ===== -->
    <section class="hero">
      <div class="hero__bg-glow" />
      <div class="hero__content container">
        <div class="hero__badge badge badge-premium animate-fade-in">
          <span class="hero__badge-dot" />
          Private Beta — Coming Soon
        </div>

        <h1 class="hero__title animate-fade-in-up">
          The institutional settlement layer<br />
          for digital asset
          <span class="gradient-text">dealflows</span>.
        </h1>

        <p class="hero__subtitle animate-fade-in-up delay-100">
          Non-custodial smart escrow. Compliant identity verification.
          Programmable settlement. Your deals flow through DeFlow.
        </p>

        <div class="hero__actions animate-fade-in-up delay-200">
          <NuxtLink to="/waitlist" class="btn btn-primary btn-lg">
            Join the Waitlist
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </NuxtLink>
          <NuxtLink to="/product" class="btn btn-secondary btn-lg">
            Explore the Product
          </NuxtLink>
        </div>

        <!-- Hero Stats Strip -->
        <div class="hero__stats animate-fade-in-up delay-250">
          <div v-for="stat in heroStats" :key="stat.label" class="hero__stat">
            <span class="hero__stat-value font-mono">{{ stat.value }}</span>
            <span class="hero__stat-label">{{ stat.label }}</span>
          </div>
        </div>

        <!-- Product Preview -->
        <div class="hero__preview animate-fade-in-up delay-300">
          <div class="hero__preview-frame">
            <div class="hero__preview-header">
              <span class="hero__preview-dot" style="background: #FF5F56" />
              <span class="hero__preview-dot" style="background: #FFBD2E" />
              <span class="hero__preview-dot" style="background: #27C93F" />
              <span class="hero__preview-title">DeFlow — Deal Room</span>
            </div>
            <div class="hero__preview-body">
              <div class="hero__preview-sidebar">
                <div class="hero__preview-nav-item active">Deal Room</div>
                <div class="hero__preview-nav-item">Syndicates</div>
                <div class="hero__preview-nav-item">Analytics</div>
                <div class="hero__preview-nav-item">Settings</div>
              </div>
              <div class="hero__preview-main">
                <div class="hero__preview-deal glass-card">
                  <div class="hero__preview-deal-header">
                    <span class="badge badge-success">Settled</span>
                    <span class="font-mono" style="color: #22C55E">$3,000,000</span>
                  </div>
                  <div class="hero__preview-deal-row">
                    <span style="color: var(--color-muted-fg)">Fee Revenue</span>
                    <span class="font-mono">$16,500</span>
                  </div>
                  <div class="hero__preview-deal-row">
                    <span style="color: var(--color-muted-fg)">Settlement Time</span>
                    <span class="font-mono">12 min</span>
                  </div>
                </div>
                <div class="hero__preview-deal glass-card" style="opacity: 0.6">
                  <div class="hero__preview-deal-header">
                    <span class="badge badge-warning">Funding</span>
                    <span class="font-mono">$1,250,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="hero__preview-glow" />
        </div>
      </div>
    </section>

    <!-- ===== TRUST STRIP ===== -->
    <section class="trust-strip">
      <div class="container">
        <p class="trust-strip__label">BUILT WITH</p>
        <div class="trust-strip__logos">
          <span v-for="logo in techLogos" :key="logo" class="trust-strip__logo">{{ logo }}</span>
        </div>
      </div>
    </section>

    <!-- ===== FEATURES ===== -->
    <section id="features" class="features section">
      <div class="container">
        <div class="section-header">
          <span class="badge badge-premium">Core Capabilities</span>
          <h2>Everything institutional settlement needs</h2>
          <p>From deal creation to final settlement — every step is verified, compliant, and non-custodial.</p>
        </div>

        <div class="features__grid">
          <div v-for="(feature, i) in features" :key="feature.title" class="features__card glass-card">
            <div class="features__icon" :style="{ background: feature.iconBg }">
              <span>{{ feature.icon }}</span>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== TESTIMONIALS ===== -->
    <TestimonialSlider />

    <!-- ===== HOW IT WORKS ===== -->
    <section class="how-it-works section">
      <div class="container">
        <div class="section-header">
          <span class="badge badge-info">Settlement Flow</span>
          <h2>Five steps to settled</h2>
          <p>From deal draft to final settlement — fully automated, fully compliant.</p>
        </div>

        <div class="how-it-works__steps">
          <div v-for="(step, i) in steps" :key="step.title" class="how-it-works__step">
            <div class="how-it-works__number">{{ i + 1 }}</div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== SECURITY ===== -->
    <section class="security section">
      <div class="container">
        <div class="security__inner">
          <div class="security__content">
            <span class="badge badge-success">Security & Compliance</span>
            <h2>Built for institutions.<br />Trusted by design.</h2>
            <p>
              DeFlow never holds your assets. We never store your identity.
              Every transaction is verified on-chain with 6-block finality.
            </p>
            <ul class="security__list">
              <li v-for="item in securityFeatures" :key="item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                {{ item }}
              </li>
            </ul>
          </div>
          <div class="security__visual">
            <div class="security__shield glass-card">
              <div class="security__shield-icon">🛡️</div>
              <div class="security__shield-label">ZERO-PII</div>
              <div class="security__shield-sub">No personal data stored</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== STATS ===== -->
    <section class="stats section">
      <div class="container">
        <div class="stats__grid">
          <div v-for="stat in stats" :key="stat.label" class="stats__item">
            <span class="stats__value font-mono">{{ stat.value }}</span>
            <span class="stats__label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== LABS PREVIEW ===== -->
    <section class="labs-preview section">
      <div class="container">
        <div class="labs-preview__card glass-card">
          <div class="labs-preview__content">
            <span class="badge badge-premium">DeFlow Labs</span>
            <h2>Where finance meets<br />frontier research</h2>
            <p>
              Our R&D arm collaborates with top universities and PhD researchers
              to advance digital asset infrastructure, compliance frameworks,
              and settlement technology.
            </p>
            <NuxtLink to="/labs" class="btn btn-secondary">
              Explore Labs
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </NuxtLink>
          </div>
          <div class="labs-preview__visual">
            <div class="labs-preview__orb" />
          </div>
        </div>
      </div>
    </section>

    <!-- ===== BOTTOM CTA / WAITLIST ===== -->
    <section class="cta section">
      <div class="container">
        <div class="cta__inner">
          <div class="cta__content">
            <h2>Ready to make your deals flow?</h2>
            <p>
              Join the waitlist for early access to DeFlow.
              Invitations will be sent on a first-come, first-served basis.
            </p>
          </div>
          <div class="cta__form">
            <WaitlistForm />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
/**
 * Homepage — DeFlow Labs marketing landing page.
 * Sections: Hero, Trust Strip, Features, How It Works, Security, Stats, Labs Preview, CTA.
 */
useHead({
  title: 'DeFlow Labs — Institutional Settlement Layer for Digital Asset Dealflows',
})

useStructuredData(ORGANIZATION_SCHEMA)
useStructuredData(WEBSITE_SCHEMA)

const techLogos = ['Ethereum', 'Safe', 'Privy', 'Alchemy', 'Google Cloud', 'Foundry']

const features = [
  {
    icon: '🔐',
    iconBg: 'rgba(99, 102, 241, 0.1)',
    title: 'Smart Escrow',
    description: 'Programmable smart contract escrow holds funds until all conditions are met. Non-custodial by design.',
  },
  {
    icon: '🛡️',
    iconBg: 'rgba(16, 185, 129, 0.1)',
    title: 'Zero-PII Identity',
    description: 'HMAC-SHA256 hashed identities. Raw personal data never reaches our database. Privacy-first compliance.',
  },
  {
    icon: '✓',
    iconBg: 'rgba(245, 158, 11, 0.1)',
    title: 'Identity Verification',
    description: 'Tiered KYC/AML with real-time sanctions screening. OFAC, EU, UN watchlists monitored continuously.',
  },
  {
    icon: '⭐',
    iconBg: 'rgba(139, 92, 246, 0.1)',
    title: 'VIP Tiers & Rewards',
    description: '19-milestone progression system. Volume-based discounts, fee credits, and priority settlement access.',
  },
  {
    icon: '⛓️',
    iconBg: 'rgba(59, 130, 246, 0.1)',
    title: 'Multi-Asset Settlement',
    description: 'USDC today, multi-currency tomorrow. Cross-chain settlement with deterministic finality.',
  },
  {
    icon: '🤝',
    iconBg: 'rgba(236, 72, 153, 0.1)',
    title: 'Referral Engine',
    description: 'Dual-bucket rewards — fee credits and cash. Earn 5-10% of platform fees on every referred deal.',
  },
]

const steps = [
  { title: 'Deal Setup', description: 'Define terms, asset type, and settlement amount in the deal wizard.' },
  { title: 'Review & Invite', description: 'Review terms and invite your counterparty via wallet address or email.' },
  { title: 'Deploy Escrow', description: 'Smart escrow contract deployed on-chain. Funds locked until conditions met.' },
  { title: 'Fund & Confirm', description: 'Both parties fund the escrow. On-chain events verify each deposit.' },
  { title: 'Settlement', description: 'Assets released atomically. Chain-verified, final, and irreversible.' },
]

const securityFeatures = [
  'Non-custodial — we never hold your assets',
  'Zero-PII — no personal data in our database',
  'OWASP ZAP weekly security scans',
  'Smart contract audited with Slither + Foundry fuzz',
  'WCAG 2 AA accessibility compliant',
  '6-block finality confirmation',
  'Wallet sanctions screening (OFAC/EU/UN)',
  'ERC-4337 smart accounts via Pimlico',
]

const heroStats = [
  { value: '25+', label: 'Modules' },
  { value: '48+', label: 'Tables' },
  { value: '0', label: 'PII Stored' },
  { value: '6-Block', label: 'Finality' },
]

const stats = [
  { value: '25+', label: 'Backend Modules' },
  { value: '48+', label: 'Database Tables' },
  { value: '14', label: 'CI/CD Workflows' },
  { value: '0', label: 'PII Stored' },
]
</script>

<style scoped>
/* ===== Hero ===== */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 6rem 0 4rem;
  overflow: hidden;
}

.hero__bg-glow {
  position: absolute;
  top: -200px;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(99, 102, 241, 0.12), transparent 70%);
  pointer-events: none;
}

.hero__content {
  position: relative;
  z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.hero__badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #A78BFA;
  animation: glow-pulse 2s ease-in-out infinite;
}

.hero__title {
  font-size: clamp(2rem, 5vw, 3.75rem);
  line-height: 1.1;
  max-width: 800px;
}

.hero__subtitle {
  font-size: 1.125rem;
  color: var(--color-muted-fg);
  max-width: 560px;
  line-height: 1.7;
}

.hero__actions {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.btn-lg {
  min-height: 3rem;
  padding: 0.75rem 1.75rem;
  font-size: 15px;
}

/* Hero Stats Strip */
.hero__stats {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
  padding: 1rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.hero__stat {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.hero__stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #FFFFFF;
  letter-spacing: -0.02em;
}

.hero__stat-label {
  font-size: 0.6875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.5);
}

/* Product Preview (mock UI) */
.hero__preview {
  position: relative;
  width: 100%;
  max-width: 900px;
  margin-top: 3rem;
}

.hero__preview-frame {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: var(--color-charcoal);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.04),
    0 32px 71px rgba(0, 0, 0, 0.98),
    0 128px 128px rgba(0, 0, 0, 0.85);
}

.hero__preview-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.hero__preview-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.hero__preview-title {
  margin-left: auto;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.05em;
}

.hero__preview-body {
  display: flex;
  min-height: 280px;
}

.hero__preview-sidebar {
  width: 180px;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hero__preview-nav-item {
  padding: 8px 12px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  border-radius: 6px;
}

.hero__preview-nav-item.active {
  background: rgba(255, 255, 255, 0.06);
  color: #FFFFFF;
}

.hero__preview-main {
  flex: 1;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.hero__preview-deal {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.hero__preview-deal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hero__preview-deal-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.hero__preview-glow {
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 120px;
  background: radial-gradient(ellipse, rgba(99, 102, 241, 0.15), transparent 70%);
  filter: blur(40px);
  pointer-events: none;
}

/* ===== Trust Strip ===== */
.trust-strip {
  padding: 3rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.trust-strip__label {
  text-align: center;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 1.5rem;
}

.trust-strip__logos {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.trust-strip__logo {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.05em;
  transition: color 0.2s ease;
}

.trust-strip__logo:hover {
  color: rgba(255, 255, 255, 0.5);
}

/* ===== Section Header ===== */
.section-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.section-header h2 {
  font-size: clamp(1.75rem, 3vw, 2.5rem);
}

.section-header p {
  font-size: 1rem;
  color: var(--color-muted-fg);
}

/* ===== Features ===== */
.features__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.features__card {
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: all 0.3s ease;
}

.features__card:hover {
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.features__icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-icon);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.features__card h3 {
  font-size: 1rem;
}

.features__card p {
  font-size: 0.875rem;
  line-height: 1.6;
}

/* ===== How It Works ===== */
.how-it-works__steps {
  display: flex;
  gap: 1rem;
  position: relative;
}

.how-it-works__steps::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  height: 2px;
  background: linear-gradient(90deg, var(--color-border), rgba(99, 102, 241, 0.3), var(--color-border));
}

.how-it-works__step {
  flex: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  position: relative;
}

.how-it-works__number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-card);
  border: 2px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-foreground);
  position: relative;
  z-index: 1;
}

.how-it-works__step h3 {
  font-size: 0.875rem;
}

.how-it-works__step p {
  font-size: 0.8125rem;
  line-height: 1.5;
}

/* ===== Security ===== */
.security__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.security__content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}

.security__content h2 {
  font-size: clamp(1.75rem, 3vw, 2.25rem);
}

.security__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.security__list li {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.875rem;
  color: var(--color-muted-fg);
}

.security__visual {
  display: flex;
  justify-content: center;
}

.security__shield {
  width: 240px;
  padding: 3rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  animation: float 6s ease-in-out infinite;
}

.security__shield-icon {
  font-size: 3rem;
}

.security__shield-label {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--color-foreground);
}

.security__shield-sub {
  font-size: 0.75rem;
  color: var(--color-muted-fg);
}

/* ===== Stats ===== */
.stats {
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.stats__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.stats__item {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stats__value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-foreground);
}

.stats__label {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-muted-fg);
}

/* ===== Labs Preview ===== */
.labs-preview__card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 320px;
  overflow: hidden;
  position: relative;
}

.labs-preview__content {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 1rem;
}

.labs-preview__content h2 {
  font-size: clamp(1.5rem, 2.5vw, 2rem);
}

.labs-preview__visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.labs-preview__orb {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: var(--gradient-purple-nebula);
  filter: blur(60px);
  opacity: 0.4;
  animation: float 8s ease-in-out infinite;
}

/* ===== Bottom CTA ===== */
.cta__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.cta__content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cta__content h2 {
  font-size: clamp(1.75rem, 3vw, 2.25rem);
}

/* ===== Responsive ===== */
@media (max-width: 1024px) {
  .features__grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .how-it-works__steps {
    flex-direction: column;
    gap: 1.5rem;
  }

  .how-it-works__steps::before {
    display: none;
  }

  .how-it-works__step {
    flex-direction: row;
    text-align: left;
    gap: 1rem;
  }

  .security__inner {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .security__visual {
    order: -1;
  }

  .labs-preview__card {
    grid-template-columns: 1fr;
  }

  .labs-preview__visual {
    display: none;
  }

  .cta__inner {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .hero__title {
    font-size: clamp(1.75rem, 7vw, 2.5rem);
  }

  .hero__actions {
    flex-direction: column;
    width: 100%;
    max-width: 320px;
  }

  .hero__actions .btn {
    width: 100%;
  }

  .hero__preview-sidebar {
    display: none;
  }

  .features__grid {
    grid-template-columns: 1fr;
  }

  .stats__grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .hero__stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
}
</style>
