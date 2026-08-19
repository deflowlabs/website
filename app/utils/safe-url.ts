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
