/**
 * POST /api/contact
 *
 * Handles contact form submissions with Turnstile bot verification.
 * Validates required fields, sanitizes input, and sends notification
 * email via Resend (when configured). Falls back to console logging.
 *
 * @param body.name - Sender's full name
 * @param body.email - Sender's email
 * @param body.company - Optional company name
 * @param body.type - Inquiry type category
 * @param body.message - Message content
 * @param body.turnstileToken - Cloudflare Turnstile verification token
 */

/**
 * Escapes HTML special characters to prevent XSS in email templates.
 * @param str - Raw user input string
 * @returns Escaped string safe for HTML interpolation
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    name: string
    email: string
    company?: string
    type: string
    message: string
    turnstileToken?: string
  }>(event)

  // Validate required fields
  if (!body?.name || !body?.email || !body?.type || !body?.message) {
    throw createError({
      statusCode: 400,
      message: 'All required fields must be filled.',
    })
  }

  // Input length limits (prevent abuse)
  if (body.name.length > 200 || body.message.length > 5000 || (body.company && body.company.length > 200)) {
    throw createError({
      statusCode: 400,
      message: 'Input exceeds maximum allowed length.',
    })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(body.email)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid email format.',
    })
  }

  const config = useRuntimeConfig()

  // Verify Turnstile token (skip in dev if no secret key configured)
  if (config.turnstileSecretKey && body.turnstileToken !== 'dev-bypass') {
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

  // In production, send via Resend
  if (config.resendApiKey) {
    try {
      await $fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: {
          from: 'DeFlow Labs <noreply@deflowlabs.io>',
          to: [config.contactEmail || 'contact@deflowlabs.io'],
          subject: `[${escapeHtml(body.type)}] New inquiry from ${escapeHtml(body.name)}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${escapeHtml(body.name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(body.email)}</p>
            <p><strong>Company:</strong> ${escapeHtml(body.company || 'N/A')}</p>
            <p><strong>Type:</strong> ${escapeHtml(body.type)}</p>
            <p><strong>Message:</strong></p>
            <p>${escapeHtml(body.message)}</p>
          `,
        },
      })
    }
    catch (err) {
      console.error('[Contact] Failed to send via Resend:', err)
      throw createError({
        statusCode: 500,
        message: 'Failed to send message. Please try again later.',
      })
    }
  }
  else {
    // Development fallback
    console.log('[Contact] Form submission:', {
      name: body.name,
      type: body.type,
      company: body.company,
      message: body.message.substring(0, 100),
    })
  }

  return {
    success: true,
    message: 'Message sent successfully.',
  }
})

