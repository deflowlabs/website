<template>
  <nav class="navbar glass" :class="{ 'navbar--scrolled': isScrolled }" :style="{ top: navTop }">
    <div class="navbar__inner container">
      <!-- Logo -->
      <NuxtLink to="/" class="navbar__logo" aria-label="DeFlow Labs Home">
        <span class="navbar__logo-icon">◆</span>
        <span class="navbar__logo-text">DeFlow</span>
      </NuxtLink>

      <!-- Desktop Navigation -->
      <ul class="navbar__links">
        <li
          v-for="group in navGroups"
          :key="group.label"
          class="navbar__dropdown"
          @mouseenter="openDropdown = group.label"
          @mouseleave="openDropdown = null"
        >
          <button
            class="navbar__link"
            :aria-expanded="openDropdown === group.label"
            aria-haspopup="true"
          >
            {{ group.label }}
            <svg class="navbar__chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          <Transition name="dropdown-fade">
            <div v-if="openDropdown === group.label" class="navbar__dropdown-menu" role="menu">
              <NuxtLink
                v-for="item in group.items"
                :key="item.to"
                :to="item.to"
                :target="item.external ? '_blank' : undefined"
                :rel="item.external ? 'noopener noreferrer' : undefined"
                class="navbar__dropdown-item"
                role="menuitem"
                @click="openDropdown = null"
              >
                <span class="navbar__dropdown-icon">{{ item.icon }}</span>
                <div>
                  <span class="navbar__dropdown-label">{{ item.label }}</span>
                  <span v-if="item.desc" class="navbar__dropdown-desc">{{ item.desc }}</span>
                </div>
              </NuxtLink>
            </div>
          </Transition>
        </li>
      </ul>

      <!-- CTAs -->
      <div class="navbar__actions">
        <NuxtLink to="/contact" class="btn btn-secondary btn-sm">
          Contact Us
        </NuxtLink>
        <NuxtLink to="/waitlist" class="btn btn-primary btn-sm">
          Join Waitlist
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </NuxtLink>

        <!-- Mobile toggle -->
        <button
          class="navbar__toggle"
          :aria-expanded="isMobileOpen"
          aria-label="Toggle navigation menu"
          @click="isMobileOpen = !isMobileOpen"
        >
          <span class="navbar__toggle-bar" />
          <span class="navbar__toggle-bar" />
          <span class="navbar__toggle-bar" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition name="slide-down">
      <div v-if="isMobileOpen" class="navbar__mobile">
        <div
          v-for="group in navGroups"
          :key="group.label"
          class="navbar__mobile-group"
        >
          <button
            class="navbar__mobile-heading"
            :aria-expanded="mobileExpanded === group.label"
            @click="mobileExpanded = mobileExpanded === group.label ? null : group.label"
          >
            {{ group.label }}
            <svg
              class="navbar__mobile-chevron"
              :class="{ 'navbar__mobile-chevron--open': mobileExpanded === group.label }"
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          <Transition name="accordion">
            <ul v-if="mobileExpanded === group.label" class="navbar__mobile-links">
              <li v-for="item in group.items" :key="item.to">
                <NuxtLink
                  :to="item.to"
                  :target="item.external ? '_blank' : undefined"
                  class="navbar__mobile-link"
                  @click="isMobileOpen = false"
                >
                  <span>{{ item.icon }}</span>
                  {{ item.label }}
                </NuxtLink>
              </li>
            </ul>
          </Transition>
        </div>
        <div class="navbar__mobile-ctas">
          <NuxtLink to="/contact" class="btn btn-secondary" style="width: 100%" @click="isMobileOpen = false">
            Contact Us
          </NuxtLink>
          <NuxtLink to="/waitlist" class="btn btn-primary" style="width: 100%" @click="isMobileOpen = false">
            Join Waitlist
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
/**
 * NavBar v2 — Mega-menu dropdown navigation with institutional feel.
 * Glass blur effect on scroll. Accordion mobile menu.
 * Offset by 40px when announcement banner is visible.
 */
interface NavItem {
  to: string
  label: string
  icon: string
  desc?: string
  external?: boolean
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: 'Solutions',
    items: [
      { to: '/product', label: 'Product', icon: '◆', desc: 'Settlement infrastructure overview' },
      { to: '/for-desks', label: 'For Desks', icon: '🏢', desc: 'White-label for trading desks' },
    ],
  },
  {
    label: 'Community',
    items: [
      { to: 'https://github.com/DeFlowLabs', label: 'GitHub', icon: '💻', external: true },
      { to: 'https://x.com/DeFlowLabs', label: 'X / Twitter', icon: '𝕏', external: true },
      { to: 'https://linkedin.com/company/deflowlabs', label: 'LinkedIn', icon: '🔗', external: true },
    ],
  },
  {
    label: 'Resources',
    items: [
      { to: '/blog', label: 'Blog', icon: '📰', desc: 'News & engineering insights' },
      { to: '/labs', label: 'Labs', icon: '🔬', desc: 'Research & open-source' },
      { to: '/security', label: 'Security', icon: '🛡️', desc: 'Audits, compliance & trust' },
    ],
  },
  {
    label: 'Company',
    items: [
      { to: '/about', label: 'About', icon: '🏛️', desc: 'Mission & team' },
      { to: '/contact', label: 'Contact', icon: '✉️', desc: 'Get in touch' },
    ],
  },
]

