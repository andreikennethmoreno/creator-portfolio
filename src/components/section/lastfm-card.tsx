import { getRecentTrack } from '@/lib/lastfm'
import { getYouTubeVideoId } from '@/lib/youtube'
import LastFmPlayer from './lastfm-player'

export default async function LastFmCard() {
  const track = await getRecentTrack()
  const videoId = track
    ? await getYouTubeVideoId(track.name, track.artist)
    : null

  return <LastFmPlayer track={track} videoId={videoId} />
}
