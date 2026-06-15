# Data Config System TL;DR

**File**: `src/data/config.tsx`

Single source of truth for ALL dynamic/changeable content. Edit this one file to personalize the entire portfolio.

## Structure

```
CONFIG
├── name, initials, url, description, avatarUrl
├── sections          → toggle { lastfm, instagram, youtube, hardcover, vercel, kofi }
├── navbar            → dock items [{ href, icon, label }]
├── dock              → { cardStyleToggle, themeToggle, search, socials } — universal dock feature toggles + social link list
├── contact
│   ├── email
│   └── social        → { YouTube, Instagram, Twitter, GitHub, Hardcover, Ko-fi, email }
│                      Each has: name, url, icon, navbar (bool)
├── youtube
│   ├── channelUrl    → "https://www.youtube.com/@kenroms"
│   ├── playlistId    → "PLX3Oq3YxWT0iZHgfDNIePM-2FSqaXQUWd"
│   └── fallbackVideos → [{ id, title, duration, href }]
├── wallpapers        → [{ name, label, url }] — 7 wallpapers
├── terminal
│   ├── bootLines     → boot sequence text array
│   ├── prompt        → "visitor@kenroms.dev:~$ "
│   └── commands      → { whoami, location, status, contact, links, help }
├── kofi
│   ├── url           → "https://ko-fi.com/kenroms"
│   └── tiers         → [{ label, amount, note }]
├── defaultCardStyle  → "default" | "glossy"
├── showDesktopModeNotification → bool — show desktop mode onboarding card
└── showThemeToggleNotification → bool — show wallpaper cycler onboarding card
```

## Derived Exports
- `WALLPAPER_URLS` — array of wallpaper image URLs (map from wallpapers)
- `DEFAULT_WALLPAPER_URL` — first wallpaper URL
- `WALLPAPER_HOSTS` — preconnect origins

## What Was Consolidated
- `resume.tsx` → renamed to `config.tsx`, extended
- `wallpaper-data.ts` → re-exports from config
- `wallpaper-context.tsx` → WALLPAPERS array moved to config
- `youtube-playlist/route.ts` → PLAYLIST_ID moved to config
- `youtube-section.tsx` → fallbackVideos moved to config
- `hero-section.tsx` → BOOT_LINES, PROMPT, COMMANDS moved to config
- `KofiCard.tsx` → TIERS moved to config
- `about-tab.tsx` → LINKS moved to config (now via `contact.social.*.url`)
- `card-style-context.tsx` → default style moved to config
