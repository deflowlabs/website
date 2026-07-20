# DeFlow Labs — Marketing Website

The institutional settlement layer for digital asset dealflows.

## Tech Stack

- **Framework:** Nuxt 4 (Vue 3)
- **Styling:** Tailwind CSS v4
- **CMS:** Sanity (headless)
- **Fonts:** Geist + Geist Mono via `@nuxt/fonts`
- **Deployment:** Vercel (SSR + ISR)
- **OG Images:** `nuxt-og-image` (Satori renderer)

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
node .output/server/index.mjs
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Description |
|:---------|:------------|
| `NUXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret |
| `RESEND_API_KEY` | Resend email API key |
| `CONTACT_EMAIL` | Contact form recipient |
| `PII_SALT_SECRET` | HMAC salt for email hashing |
| `NUXT_PUBLIC_SITE_URL` | Production URL |
| `NUXT_SANITY_PROJECT_ID` | Sanity project ID |
| `NUXT_SANITY_DATASET` | Sanity dataset name |

## License

Proprietary © DeFlow Labs
