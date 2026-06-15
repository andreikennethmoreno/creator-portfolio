# Data Config System TL;DR

**File**: `src/data/config.tsx`

Single source of truth. Edit this one file to personalize.

## Structure (Multi-Mode)

```
CONFIG
├── mode                  → "creator" | "linktree" | "dev" ← master switch
├── name, initials, url, description, avatarUrl  ← shared identity
├── general               ← app-wide settings
│   ├── defaultCardStyle  → "default" | "glossy"
│   ├── showDesktopModeNotification → bool
│   ├── showThemeToggleNotification → bool
│   └── wallpapers        → [{ name, label, url }] — 7 wallpapers
│
├── contact
│   ├── email
│   └── social            → { YouTube, Instagram, Twitter, GitHub, Hardcover, Ko-fi, email }
│                          Each: name, url, icon, navbar (bool)
│
├── creator               ← portfolio mode config
│   ├── sections          → toggle { lastfm, instagram, youtube, hardcover, vercel, kofi }
│   ├── navbar            → dock items [{ href, icon, label }]
│   ├── dock              → { cardStyleToggle, themeToggle, search, socials }
│   ├── youtube           → channelUrl, playlistId, fallbackVideos

│   ├── terminal          → bootLines, prompt, commands
│   └── kofi              → url, tiers
│
├── linktree              ← linktree mode config (empty shell)
│   ├── links             → ordered social keys
│   ├── showTerminal      → bool
│   └── showDock          → bool
│
└── dev                   ← dev mode config (empty)
```

## Derived Exports
- `WALLPAPER_URLS` — array of wallpaper image URLs (from CONFIG.general.wallpapers)
- `DEFAULT_WALLPAPER_URL` — first wallpaper URL
- `WALLPAPER_HOSTS` — preconnect origins

## Key Principle
Identity (name, avatar, contact) lives at root — shared across all modes.
Mode-specific config lives under its namespace — components only read their own.
