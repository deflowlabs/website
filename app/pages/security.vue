<template>
  <div class="security-page">
    <!-- Hero -->
    <section class="sec-hero section">
      <div class="sec-hero__bg-glow" />
      <div class="container">
        <div class="section-header">
          <span class="badge badge-success">Security & Compliance</span>
          <h1>
            Security is infrastructure,<br />
            <span class="gradient-text">not a feature</span>.
          </h1>
          <p>
            Every layer of DeFlow is designed with security as a first principle —
            from zero-knowledge identity to non-custodial settlement.
          </p>
        </div>
      </div>
    </section>

    <!-- Zero-PII Architecture -->
    <section class="sec-section section">
      <div class="container">
        <div class="sec-section__inner">
          <div class="sec-section__content">
            <span class="badge badge-info">Architecture</span>
            <h2>Zero-PII by design</h2>
            <p>
              DeFlow never stores personal information. Emails, names, and identities
              are processed through HMAC-SHA256 with a rotating salt — then immediately
              discarded. Only the irreversible hash is stored.
            </p>
            <ul class="sec-checklist">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                Raw email discarded after HMAC-SHA256 hashing
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                No PII in database, logs, or Sentry error reports
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                ZeroPiiExceptionFilter strips sensitive data from all responses
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                Email notifications via Privy REST API — backend never sees email strings
              </li>
            </ul>
          </div>
          <div class="sec-section__visual">
            <div class="sec-flow glass-card">
              <div class="sec-flow__step">
                <span class="sec-flow__label">User Email</span>
                <span class="sec-flow__value font-mono">user@example.com</span>
              </div>
              <div class="sec-flow__arrow">↓ HMAC-SHA256</div>
              <div class="sec-flow__step">
                <span class="sec-flow__label">Stored Hash</span>
                <span class="sec-flow__value font-mono" style="font-size: 0.625rem; word-break: break-all;">a7f8c3e2d...</span>
              </div>
              <div class="sec-flow__arrow">↓ Discard</div>
              <div class="sec-flow__step sec-flow__step--red">
                <span class="sec-flow__label">Raw Email</span>
                <span class="sec-flow__value font-mono" style="text-decoration: line-through; opacity: 0.3">user@example.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Smart Contract Security -->
    <section class="sec-section section">
      <div class="container">
        <div class="section-header">
          <span class="badge badge-warning">Smart Contracts</span>
          <h2>Audited & battle-tested</h2>
          <p>Our Solidity contracts are verified through multiple layers of automated and manual analysis.</p>
        </div>
        <div class="sec-grid">
          <div v-for="audit in audits" :key="audit.title" class="sec-grid__card glass-card">
            <span class="sec-grid__icon">{{ audit.icon }}</span>
            <h3>{{ audit.title }}</h3>
            <p>{{ audit.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Compliance & Sanctions -->
    <section class="sec-section section">
      <div class="container">
        <div class="sec-section__inner sec-section__inner--reverse">
          <div class="sec-section__content">
            <span class="badge badge-premium">Compliance</span>
            <h2>Sanctions screening & KYC</h2>
            <p>
              Every participant is screened against international sanctions lists
              before any transaction is allowed to proceed.
            </p>
            <ul class="sec-checklist">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                OFAC / EU / UN / OFSI / MOFA / NBCTF screening
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                Wallet screening via Scorechain (Web3 AML)
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                24-hour TTL on AML results — stale data blocks funding
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                3-tier KYC: Basic → Enhanced → Corporate
              </li>
            </ul>
          </div>
          <div class="sec-section__visual">
            <div class="sec-shield glass-card">
              <div class="sec-shield__icon">🛡️</div>
              <div class="sec-shield__badges">
                <span v-for="badge in sanctionBadges" :key="badge" class="sec-shield__badge">{{ badge }}</span>
              </div>
              <div class="sec-shield__status">
                <span class="sec-shield__dot" />
                Active Screening
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Settlement Security -->
    <section class="sec-section section">
      <div class="container">
        <div class="section-header">
          <span class="badge badge-success">Settlement</span>
          <h2>On-chain finality</h2>
          <p>Non-custodial smart escrow with deterministic settlement.</p>
        </div>
        <div class="sec-grid sec-grid--3col">
          <div v-for="item in settlementFeatures" :key="item.title" class="sec-grid__card glass-card">
            <span class="sec-grid__icon">{{ item.icon }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Bug Bounty CTA -->
    <section class="sec-bounty section">
      <div class="container">
        <div class="sec-bounty__card glass-card">
          <span class="sec-bounty__icon">🐛</span>
          <h2>Bug Bounty Program</h2>
          <p>Found a vulnerability? We take security seriously and reward responsible disclosure.</p>
          <span class="badge badge-warning">Coming Soon</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
/**
 * Security page — comprehensive overview of DeFlow's security architecture.
 * Covers Zero-PII, smart contract audits, compliance/sanctions, and settlement.
 */
import { useStructuredData, ORGANIZATION_SCHEMA } from '~/composables/useStructuredData'

useHead({
  title: 'Security — DeFlow Labs',
  meta: [
    { name: 'description', content: 'How DeFlow protects your assets and identity with Zero-PII architecture, smart contract audits, sanctions screening, and non-custodial settlement.' },
  ],
})

useStructuredData(ORGANIZATION_SCHEMA)

const audits = [
  { icon: '🔍', title: 'Slither Analysis', desc: 'Static analysis for common Solidity vulnerabilities, reentrancy, and gas optimization issues.' },
  { icon: '🧪', title: 'Foundry Fuzz Testing', desc: 'Property-based fuzz testing with millions of random inputs to find edge cases.' },
  { icon: '📐', title: 'Formal Verification', desc: 'Mathematical proofs for critical invariants in escrow and fee distribution contracts.' },
  { icon: '🔒', title: 'Access Control Audit', desc: 'OpenZeppelin-based role separation with multi-sig requirements for administrative functions.' },
]

const sanctionBadges = ['OFAC', 'EU', 'UN', 'OFSI', 'MOFA', 'NBCTF']

const settlementFeatures = [
  { icon: '⛓️', title: 'Non-Custodial', desc: 'DeFlow never holds your assets. Smart contracts manage escrow with deterministic release conditions.' },
  { icon: '⏱️', title: '6-Block Finality', desc: 'All transactions confirmed with 6-block depth on Ethereum (Sepolia in staging, 1-block on Anvil).' },
  { icon: '📊', title: 'Event Reconciliation', desc: 'On-chain events are immutable financial truth. UI confirms only after chain event verification.' },
]
</script>

<style scoped>
.sec-hero {
  position: relative;
  padding: 8rem 0 4rem;
  overflow: hidden;
}

.sec-hero__bg-glow {
  position: absolute;
  top: -200px;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 600px;
  background: radial-gradient(ellipse, rgba(34, 197, 94, 0.06) 0%, transparent 70%);
  pointer-events: none;
}

/* Alternating content/visual sections */
.sec-section__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.sec-section__inner--reverse {
  direction: rtl;
}

.sec-section__inner--reverse > * {
  direction: ltr;
}

.sec-section__content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sec-section__content h2 {
  font-size: 2rem;
  font-weight: 700;
}

.sec-section__content p {
  font-size: 1rem;
  color: var(--color-muted-fg);
  line-height: 1.7;
}

.sec-checklist {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin-top: 0.5rem;
}

.sec-checklist li {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}

.sec-checklist li svg {
  flex-shrink: 0;
  margin-top: 2px;
}

/* Zero-PII Flow Diagram */
.sec-flow {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.sec-flow__step {
  text-align: center;
  padding: 1rem;
  border-radius: var(--radius-card);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  width: 100%;
}

.sec-flow__step--red {
  border-color: rgba(239, 68, 68, 0.2);
  background: rgba(239, 68, 68, 0.04);
}

.sec-flow__label {
  display: block;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 0.25rem;
}

.sec-flow__value {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.8);
}

.sec-flow__arrow {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.3);
  font-family: var(--font-mono);
}

/* Grid Cards */
.sec-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.sec-grid--3col {
  grid-template-columns: repeat(3, 1fr);
}

.sec-grid__card {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sec-grid__icon {
  font-size: 1.5rem;
}

.sec-grid__card h3 {
  font-size: 1rem;
  font-weight: 600;
}

.sec-grid__card p {
  font-size: 0.8125rem;
  color: var(--color-muted-fg);
  line-height: 1.6;
}

/* Shield Visual */
.sec-shield {
  padding: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.sec-shield__icon {
  font-size: 3rem;
}

.sec-shield__badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.sec-shield__badge {
  padding: 0.25rem 0.75rem;
  font-size: 0.6875rem;
  font-weight: 600;
  font-family: var(--font-mono);
  letter-spacing: 0.05em;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.6);
}

.sec-shield__status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #22C55E;
}

.sec-shield__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22C55E;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* Bug Bounty */
.sec-bounty__card {
  padding: 4rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.sec-bounty__icon {
  font-size: 3rem;
}

.sec-bounty__card h2 {
  font-size: 1.75rem;
  font-weight: 700;
}

.sec-bounty__card p {
  font-size: 1rem;
  color: var(--color-muted-fg);
  max-width: 480px;
}

/* Responsive */
@media (max-width: 1024px) {
  .sec-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .sec-grid--3col {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .sec-section__inner,
  .sec-section__inner--reverse {
    grid-template-columns: 1fr;
    gap: 2rem;
    direction: ltr;
  }

  .sec-grid,
  .sec-grid--3col {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sec-shield__dot {
    animation: none;
  }
}
</style>
