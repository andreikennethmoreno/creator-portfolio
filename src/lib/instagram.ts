export type BeholdPost = {
  id: string
  mediaUrl: string
  thumbnailUrl?: string
  caption: string
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  permalink: string
  timestamp: string
  sizes: {
    small: { height: number; width: number; mediaUrl: string }
    medium: { height: number; width: number; mediaUrl: string }
    large: { height: number; width: number; mediaUrl: string }
  }
}

export type BeholdFeedResponse = {
  id: string
  username: string
  biography: string
  profilePictureUrl: string
  posts: BeholdPost[]
}

export async function getInstagramPosts(limit = 6): Promise<BeholdPost[]> {
  const feedId = process.env.NEXT_PUBLIC_BEHOLD_FEED_ID

  if (!feedId) {
    console.warn('NEXT_PUBLIC_BEHOLD_FEED_ID not set')
    return []
  }

  const res = await fetch(`https://feeds.behold.so/${feedId}`, {
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    console.error('Behold fetch failed:', res.status)
    return []
  }

  const data: BeholdFeedResponse = await res.json()
  return (data.posts ?? []).slice(0, limit)
}
