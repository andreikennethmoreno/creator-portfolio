# Project TL;DR

Next.js 16 / React 19 / TypeScript / Tailwind v4 / shadcn/ui portfolio for Kenroms.

## Routes
- `/` — single-scroll landing with sections: Hero, Instagram, YouTube, Books, Last.fm, Threads, Support
- `/blog` — paginated blog listing (5/page)
- `/blog/[slug]` — MDX blog posts with Shiki syntax highlighting
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
- View Transitions API for animated theme toggle
- Wallpaper system with k-means palette extraction (`src/lib/wallpaper-context.tsx`)
