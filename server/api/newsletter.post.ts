/**
 * POST /api/newsletter
 *
 * Handles newsletter signups from the footer email form.
 * Uses the same Zero-PII pattern as waitlist: HMAC-SHA256 hash, no raw email stored.
 * Lighter validation than waitlist — no Turnstile (inline footer form).
 *
 * @param body.email - User's email address (hashed before storage)
 */
import { createHmac } from 'node:crypto'

// In-memory store for development — replace with DB when connected.
export const newsletterStore: Set<string> = new Set()

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email: string }>(event)

  if (!body?.email || typeof body.email !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'Email is required.',
    })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(body.email)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid email format.',
    })
  }

  // Hash the email (Zero-PII)
  const config = useRuntimeConfig()
  const salt = config.piiSaltSecret || 'deflow-newsletter-dev-salt'
  const hashedEmail = createHmac('sha256', salt)
    .update(body.email.toLowerCase().trim())
    .digest('hex')

  if (newsletterStore.has(hashedEmail)) {
    return {
      success: true,
      message: 'You\'re already subscribed!',
    }
  }

  newsletterStore.add(hashedEmail)

  return {
    success: true,
    message: 'Successfully subscribed to the newsletter!',
  }
})
