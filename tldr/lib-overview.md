# Lib Files TL;DR

All 20 files in `src/lib/`. Quick reference.

## Context Providers (8)
| File | Exports | Type |
|------|---------|------|
| `theme-context.tsx` | `ThemeProvider`, `useTheme()` | light/dark, localStorage, anti-FOUC |
| `wallpaper-context.tsx` | `WallpaperProvider`, `useWallpaper()` | Image cycling, preload, palette extraction trigger |
| `desktop-mode-context.tsx` | `DesktopModeProvider`, `useDesktopMode()` | `isDesktop`, `toggleDesktop`, `revealedSection` |
| `window-manager-context.tsx` | `WindowManagerProvider`, `useWindowManager()` | 3 screens, windows state, tiling, z-index, transition |
| `card-style-context.tsx` | `CardStyleProvider`, `useCardStyle()` | flat/glossy toggle, persisted to localStorage |
| `card-window-context.tsx` | `CardWindowProvider`, `useCardWindow()` | Per-card window state (isWindow, drag coords) |
| `music-player-context.tsx` | `MusicPlayerProvider`, `useMusicPlayer()` | Shared YT player, polls `/api/lastfm` every 10s |
| `hud/hud-panel.tsx` | `HUDPanelProvider`, `useHUDPanel()` | Desktop HUD dropdown with 4 tabs |

## API Helpers (5)
| File | Exports | ISR |
|------|---------|-----|
| `hardcover.ts` | `getCurrentlyReading()`, `getRecentlyRead()`, `getWantToRead()`, `getReadingStats()` | `revalidate: 3600` |
| `instagram.ts` | `getInstagramPosts(limit?)` via Behold.so | `revalidate: 3600` |
| `lastfm.ts` | `getRecentTrack()` via Last.fm API | `revalidate: 60` |
| `vercel.ts` | `getTopVercelProjects(limit?)` | `revalidate: 3600` |
| `youtube.ts` | `getYouTubeVideoId(trackName, artist)` for Last.fm player | `revalidate: 3600` |

## Utilities (4)
| File | Exports | Purpose |
|------|---------|---------|
| `env.ts` | `env.youtube()`, `env.behold()`, `env.hardcoverToken()`, etc. | Centralized env var access, never throws |
| `utils.ts` | `cn()` (clsx+twMerge), `formatDate()` | Class merging, date formatting |
| `view-transition.ts` | `rippleTransition(x, y, applyChange, duration?)` | Circle clip VT for theme/wallpaper changes |
| `use-drag.ts` | `useDrag(x, y, onMove, onStart?, w?, h?)` | Window drag with boundary clamping |

## Hooks (2)
| File | Exports | Purpose |
|------|---------|---------|
| `use-wallpaper-theme.ts` | `useWallpaperTheme()` | colorthief-based palette extraction (alt. to k-means) |
| `use-domain-color.ts` | `useDomainColor(faviconUrl)` | Vercel project favicon → dominant color |

## Data Re-exports (1)
| File | Exports |
|------|---------|
| `wallpaper-data.ts` | Re-exports `WALLPAPER_URLS`, `DEFAULT_WALLPAPER_URL`, `WALLPAPER_HOSTS` from config |

## Wallpaper Theme (2 files)
| File | Exports | Purpose |
|------|---------|---------|
| `wallpaper-theme.ts` | `buildPalette(img)`, `applyPaletteToDOM(palette)`, `extractAndApply(imgSrc)` | k-means clustering (k=16, 10 iters), RGB→OKLCH, DOM CSS var inject |
| `wallpaper-context.tsx` | `WallpaperProvider`, `useWallpaper()` | Wallpaper state + `extractAndApply` trigger on change |
