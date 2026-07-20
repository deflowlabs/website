/**
 * useSanity composable — lightweight Sanity CMS client.
 *
 * Replaces @nuxtjs/sanity to avoid React dependency conflicts in the monorepo.
 * Uses @sanity/client directly with runtime config for project credentials.
 *
 * @returns Object with `sanityFetch` method for GROQ queries and `client` instance.
 */
import { createClient, type SanityClient } from '@sanity/client'

let _client: SanityClient | null = null

export function useSanity() {
  if (!_client) {
    const config = useRuntimeConfig()
    _client = createClient({
      projectId: config.public.sanityProjectId as string,
      dataset: config.public.sanityDataset as string || 'production',
      apiVersion: '2026-07-17',
      useCdn: true,
    })
  }

  /**
   * Execute a GROQ query against the Sanity dataset.
   * @param query - GROQ query string
   * @param params - Optional query parameters
   */
  const sanityFetch = <T = any>(query: string, params?: Record<string, any>): Promise<T> => {
    return _client!.fetch<T>(query, params || {})
  }

  return {
    client: _client,
    sanityFetch,
    /** @deprecated Use `sanityFetch` instead */
    fetch: sanityFetch,
  }
}
