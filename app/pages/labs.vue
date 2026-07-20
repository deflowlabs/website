<template>
  <div class="labs-page">
    <!-- Hero -->
    <section class="labs-hero section">
      <div class="container">
        <div class="labs-hero__inner">
          <div class="labs-hero__content">
            <span class="badge badge-premium">DeFlow Labs</span>
            <h1>Where finance meets<br />frontier research</h1>
            <p>
              DeFlow Labs is the R&amp;D arm of DeFlow Labs, Inc. We collaborate with
              top universities and PhD researchers to advance digital asset
              infrastructure, compliance frameworks, and settlement technology.
            </p>
          </div>
          <div class="labs-hero__visual">
            <div class="labs-hero__orb" />
          </div>
        </div>
      </div>
    </section>

    <!-- Mission -->
    <section class="labs-mission section">
      <div class="container">
        <div class="labs-mission__grid">
          <div v-for="pillar in pillars" :key="pillar.title" class="labs-mission__card glass-card">
            <span class="labs-mission__icon">{{ pillar.icon }}</span>
            <h3>{{ pillar.title }}</h3>
            <p>{{ pillar.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Active Projects -->
    <section class="labs-projects section">
      <div class="container">
        <div class="section-header">
          <span class="badge badge-info">Active Research</span>
          <h2>Current Projects</h2>
          <p>Ongoing research initiatives and collaborations.</p>
        </div>

        <div class="labs-projects__grid">
          <!-- Dynamic Sanity projects -->
          <div v-for="project in projects" :key="project.slug" class="labs-project glass-card">
            <div class="labs-project__header">
              <span
                class="badge"
                :class="{
                  'badge-success': project.status === 'active',
                  'badge-warning': project.status === 'upcoming',
                  'badge-info': project.status === 'completed',
                }"
              >
                {{ project.status.charAt(0).toUpperCase() + project.status.slice(1) }}
              </span>
            </div>
            <h3>{{ project.title }}</h3>
            <p v-if="project.partner" class="labs-project__partner">{{ project.partner }}</p>
            <p class="labs-project__desc">{{ project.description }}</p>
            <div v-if="project.tags?.length" class="labs-project__tags">
              <span v-for="tag in project.tags" :key="tag" class="labs-project__tag">{{ tag }}</span>
            </div>
            <a
              v-if="project.publicationUrl"
              :href="project.publicationUrl"
              target="_blank"
              rel="noopener"
              class="labs-project__link"
            >
              View Publication →
            </a>
          </div>

          <!-- Coming Soon Placeholder -->
          <div class="labs-project glass-card labs-project--placeholder">
            <div class="labs-project__placeholder">
              <span>+</span>
              <p>More projects coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Collaborate CTA -->
    <section class="labs-cta section">
      <div class="container" style="text-align: center">
        <h2>Interested in collaborating?</h2>
        <p style="color: var(--color-muted-fg); margin: 1rem 0 2rem; max-width: 480px; margin-left: auto; margin-right: auto">
          We're always looking for researchers, universities, and institutions
          interested in pushing the boundaries of digital asset infrastructure.
        </p>
        <NuxtLink to="/contact" class="btn btn-primary btn-lg">
          Get in Touch
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
/**
 * Labs page — R&D arm of DeFlow Labs.
 * Fetches projects from Sanity CMS, falls back to placeholder for upcoming project.
 */
import { LABS_PROJECTS_QUERY } from '~/utils/sanity-queries'

useHead({
  title: 'Labs — DeFlow Labs',
  meta: [
    { name: 'description', content: 'DeFlow Labs R&D — collaborating with universities and PhD researchers to advance digital asset infrastructure and settlement technology.' },
  ],
})

const { sanityFetch } = useSanity()
const { data: sanityProjects } = await useAsyncData('labs-projects', () =>
  sanityFetch(LABS_PROJECTS_QUERY),
)

const placeholderProject = [
  {
    slug: 'research-project-1',
    title: 'Research Project #1',
    status: 'upcoming',
    partner: 'Partner to be announced',
    description: 'Details on our first research collaboration will be shared soon. This project focuses on advancing settlement infrastructure for institutional digital asset markets.',
    tags: ['Settlement', 'Infrastructure'],
  },
]

const projects = computed(() => {
  const p = sanityProjects.value
  return p?.length ? p : placeholderProject
})

const pillars = [
  {
    icon: '🔬',
    title: 'Settlement Research',
    description: 'Advancing on-chain settlement mechanisms, cross-chain atomic swaps, and programmable escrow patterns.',
  },
  {
    icon: '📜',
    title: 'Compliance Innovation',
    description: 'Zero-knowledge identity proofs, privacy-preserving KYC, and regulatory framework analysis for digital assets.',
  },
  {
    icon: '🏛️',
    title: 'Academic Partnerships',
    description: 'Collaborating with top-tier universities on peer-reviewed research, publishing papers, and funding PhD positions.',
  },
]
</script>

<style scoped>
.labs-hero__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.labs-hero__content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}

.labs-hero__content h1 {
  font-size: clamp(2rem, 4vw, 3rem);
}

.labs-hero__visual {
  display: flex;
  align-items: center;
  justify-content: center;
}

.labs-hero__orb {
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: var(--gradient-purple-nebula);
  filter: blur(80px);
  opacity: 0.3;
  animation: float 8s ease-in-out infinite;
}

.labs-mission__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.labs-mission__card {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.labs-mission__icon {
  font-size: 2rem;
}

.labs-mission__card p {
  font-size: 0.875rem;
  line-height: 1.6;
}

.labs-projects__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.labs-project {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.labs-project__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.labs-project h3 {
  font-size: 1.25rem;
}

.labs-project__partner {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.4);
  font-style: italic;
}

.labs-project__desc {
  font-size: 0.875rem;
  line-height: 1.6;
}

.labs-project__tags {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.labs-project__tag {
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-pill);
  font-size: 0.6875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.labs-project__link {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  margin-top: auto;
  transition: color 0.2s ease;
}

.labs-project__link:hover {
  color: #FFFFFF;
}

.labs-project--placeholder {
  border-style: dashed;
  min-height: 200px;
}

.labs-project__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.5);
}

.labs-project__placeholder span {
  font-size: 2rem;
  font-weight: 300;
}

.labs-project__placeholder p {
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .labs-hero__inner {
    grid-template-columns: 1fr;
  }

  .labs-hero__visual {
    display: none;
  }

  .labs-mission__grid,
  .labs-projects__grid {
    grid-template-columns: 1fr;
  }
}
</style>
