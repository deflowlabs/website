import { createClient } from '@sanity/client'
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'
import { baseRevalidationPaths } from '../../utils/sanity-revalidation'

interface WebhookDocument {
  _id?: string
  _type?: string
  slug?: string
}

interface WebhookPayload {
  operation?: 'create' | 'update' | 'delete'
  before?: WebhookDocument | null
  after?: WebhookDocument | null
}

const allowedTypes = new Set(['post', 'author', 'category', 'labsProject', 'partner', 'announcement'])

/**
 * Receive signed, published Sanity changes and purge only the affected Vercel
 * ISR routes. Repeated delivery is safe because every operation is idempotent.
 */
export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'private, no-store')
  const config = useRuntimeConfig()
  const rawBody = await readRawBody(event)
  const signature = getHeader(event, SIGNATURE_HEADER_NAME) || ''

  if (!rawBody || !config.sanityRevalidateSecret || !(await isValidSignature(rawBody, signature, config.sanityRevalidateSecret))) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid Sanity webhook signature' })
  }

  if (
    getHeader(event, 'sanity-project-id') !== config.public.sanityProjectId ||
    getHeader(event, 'sanity-dataset') !== config.public.sanityDataset
  ) {
    throw createError({ statusCode: 403, statusMessage: 'Unexpected Sanity project or dataset' })
  }

  let payload: WebhookPayload
  try {
    payload = JSON.parse(rawBody) as WebhookPayload
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid webhook payload' })
  }

  const document = payload.after || payload.before
  if (!payload.operation || !['create', 'update', 'delete'].includes(payload.operation) || !document?._type || !allowedTypes.has(document._type)) {
    throw createError({ statusCode: 422, statusMessage: 'Unsupported webhook event' })
  }
  if (payload.before?._id?.startsWith('drafts.') || payload.after?._id?.startsWith('drafts.')) {
    throw createError({ statusCode: 422, statusMessage: 'Draft events are not accepted' })
  }

  const client = createClient({
    projectId: config.public.sanityProjectId,
    dataset: config.public.sanityDataset,
    apiVersion: config.public.sanityApiVersion,
    useCdn: false,
    perspective: 'published',
  })
  const paths = baseRevalidationPaths(document._type, payload.before, payload.after)

  switch (document._type) {
    case 'post':
      break
    case 'labsProject':
      break
    case 'author':
    case 'category': {
      const postSlugs = await client.fetch<string[]>(
        '*[_type == "post" && !(_id in path("drafts.**")) && references($id)].slug.current',
        { id: document._id },
      )
      postSlugs.filter(Boolean).forEach(slug => paths.add(`/blog/${slug}`))
      break
    }
    case 'partner': {
      break
    }
    case 'announcement':
      // The global banner is intentionally client-fetched and is not stored in ISR.
      break
  }

  if (!config.vercelIsrBypassToken) {
    throw createError({ statusCode: 503, statusMessage: 'ISR revalidation is not configured' })
  }

  const siteOrigin = new URL(config.public.siteUrl).origin
  const results = await Promise.all([...paths].map(async path => {
    const response = await fetch(`${siteOrigin}${path}`, {
      method: 'GET',
      headers: { 'x-prerender-revalidate': config.vercelIsrBypassToken },
      redirect: 'manual',
    })
    return { path, status: response.status }
  }))
  const failures = results.filter(result => result.status >= 500)
  if (failures.length) {
    throw createError({ statusCode: 502, statusMessage: `Failed to revalidate: ${failures.map(result => result.path).join(', ')}` })
  }

  return {
    ok: true,
    operation: payload.operation,
    documentType: document._type,
    revalidated: results,
  }
})
