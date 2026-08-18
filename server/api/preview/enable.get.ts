import { createClient } from '@sanity/client'
import { validatePreviewUrl } from '@sanity/preview-url-secret'
import { previewCookieName, previewCookieValue } from '../../utils/sanity-preview'
import { safeLocalPath } from '../../../app/utils/safe-url'

/**
 * Validate Sanity Presentation's signed preview URL server-side, then issue an
 * HttpOnly local cookie. The Sanity token never reaches browser JavaScript.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  if (!config.public.sanityProjectId || !config.sanityApiReadToken) {
    throw createError({ statusCode: 503, statusMessage: 'Draft preview is not configured' })
  }

  const client = createClient({
    projectId: config.public.sanityProjectId,
    dataset: config.public.sanityDataset,
    apiVersion: config.public.sanityApiVersion,
    useCdn: false,
    token: config.sanityApiReadToken,
  })
  const { isValid, redirectTo = '/' } = await validatePreviewUrl(client, getRequestURL(event).toString())
  if (!isValid) throw createError({ statusCode: 401, statusMessage: 'Invalid preview secret' })

  setCookie(event, previewCookieName(), previewCookieValue(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: !import.meta.dev,
    path: '/',
    maxAge: 60 * 60 * 8,
  })
  return sendRedirect(event, safeLocalPath(redirectTo), 307)
})
