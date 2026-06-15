# Project TL;DR

Next.js 16 / React 19 / TypeScript / Tailwind v4 / shadcn/ui / Magic UI / Motion portfolio for **Kenroms** — Software Engineer & Content Creator.

## Routes
- `/` — single-scroll landing: Hero, Instagram, YouTube, Books, Last.fm, Vercel Projects, Ko-fi
- `/api/lastfm` — GET last scrobble
- `/api/youtube-playlist` — GET playlist videos (uses playlistId from config)
- `/api/vercel-stats` — GET Vercel deployment stats

## Key Files
- `src/app/globals.css` — global styles, Tailwind v4 `@theme inline`, OKLCH color vars
- `src/data/config.tsx` — **SINGLE SOURCE OF TRUTH** for ALL dynamic data (personal info, sections toggle, social links, YouTube playlist ID, wallpapers, terminal boot data, Ko-fi tiers, default card style, etc.)
- `src/app/page.tsx` — home page layout with DesktopPanel wrappers

## Config System (`src/data/config.tsx`)
Single file driving all changeable content:
- `CONFIG.name`, `CONFIG.description`, `CONFIG.avatarUrl` — identity
- `CONFIG.sections.*` — toggle section visibility
- `CONFIG.contact.social.*` — all social links + icons
- `CONFIG.youtube.playlistId` — YouTube playlist ID
- `CONFIG.youtube.fallbackVideos` — fallback when API key missing
- `CONFIG.wallpapers` — wallpaper array (name, label, url)
- `CONFIG.terminal.bootLines/prompt/commands` — hero terminal mode
- `CONFIG.kofi.tiers` — Ko-fi support tiers
- `CONFIG.contact.social.*.url` — HUD about-tab links (via direct property access)
- `CONFIG.general.defaultCardStyle` — default card appearance ("default" | "glossy")
- `CONFIG.general.showDesktopModeNotification` — show desktop mode onboarding toast
- `CONFIG.general.showThemeToggleNotification` — show wallpaper toggle onboarding toast

## Styling
- Tailwind v4 via `@tailwindcss/postcss`, CSS custom properties in OKLCH
- Green primary accent: `oklch(0.6333 0.0309 154.9039)` (same in light & dark)
- `--color-card`, `--color-muted-foreground` used for hover overlays
- Radius: `0.35rem`, spacing: `0.23rem`
- Fonts: Antic (sans), Signifier (serif), JetBrains Mono (mono)

## Desktop Mode
- Toggle in navbar left dock → `isDesktop` in `DesktopModeProvider`
- 3 virtual screens (macOS Spaces-style), draggable/resizable windows
- Window manager with tiling layout (useReducer)
- Dock auto-hides when window maximized; bottom 100px hover reveals dock
- See `tldr/desktop-mode.md`, `tldr/screens.md`, `tldr/navbar.md`, `tldr/dockers.md`

## Navbar (Dock System)
- 3 dockers: left (desktop toggle + screen switcher), center (links + app launchers + card style + wallpaper), right (mini player)
- Left & center use MagicUI Dock (spring physics magnification); right is plain div
- Left dock hidden when `CONFIG.mode === "linktree"` (no desktop toggle, no screen switchers)
- Mini player shows album art, track info, progress bar, play/pause
- See `tldr/top-panel.md`, `tldr/music-player-context.md`, `tldr/mini-player.md`

## Linktree Mode (`CONFIG.mode === "linktree"`)
- Renders `<LinktreeLayout />` instead of the full portfolio
- Avatar, name, description (`text-foreground/80`), link cards with uniform `hover:bg-muted/20`
- Terminal easter egg with boot sequence, commands, Matrix Rain mode
- Left dock removed from navbar; center dock still renders
- Reduced top padding (`py-6`) for balanced vertical centering
- See `tldr/modes.md` for mode architecture details

## Search Explorer
- Spotlight-style search, 9 searchable items
- Wallpaper carousel inside search panel
- Opening theme/wallpaper in search opens carousel within panel
- All other results open desktop windows
- See `tldr/search-explorer.md`
