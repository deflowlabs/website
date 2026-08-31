# DeFlow Labs Marketing Website

The public [deflowlabs.io](https://deflowlabs.io) application, built with Nuxt 4, Vue 3, Tailwind CSS 4 and Sanity. This README is the single operating manual for local setup, CMS integration, APIs, testing, security and Vercel deployment.

**Runtime:** Node.js 24 LTS and npm 11+
**Rendering:** Nuxt SSR with Vercel ISR

## What this repository owns

- Public marketing and legal pages.
- Blog, website-banner, public Partner and Labs rendering from Sanity.
- Accessible Portable Text rendering and authenticated live visual editing.
- Waitlist and contact APIs.
- SEO, RSS, sitemap, ISR and response security headers.

The sibling `/studio` owns Sanity schemas/editor UX. `/docs` is the separate static Nuxt Content application.

```text
Sanity Studio ──► Sanity dataset ──► published CDN ──► deflowlabs.io ISR
       │                    │
       └─ Presentation ─────┴─► preview.deflowlabs.io (private/no-store)
                                      │
Browser ──► Nuxt SSR/ISR ─────────────┼─► rendered marketing content
   │                                  │
   ├─ waitlist ─► Turnstile ─► HMAC hash ─► Postgres
   └─ contact ──► Turnstile ───────────────► Resend
```

## Technology

| Layer | Technology |
|---|---|
| Framework | Nuxt 4, Vue 3, SSR/ISR |
| Styling | Tailwind CSS 4 |
| CMS | Sanity Studio 6.9, `@nuxtjs/sanity` 2.5 and `@sanity/client` 7 |
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
| `NUXT_SANITY_PREVIEW_ENABLED` | `true` only on the dedicated preview deployment; `false` in production | Public configuration |
| `NUXT_SANITY_STUDIO_ORIGIN` | Exact Studio origin allowed to frame the dedicated preview site | Public configuration |
| `SANITY_API_READ_TOKEN` | Least-privilege Viewer token for server-only draft reads | **Preview server secret only** |
| `SANITY_REVALIDATE_SECRET` | Shared high-entropy signing secret for the Sanity publish webhook | **Server secret** |
| `VERCEL_ISR_BYPASS_TOKEN` | Vercel token used by the signed endpoint to purge affected ISR routes | **Server secret** |

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

Never expose a server secret through `NUXT_PUBLIC_*`. Generate the PII key independently:

```powershell
[Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(32)).ToLower()
```

Changing `PII_SALT_SECRET` changes the same email’s stored hash and breaks deduplication unless performed with a planned migration.

## CMS query and preview architecture

Public mode uses checked-in GROQ through `useSanityQuery`, the published perspective and Sanity's CDN:

```text
Page/component → useSanityQuery → checked-in GROQ
→ published perspective → Sanity CDN
```

Production has `NUXT_SANITY_PREVIEW_ENABLED=false`, no Viewer token, no Visual Editing endpoints or stega configuration, and permits framing only by itself. Presentation targets the separate `https://preview.deflowlabs.io` deployment. That deployment has preview enabled, a server-only Viewer token, private/no-store responses, no ISR and global `noindex, nofollow`. The browser never receives the token.

| File | Responsibility |
|---|---|
| `app/utils/sanity-queries.ts` | GROQ projections, filters and deterministic ordering |
| `nuxt.config.ts` | Sanity client, secure preview proxy, Visual Editing and framing policy |
| `app/components/SanityImage.vue` | Crop/hotspot-aware responsive Sanity images |
| `app/components/PortableContent.vue` | Accessible rich-content rendering |
| `app/types/sanity.generated.ts` | Generated schema/query types; do not edit |

Public queries exclude drafts and future publication dates. Featured placement requires `isFeatured == true`; populated categories come from referenced published posts; private Partners are projected as `null`; Labs uses explicit `displayOrder`. Sanity images are rendered through crop/hotspot-aware WebP and JPEG sources because those are the Content Lake CDN formats used by this integration.

### CMS-to-website field contract

| Content | Field | Classification | Website behaviour |
|---|---|---|---|
| Post | title, slug, excerpt, body, publishedAt, readingTime | Rendered | Blog cards/detail, dates and reading time; author attribution appears on the article, not listing cards |
| Post | categories | Rendered + behavioural | First category is the badge; every category is filterable; slug `announcements` controls the leading announcement-story slot |
| Post | isFeatured | Behavioural | Exactly one explicit featured slot; never inferred from recency |
| Post | coverImage/crop/hotspot/alt | Rendered | Responsive 16:9 card/detail images |
| Post | SEO title, description, image, noIndex | Behavioural | Metadata, social preview, robots and sitemap inclusion |
| Author | name, slug, portrait, role, biography, public links | Rendered | Attribution and `/blog/author/[slug]` |
| Labs project | title, summary, cover, tags, status, partner | Rendered | Non-interactive cards on `/labs` |
| Labs project | dates, displayOrder | Behavioural | Date validation and stable Labs ordering; dates are not displayed |
| Labs project | slug, details, CTA, publication URL, SEO | Legacy | Preserved in Sanity for existing records; hidden from editors and not queried publicly |
| Partner | name, logo, URL | Rendered conditionally | Exposed only when `isPublic == true` |
| Partner | internalNote | Internal-only | Never queried by the website |
| Website banner | text, tone, CTA, isActive, revision | Rendered + behavioural | Client-fetched banner, accessible tone/style and revision-keyed dismissal |
| Legacy fields | old SEO, Labs partner text, banner link/colour | Legacy | Read-only migration compatibility; never used as a public fallback |

## Running website and Studio together

1. Set `NUXT_SANITY_PREVIEW_ENABLED=true`, the website’s Sanity values, Viewer token and `NUXT_SANITY_STUDIO_ORIGIN=http://localhost:3333`.
2. Start website on port 3000.
3. Set Studio `SANITY_STUDIO_PREVIEW_URL=http://localhost:3000` and start it on 3333.
4. Add both exact origins to Sanity CORS; enable credentials only where required.
5. Open Presentation from Studio and confirm draft content is limited to that authenticated session.
6. Use Presentation's preview control or visit `/preview/disable` when finished.

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
| `POST` | `/api/sanity/revalidate` | Verify a signed Sanity publish event and purge affected Vercel ISR routes |
| `GET` | `/preview/enable` | Module-owned signed-secret validation and secure preview activation |
| `GET` | `/preview/disable` | Module-owned preview-state removal |
| `POST` | `/_sanity/visual-editing/fetch` | Protected server-only draft query forwarding for Presentation |

The preview routes exist only when `NUXT_SANITY_PREVIEW_ENABLED=true`. New endpoints must validate input, keep secrets in runtime config, rate-limit plausible abuse, return minimal errors, avoid PII logs and include tests.

### Sanity publish webhook

Create one Sanity webhook for published `create`, `update` and `delete` events. Enable the webhook secret, use `SANITY_REVALIDATE_SECRET`, target `https://deflowlabs.io/api/sanity/revalidate`, and use this projection:

```groq
{
  "operation": delta::operation(),
  "before": before(){_id, _type, "slug": slug.current},
  "after": after(){_id, _type, "slug": slug.current}
}
```

The endpoint verifies Sanity's signature plus `sanity-project-id` and `sanity-dataset`, rejects drafts and unknown types, and sends Vercel's `x-prerender-revalidate` header only for affected Blog, author, Labs index, RSS and sitemap routes. Delivery is safe to repeat.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm audit --omit=dev
npm run preview
```

Review home, product, about, Labs index, Blog index/detail, Portable Text, announcements, sitemap/RSS, mobile navigation and keyboard focus. Confirm `/labs/<slug>` returns 404, drafts require preview, future posts stay absent, and waitlist/contact success plus failure paths work when credentials are present. Review lint warnings rather than silently increasing them.

## GitHub Actions

`.github/workflows/ci.yml` runs on pull requests and pushes to `main` with Node 24. Its stable required check is `Website / Required`, aggregating:

- unit tests, lint, types, published-only production build and production dependency audit;
- desktop/mobile Playwright and automated accessibility checks with retained HTML, trace, screenshot and video evidence;
- a dedicated Presentation build that proves the server-only Sanity read token is absent from browser assets;
- actionlint, zizmor, Trivy secret/misconfiguration checks, the repository Semgrep policy and a CycloneDX SBOM.

`.github/workflows/deployment-smoke.yml` accepts only `https://deflowlabs.io` or `https://preview.deflowlabs.io`. It can be run manually, and Vercel's GitHub integration can trigger it automatically with the native `vercel.deployment.success` repository-dispatch event. Repository-dispatch events for non-production environments or unknown projects are ignored at the job boundary so normal preview deployments do not create false failures. For accepted events, the workflow maps Vercel's unique deployment URL to the stable canonical domain and rejects arbitrary hosts before making a request.

The default Vercel project names are `website` and `website-preview`. If the actual project slugs differ, configure repository variables `VERCEL_PRODUCTION_PROJECT_NAME` and `VERCEL_PRESENTATION_PROJECT_NAME` with their exact values. The automatic event payload must include Vercel's documented `environment`, `project.name`, `git.sha` and `url` fields. The workflow appears in the Actions tab only after it has been committed and pushed to the default branch.

Dependabot checks npm and GitHub Actions updates on Mondays at 06:00 Europe/Lisbon. npm patch, minor and major version updates use 3-, 7- and 30-day cooldowns respectively; Actions use GitHub's supported seven-day default cooldown. Security updates are not delayed. Compatible patch/minor updates are grouped, while majors remain separate. After `Website CI` succeeds, `dependabot-queue.yml` enables native squash auto-merge, but one maintainer approval and every protected-branch requirement remain mandatory; the workflow never approves or bypasses a PR.

Review and triage dependency pull requests using the canonical [Dependabot Pull Request SOP](https://github.com/deflowlabs/core/blob/stage/docs/DEPENDABOT_SOP.md).

`@deflowlabs/engineering` owns the repository through `.github/CODEOWNERS`. Protect `main`, require code-owner review, conversation resolution and `Website / Required`, and prevent force pushes. Configure the organisation GitHub App variable `DEFLOW_CI_APP_CLIENT_ID` and secret `DEFLOW_CI_APP_PRIVATE_KEY` where Studio must verify this consumer; grant the App read-only Contents access to this repository only.

Repository workflow permissions can remain read-only. This repository does not require GitHub Actions to create or approve pull requests.

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
| Production Branch | `main` |
| Domain | `deflowlabs.io` plus canonical `www` redirect if used |

### Environment scoping

- **Production (`deflowlabs.io`):** `NUXT_SANITY_PREVIEW_ENABLED=false`; no `SANITY_API_READ_TOKEN`; production dataset, revalidation secrets, Turnstile/Resend/database and canonical URL.
- **Dedicated Presentation (`preview.deflowlabs.io`):** `NUXT_SANITY_PREVIEW_ENABLED=true`; exact Studio origin; Viewer token; private/no-store/noindex responses and no ISR. Use a stable protected deployment, not an arbitrary branch URL.
- **Ordinary Vercel Preview:** preview disabled unless it is the dedicated Presentation project; use test form keys and separate persistence.
- **Development:** local origins and authorised development credentials.

| Variable | Public production | Dedicated Presentation | Local Presentation |
|---|---|---|---|
| `NUXT_PUBLIC_SITE_URL` | `https://deflowlabs.io` | `https://preview.deflowlabs.io` | `http://localhost:3000` |
| `NUXT_SANITY_PREVIEW_ENABLED` | `false` | `true` | `true` |
| `NUXT_SANITY_STUDIO_ORIGIN` | Not required | `https://studio.deflowlabs.io` | `http://localhost:3333` |
| `SANITY_API_READ_TOKEN` | **Unset** | Viewer token | Viewer token |
| `SANITY_REVALIDATE_SECRET` | Required | Required for production-equivalent builds | Development value |
| `VERCEL_ISR_BYPASS_TOKEN` | Required | Configured but unused because ISR is disabled | Development value |

Environment changes apply only to new deployments. Redeploy after updates.

External-service checklist:

1. Register exact Studio/site origins in Sanity CORS.
2. Authorise production/stable preview hostnames in Turnstile.
3. Verify the Resend sending domain and recipient.
4. Connect Postgres and apply the waitlist table migration.
5. Create a least-privilege Sanity Viewer token for the dedicated preview deployment only.
6. Match Studio Preview URL and website Studio origin exactly.
7. Configure the signed publish webhook and Vercel bypass token, then publish a test update and confirm affected routes refresh.

Before promotion, run the full verification commands, deploy the dedicated preview site, complete website/content/legal/admin UAT, then promote. After the first isolation release, purge the existing production Vercel ISR cache once so no historical preview/stega payload survives.

## Security and recovery

- Keep Sanity tokens, form secrets, DB URLs and HMAC salts server-only.
- Preserve exact CORS/Studio origins, CSP framing, MIME-sniffing, referrer and permissions headers.
- Preserve published-perspective filters, preview-proxy authorisation and safe external-URL validation.
- Never log raw waitlist/contact emails or secrets.
- Use separate preview resources and rotate credentials after access changes.
- Monitor server functions, Sanity queries, Resend and database availability.
- Roll back app defects through Vercel history; recover CMS changes through additive migrations/document history.

## Troubleshooting

- **No CMS content:** verify project/dataset/API date, publication date, browser network response and query filters.
- **Preview shows published only:** verify the Viewer token, exact Studio origin, Sanity CORS and website CSP; disable preview, restart both apps and retry.
- **Generated type is stale:** extract/typegen from sibling `/studio`; ensure queries remain under website `app` or `server`.
- **Host-only build failure:** compare Node and exact environment names; check public/server prefixes and Nuxt Vercel preset.
- **Fonts perform build-time network work:** migrate approved Geist assets to a local source and visually verify before removing provider configuration.
- **`Unable to check top-level optout` in Presentation:** this is emitted by the Ruffle browser extension when it probes a cross-origin frame. The site declares `data-ruffle-optout` because DeFlow has no Flash content; confirm the current deployment includes it or disable Ruffle for DeFlow domains.

## Code and maintenance standard

Document exported utilities/composables, query/security boundaries, preview invariants and non-obvious fallbacks close to code. Comments explain intent and trade-offs, not syntax. Update this README whenever environment, API, CMS, deployment or recovery behaviour changes.

Proprietary © DeFlow Labs
