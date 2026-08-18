/** Return a normalized public HTTP(S) URL, or undefined for unsafe protocols. */
export function safeExternalUrl(value?: string | null) {
  if (!value) return undefined
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : undefined
  } catch {
    return undefined
  }
}

/** Constrain preview redirects to a path on the current website origin. */
export function safeLocalPath(value?: string | null) {
  if (!value?.startsWith('/') || value.startsWith('//') || value.includes('\\')) return '/'
  const url = new URL(value, 'https://deflowlabs.io')
  return `${url.pathname}${url.search}${url.hash}`
}
