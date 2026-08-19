interface PlacementDocument { _id: string }

/** Apply announcement → featured → recent placement precedence without duplicates. */
export function resolveBlogPlacements<T extends PlacementDocument>(announcement: T | null, featured: T | null) {
  const featuredStory = featured?._id === announcement?._id ? null : featured
  return {
    announcementStory: announcement,
    featuredStory,
    excludedIds: [announcement?._id, featuredStory?._id].filter((id): id is string => Boolean(id)),
  }
}

/** Select the only valid empty-state message for the current catalogue view. */
export function resolveBlogEmptyState(totalPublished: number, filteredCount: number, hasFilters: boolean) {
  if (hasFilters && filteredCount === 0) return 'no-results' as const
  if (!hasFilters && totalPublished === 0) return 'coming-soon' as const
  return null
}
