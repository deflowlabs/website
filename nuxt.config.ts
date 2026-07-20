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
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxtjs/sitemap',
    'nuxt-og-image',
  ],

  // Font configuration — Geist (primary) + Geist Mono (data)
  fonts: {
    families: [
      { name: 'Geist', provider: 'google', weights: [400, 500, 600, 700] },
      { name: 'Geist Mono', provider: 'google', weights: [400, 500, 600] },
    ],
  },

  // Sitemap configuration — static + dynamic blog routes from Sanity
  sitemap: {
    siteUrl: 'https://deflowlabs.io',
    zeroRuntime: true,
    urls: [
      '/',
      '/product',
      '/about',
      '/labs',
      '/blog',
      '/contact',
      '/waitlist',
      '/for-desks',
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

  // Dynamic OG image generation
  ogImage: {
    defaults: {
      component: 'OgImageBlog',
    },
  },

  // Runtime configuration
  runtimeConfig: {
    // Server-only
    turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY || '',
    resendApiKey: process.env.RESEND_API_KEY || '',
    contactEmail: process.env.CONTACT_EMAIL || 'contact@deflowlabs.io',
    piiSaltSecret: process.env.PII_SALT_SECRET || '',
    public: {
      // Client-accessible
      turnstileSiteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY || '',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://deflowlabs.io',
      sanityProjectId: process.env.NUXT_SANITY_PROJECT_ID || '',
      sanityDataset: process.env.NUXT_SANITY_DATASET || 'production',
    },
  },

  // Route rules for performance
  routeRules: {
    '/': { prerender: true },
    '/product': { prerender: true },
    '/about': { prerender: true },
    '/labs': { isr: 3600 }, // Revalidate every hour (Sanity content)
    '/blog': { isr: 600 }, // Revalidate every 10 min
    '/blog/**': { isr: 3600 },
    '/legal/**': { prerender: true },
    '/waitlist': { prerender: true },
    '/for-desks': { prerender: true },
    '/security': { prerender: true },
    '/rss.xml': { isr: 600 }, // RSS feed, revalidate every 10 min
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
    preset: 'vercel', // Change to 'cloudflare-pages' if using CF
  },
})
