/**
 * In-memory sliding-window rate limiter for Nitro server endpoints.
 * Uses a Map of IP → request timestamps. Automatically evicts expired entries.
 *
 * Best suited for single-instance deployments (Vercel serverless, Cloud Run).
 * For multi-instance deployments, swap to Redis-backed implementation.
 *
 * @param windowMs - Time window in milliseconds (default: 60s)
 * @param maxRequests - Max requests per IP within the window (default: 5)
 * @returns Middleware-style function that throws 429 on rate limit exceeded
 */

interface RateLimitEntry {
  timestamps: number[]
}

const store = new Map<string, RateLimitEntry>()

// Periodic cleanup every 5 minutes to prevent memory leaks
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000
let lastCleanup = Date.now()

/**
 * Evicts entries whose newest timestamp is older than the largest
 * possible window (10 minutes) to prevent unbounded memory growth.
 */
function evictStaleEntries(): void {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return
  lastCleanup = now

  const maxAge = 10 * 60 * 1000 // 10 min — covers any reasonable window
  for (const [key, entry] of store) {
    const newest = entry.timestamps[entry.timestamps.length - 1] || 0
    if (now - newest > maxAge) {
      store.delete(key)
    }
  }
}

/**
 * Checks whether the given IP has exceeded the rate limit.
 * Call this at the top of any server endpoint handler.
 *
 * @param event - H3 event (used to extract client IP)
 * @param windowMs - Sliding window duration in ms (default: 60_000)
 * @param maxRequests - Max allowed requests in the window (default: 5)
 * @throws 429 error if rate limit exceeded
 */
export function useRateLimit(
  event: Parameters<typeof getRequestIP>[0],
  windowMs = 60_000,
  maxRequests = 5,
): void {
  evictStaleEntries()

  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const now = Date.now()
  const windowStart = now - windowMs

  let entry = store.get(ip)
  if (!entry) {
    entry = { timestamps: [] }
    store.set(ip, entry)
  }

  // Remove timestamps outside the current window
  entry.timestamps = entry.timestamps.filter((t) => t > windowStart)

  if (entry.timestamps.length >= maxRequests) {
    throw createError({
      statusCode: 429,
      message: 'Too many requests. Please try again later.',
    })
  }

  entry.timestamps.push(now)
}
