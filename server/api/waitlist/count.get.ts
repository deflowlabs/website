/**
 * GET /api/waitlist/count
 *
 * Returns the current number of waitlist signups from Vercel Postgres (Neon).
 * Used by the WaitlistForm counter badge.
 */
import { ensureWaitlistTable, useDb } from '../../utils/db'

export default defineEventHandler(async () => {
  try {
    await ensureWaitlistTable()
    const sql = useDb()
    const result = await sql`SELECT COUNT(*)::int AS count FROM waitlist_signups`
    return { count: result[0]?.count ?? 0 }
  }
  catch {
    // Graceful fallback if DB is not configured
    return { count: 0 }
  }
})
