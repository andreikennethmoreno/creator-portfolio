# Music Player Context TL;DR

File: `src/lib/music-player-context.tsx` — shared YT player state consumed by MiniPlayer, LastFmPlayer, and top-panel PlayerTab.

## Provider
- `MusicPlayerProvider` in layout.tsx
- Fetches initial track from `/api/lastfm` server-side
- Polls `/api/lastfm` every 10s for track updates
- Manages single YT iframe player (hidden, offscreen)

## Context (`useMusicPlayer()`)
| Field | Type | Purpose |
|-------|------|---------|
| `track` | LastFmTrack\|null | Current scrobble |
| `videoId` | string\|null | YT video ID |
| `isPlaying` | boolean | Playback state |
| `currentTime` | number | Seconds elapsed |
| `duration` | number | Total seconds |
| `toggle` | () => void | Play/pause |
| `seek` | (time) => void | Jump to position |
| `iframeContainerRef` | Ref | Hidden iframe mount point |

## Key behaviors
- loads YT IFrame API once globally
- Reuses player on video change (`loadVideoById`)
- Destroys player on unmount
- Uses `requestAnimationFrame` for time tracking