const props = defineProps<{
  announcementOffset?: boolean
}>()

const isScrolled = ref(false)
const isMobileOpen = ref(false)
const openDropdown = ref<string | null>(null)
const mobileExpanded = ref<string | null>(null)

// Announcement banner offset
const navTop = computed(() => props.announcementOffset ? '40px' : '0')

onMounted(() => {
  const handleScroll = () => {
    isScrolled.value = window.scrollY > 20
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', handleScroll))

  // Close dropdown on Escape
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      openDropdown.value = null
      isMobileOpen.value = false
    }
  }
  document.addEventListener('keydown', handleEscape)
  onUnmounted(() => document.removeEventListener('keydown', handleEscape))
})

// Close mobile menu on route change
const route = useRoute()
watch(() => route.path, () => {
  isMobileOpen.value = false
  openDropdown.value = null
})
</script>

<style scoped>
.navbar {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(11, 11, 20, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.3s ease;
}

.navbar--scrolled {
  background: rgba(11, 11, 20, 0.9);
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.navbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}

/* Logo */
.navbar__logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.navbar__logo-icon {
  font-size: 1.25rem;
  background: linear-gradient(135deg, #D3D3D3, #A3A3A3, #555555);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.navbar__logo-text {
  font-family: var(--font-primary);
  font-size: 1.25rem;
  font-weight: 700;
  color: #FFFFFF;
  letter-spacing: -0.02em;
}

/* Desktop Links */
.navbar__links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  list-style: none;
}

.navbar__dropdown {
  position: relative;
}

.navbar__link {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
  border-radius: var(--radius-card);
}

.navbar__link:hover {
  color: #FFFFFF;
}

.navbar__link:focus-visible {
  outline: 2px solid var(--color-ring);
  outline-offset: 2px;
}

.navbar__chevron {
  transition: transform 0.2s ease;
}

.navbar__dropdown:hover .navbar__chevron {
  transform: rotate(180deg);
}

/* Dropdown Menu */
.navbar__dropdown-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  min-width: 260px;
  padding: 0.5rem;
  margin-top: 0.5rem;
  background: rgba(18, 18, 28, 0.98);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.75rem;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
}

.navbar__dropdown-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: background 0.15s ease;
}

.navbar__dropdown-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.navbar__dropdown-icon {
  font-size: 1rem;
  line-height: 1.4;
  flex-shrink: 0;
}

.navbar__dropdown-label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.navbar__dropdown-desc {
  display: block;
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 0.125rem;
}

/* CTAs */
.navbar__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-sm {
  min-height: 2.25rem;
  padding: 0.375rem 1rem;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Mobile Toggle */
.navbar__toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.navbar__toggle-bar {
  display: block;
  width: 20px;
  height: 2px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 1px;
  transition: all 0.2s ease;
}

/* Mobile Menu */
.navbar__mobile {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 1rem 1.5rem 1.5rem;
  background: rgba(11, 11, 20, 0.95);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  max-height: calc(100vh - 72px);
  overflow-y: auto;
}

.navbar__mobile-group {
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.navbar__mobile-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.875rem 0;
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.45);
  background: none;
  border: none;
  cursor: pointer;
}

.navbar__mobile-heading:focus-visible {
  outline: 2px solid var(--color-ring);
  outline-offset: 2px;
}

.navbar__mobile-chevron {
  transition: transform 0.2s ease;
}

.navbar__mobile-chevron--open {
  transform: rotate(180deg);
}

.navbar__mobile-links {
  list-style: none;
  padding-bottom: 0.5rem;
}

.navbar__mobile-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.5rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  border-radius: var(--radius-card);
  transition: all 0.2s ease;
}

.navbar__mobile-link:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #FFFFFF;
}

.navbar__mobile-ctas {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

/* Dropdown Transition */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.2s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-4px);
}

/* Accordion Transition */
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
}

.accordion-enter-to {
  max-height: 300px;
}

/* Slide Down */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive */
@media (max-width: 768px) {
  .navbar__links {
    display: none;
  }

  .navbar__toggle {
    display: flex;
  }

  .navbar__actions .btn {
    display: none;
  }
}
</style>
