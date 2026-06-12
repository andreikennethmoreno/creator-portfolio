# Contexts TL;DR

All providers in `src/app/layout.tsx` (order matters):

| Context | File | Key Fields |
|---------|------|------------|
| ThemeProvider | `theme-context.tsx` | `theme`, `setTheme` (light/dark) |
| WallpaperProvider | `wallpaper-context.tsx` | `wallpaper`, `palette`, `cycleWallpaper` |
| DesktopModeProvider | `desktop-mode-context.tsx` | `isDesktop`, `toggleDesktop`, `revealedSection` |
| WindowManagerProvider | `window-manager-context.tsx` | `windows`, `activeScreen`, `openWindow`, `hasMaximizedWindow` |
| CardStyleProvider | `card-style-context.tsx` | `cardStyle` (flat/glossy) |
| CardWindowProvider | `card-window-context.tsx` | Per-window drag/resize/controls |
| MusicPlayerProvider | `music-player-context.tsx` | `track`, `videoId`, `isPlaying`, `currentTime`, `toggle`, `seek` |
| HUDPanelProvider | `hud/hud-panel.tsx` | `open`, `close`, `isOpen`, `activeTab` |

## Data Flow
- `resume.tsx` → DATA object → consumed by navbar, hero, sections
- External API → `fetch()` with `revalidate` → ISR cache → rendered component
- Theme/Wallpaper/Desktop state → React Contexts → consumed via custom hooks
- Music player state → `MusicPlayerContext` → shared by MiniPlayer, LastFmPlayer, HUD PlayerTab
