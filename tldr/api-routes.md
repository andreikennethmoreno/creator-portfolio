# API Routes TL;DR

## `/api/lastfm` (GET)
- **File**: `src/app/api/lastfm/route.ts`
- Returns `{ track: { name, artist, album, image }, videoId: string | null }`
- Proxies Last.fm API for recent scrobble
- Caches YouTube search result per track in memory (avoids re-searching same song on 10s poll)
- Environment: `LASTFM_API_KEY`, `LASTFM_USERNAME`

## `/api/youtube-playlist` (GET)
- **File**: `src/app/api/youtube-playlist/route.ts`
- Returns `{ videos: [{ id, title, duration, href }] }`
- Fetches playlist items + video durations from YouTube API, cached with `revalidate: 3600`
- Environment: `YOUTUBE_API_KEY` (or `NEXT_PUBLIC_YOUTUBE_API_KEY`)

## External API Dependencies
| Service | Purpose | Auth |
|---------|---------|------|
| YouTube Data API v3 | Playlist + music search | `YOUTUBE_API_KEY` |
| Behold.so | Instagram feed proxy | `NEXT_PUBLIC_BEHOLD_FEED_ID` |
| Hardcover GraphQL | Books data | `HARDCOVER_API_TOKEN`, `HARDCOVER_USER_ID` |
| Last.fm API | Recent scrobble | `LASTFM_API_KEY`, `LASTFM_USERNAME` |
| Vercel API | Projects + stats | `MY_VERCEL_API_TOKEN`, `MY_VERCEL_TEAM_ID` |
| Microlink API | Screenshots (public) | None |
