/**
 * useStructuredData — Injects JSON-LD structured data into page head.
 *
 * Supports Organization, WebSite, and BlogPosting schemas.
 * Used on homepage, blog listing, and individual article pages
 * to improve search engine understanding and rich snippet eligibility.
 *
 * @param schema - A Schema.org-compliant JSON-LD object
 */
export function useStructuredData(schema: Record<string, any>) {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(schema),
      },
    ],
  })
}

/** DeFlow Labs Organization schema — reusable across pages. */
export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'DeFlow Labs',
  url: 'https://deflowlabs.io',
  logo: 'https://deflowlabs.io/deflow-logo.svg',
  description: 'Institutional settlement layer for digital asset dealflows. Non-custodial smart escrow, compliant identity verification, and programmable settlement.',
  sameAs: [
    'https://linkedin.com/company/deflowlabs',
    'https://github.com/DeFlowLabs',
    'https://x.com/DeFlowLabs',
    'https://discord.gg/deflowlabs',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'contact@deflowlabs.io',
    contactType: 'customer support',
  },
}

/** WebSite schema with search action potential. */
export const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'DeFlow Labs',
  url: 'https://deflowlabs.io',
  description: 'The institutional settlement layer for digital asset dealflows.',
  publisher: {
    '@type': 'Organization',
    name: 'DeFlow Labs',
  },
}

/**
 * Creates a BlogPosting JSON-LD schema from a Sanity blog post.
 * @param post - Blog post data from Sanity
 * @returns Schema.org BlogPosting object
 */
export function createBlogPostSchema(post: {
  title: string
  excerpt?: string
  publishedAt?: string | null
  author?: { name: string } | null
  coverImage?: string | null
  slug: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || '',
    datePublished: post.publishedAt || undefined,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'DeFlow Labs',
    },
    publisher: {
      '@type': 'Organization',
      name: 'DeFlow Labs',
      logo: {
        '@type': 'ImageObject',
        url: 'https://deflowlabs.io/deflow-logo.svg',
      },
    },
    image: post.coverImage || 'https://deflowlabs.io/og-image.png',
    url: `https://deflowlabs.io/blog/${post.slug}`,
    mainEntityOfPage: `https://deflowlabs.io/blog/${post.slug}`,
  }
}
