export interface RevalidationDocument {
  _id?: string
  _type?: string
  slug?: string
}

/** Return deterministic direct routes before reference-dependent expansion. */
export function baseRevalidationPaths(
  type: string,
  before?: RevalidationDocument | null,
  after?: RevalidationDocument | null,
) {
  const paths = new Set<string>()
  const addSlugs = (prefix: string) => {
    for (const document of [before, after]) {
      if (document?.slug) paths.add(`${prefix}/${document.slug}`)
    }
  }

  if (type === 'post') {
    paths.add('/blog')
    paths.add('/rss.xml')
    paths.add('/sitemap.xml')
    addSlugs('/blog')
  } else if (type === 'labsProject') {
    paths.add('/labs')
  } else if (type === 'author' || type === 'category') {
    paths.add('/blog')
    paths.add('/rss.xml')
    paths.add('/sitemap.xml')
    if (type === 'author') addSlugs('/blog/author')
  } else if (type === 'partner') {
    paths.add('/labs')
  }

  return paths
}
