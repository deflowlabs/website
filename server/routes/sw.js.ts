/**
 * GET /sw.js — Returns 204 No Content for service worker requests.
 * Browser extensions (e.g., Vantage) request /sw.js which causes
 * VUE_ROUTER_R0004 warnings. This silences them.
 */
export default defineEventHandler((event) => {
  setResponseStatus(event, 204)
  return null
})
