# Debug Settings (Navbar Dock) TL;DR

**File**: `src/components/navbar.tsx` (inline popover)

Debug Settings icon in the center dock (non-desktop mode only). Toggle with `CONFIG.general.debugSettings`.

## Position
- Settings `gear` icon in the center dock, only when `!isDesktop`
- **Order**: appears first after the social links separator, before cardStyleToggle and themeToggle
- Click opens a popover above the dock
- Popover positioned `absolute bottom-full mb-3 left-1/2 -translate-x-1/2`

## Popover Contents
| Section | Controls |
|---------|----------|
| **Mode** | dev / creator / custom / linktree — sets `?mode=` param, reloads page |
| **Card Style** | default / glossy — toggles via `useCardStyle().toggle()` |
| **Wallpaper** | Thumbnail circles — click to change wallpaper with view-transition ripple |

## Wallpaper Ripple Animation
- Uses `rippleTransition()` from `src/lib/view-transition.ts`
- Origin = center of clicked thumbnail button
- Same View Transitions API as `theme-toggle.tsx` and `search-explorer.tsx`

## Config
```tsx
CONFIG.general.debugSettings // bool — show/hide debug settings button
```

## Dependencies
- `useWallpaper` — wallpaper state
- `useCardStyle` — card style state + toggle
- `rippleTransition` — view-transition ripple for wallpaper changes
- `CONFIG.general.wallpapers` — wallpaper list
- URL `?mode=` param — mode switching with page reload
