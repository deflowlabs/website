/**
 * GET /api/waitlist/count
 *
 * Returns the current number of waitlist signups from Vercel Postgres (Neon).
 * DFL-013: Uses cached count with 5-minute TTL to avoid uncached COUNT(*).
 */
import { ensureWaitlistTable, getWaitlistCount } from '../../utils/db'

export default defineEventHandler(async () => {
  try {
    await ensureWaitlistTable()
    const count = await getWaitlistCount()
    return { count }
  }
  catch {
    // Graceful fallback if DB is not configured
    return { count: 0 }
  }
})
