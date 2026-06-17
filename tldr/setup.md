# Setup TL;DR (Agent)

## Bare Minimum to Run
```bash
git clone <repo> && cd creator-portfolio && pnpm install && pnpm dev
```
Opens at `http://localhost:3000` — works instantly with fallback/placeholder data. Zero env vars needed.

## Config: One File, Four Modes
Edit `src/data/config.tsx` — the `CONFIG` object.

### Mode Switch
`CONFIG.mode` — `"dev"` | `"creator"` | `"linktree"` | `"custom"`

### MUST Change (any mode)
- `name`, `initials`, `description`, `avatarUrl`, `url`
- `contact.email` + `contact.social.*.url`

### Dev Mode Fields
`aboutSegments`, `experience[]`, `education[]`, `projects[]`, `links.*`, `certificates[]`

### Creator Mode Fields
`sections.*` (toggles), `youtube.*` (channelUrl, playlistId, videoType, fallbackVideos), `terminal.*`, `kofi.*`, `dock.*`

### Linktree Mode Fields
`links[]` (ordered social keys), `showTerminal`, `showDock`

## Env Vars (All Optional)
Site shows placeholders/fallbacks when any are missing:
- `NEXT_PUBLIC_YOUTUBE_API_KEY` → YouTube feed + music player
- `NEXT_PUBLIC_BEHOLD_FEED_ID` → Instagram feed
- `HARDCOVER_API_TOKEN` + `HARDCOVER_USER_ID` → Books
- `LASTFM_API_KEY` + `NEXT_PUBLIC_LASTFM_USERNAME` → Music
- `MY_VERCEL_API_TOKEN` + `MY_VERCEL_TEAM_ID` → Projects

Copy `.env.example` → `.env.local`, fill only what you want live.

## Scripts
`pnpm dev` / `pnpm build` / `pnpm start` / `pnpm lint`

## Deploy
Push to GitHub → Vercel → Add env vars → Done. No build config needed.

## Full Guide
See `SETUP.md` at project root.
