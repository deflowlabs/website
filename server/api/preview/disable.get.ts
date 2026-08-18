import { previewCookieName } from '../../utils/sanity-preview'

/** Clear local draft perspective and return the editor to the public home page. */
export default defineEventHandler((event) => {
  deleteCookie(event, previewCookieName(), { path: '/' })
  return sendRedirect(event, '/', 307)
})
