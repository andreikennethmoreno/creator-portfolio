# Wallpaper System TL;DR

Spans 4 lib files + 3 components. Dynamic background with palette extraction.

## Files

| File | Role |
|------|------|
| `src/data/config.tsx` | `CONFIG.general.wallpapers` — 7 wallpapers (name, label, url) |
| `src/lib/wallpaper-data.ts` | Re-exports `WALLPAPER_URLS`, `DEFAULT_WALLPAPER_URL`, `WALLPAPER_HOSTS` |
| `src/lib/wallpaper-context.tsx` | Provider: `wallpaper`, `palette`, `cycleWallpaper`, `setWallpaper` |
| `src/lib/wallpaper-theme.ts` | k-means clustering + RGB→OKLCH + DOM CSS var injection |
| `src/lib/use-wallpaper-theme.ts` | Alt. via colorthief `getSwatchesSync()` |
| `src/components/wallpaper-background.tsx` | Renders `background-image: url(${wallpaper})` fixed -z-10 |

## Preloading (layout.tsx)
- All 7 wallpapers preloaded via `<link rel="preload" as="image">` in `<body>`
- Hosts preconnected via `<link rel="preconnect">`
- Default wallpaper has `fetchPriority="high"`

## Palette Extraction Pipeline

1. **User clicks wallpaper cycler** → `cycleWallpaper()` in context
2. **Detect palette change** via `extractAndApply(url)` in `wallpaper-theme.ts`:
   - New `<img>` with `crossOrigin="anonymous"`
   - Sample pixels at 200×200 via `<canvas>`
   - Every 16th pixel sampled (skip transparent)
   - **k-means clustering**: k=16, 10 iterations, sorted by luminance
   - Map clusters → `buildPalette()` picks: darkest[0], darkMid[2], accent1[4], accent2[6], midtone[8], lightMid[12], brightest[15]
   - RGB → OKLCH conversion with linearization + D65 → LMS → OKLab → OKLCH
3. **`applyPaletteToDOM(palette)`** sets 22 CSS vars on `<html>`:
   - `--background`, `--foreground`, `--card`, `--primary`, `--accent`, `--border`, `--muted`, `--chart-1` through `--chart-5`, `--sidebar*`, etc.
    - Clamps OKLCH lightness per role (e.g., primary: 0.40–1 dark, 0–0.65 light)
    - **`--primary-foreground` is dynamic**: `oklchFgFor(primary)` — white if primary ≤ 0.7 L, black if > 0.7 L. Keeps `bg-primary text-primary-foreground` readable for buttons/tooltips/navbar.
    - Toggles `.dark` class based on darkest cluster luminance (< 0.15)

## Alt. Method
`use-wallpaper-theme.ts` uses `colorthief` package `getSwatchesSync()` with fallback favicon proxy. Reads swatches in priority: Vibrant → DarkVibrant → LightVibrant → Muted → DarkMuted → LightMuted.

## View Transition on Change
Wallpaper changes use `rippleTransition()` from `view-transition.ts` with circle clip path from click origin. See `tldr/view-transitions.md`.

## Components Consuming Palette
- `WallpaperBackground` — fixed bg image
- `Navbar` — wallpaper cycler button
- `SearchExplorer` — wallpaper carousel panel
- `FloatingToolbar` — wallpaper thumbnail picker
