# Sections TL;DR

All sections wrapped in `WMCard` with staggered `BlurFade` scroll-reveal.

> **Env dependency map:** See `tldr/env-vars.md` for which env vars each section uses and current crash behavior.

> **Toggle status:** Section visibility controlled by `CONFIG.sections.*` in `src/data/config.tsx`.

> **Threads removed.** Replaced by Twitter social link. No Threads section, no API route, no env vars. Twitter handle: @Kenroms.

## Hero
- Avatar, name, tagline, location, terminal mode toggle
- Grid background pattern (48px squares, gray 10% opacity)
- **Terminal**: Click anywhere on the card (titlebar, content, avatar — entire `<section>` area) to open. Boot sequence (100ms interval), then interactive prompt.
- **Desktop mode**: Terminal fills the entire window (`h-full` on container + terminal body when `isWindow && terminalOpen`)
- **Commands**: whoami, location, status, contact, links, matrix, clear, exit (data from `CONFIG.terminal` in config.tsx)
- **`matrix` command**: Takes over the entire terminal body — full-size `<MatrixRain />` overlay. `matrixMode` state toggled on `cmd === "matrix"`, exit via [exit] button or Escape key.
- **MatrixRain** (`src/components/matrix-rain.tsx`): DOM `<pre>`-based, auto-sized via ResizeObserver (fills parent). Dense straight-down columns (one per char width), katakana + ASCII, `--primary` CSS color with opacity fade trail (7 chars deep). rAF loop, pauses on tab hidden.
- **"click me" button**: `dark:bg-primary dark:text-primary-foreground bg-primary/15 text-primary-foreground` + `animate-pulse` — full primary bg in dark, subtle tint in light, text always readable (primary-foreground). Pulsating cursor uses `dark:bg-primary-foreground bg-primary-foreground`.

## Instagram (`instagram-card.tsx`)
- **Type**: Async server component
- **Source**: Behold.so proxy (`NEXT_PUBLIC_BEHOLD_FEED_ID`)
- **Grid**: 3 columns, `aspect-4/5` images
- **Hover**: `bg-card/60` overlay + `text-muted-foreground` caption text

## YouTube (`youtube-section.tsx`)
- **Type**: Client component
- **Source**: YouTube Data API v3 (playlist ID from `CONFIG.youtube.playlistId` in config.tsx)
- **Grid**: 2 columns, `aspect-video` thumbnails
- **Hover**: `bg-card/60` overlay + `text-muted-foreground` title text
- **Duration badge**: `bg-black/80 text-white` bottom-right
- **Fallback**: 5 videos from `CONFIG.youtube.fallbackVideos` (config.tsx) when no API key

## Hardcover (`hardcover-card.tsx` + `hardcover-books-carousel.tsx`)
- **Type**: Async server component + client carousel
- **Source**: Hardcover GraphQL API
- **Display**: Embla Carousel, 96x144px covers
- **Sections**: Read, Currently Reading, Want to Read
- **Hover**: `bg-card/80` overlay with title, author, star rating
- **StarRating**: half-star support (`*`/`**`/`***`/`***1/2`/`****`)

## Last.fm (`lastfm-card.tsx` + `lastfm-player.tsx`)
- **Type**: Async server component + client player
- **Source**: Last.fm API (`/api/lastfm` route)
- **Display**: Album art, track name, artist, "Now Playing" green dot
- **Player**: Hidden YouTube iframe for audio, 28-bar canvas audio visualizer
- **Features**: Seekable progress bar, play/pause, cleanup on unmount

## Vercel Projects (`vercel-projects.tsx`)
- **Type**: Client component
- **Source**: Vercel API + Microlink screenshots
- **Display**: Project cards with framework badges, deployment counts, favicons

## Ko-fi (`KofiCard.tsx` + `KofiButton.tsx`)
- **Type**: Client component + client widget
- **Layout**: 2-column grid (always side-by-side, never stacks), `-m-3` cancels card padding
- **Left**: `holdingsign.gif` (720x1280, 31 frames, palette mode) from `/public/`, `h-52 w-full object-cover` in `140px` column
- **GIF smoothing**: CSS `filter: brightness(1.02) contrast(1.02) blur(0.4px)` + `image-rendering: auto` to fix GIF color banding
- **Overlay**: "good/karma" text centered with `pt-16`, bold black `text-[11px]` font-mono
- **Right**: Clickable tip tiers from `CONFIG.kofi.tiers` (config.tsx) as rounded links, `pr-3` padding
- **Button**: `kofi-react-widget` floating button

## Hover Overlay Pattern (Instagram / YouTube / Hardcover)
All use the same pattern:
```tsx
<div className="absolute inset-0 bg-card/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
  <p className="text-xs text-muted-foreground line-clamp-2">{text}</p>
</div>
```
