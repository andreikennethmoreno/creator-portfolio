# Project TL;DR

Next.js 16 / React 19 / TypeScript / Tailwind v4 / shadcn/ui / Magic UI / Motion portfolio for **Kenroms** — Software Engineer & Content Creator.

## Routes
- `/` — single-scroll landing: Hero, Instagram, YouTube, Books, Last.fm, Vercel Projects, Ko-fi
- `/api/lastfm` — GET last scrobble

## Key Files
- `src/app/globals.css` — global styles, Tailwind v4 `@theme inline`, OKLCH color vars
- `src/data/resume.tsx` — all personal data (name, links, social, navbar items)
- `src/app/page.tsx` — home page layout with DesktopPanel wrappers

## Styling
- Tailwind v4 via `@tailwindcss/postcss`, CSS custom properties in OKLCH
- Green primary accent: `oklch(0.6333 0.0309 154.9039)` (same in light & dark)
- `--color-card`, `--color-muted-foreground` used for hover overlays
- Radius: `0.35rem`, spacing: `0.23rem`
- Fonts: Antic (sans), Signifier (serif), JetBrains Mono (mono)

## Sections & Hover Styles
- **YouTube**: `bg-card/60` overlay, `text-muted-foreground` title, `group-hover:opacity-100`
- **Instagram**: same as YouTube (`bg-card/60`, `text-muted-foreground`)
- **Hardcover**: `bg-card` overlay, title/author text

- **All image overlays**: `opacity-0 group-hover:opacity-100 transition-opacity`

## Theme
- Custom context (`src/lib/theme-context.tsx`), persists to `localStorage.theme`
- View Transitions API for animated toggle (`AnimatedThemeToggler`)
- Wallpaper system with k-means palette extraction (`wallpaper-context.tsx`) — 7 wallpapers in rotation, all preloaded at build time via `<link rel="preload">` tags
- `ThemeToggle` = wallpaper cycler; `ModeToggle` = light/dark toggle
- Wallpaper URLs/hosts stored in `src/lib/wallpaper-data.ts` (server-safe import, no `"use client"`)

## Desktop Mode
- Toggle in navbar left dock → `isDesktop` in `DesktopModeProvider`
- **DesktopModeNotification** — floating card above left dock on lg+ when desktop OFF, "Try it"/"Later" buttons, localStorage dismiss
- 3 virtual screens (macOS Spaces-style), draggable/resizable windows
- Window manager with tiling layout (useReducer)
- Dock auto-hides only when a window is **maximized** (`hasMaximizedWindow` from WM context)
- When maximized, bottom 100px hover reveals dock in 3 zones (left/center/right)
- Restore button (middle button between _ and X) → un-maximizes → dock reappears
- See `tldr/desktop-mode.md`, `tldr/screens.md`, `tldr/navbar.md`, `tldr/dockers.md`

## Navbar (Dock System)
- 3 dockers: left (desktop toggle + screen switcher), center (links + app launchers + card style + wallpaper), right (mini player)
- Left & center use MagicUI Dock (spring physics magnification); right is plain div (no magnification)
- Mini player shows album art, track info, progress bar/CSS sound wave, play/pause
- **Top Panel** (`src/components/top-panel.tsx`): hover-triggered drop-down at top center, 4 tabs (Website/Tech Stack/Music/About)
- **MiniPlayer** (`src/components/mini-player.tsx`): desktop mode right dock, reads from shared MusicPlayerContext
- All music consumers read from single `MusicPlayerContext` — no duplicate YT players
- See `tldr/top-panel.md`, `tldr/music-player-context.md`, `tldr/mini-player.md`

## Search Explorer
- Spotlight-style search (`search-explorer.tsx`), triggered from center dock (search icon)
- `SECTIONS` array defines 9 searchable items: hero, instagram, youtube, reading, listening, vercel, twitter, support, themes
- **Keyword matching**: each section can have a `keywords` array for alt search terms. e.g. `vercel` has `keywords: ["projects"]`, `themes` has `keywords: ["wallpaper"]`
- Filter checks both `label` and `keywords` (case-insensitive substring)
- Selecting "themes" opens the wallpaper carousel inside the search panel
- All other results call `onReveal(label)` → finds matching APP in `window-manager-context.tsx` via `APPS.find(a => a.id === section)` → opens window
- See `tldr/search-explorer.md`
