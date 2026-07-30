/**
 * Database utility for the marketing website.
 * Connects to Vercel Postgres (Neon) for persistent waitlist storage.
 * Uses @neondatabase/serverless for edge-compatible connections.
 *
 * DFL-013: Table creation is idempotent (IF NOT EXISTS) but should be
 * pre-created via migration in production. Runtime DDL is a convenience
 * for development only.
 */
import { neon } from '@neondatabase/serverless'

let _initialized = false
let _cachedCount: number | null = null
let _countCachedAt = 0

/** Cache TTL for waitlist count — 5 minutes */
const COUNT_CACHE_TTL_MS = 5 * 60 * 1000

/**
 * Returns a Neon SQL tagged-template function bound to the POSTGRES_URL.
 * Throws 503 if no URL is configured.
 */
export function useDb() {
  const config = useRuntimeConfig()
  if (!config.postgresUrl) {
    throw createError({
      statusCode: 503,
      message: 'Database not configured.',
    })
  }
  return neon(config.postgresUrl)
}

/**
 * Ensures the waitlist_signups table exists.
 * Uses IF NOT EXISTS for idempotency — safe to call on every cold start.
 *
 * DFL-013: In production, the table should be pre-created via migration.
 * This runtime DDL is a development convenience only.
 */
export async function ensureWaitlistTable(): Promise<void> {
  if (_initialized) return

  const isDev = process.env.NODE_ENV === 'development'
  if (!isDev) {
    console.warn(
      '[db] Runtime DDL (CREATE TABLE IF NOT EXISTS) executed in production. '
      + 'Consider pre-creating the waitlist_signups table via migration.',
    )
  }

  const sql = useDb()
  await sql`
    CREATE TABLE IF NOT EXISTS waitlist_signups (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email_hash VARCHAR(64) NOT NULL UNIQUE,
      source VARCHAR(50) DEFAULT 'website',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `

  _initialized = true
}

/**
 * Returns the current waitlist signup count.
 * DFL-013: Cached with a 5-minute TTL to avoid uncached COUNT on every request.
 *
 * @returns The number of waitlist signups
 */
export async function getWaitlistCount(): Promise<number> {
  const now = Date.now()
  if (_cachedCount !== null && (now - _countCachedAt) < COUNT_CACHE_TTL_MS) {
    return _cachedCount
  }

  const sql = useDb()
  const result = await sql`SELECT COUNT(*)::int AS count FROM waitlist_signups`
  const count: number = result[0]?.count ?? 0
  _cachedCount = count
  _countCachedAt = now
  return _cachedCount
}
