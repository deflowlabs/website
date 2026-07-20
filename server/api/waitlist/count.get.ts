/**
 * GET /api/waitlist/count
 *
 * Returns the current number of waitlist signups.
 * Used by the WaitlistForm counter badge.
 *
 * TODO: Replace with Drizzle query on `waitlist_signups` table
 * when database is connected for production.
 */
import { waitlistStore } from '../waitlist.post'

export default defineEventHandler(() => {
  return {
    count: waitlistStore.size,
  }
})
