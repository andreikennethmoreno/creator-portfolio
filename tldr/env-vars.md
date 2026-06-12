# Env Vars & Error Handling TL;DR

## All Env Vars

| Var | Component(s) | In .env.example | Current crash on missing? |
|-----|-------------|-----------------|--------------------------|
| `NEXT_PUBLIC_YOUTUBE_API_KEY` | `youtube-section.tsx`, `/api/youtube-playlist`, `lastfm-player.tsx` (search) | Yes (`your_youtube_api_key`) | No — 5 hardcoded fallback videos; client-side graceful |
| `NEXT_PUBLIC_BEHOLD_FEED_ID` | `instagram-card.tsx` | Yes (`your_behold_feed_id`) | **YES** — async server component, likely throws |
| `HARDCOVER_API_TOKEN` | `hardcover-card.tsx` | Yes (`your_token_here`) | **YES** — async server component, GraphQL fetch |
| `HARDCOVER_USER_ID` | `hardcover-card.tsx` | Yes (`your_user_id_here`) | **YES** — used alongside token |
| `LASTFM_API_KEY` | `lastfm-card.tsx`, `/api/lastfm` | Yes (`your_api_key_here`) | **YES** — server-side fetch |
| `LASTFM_USERNAME` | `lastfm-card.tsx`, `/api/lastfm` | Yes (`your_lastfm_username`) | **YES** — used alongside key |
| `MY_VERCEL_TOKEN` | `vercel-projects.tsx` | Yes (`your_token_here`) | **YES** — client component, likely throws |
| `MY_VERCEL_TEAM_ID` | `vercel-projects.tsx` | Yes (`your_team_id_here`) | **YES** — used alongside token |
| `NEXT_PUBLIC_BASE_URL` | OG images, meta | Yes (`http://localhost:3000`) | No — static fallback likely |

**Discrepancy**: `.env.example` has `MY_VERCEL_TOKEN` but README table says `MY_VERCEL_API_TOKEN`. Check actual code.

## Section Toggle Status (src/data/resume.tsx)

Current: **NO toggle system exists.** All sections always render. No `sections: { ... }` config.

Target: Add `sections` object w/ booleans for: lastfm, instagram, youtube, hardcover, vercel, kofi.

## Placeholder Pattern Needed

When env var missing OR fetch fails:
- Still render WMCard wrapper + title bar (desktop mode windows)
- Show muted `"— not configured —"` or `"— unavailable —"` centered, font-mono
- Match approximate real section height (prevent layout jump)
- No error stack, no red UI

## Components Requiring try/catch + Placeholder

1. `instagram-card.tsx` — server component, fetch from Behold.so
2. `youtube-section.tsx` — client component, YT API (already has fallback)
3. `hardcover-card.tsx` — server component, GraphQL fetch
4. `lastfm-card.tsx` + `lastfm-player.tsx` — Last.fm API
5. `vercel-projects.tsx` — Vercel API + Microlink
6. `KofiCard.tsx` — static, no API, just needs toggle guard

## Source file locations
- Sections: `src/app/page.tsx` (imports + layout)
- Each section component: `src/components/` (youtube-section, instagram-card, hardcover-card, lastfm-card, lastfm-player, vercel-projects, kofi-card)
- DATA config: `src/data/resume.tsx`
- .env.example: root
