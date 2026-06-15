# Env Vars & Error Handling TL;DR

## All Env Vars

| Var | Component(s) | In .env.example | Current crash on missing? |
|-----|-------------|-----------------|--------------------------|
| `NEXT_PUBLIC_YOUTUBE_API_KEY` | `youtube-section.tsx`, `/api/youtube-playlist`, `lastfm-player.tsx` (search) | Yes (empty) | No — 5 hardcoded fallback videos; client-side graceful |
| `NEXT_PUBLIC_BEHOLD_FEED_ID` | `instagram-card.tsx` | Yes (empty) | No — placeholder "— not configured —" |
| `HARDCOVER_API_TOKEN` | `hardcover-card.tsx` | Yes (empty) | No — placeholder "— not configured —" |
| `HARDCOVER_USER_ID` | `hardcover-card.tsx` | Yes (empty) | No — placeholder "— not configured —" |
| `LASTFM_API_KEY` | `lastfm-card.tsx`, `/api/lastfm` | Yes (empty) | No — placeholder "— not configured —" |
| `NEXT_PUBLIC_LASTFM_USERNAME` | `lastfm-card.tsx`, `/api/lastfm` | Yes (empty) | No — placeholder "— not configured —" |
| `MY_VERCEL_API_TOKEN` | `vercel-projects.tsx`, `/api/vercel-stats` | Yes (empty) | No — placeholder "— not configured —" |
| `MY_VERCEL_TEAM_ID` | `vercel-projects.tsx`, `/api/vercel-stats` | Yes (empty) | No — placeholder "— not configured —" |
| `NEXT_PUBLIC_BASE_URL` | OG images, meta, layout.tsx | Yes (empty) | No — defaults to http://localhost:3000 |

## Section Toggle System (src/data/config.tsx)

Added `sections` object to CONFIG. Each key maps to a section:
- `lastfm`, `instagram`, `youtube`, `hardcover`, `vercel`, `kofi`
- Set to `false` to hide the section entirely (returns null)
- Default: all `true`

## Env Helper (src/lib/env.ts)

Single source of truth for env vars. Never throws — returns `undefined` if missing.

```ts
env.youtube()           // NEXT_PUBLIC_YOUTUBE_API_KEY
env.youtubeServerKey()  // YOUTUBE_API_KEY
env.behold()            // NEXT_PUBLIC_BEHOLD_FEED_ID
env.hardcoverToken()    // HARDCOVER_API_TOKEN
env.hardcoverUser()     // HARDCOVER_USER_ID
env.lastfmKey()         // LASTFM_API_KEY
env.lastfmUser()        // LASTFM_USERNAME
env.lastfmUserPublic()  // NEXT_PUBLIC_LASTFM_USERNAME
env.vercelToken()       // MY_VERCEL_API_TOKEN
env.vercelTeam()        // MY_VERCEL_TEAM_ID
env.baseUrl()           // NEXT_PUBLIC_BASE_URL
```

All raw `process.env.X` references replaced across codebase.

## Placeholder Pattern

When env var missing OR fetch fails:
- Still renders WMCard wrapper + title bar (desktop mode windows work)
- Shows muted `"— not configured —"` centered, font-mono
- Approximate real section height (prevent layout jump)
- No error stack, no red UI

## Components with try/catch + Placeholder

1. `instagram-card.tsx` — server component, fetch from Behold.so
2. `youtube-section.tsx` — client component, YT API (already has fallback with hardcoded videos, just toggle guard added)
3. `hardcover-card.tsx` — server component, GraphQL fetch
4. `lastfm-card.tsx` — server component, checks env vars and renders placeholder; delegates to `lastfm-player.tsx` client component for real content
5. `vercel-projects.tsx` — client component, Vercel API
6. `KofiCard.tsx` — static, no API, just toggle guard

## Source file locations
- Sections: `src/app/page.tsx` (imports + layout)
- Each section component: `src/components/` (youtube-section, instagram-card, hardcover-card, lastfm-card, lastfm-player, vercel-projects, kofi-card)
- DATA config: `src/data/config.tsx`
- Env helper: `src/lib/env.ts`
- .env.example: root
