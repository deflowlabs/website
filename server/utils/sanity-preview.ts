import { createHmac, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'

const PREVIEW_COOKIE = '__deflow_preview'

/** Derive a deterministic cookie signature without storing the token itself. */
function signature(secret: string) {
  return createHmac('sha256', secret).update('deflow-sanity-preview-v1').digest('hex')
}

/** Public helper keeps every preview endpoint on the same cookie name. */
export function previewCookieName() {
  return PREVIEW_COOKIE
}

/** Create the signed cookie value, failing closed for weak/missing secrets. */
export function previewCookieValue() {
  const config = useRuntimeConfig()
  const secret = config.sanityPreviewCookieSecret
  if (!secret || secret.length < 32) throw createError({ statusCode: 500, statusMessage: 'Preview cookie secret is not configured safely' })
  return signature(secret)
}

/** Verify the cookie with a timing-safe comparison before enabling drafts. */
export function isPreviewRequest(event: H3Event) {
  const actual = getCookie(event, PREVIEW_COOKIE)
  if (!actual) return false
  const config = useRuntimeConfig()
  const secret = config.sanityPreviewCookieSecret
  if (!secret || secret.length < 32) return false
  const expected = previewCookieValue()
  if (actual.length !== expected.length) return false
  return timingSafeEqual(Buffer.from(actual), Buffer.from(expected))
}
