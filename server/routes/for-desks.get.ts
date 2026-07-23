/**
 * 301 redirect: /for-desks → /for-institutions
 * Preserves SEO equity and handles existing links after the page rename.
 */
export default defineEventHandler((event) => {
  return sendRedirect(event, '/for-institutions', 301)
})
