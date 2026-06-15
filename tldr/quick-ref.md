# Quick Ref — 30s Agent TL;DR

## Identity
**Project**: Next.js 16 / React 19 / TS / Tailwind v4 / shadcn/ui / Magic UI / Motion portfolio for Kenroms

## Modes (`CONFIG.mode`)
- `"creator"` — full portfolio (hero, instagram, youtube, books, lastfm, vercel, kofi)
- `"linktree"` — simplified link-in-bio page
- `"dev"` — developer portfolio (about, experience, education, projects)

## Config
**Single file**: `src/data/config.tsx` — edit this to change ALL content.
- Root: identity (name, avatar, contact)
- `CONFIG.creator.*` / `CONFIG.linktree.*` / `CONFIG.dev.*` — mode-specific

## Routing
- `/` — landing page (mode-dependent layout)
- `/api/lastfm` — GET recent scrobble
- `/api/youtube-playlist` — GET playlist videos
- `/api/vercel-stats` — GET vercel deployment stats
- `/*` — custom 404

## Dev Mode Sections
| Section | Component | Status |
|---------|-----------|--------|
| About | `about-section.tsx` | ✅ Config-driven with segments |
| Experience | `experience-section.tsx` | ⏳ Placeholder |
| Education | `education-section.tsx` | ⏳ Placeholder |
| Projects | `projects-section.tsx` | ⏳ Placeholder |

## Component Pattern
```
Every section → WMCard wrapper + BlurFade stagger → DesktopPanel in page.tsx
```

## Key Patterns
- **Sections**: `WMCard(title) > BlurFade(delay) > content`
- **Data**: `CONFIG` → component imports from `@/data/config`
- **Env vars**: `env.*()` from `@/lib/env` — never throws
- **Styling**: Tailwind v4 `@theme inline` + OKLCH vars; flat/glossy via `useCardStyle()`
- **Desktop mode**: Sections auto-become draggable/resizable windows

## Desktop Mode Contexts (in order)
ThemeProvider → WallpaperProvider → DesktopModeProvider → WindowManagerProvider → CardStyleProvider → CardWindowProvider → MusicPlayerProvider → HUDPanelProvider

## File Structure (src/)
```
src/
├── app/          # pages, layouts, API routes, globals.css
├── components/   # section/, ui/, magicui/, hud/, plus root components
├── data/         # config.tsx (single source of truth)
└── lib/          # contexts, utils, API helpers
```
