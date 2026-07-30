/**
 * POST /api/waitlist
 *
 * Handles waitlist signups with Cloudflare Turnstile bot verification.
 * Validates email format, verifies Turnstile token, and stores a
 * HMAC-SHA256 hashed version of the email in Vercel Postgres (Neon).
 * Zero-PII: raw email is never persisted.
 *
 * @param body.email - User's email address (hashed before storage)
 * @param body.turnstileToken - Cloudflare Turnstile verification token
 */
import { createHmac } from 'node:crypto'
import { ensureWaitlistTable, useDb } from '../utils/db'

export default defineEventHandler(async (event) => {
  // DFL-011: Rate limit — 3 signups per minute per IP
  useRateLimit(event, 60_000, 3)

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

  // Verify Turnstile token
  const config = useRuntimeConfig()
  const isDev = process.env.NODE_ENV === 'development'

  if (isDev && body.turnstileToken === 'dev-bypass') {
    // Allow bypass only in local development
  }
  else if (!config.turnstileSecretKey) {
    // Fail closed: missing secret in production is a configuration error
    throw createError({
      statusCode: 500,
      message: 'Service temporarily unavailable.',
    })
  }
  else {
    if (!body.turnstileToken) {
      throw createError({
        statusCode: 400,
        message: 'Bot verification is required.',
      })
    }

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

  // Hash the email (Zero-PII) — fail closed if salt is missing
  const salt = config.piiSaltSecret
  if (!salt) {
    if (isDev) {
      // Allow a dev-only fallback so local development works without secrets
      console.warn('[Waitlist] PII_SALT_SECRET not set — using dev fallback. Never use in production.')
    }
    else {
      throw createError({
        statusCode: 500,
        message: 'Service temporarily unavailable.',
      })
    }
  }
  const hashedEmail = createHmac('sha256', salt || 'deflow-waitlist-dev-salt')
    .update(body.email.toLowerCase().trim())
    .digest('hex')

  // Ensure table exists (idempotent, cached after first call)
  await ensureWaitlistTable()

  // Insert into Vercel Postgres (Neon) — UNIQUE constraint handles dedup
  try {
    const sql = useDb()
    await sql`
      INSERT INTO waitlist_signups (email_hash, source)
      VALUES (${hashedEmail}, 'website')
    `
  }
  catch (err: unknown) {
    // PostgreSQL error code 23505 = unique_violation (duplicate email hash)
    // Return identical success response to prevent email enumeration (DFL-012)
    if (err && typeof err === 'object' && 'code' in err && err.code === '23505') {
      return {
        success: true,
        message: 'Successfully joined the waitlist!',
      }
    }
    console.error('[Waitlist] Database error')
    throw createError({
      statusCode: 500,
      message: 'Something went wrong. Please try again later.',
    })
  }

  return {
    success: true,
    message: 'Successfully joined the waitlist!',
  }
})
