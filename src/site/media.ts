import type { Media } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

type Size = 'thumbnail' | 'card' | 'large'

/** Returns a usable image src + alt from a populated Media doc (or undefined if not populated). */
export function img(media: number | Media | null | undefined, size: Size = 'large') {
  if (!media || typeof media === 'number') return undefined
  const url = media.sizes?.[size]?.url ?? media.url
  if (!url) return undefined
  return { src: getMediaUrl(url, media.updatedAt), alt: media.altText || '' }
}
