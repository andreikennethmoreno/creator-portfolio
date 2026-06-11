# Project TL;DR

Next.js 16 / React 19 / TypeScript / Tailwind v4 / shadcn/ui portfolio for Kenroms.

## Routes
- `/` — single-scroll landing: Hero, Instagram, YouTube, Books, Last.fm, Threads, Support
- `/blog` — paginated blog listing (5/page)
- `/blog/[slug]` — MDX blog posts with Shiki highlighting
- `/api/refresh-threads-token` — GET endpoint

## Key Files
- `src/data/resume.tsx` — all personal data (name, links, social, projects, navbar items)
- `src/app/page.tsx` — home page layout
- `src/app/layout.tsx` — root layout with providers + LayoutShell + Navbar

## Styling
- Tailwind v4 with CSS custom properties (OKLCH color space)
- `src/app/globals.css` — global styles, theme variables
- shadcn/ui components in `src/components/ui/`

## Theme
- Custom context (`src/lib/theme-context.tsx`), not next-themes
- View Transitions API for animated theme toggle (`AnimatedThemeToggler`)
- Wallpaper system with k-means palette extraction (`src/lib/wallpaper-context.tsx`)
- `ThemeToggle` = wallpaper cycler (confusing name)
- `ModeToggle` wraps `AnimatedThemeToggler` (light/dark) — NOT currently used in navbar
- In navbar center dock: theme toggle (wallpaper cycler) hidden on desktop via `!isDesktop`

## Desktop Mode
- Toggle in navbar left dock → sets `isDesktop` in `DesktopModeProvider`
- Full-screen windowed overlay, sections become draggable/resizable windows
- Window manager with tiling layout (useReducer-based)
- Dock auto-hides when windows are open
- See `tldr/desktop-mode.md` for details

## Navbar (Dock System)
- 3 dockers: left (desktop toggle), center (nav links, apps, card style, wallpaper toggle), right (mini player)
- `ThemeToggle` (wallpaper cycler) hidden on desktop — visible on mobile/tablet only
- GitHub and email social links hidden on desktop (filtered out when `isDesktop`)
