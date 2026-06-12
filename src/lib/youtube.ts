import { env } from "@/lib/env"

export async function getYouTubeVideoId(
  trackName: string,
  artist: string
): Promise<string | null> {
  const key = env.youtubeServerKey()
  if (!key) return null

  const q = encodeURIComponent(`${trackName} ${artist}`)
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${q}&type=video&maxResults=1&key=${key}`,
    { next: { revalidate: 3600 } }
  )

  if (!res.ok) {
    const body = await res.text()
    console.warn('YouTube search failed:', res.status, body)
    throw new Error(`YouTube search failed: ${res.status}`)
  }

  const data = await res.json()
  return data.items?.[0]?.id?.videoId ?? null
}
