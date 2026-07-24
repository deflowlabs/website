/**
 * Database utility for the marketing website.
 * Connects to Vercel Postgres (Neon) for persistent waitlist storage.
 * Uses @neondatabase/serverless for edge-compatible connections.
 *
 * The table is auto-created on first query if it doesn't exist.
 */
import { neon } from '@neondatabase/serverless'

let _initialized = false

/**
 * Returns a Neon SQL tagged-template function bound to the POSTGRES_URL.
 * Falls back gracefully if no URL is configured (dev mode).
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
 */
export async function ensureWaitlistTable(): Promise<void> {
  if (_initialized) return

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
