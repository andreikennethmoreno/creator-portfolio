# Architecture TL;DR

## Directory Structure
```
src/
├── app/              # Next.js App Router
│   ├── page.tsx      # Home (single scroll)
│   ├── not-found.tsx # 404 page
│   ├── globals.css   # Tailwind v4 + theme vars
│   ├── layout.tsx    # Root layout (providers, fonts)
│   └── api/lastfm/   # Last.fm proxy route
├── components/       # React components
│   ├── magicui/      # Dock, BlurFade, BlurFadeText
│   ├── ui/           # shadcn primitives
│   ├── hud/          # HUD panel components
│   ├── section/      # Section-specific components
│   └── (root)        # navbar, wm-card, desktop-layout, etc.
├── lib/              # Contexts, utils, API helpers
└── data/
    └── config.tsx    # SINGLE source of truth for ALL dynamic data (personal info, sections toggle, YouTube playlist/fallbacks, wallpapers, terminal, Ko-fi tiers, default card style, social links)
```

## Rendering Patterns
- **Server Components (async)**: InstagramCard, HardcoverCard, LastFmCard, KofiCard
- **Client Components**: Navbar, SearchExplorer, DesktopLayout, WM, Youtube, Players
- **ISR**: All server fetches use `next: { revalidate }` (60s-3600s)

## Component Patterns
- **WMCard wrapper**: Every section wrapped in `WMCard` for desktop mode window support
- **BlurFade stagger**: Scroll-reveal with staggered delays `[0.04, 0.28, ...]`
- **Dock icons**: Wrapped in `DockIcon` → `Tooltip` → `TooltipTrigger` → `button`/`a`
- **Desktop mode**: Sections open as draggable/resizable windows with tiling
- **MatrixRain** (`src/components/matrix-rain.tsx`): DOM `<pre>`-based Matrix rain, auto-sizes to parent via ResizeObserver. Dense straight-down columns with `--primary` CSS var + opacity fade. Used as full terminal takeover overlay when `matrix` command typed in HeroSection.
