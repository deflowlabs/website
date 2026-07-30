/**
 * Composable for setting per-route canonical URLs and SEO metadata.
 * Generates a self-referencing canonical link for the current route
 * to prevent duplicate indexing (DFL-016).
 *
 * @param overrides - Optional title and description overrides
 */
export function useCanonical(overrides?: { title?: string; description?: string }) {
  const route = useRoute()
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl || 'https://deflowlabs.io'

  // Build canonical URL from current route path (strip trailing slash except root)
  const path = route.path === '/' ? '/' : route.path.replace(/\/$/, '')
  const canonical = `${siteUrl}${path}`

  useHead({
    link: [
      { rel: 'canonical', href: canonical },
    ],
    meta: [
      { property: 'og:url', content: canonical },
      ...(overrides?.title ? [{ property: 'og:title', content: overrides.title }] : []),
      ...(overrides?.description ? [{ property: 'og:description', content: overrides.description }] : []),
    ],
  })

  return { canonical }
}
