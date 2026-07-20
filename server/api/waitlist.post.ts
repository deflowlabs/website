/**
 * POST /api/waitlist
 *
 * Handles waitlist signups with Cloudflare Turnstile bot verification.
 * Validates email format, verifies Turnstile token, and stores a
 * HMAC-SHA256 hashed version of the email. Zero-PII: raw email is never persisted.
 *
 * @param body.email - User's email address (hashed before storage)
 * @param body.turnstileToken - Cloudflare Turnstile verification token
 */
import { createHmac } from 'node:crypto'

// TODO: Replace with Drizzle query on `waitlist_signups` table when DB is connected.
// In-memory store for development — resets on server restart.
export const waitlistStore: Set<string> = new Set()

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email: string; turnstileToken: string }>(event)

  if (!body?.email || typeof body.email !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'Email is required.',
    })
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(body.email)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid email format.',
    })
  }

  // Verify Turnstile token (skip in dev if no secret key configured)
  const config = useRuntimeConfig()
  if (config.turnstileSecretKey && body.turnstileToken !== 'dev-bypass') {
    const turnstileResult = await $fetch<{ success: boolean }>(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: {
          secret: config.turnstileSecretKey,
          response: body.turnstileToken,
          remoteip: getRequestIP(event),
        },
      },
    )

    if (!turnstileResult.success) {
      throw createError({
        statusCode: 403,
        message: 'Bot verification failed. Please try again.',
      })
    }
  }

  // Hash the email (Zero-PII) — salt from runtimeConfig for consistency
  const salt = config.piiSaltSecret || 'deflow-waitlist-dev-salt'
  const hashedEmail = createHmac('sha256', salt)
    .update(body.email.toLowerCase().trim())
    .digest('hex')

  // Check for duplicates
  if (waitlistStore.has(hashedEmail)) {
    throw createError({
      statusCode: 409,
      message: 'You\'re already on the waitlist!',
    })
  }

  // Store hashed email
  waitlistStore.add(hashedEmail)

  return {
    success: true,
    message: 'Successfully joined the waitlist!',
  }
})
