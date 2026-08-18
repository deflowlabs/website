# DeFlow Labs Marketing Website

The public [deflowlabs.io](https://deflowlabs.io) application, built with Nuxt 4, Vue 3, Tailwind CSS 4 and Sanity. This README is the single operating manual for local setup, CMS integration, APIs, testing, security and Vercel deployment.

**Runtime:** Node.js 24 LTS and npm 11+
**Rendering:** Nuxt SSR with Vercel ISR

## What this repository owns

- Public marketing and legal pages.
- Blog, announcement, Partner and Labs rendering from Sanity.
- Accessible Portable Text rendering and authenticated draft preview.
- Waitlist and contact APIs.
- SEO, RSS, sitemap, ISR and response security headers.

The sibling `/studio` owns Sanity schemas/editor UX. `/docs` is the separate static Nuxt Content application.

```text
Sanity Studio ──► Sanity dataset ──► allowlisted website query endpoint
                                             │
Browser ──► Nuxt SSR/ISR ────────────────────┼─► rendered marketing content
   │                                         │
   ├─ waitlist ─► Turnstile ─► HMAC hash ─► Postgres
   └─ contact ──► Turnstile ───────────────► Resend
```

## Technology

| Layer | Technology |
|---|---|
| Framework | Nuxt 4, Vue 3, SSR/ISR |
| Styling | Tailwind CSS 4 |
| CMS | Sanity Studio 6.9 and `@sanity/client` 7 |
| Rich content | `@portabletext/vue` with safe custom components |
| Storage | Neon/Vercel Postgres for waitlist hashes |
| Bot protection | Cloudflare Turnstile |
| Email | Resend |
| Deployment | Vercel |

## Local setup

```bash
npm install
cp .env.example .env
npm run dev
```

PowerShell:

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Open `http://localhost:3000`. Published Sanity pages need the project, dataset and API-date values. Form tests additionally need Turnstile, Resend, HMAC and Postgres credentials. Never copy production secrets onto an untrusted machine.

| Command | Purpose |
|---|---|
| `npm run dev` | Start local Nuxt |
| `npm run lint` | ESLint code-quality check |
| `npm run typecheck` | Nuxt/Vue type check |
| `npm test` | Node tests for queries, preview, URLs and server rules |
| `npm run build` | Production SSR/ISR build |
| `npm run preview` | Run built output locally |

## Environment variables

### Sanity and preview

| Variable | Purpose | Visibility |
|---|---|---|
| `NUXT_SANITY_PROJECT_ID` | Sanity project ID (`i34vbeac` currently) | Public configuration |
| `NUXT_SANITY_DATASET` | `production` or isolated preview dataset | Public configuration |
| `NUXT_SANITY_API_VERSION` | Pinned contract date, `2026-08-17` | Public configuration |
| `NUXT_SANITY_STUDIO_ORIGIN` | Exact Studio origin allowed to frame preview | Public configuration |
| `SANITY_API_READ_TOKEN` | Least-privilege Viewer token for server draft reads | **Server secret** |
| `SANITY_PREVIEW_COOKIE_SECRET` | Independent random value, at least 32 characters | **Server secret** |

### Forms and application

| Variable | Purpose | Visibility |
|---|---|---|
| `NUXT_PUBLIC_SITE_URL` | Canonical origin (`https://deflowlabs.io` in production) | Public |
| `NUXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile site key authorised for the hostname | Public |
| `TURNSTILE_SECRET_KEY` | Server verification secret | **Server secret** |
| `RESEND_API_KEY` | Contact-email delivery | **Server secret** |
| `CONTACT_EMAIL` | Contact recipient | Server configuration |
| `PII_SALT_SECRET` | Stable HMAC key for waitlist email hashes | **Server secret** |
| `POSTGRES_URL` | Waitlist database connection | **Server secret** |

Never expose a server secret through `NUXT_PUBLIC_*`. Generate preview-cookie and PII keys independently:

```powershell
[Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(32)).ToLower()
```

Changing `PII_SALT_SECRET` changes the same email’s stored hash and breaks deduplication unless performed with a planned migration.

## CMS query and preview architecture

Public mode:

```text
Page/component → useSanity → POST /api/sanity/query
→ known query identifier → checked-in GROQ → published perspective
```

Preview mode uses the same server boundary with authenticated preview state and draft perspective. The browser cannot submit arbitrary GROQ and never receives the read token.

| File | Responsibility |
|---|---|
| `app/utils/sanity-queries.ts` | GROQ projections, filters and deterministic ordering |
| `app/composables/useSanity.ts` | Component-facing query interface |
| `server/api/sanity/query.post.ts` | Query allowlist and server client |
| `server/utils/sanity-preview.ts` | Signed preview-cookie checks |
| `app/components/PortableContent.vue` | Accessible rich-content rendering |
| `app/types/sanity.generated.ts` | Generated schema/query types; do not edit |

Public queries exclude drafts and future publication dates, deterministically select featured/active records and order Labs by `displayOrder`.

## Running website and Studio together

1. Set the website’s Sanity values, read token, 32+ character cookie secret and `NUXT_SANITY_STUDIO_ORIGIN=http://localhost:3333`.
2. Start website on port 3000.
3. Set Studio `SANITY_STUDIO_PREVIEW_URL=http://localhost:3000` and start it on 3333.
4. Add both exact origins to Sanity CORS; enable credentials only where required.
5. Open Presentation from Studio and confirm draft content is limited to that authenticated session.
6. Visit `/api/preview/disable` when finished.

Restart website after changing Studio origin because CSP framing is built from runtime configuration.

## Changing Sanity content interfaces

Coordinate schema and consumer changes in this order:

1. Add an additive field/type in `/studio`.
2. Update the website GROQ projection.
3. From `/studio`, run `npm run schema:extract && npm run typegen`.
4. Consume the generated type and tolerate missing legacy fields.
5. Add fixtures for normal, missing and invalid values.
6. Build/deploy the compatible website before editors depend on the field.

`typegen` writes `website/app/types/sanity.generated.ts`. Fix its schema/query source rather than hand-editing it.

## Portable Text contract

`PortableContent.vue` renders headings, paragraphs, lists, marks, safe links, images and code. New blocks require a Studio schema, regenerated types, accessible renderer/fallback, safe URL handling and malformed/missing-value tests. Require meaningful alternative text for content images. Never fall back to paragraph-only rendering or untrusted HTML.

## Server APIs

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/waitlist` | Verify Turnstile, hash email and store deduplicated waitlist entry |
| `GET` | `/api/waitlist/count` | Return aggregate waitlist count |
| `POST` | `/api/contact` | Verify Turnstile and deliver contact email |
| `GET` | `/api/preview/enable` | Validate Presentation secret and enable signed draft preview |
| `GET` | `/api/preview/disable` | Clear preview state |
| `POST` | `/api/sanity/query` | Execute only an allowlisted CMS query |

New endpoints must validate input, keep secrets in runtime config, rate-limit plausible abuse, return minimal errors, avoid PII logs and include tests. Update this table.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm audit --omit=dev
npm run preview
```

Review home, product, about, Labs, blog index/detail, Portable Text, announcements, sitemap/RSS, mobile navigation and keyboard focus. Confirm drafts require preview, future posts stay absent, and waitlist/contact success plus failure paths work when credentials are present. Review lint warnings rather than silently increasing them.

## GitHub Actions

`.github/workflows/ci.yml` runs on pull requests and pushes to `master`, `stage` and `main` with Node 24. It installs from the lockfile, runs unit tests, lint, type checking, a production build and a high-severity production dependency audit. The workflow publishes a readable result table on the run **Summary** page, uses least-privilege permissions, cancels obsolete branch runs and requires no application secret for the quality build.

Dependabot reviews npm and GitHub Actions updates weekly. Action dependencies are pinned to immutable commit SHAs; review and merge its pull requests only after the full workflow passes.

## Vercel deployment

The website is SSR/ISR, not the static `/docs` build. `vercel.json` is authoritative.

| Setting | Value |
|---|---|
| Root Directory | `website` in a parent repository; blank when standalone |
| Framework Preset | Nuxt.js / automatic |
| Node.js | 24.x |
| Install | `npm ci` |
| Build | `npm run build` |
| Output | Leave empty; use Nuxt/Vercel Build Output API |
| Production Branch | `master` |
| Domain | `deflowlabs.io` plus canonical `www` redirect if used |

### Environment scoping

- **Production:** production dataset/domains, production Turnstile/Resend/database and `NUXT_PUBLIC_SITE_URL=https://deflowlabs.io`.
- **Preview:** isolated dataset, stable protected Studio/site origins, test keys and separate database. Never let arbitrary preview branches write to production waitlist data.
- **Development:** local origins and authorised development credentials.

Environment changes apply only to new deployments. Redeploy after updates.

External-service checklist:

1. Register exact Studio/site origins in Sanity CORS.
2. Authorise production/stable preview hostnames in Turnstile.
3. Verify the Resend sending domain and recipient.
4. Connect Postgres and apply the waitlist table migration.
5. Create a least-privilege Sanity Viewer token.
6. Match Studio Preview URL and website Studio origin per environment.

Before promotion, run the full verification commands, deploy Preview, complete website/content/legal/admin UAT, then promote. Account for ISR revalidation when checking new content instead of repeatedly republishing.

## Security and recovery

- Keep Sanity tokens, form secrets, DB URLs and HMAC salts server-only.
- Preserve exact CORS/Studio origins, CSP framing, MIME-sniffing, referrer and permissions headers.
- Preserve query allowlisting and safe external-URL validation.
- Never log raw waitlist/contact emails or secrets.
- Use separate preview resources and rotate credentials after access changes.
- Monitor server functions, Sanity queries, Resend and database availability.
- Roll back app defects through Vercel history; recover CMS changes through additive migrations/document history.

## Troubleshooting

- **No CMS content:** verify project/dataset/API date, `/api/sanity/query`, publication date and query filters.
- **Preview shows published only:** verify server token, cookie-secret length, exact Studio origin/CORS/CSP; clear preview and restart both apps.
- **Generated type is stale:** extract/typegen from sibling `/studio`; ensure queries remain under website `app` or `server`.
- **Host-only build failure:** compare Node and exact environment names; check public/server prefixes and Nuxt Vercel preset.
- **Fonts perform build-time network work:** migrate approved Geist assets to a local source and visually verify before removing provider configuration.

## Code and maintenance standard

Document exported utilities/composables, query/security boundaries, preview invariants and non-obvious fallbacks close to code. Comments explain intent and trade-offs, not syntax. Update this README whenever environment, API, CMS, deployment or recovery behaviour changes.

Proprietary © DeFlow Labs
