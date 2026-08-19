import imageUrlBuilder from '@sanity/image-url'
import { stegaClean } from '@sanity/client/stega'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

/** Build a clean absolute Sanity CDN URL for metadata and structured data. */
export function useSanityImageUrl() {
  const config = useRuntimeConfig()
  const builder = imageUrlBuilder({
    projectId: config.public.sanityProjectId,
    dataset: config.public.sanityDataset,
  })

  return (source: unknown, width = 1200, height = 630) => {
    if (!source) return undefined
    try {
      return builder.image(stegaClean(source) as SanityImageSource).width(width).height(height).fit('crop').format('jpg').quality(85).url()
    } catch {
      return undefined
    }
  }
}
