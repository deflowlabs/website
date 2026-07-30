/**
 * DeFlow Labs — Marketing Website
 * Nuxt 4 configuration with Sanity CMS, SEO, image optimization, and Tailwind CSS.
 * Follows the "Atmospheric Institutional" design system.
 */
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'DeFlow Labs — Institutional Settlement Layer for Digital Asset Dealflows',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'DeFlow is the institutional settlement layer for digital asset dealflows. Non-custodial smart escrow, compliant identity verification, and programmable settlement.',
        },
        { name: 'theme-color', content: '#0B0B14' },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'DeFlow Labs' },
        {
          property: 'og:title',
          content: 'DeFlow Labs — Institutional Settlement Layer for Digital Asset Dealflows',
        },
        {
          property: 'og:description',
          content: 'Non-custodial smart escrow, compliant identity verification, and programmable settlement for digital assets.',
        },
        { property: 'og:image', content: 'https://deflowlabs.io/og-image.png' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'DeFlow Labs' },
        {
          name: 'twitter:description',
          content: 'The institutional settlement layer for digital asset dealflows.',
        },
        { name: 'twitter:image', content: 'https://deflowlabs.io/og-image.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'alternate', type: 'application/rss+xml', title: 'DeFlow Labs Blog', href: '/rss.xml' },
        // DFL-022: Preconnect to Sanity CDN for faster blog image loading
        { rel: 'preconnect', href: 'https://cdn.sanity.io', crossorigin: '' },
        { rel: 'dns-prefetch', href: 'https://cdn.sanity.io' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxtjs/sitemap',
  ],

  // Site URL — required by sitemap module during prerender
  site: {
    url: 'https://deflowlabs.io',
  },

  // Icon configuration — Lucide icons for Atmospheric Institutional design
  icon: {
    serverBundle: 'local',
    collections: ['lucide'],
  },

  // Font configuration — Geist (primary) + Geist Mono (data)
  fonts: {
    families: [
      { name: 'Geist', provider: 'google', weights: [400, 500, 600, 700] },
      { name: 'Geist Mono', provider: 'google', weights: [400, 500, 600] },
    ],
  },

  // Sitemap configuration — static + dynamic blog routes from Sanity
  sitemap: {
    zeroRuntime: true,
    urls: [
      '/',
      '/product',
      '/about',
      '/labs',
      '/blog',
      '/contact',
      '/waitlist',
      '/for-institutions',
      '/security',
      '/legal/terms',
      '/legal/privacy',
      '/legal/risk',
    ],
  },

  // Image optimization
  image: {
    quality: 80,
    format: ['webp', 'avif'],
  },

  // Runtime configuration
  runtimeConfig: {
    // Server-only
    turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY || '',
    resendApiKey: process.env.RESEND_API_KEY || '',
    contactEmail: process.env.CONTACT_EMAIL || 'contact@deflowlabs.io',
    piiSaltSecret: process.env.PII_SALT_SECRET || '',
    postgresUrl: process.env.POSTGRES_URL || '',
    public: {
      // Client-accessible
      turnstileSiteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY || '',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://deflowlabs.io',
      sanityProjectId: process.env.NUXT_SANITY_PROJECT_ID || '',
      sanityDataset: process.env.NUXT_SANITY_DATASET || 'production',
    },
  },

  // Route rules for performance — ISR on Vercel (no build-time prerendering required)
  routeRules: {
    '/': { isr: 3600 },
    '/product': { isr: 3600 },
    '/about': { isr: 3600 },
    '/labs': { isr: 3600 },
    '/blog': { isr: 600 },
    '/blog/**': { isr: 3600 },
    '/legal/**': { isr: 86400 },
    '/waitlist': { isr: 3600 },
    '/for-institutions': { isr: 3600 },
    '/security': { isr: 3600 },
    '/rss.xml': { isr: 600 },
    // DFL-032: Redirect intuitive alias to canonical route
    '/institutions': { redirect: { to: '/for-institutions', statusCode: 301 } },
  },

  // Vite configuration — Tailwind v4 plugin + exclude React deps
  vite: {
    plugins: [
      tailwindcss(),
    ],
    optimizeDeps: {
      exclude: ['react-compiler-runtime', 'react', 'react-dom'],
      include: ['@sanity/client'],
    },
  },

  // Nitro server configuration
  nitro: {
    preset: 'vercel',
    // DFL-010: Security headers — remove framework fingerprint, add defense-in-depth
    routeRules: {
      '/**': {
        headers: {
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        },
      },
    },
  },
})
