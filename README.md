# DeFlow Labs — Marketing Website

> Institutional-grade marketing website for the DeFlow settlement platform. Built with Nuxt 4, Tailwind CSS v4, and Sanity CMS.

[![Nuxt](https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxtdotjs&logoColor=white)](https://nuxt.com/)
[![Vue](https://img.shields.io/badge/Vue-3-4FC08D?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?logo=vercel&logoColor=white)](https://vercel.com/)

**Live:** [deflowlabs.io](https://deflowlabs.io)

## Overview

The DeFlow Labs website serves as the primary public-facing interface for the platform, featuring:

- **Landing page** with product overview and value proposition
- **Blog** powered by Sanity CMS with rich content and SEO optimization
- **Waitlist** with Cloudflare Turnstile CAPTCHA and Zero-PII email hashing
- **Contact form** via Resend email API
- **Dynamic OG images** generated with `nuxt-og-image` (Satori renderer)

## Tech Stack

| Layer | Technology |
|:------|:-----------|
| Framework | Nuxt 4 (Vue 3, SSR + ISR) |
| Styling | Tailwind CSS v4 |
| CMS | Sanity v5 (headless, via `@nuxt/sanity`) |
| Typography | Geist + Geist Mono (`@nuxt/fonts`) |
| Database | Vercel Postgres (Neon) — waitlist storage |
| CAPTCHA | Cloudflare Turnstile |
| Email | Resend API |
| OG Images | `nuxt-og-image` (Satori) |
| Deployment | Vercel (SSR + ISR) |

## Getting Started

### Prerequisites

- Node.js ≥ 18
- Access to Sanity project (see `@deflow/studio`)

### Setup

```bash
# Install dependencies
npm install

# Generate Nuxt types
npx nuxt prepare

# Copy environment variables
cp .env.example .env

# Start dev server (http://localhost:3000)
npm run dev
```

### Production Build

```bash
npm run build
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description |
|:---------|:------------|
| `NUXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key |
| `RESEND_API_KEY` | Resend email API key |
| `CONTACT_EMAIL` | Contact form recipient address |
| `PII_SALT_SECRET` | HMAC-SHA256 salt for Zero-PII email hashing |
| `NUXT_PUBLIC_SITE_URL` | Production URL (e.g., `https://deflowlabs.io`) |
| `NUXT_SANITY_PROJECT_ID` | Sanity project identifier |
| `NUXT_SANITY_DATASET` | Sanity dataset name (default: `production`) |
| `POSTGRES_URL` | Vercel Postgres connection string (auto-injected by Vercel) |

## API Endpoints

| Method | Path | Description |
|:-------|:-----|:------------|
| `POST` | `/api/waitlist` | Waitlist signup — Turnstile verification + Zero-PII email hash → Postgres |
| `GET` | `/api/waitlist/count` | Returns current waitlist count |
| `POST` | `/api/contact` | Contact form submission — Turnstile verification + Resend email delivery |

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Sanity     │────▶│   Website    │────▶│   Vercel     │
│   Studio     │     │   (Nuxt 4)   │     │   (SSR/ISR)  │
└──────────────┘     └──────┬───────┘     └──────────────┘
                            │
                    ┌───────┴───────┐
                    │               │
              ┌─────▼─────┐  ┌─────▼─────┐
              │  Postgres  │  │  Resend   │
              │  (Neon)    │  │  (Email)  │
              └────────────┘  └───────────┘
```

## Content Management

Blog content is managed through the companion [Sanity Studio](../studio). Content updates are delivered in real-time via Sanity's CDN with ISR caching on Vercel.

## Security

- **Zero-PII:** Email addresses are HMAC-SHA256 hashed before database storage. Raw emails are never persisted.
- **CAPTCHA:** All form submissions are protected by Cloudflare Turnstile.
- **Server-side validation:** All API routes validate input and verify Turnstile tokens server-side.

## License

Proprietary © DeFlow Labs
