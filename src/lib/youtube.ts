export async function getYouTubeVideoId(
  trackName: string,
  artist: string
): Promise<string | null> {
  const key = process.env.YOUTUBE_API_KEY
  if (!key) {
    console.warn('YOUTUBE_API_KEY not set')
    return null
  }

  const q = encodeURIComponent(`${trackName} ${artist} official audio`)
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${q}&type=video&videoCategoryId=10&maxResults=1&key=${key}`,
    { next: { revalidate: 3600 } }
  )

  if (!res.ok) {
    const body = await res.text()
    console.warn('YouTube search failed:', res.status, body)
    return null
  }

  const data = await res.json()
  return data.items?.[0]?.id?.videoId ?? null
}
