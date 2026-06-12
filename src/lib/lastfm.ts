import { env } from "@/lib/env"

const LASTFM_ENDPOINT = 'https://ws.audioscrobbler.com/2.0/'

export type LastFmTrack = {
  name: string
  artist: string
  album: string
  albumArt: string
  url: string
  playedAt: string | null
  isNowPlaying: boolean
}

export async function getRecentTrack(): Promise<LastFmTrack | null> {
  const LASTFM_API_KEY = env.lastfmKey()
  const LASTFM_USERNAME = env.lastfmUserPublic()

  if (!LASTFM_API_KEY || !LASTFM_USERNAME) {
    console.warn('Last.fm env vars not set')
    return null
  }

  const url =
    `${LASTFM_ENDPOINT}?method=user.getrecenttracks` +
    `&user=${LASTFM_USERNAME}` +
    `&api_key=${LASTFM_API_KEY}` +
    `&format=json` +
    `&limit=1`

  const res = await fetch(url, {
    next: {
      revalidate: 60,
    },
  })

  if (!res.ok) {
    console.error('Last.fm fetch failed:', res.status)
    return null
  }

  const data = await res.json()
  const track = data?.recenttracks?.track?.[0]

  if (!track) return null

  const isNowPlaying = track['@attr']?.nowplaying === 'true'

  return {
    name: track.name,
    artist: track.artist['#text'],
    album: track.album['#text'],
    albumArt: track.image?.[3]?.['#text'] || track.image?.[2]?.['#text'] || '',
    url: track.url,
    playedAt: isNowPlaying ? null : track.date?.['#text'] ?? null,
    isNowPlaying,
  }
}
