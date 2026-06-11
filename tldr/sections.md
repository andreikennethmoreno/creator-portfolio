# Sections TL;DR

All sections wrapped in `WMCard` with staggered `BlurFade` scroll-reveal.

> **Threads removed.** Replaced by Twitter social link. No Threads section, no API route, no env vars. Twitter handle: @Kenroms.

## Hero
- Avatar, name, tagline, location, terminal mode toggle
- Grid background pattern (48px squares, gray 10% opacity)

## Instagram (`instagram-card.tsx`)
- **Type**: Async server component
- **Source**: Behold.so proxy (`NEXT_PUBLIC_BEHOLD_FEED_ID`)
- **Grid**: 3 columns, `aspect-4/5` images
- **Hover**: `bg-card/60` overlay + `text-muted-foreground` caption text

## YouTube (`youtube-section.tsx`)
- **Type**: Client component
- **Source**: YouTube Data API v3 (playlist `PLX3Oq3YxWT0iZHgfDNIePM-2FSqaXQUWd`)
- **Grid**: 2 columns, `aspect-video` thumbnails
- **Hover**: `bg-card/60` overlay + `text-muted-foreground` title text
- **Duration badge**: `bg-black/80 text-white` bottom-right
- **Fallback**: 5 hardcoded videos when no API key

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
- **Right**: Clickable tip tiers ($5 coffee, $10 large coffee) as rounded links, `pr-3` padding
- **Button**: `kofi-react-widget` floating button

## Hover Overlay Pattern (Instagram / YouTube / Hardcover)
All use the same pattern:
```tsx
<div className="absolute inset-0 bg-card/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
  <p className="text-xs text-muted-foreground line-clamp-2">{text}</p>
</div>
```
