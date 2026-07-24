# DeFlow Labs — Marketing Website

The institutional settlement layer for digital asset dealflows.

## Tech Stack

- **Framework:** Nuxt 4 (Vue 3)
- **Styling:** Tailwind CSS v4
- **CMS:** Sanity (headless)
- **Fonts:** Geist + Geist Mono via `@nuxt/fonts`
- **Database:** Vercel Postgres (Neon) — waitlist storage
- **Deployment:** Vercel (SSR + ISR)
- **OG Images:** `nuxt-og-image` (Satori renderer)

## Getting Started

```bash
# Install dependencies
npm install

# Generate Nuxt types
npx nuxt prepare

# Start dev server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Description |
|:---------|:------------|
| `NUXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret |
| `RESEND_API_KEY` | Resend email API key |
| `CONTACT_EMAIL` | Contact form recipient |
| `PII_SALT_SECRET` | HMAC salt for email hashing (Zero-PII) |
| `NUXT_PUBLIC_SITE_URL` | Production URL |
| `NUXT_SANITY_PROJECT_ID` | Sanity project ID |
| `NUXT_SANITY_DATASET` | Sanity dataset name |
| `POSTGRES_URL` | Vercel Postgres (Neon) connection string — auto-injected by Vercel |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/waitlist` | Waitlist signup (Turnstile + Zero-PII hash → Postgres) |
| `GET` | `/api/waitlist/count` | Current waitlist count |
| `POST` | `/api/contact` | Contact form (Turnstile + Resend email) |

## License

Proprietary © DeFlow Labs
