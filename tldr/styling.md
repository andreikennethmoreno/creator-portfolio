# Styling System TL;DR

## Tech
- Tailwind CSS v4 via `@tailwindcss/postcss`
- CSS custom properties in OKLCH color space
- shadcn/ui New York style

## Theme (globals.css)
- `@theme inline` block in globals.css for all design tokens
- Light/dark via `.light` / `.dark` class on `<html>`
- Colors: `--color-background`, `--color-card`, `--color-primary`, `--color-muted-foreground`, etc.
- Primary green: `oklch(0.6333 0.0309 154.9039)` (same in both modes)
- Border radius: `0.35rem`
- Spacing scale: `0.23rem` base unit

## Wallpaper System
- 7 external wallpapers from GitHub repos, rendered as CSS `background-image` on `<div>`
- **Preloading**: All 7 wallpapers preloaded via `<link rel="preload" as="image">` tags in `<body>` (hoisted to `<head>` by React 19). Hosts preconnected via `<link rel="preconnect">`. Default wallpaper has `fetchPriority="high"`.
- Color extraction: Client-side k-means clustering on canvas (16 pixels sample, 16 clusters, 10 iterations), sets CSS custom properties on `<html>`.
- API: `src/lib/wallpaper-data.ts` (server-safe, no `"use client"`), `wallpaper-context.tsx` (provider + JS preload fallback), `wallpaper-theme.ts` (k-means + DOM application), `wallpaper-background.tsx` (rendering).

## Dock Styling
- `bg-card/90 backdrop-blur-3xl border shadow-[0_0_10px_3px] shadow-primary/5 rounded-xl`
- Dock items: `bg-background border border-border text-muted-foreground hover:text-foreground hover:bg-muted`
- On small screens (< 1024px): left dock hidden, center dock has no left border (`border-l-0 lg:border-l`), magnification disabled

## Key CSS Patterns
- Overlays: `bg-card/60 opacity-0 group-hover:opacity-100 transition-opacity`
- Cards: `rounded-xl border bg-card text-card-foreground shadow-sm`
- Hover: `transition-colors` on dock icons
- Dock auto-hide: `transition-all duration-300` with translate-y/opacity
