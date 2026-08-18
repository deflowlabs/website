import { createClient } from '@sanity/client'
import { isPreviewRequest } from '../../utils/sanity-preview'
import {
  ACTIVE_ANNOUNCEMENT_QUERY,
  FEATURED_POST_QUERY,
  LABS_PROJECTS_QUERY,
  NON_FEATURED_COUNT_QUERY,
  PAGINATED_POSTS_QUERY,
  POSTS_QUERY,
  POST_BY_SLUG_QUERY,
  POST_COUNT_QUERY,
  POST_SLUGS_QUERY,
} from '../../../app/utils/sanity-queries'

interface QueryBody {
  query?: string
  params?: Record<string, string | number | boolean | null>
}

/** Only checked-in consumer queries may cross the public server boundary. */
const allowedQueries = new Set<string>([
  POSTS_QUERY,
  FEATURED_POST_QUERY,
  PAGINATED_POSTS_QUERY,
  NON_FEATURED_COUNT_QUERY,
  POST_BY_SLUG_QUERY,
  LABS_PROJECTS_QUERY,
  ACTIVE_ANNOUNCEMENT_QUERY,
  POST_COUNT_QUERY,
  POST_SLUGS_QUERY,
])

/** Bound query input types, count, string length and pagination range. */
function validateParams(params: unknown): asserts params is QueryBody['params'] {
  if (params === undefined) return
  if (!params || typeof params !== 'object' || Array.isArray(params)) {
    throw createError({ statusCode: 400, statusMessage: 'CMS query parameters must be an object' })
  }

  const entries = Object.entries(params)
  if (entries.length > 10) throw createError({ statusCode: 400, statusMessage: 'Too many CMS query parameters' })
  for (const [key, value] of entries) {
    if (!['string', 'number', 'boolean'].includes(typeof value) && value !== null) {
      throw createError({ statusCode: 400, statusMessage: `Invalid CMS query parameter: ${key}` })
    }
    if (typeof value === 'string' && value.length > 200) {
      throw createError({ statusCode: 400, statusMessage: `CMS query parameter is too long: ${key}` })
    }
    if (typeof value === 'number' && !Number.isFinite(value)) {
      throw createError({ statusCode: 400, statusMessage: `CMS query parameter is not finite: ${key}` })
    }
  }

  const paramRecord = params as Record<string, unknown>
  const start = typeof paramRecord.start === 'number' ? paramRecord.start : 0
  const end = typeof paramRecord.end === 'number' ? paramRecord.end : start
  if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end < start || end > 100) {
    throw createError({ statusCode: 400, statusMessage: 'CMS pagination parameters are outside the allowed range' })
  }
}

/** Execute published queries publicly and draft perspective only after preview validation. */
export default defineEventHandler(async (event) => {
  const body = await readBody<QueryBody>(event)
  if (!body.query || typeof body.query !== 'string' || !allowedQueries.has(body.query)) {
    throw createError({ statusCode: 400, statusMessage: 'This CMS query is not allowed' })
  }
  validateParams(body.params)

  const config = useRuntimeConfig()
  const preview = isPreviewRequest(event)
  if (!config.public.sanityProjectId) return { data: null, preview: false }
  if (preview && !config.sanityApiReadToken) throw createError({ statusCode: 503, statusMessage: 'Draft preview token is missing' })

  const client = createClient({
    projectId: config.public.sanityProjectId,
    dataset: config.public.sanityDataset,
    apiVersion: config.public.sanityApiVersion,
    useCdn: !preview,
    token: preview ? config.sanityApiReadToken : undefined,
    perspective: preview ? 'drafts' : 'published',
  })
  const data = await client.fetch(body.query, { ...(body.params || {}), preview })
  return { data, preview }
})
