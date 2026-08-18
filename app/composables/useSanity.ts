type QueryParameters = Record<string, string | number | boolean | null>

/**
 * Executes CMS reads through Nitro. The server alone decides whether the current
 * request may use the authenticated drafts perspective, so read tokens never
 * enter browser bundles.
 */
export function useSanity() {
  const config = useRuntimeConfig()
  const requestFetch = useRequestFetch()

  const sanityFetch = async <T = unknown>(query: string, params: QueryParameters = {}): Promise<T> => {
    if (!config.public.sanityProjectId) return null as T
    const response = await requestFetch<{ data: T }>('/api/sanity/query', {
      method: 'POST',
      body: { query, params },
    })
    return response.data
  }

  return { sanityFetch, fetch: sanityFetch }
}
