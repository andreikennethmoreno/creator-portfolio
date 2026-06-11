<div align="center">
<img alt="Portfolio" src="https://storage.ko-fi.com/cdn/useruploads/27d854e4-a478-41ec-acbe-f79865f858be_149867fb-a92d-4a0f-a16d-5e06c123c8c5.png" width="90%">
</div>

# Kenroms Portfolio

A dynamic, single-page portfolio built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **shadcn/ui** (New York style), **Magic UI** components, and **Motion** (Framer Motion API). Deployed on Vercel with ISR-based data fetching. Built for **Kenroms** — a Software Engineer and Content Creator based in the Philippines.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features & Sections](#features--sections)
- [Pages & Routing](#pages--routing)
- [Desktop Mode](#desktop-mode)
- [External Integrations](#external-integrations)
- [Theme System](#theme-system)
- [Wallpaper System](#wallpaper-system)
- [Animations & Visual Aesthetics](#animations--visual-aesthetics)
- [Responsive Design](#responsive-design)
- [Architecture & Component Patterns](#architecture--component-patterns)
- [Configuration & Data-Driven Design](#configuration--data-driven-design)
- [Environment Variables](#environment-variables)
- [Getting Started Locally](#getting-started-locally)
- [License](#license)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16.2.7](https://nextjs.org/) (App Router, React 19, Turbopack) |
| **Language** | TypeScript 5.9 (strict mode) |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/postcss`), PostCSS, CSS custom properties (OKLCH color space) |
| **UI Library** | [shadcn/ui](https://ui.shadcn.com/) (New York style) with [Radix UI](https://radix-ui.com/) primitives |
| **Animation** | [Motion](https://motion.dev/) (Framer Motion API v12), [Magic UI](https://magicui.design/) components, [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) |
| **Content** | [Content Collections](https://content-collections.dev/) with MDX |
| **Carousel** | Embla Carousel (via shadcn/ui) |
| **Icons** | Lucide React, Radix Icons, custom SVG components |
| **Package Manager** | pnpm |
| **Deployment** | Vercel |
| **License** | MIT |

---

## Features & Sections

The portfolio is a single-scroll landing page (`/`). Each section is wrapped in a `WMCard` with staggered scroll-reveal animations. All sections can also open as draggable/resizable windows in **Desktop Mode**.

### Hero Section
- Avatar image (96px mobile / 128px desktop, `rounded-xl` with ring)
- Greeting with the creator's name ("Kenroms")
- Description tagline: *"Software Engineer, Content Creator. Love building things and learning shit. Very active on YouTube and Twitter."*
- Location: Philippines
- Background: subtle fixed grid pattern (48px squares, gray 10% opacity)
- **Interactive Terminal Mode**: Click the pulsing `$ click me` button to switch to a terminal interface with boot sequence and commands (`whoami`, `location`, `status`, `contact`, `links`, `help`, `clear`, `exit`)

### Instagram Feed
- **Async server component** fetching the latest 6 Instagram posts via [Behold.so](https://behold.so) (third-party Instagram feed proxy)
- 3-column grid of square images (`aspect-4/5`) with hover overlay showing truncated caption
- Links out to `https://instagram.com/ken.roms`

### YouTube Playlist
- **Client component** fetching videos from a hardcoded playlist ID (`PLX3Oq3YxWT0iZHgfDNIePM-2FSqaXQUWd`)
- Uses YouTube Data API v3 for playlist items + video duration
- 2-column grid of thumbnails with duration badges (formatted as `M:SS` or `H:MM:SS`)
- Hover overlay shows truncated video title
- 5 hardcoded fallback videos when the API key is missing or the fetch fails
- Links out to `https://www.youtube.com/@kenroms`

### Hardcover Books (Reading)
- **Async server component** fetching data from the Hardcover GraphQL API
- Three carousel sections powered by **Embla Carousel** with `dragFree: true` — smoothly scrollable on any device:
  - **Read** (recently finished, up to 15 books)
  - **Currently Reading**
  - **Want to Read**
- Each book rendered as a 96x144px cover image with hover overlay (title, author, star rating via `StarRating` component — half-star support like `***1/2`)
- Links to `https://hardcover.app/@Kenroms`
- Also fetches reading statistics (available but not yet displayed)

### Last.fm Music Player
- **Async server component** fetching the most recent scrobble
- **Client-side YouTube player** (`LastFmPlayer`) that:
  - Searches YouTube for the matching music video
  - Embeds a hidden YouTube iframe player (1x1px, offscreen)
  - Shows album art (or emoji fallback), track name, artist
  - **"Now Playing"** badge with green pulsing dot or **"Last played X time ago"** for past tracks
  - Play/pause button (on album art hover + secondary circle button)
  - Seekable progress bar with current time / total duration, updating every 250ms
  - **Canvas Audio Visualizer**: 28-bar procedural noise-based visualizer using `requestAnimationFrame`, with bar heights generated by `smoothNoise()` (sin-sum function) and smooth easing on pause
  - Proper cleanup on unmount (destroy player, clear intervals)

### Vercel Projects
- **Client component** fetching top projects from the Vercel API
- Renders project cards with:
  - Live screenshots via **Microlink API** (1920x1080, dark mode)
  - Framework badges (Next.js, etc.)
  - Deployment counts
  - Favicon extraction
  - Links to live deployment URLs

### Ko-fi Support
- **Ko-fi Card** (static server component): Displays two support tiers — "coffee" (PHP 150) and "large coffee" (PHP 300) — with terminal-style styling (`>` prefix, monospace font)
- **Ko-fi Floating Button** (client component): Renders the `kofi-react-widget` floating support button on the page
- Contact email displayed: `kennonirom@gmail.com`
- Links to `https://ko-fi.com/kenroms`

### Navigation (Dock Bar)
- macOS-style **magnification dock** (Magic UI `Dock` component) fixed to the bottom of the viewport
- Spring-physics icon scaling: each icon expands proportionally based on cursor proximity (40px base, 60px at closest, spring `{ mass: 0.1, stiffness: 150, damping: 12 }`)
- **Three dock sections** (visible in desktop mode):
  - **Left dock**: Desktop mode toggle + virtual screen switchers (3 screens with active dot indicator)
  - **Center dock**: Search button (in desktop mode), social links (YouTube, Twitter, GitHub, Email), app launchers for each section, wallpaper cycler, card style toggle
  - **Right dock**: Mini player for current Last.fm track
- Dock auto-hides when a fullscreen window is open (reappears on hover near bottom edge)
- All items wrapped in Radix Tooltips with arrows
- Backdrop blur, primary-tinted shadow, responsive positioning

### Search Explorer
- **Spotlight-style search overlay** (triggered by clicking the Home/Search icon in desktop mode, or via `Cmd+K`-like interaction)
- Filters through all sections with fuzzy matching
- Shows recent items with clock icon
- Clicking a result reveals the section and opens it as a window
- Animated open/close with `cubic-bezier(0.34,1.56,0.64,1)` easing

### Mini Player
- Dedicated mini YouTube player in the right dock (desktop mode only)
- Fetches current Last.fm track from `/api/lastfm` every 10 seconds
- Embedded YouTube iframe for audio playback
- Shows album art thumbnail with play/pause
- Green dot indicator for "now playing" status

### Skills Display
- 11 technology icons rendered as inline SVG React components: React, Next.js, TypeScript, Node.js, Python, Go, PostgreSQL, Docker, Kubernetes, Java, C++
- Displayed below the hero section in the portfolio layout

### Card Style Toggle
- Toggle between **"flat"** (default) and **"glossy"** (glassmorphism) card appearance
- Glossy style uses `backdrop-blur`, inset box-shadows, and semi-transparent borders
- Accessible via the dock bar (sparkles/flat icon)

---

## Pages & Routing

| Route | File | Description |
|---|---|---|
| `/` | `src/app/page.tsx` | Home page — single-scroll layout with all section cards |
| `/*` (catch-all) | `src/app/not-found.tsx` | Custom 404 page — large gradient "404", "Page Not Found" heading, "Go to Home" button |
| `/api/lastfm` | `src/app/api/lastfm/route.ts` | GET — returns `{ track, videoId }` for the Last.fm recent scrobble |

### Dynamic OpenGraph Images
- **Edge runtime** (`runtime = "edge"`) using `next/og` (`ImageResponse`)
- Self-hosted OG fonts: `CabinetGrotesk-Medium.ttf` and `ClashDisplay-Semibold.ttf` in `public/fonts/`

---

## Desktop Mode

A full desktop-like window manager that transforms the single-scroll layout into a virtual desktop environment.

### Three Virtual Screens
- macOS Spaces-style **3 virtual screens** (workspaces) with spring slide transitions (`stiffness: 220, damping: 28, mass: 0.55`)
- Navigation via dock indicators (1, 2, 3) with active screen dot and window count badges
- Each screen maintains its own set of open windows

### Window Manager
- **Draggable windows**: Move windows by dragging the titlebar via custom `useDrag` hook
- **Resizable windows**: 8-direction edge/drag handles (n/s/e/w/ne/nw/se/sw), minimum size 200x120px
- **Window controls**: macOS-style traffic light buttons — close (red), minimize (yellow, collapses to dock), maximize (green, fills viewport)
- **Z-index stacking**: Click-to-focus brings window to front
- **Fullscreen detection**: Dock auto-hides when a window fills the viewport

### Tiling Algorithm
- Auto-layout on window open:
  - **1 window**: fills viewport
  - **2 windows**: side-by side equal split
  - **3 windows**: master (55%) + stacked (45% / 2)
  - **4+ windows**: grid layout (auto-calculated columns/rows)

### Desktop Mode Onboarding Notification
- A **floating notification card** (`DesktopModeNotification`) appears above the left dock on `lg+` screens when desktop mode is **inactive** and has never been dismissed
- Designed to onboard desktop/laptop users into the desktop mode feature
- Styled as a shadcn-style card with: Monitor icon, title ("Desktop Mode"), description of features, and two buttons — **"Try it"** (enters desktop mode + dismisses) and **"Later"** (dismisses only)
- Dismissed state persists in `localStorage` (`desktop-mode-notification-dismissed`)
- Fades in with `animate-in fade-in slide-in-from-bottom-4 duration-500`
- Automatically hidden when desktop mode is active

---

## External Integrations

| Service | Purpose | API / Method | Caching (ISR) |
|---|---|---|---|
| **YouTube Data API v3** | Fetch playlist videos + search music videos for Last.fm tracks | `YOUTUBE_API_KEY` / `NEXT_PUBLIC_YOUTUBE_API_KEY` | Client-side fetch |
| **Behold.so** | Instagram feed proxy (no official Instagram API needed) | `NEXT_PUBLIC_BEHOLD_FEED_ID` | `revalidate: 3600` (1 hour) |
| **Hardcover GraphQL API** | Fetch books (reading, read, want to read) + stats | `HARDCOVER_API_TOKEN`, `HARDCOVER_USER_ID` | `revalidate: 3600` (1 hour) |
| **Last.fm API** | Fetch most recent scrobble (now playing / recently played) | `LASTFM_API_KEY`, `LASTFM_USERNAME` | `revalidate: 60` (60 seconds) |
| **Vercel API** | Fetch top projects with deployment counts | `MY_VERCEL_API_TOKEN`, `MY_VERCEL_TEAM_ID` | `revalidate: 3600` (1 hour) |
| **Microlink API** | Screenshot generation for Vercel project cards | Public API (no auth) | Client-side fetch |
| **Ko-fi** | Donation/support widget + embedded card | Ko-fi link + `kofi-react-widget` package | Static |

All server-side fetches use Next.js `fetch` with `next: { revalidate }` for Incremental Static Regeneration (ISR).

---

## Theme System

### Custom Implementation (not `next-themes`)
- **React Context** in `src/lib/theme-context.tsx` providing `{ theme, setTheme }` (`"light"` | `"dark"`)
- **Persistence chain:** `localStorage.theme` → `prefers-color-scheme` media query → `defaultTheme` ("light")
- **Applies** `class="light"` or `class="dark"` to `<html>`
- **Anti-FOUC:** Inline `<script>` in the root layout that reads `localStorage.theme` and sets the class before React hydrates

### Color Palette (OKLCH Color Space)
- **Light mode:** Warm off-white background (`oklch(0.9761 0.0041 91.4461)`), green primary accent (`oklch(0.6333 0.0309 154.9039)`)
- **Dark mode:** Near-black background (`oklch(0.1448 0 0)`), same green primary (`oklch(0.6333 0.0309 154.9039)`)
- Full shadcn-compatible semantic color system (background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, ring, chart colors, sidebar colors)
- Border radius: `0.35rem` globally
- Shadows defined as custom properties across 7 levels (2xs through 2xl)

### Theme Toggle: View Transitions API
- `AnimatedThemeToggler` component using `document.startViewTransition()`
- 7 clip-path shape variants selected randomly: `circle`, `square`, `triangle`, `diamond`, `hexagon`, `rectangle`, `star`
- Default duration: 700ms
- Falls back to instant class toggle when View Transitions API is unavailable (e.g., Firefox)
- Uses `flushSync` from `react-dom` for synchronous class application within the transition callback
- Mobile-optimized with `fromCenter` to avoid off-screen clip origins

---

## Wallpaper System

### Dynamic Wallpaper Context
- **React Context** in `src/lib/wallpaper-context.tsx` providing `{ wallpaper, palette, setWallpaper, cycleWallpaper }`
- **3 wallpapers** from `dharmx/walls` (Nord theme), cycled on click:
  1. **Hillside Walk** (Nord-themed hillside)
  2. **Blue and Black** (geometric pattern)
  3. **Watercolor Town** (watercolor cityscape)
- All wallpapers preloaded on mount

### Dynamic Palette Extraction
- Image pixels sampled at 200x200 via canvas
- **k-means clustering** (k=16, 10 iterations) on sampled pixels
- Clusters sorted by luminance and mapped to semantic palette: `bg`, `bgAlt`, `card`, `fg`, `fgMuted`, `primary`, `accent`, `border`, `muted`
- RGB-to-OKLCH color space conversion
- 20 CSS custom properties applied to `:root` in real time via `applyPaletteToDOM()`
- Alternative extraction method using `colorthief` library in `src/lib/use-wallpaper-theme.ts`

### Wallpaper Background
- Fixed `-z-10` layer with `bg-cover bg-center`
- No CSS transitions (pure drop-reveal via View Transitions)

### Wallpaper Cyclers
- **ThemeToggle** component in the navbar cycles wallpapers with a circle clip-path View Transition
- Wallpaper changes use the same VT mechanism with a circle crop reveal from the toggle button origin

---

## Animations & Visual Aesthetics

### Scroll-Reveal Animations (Magic UI)
- **BlurFade:** Each section card fades in with a vertical offset (6px) + CSS blur (6px) as the user scrolls, triggered by `useInView`. Staggered delays create a cascading reveal: `[0.04, 0.28, 0.32, 0.36, 0.40, 0.44, 0.48, 0.52, 0.56]`
- **BlurFadeText:** Per-character staggered blur-fade animation for the hero greeting, creating a typewriter-like reveal effect (each letter at 0.03s delay)

### Dock Magnification (Magic UI)
- macOS-style spring-physics icon scaling: tracks mouse X position, scales nearest icons to 60px from 40px base
- `motion/react` motion values with spring config `{ mass: 0.1, stiffness: 150, damping: 12 }`

### Desktop Mode Transitions
- **Screen transitions:** Spring slide between virtual screens (`stiffness: 220, damping: 28, mass: 0.55`)
- **Window animations:** Open/close/minimize/maximize with smooth motion values
- **Window drag:** Custom `useDrag` hook with real-time position updates

### Hover Effects
- **Instagram/YouTube/Hardcover cards:** Dark gradient overlay with truncated text, opacity transition (`opacity-0` → `opacity-100`)
- **Navigation icons:** Smooth color transitions (`transition-colors`)

- **Search results:** Background change on hover (`hover:bg-muted`)

### Music Player Visuals
- **Now Playing:** Green dot with `animate-pulse` for currently playing track
- **Canvas Audio Visualizer:** 28-bar procedural noise visualizer with `requestAnimationFrame`, smooth easing, and persistent bar heights on pause
- **Progress bar:** Smooth width transition (`transition-[width] duration-100`)
- **Time formatting:** `timeAgo()` for relative timestamps, `formatTime()` for MM:SS progress display

### Hero Terminal Mode
- Boot sequence prints 8 lines at 100ms intervals via `setInterval`
- Command input with history (supports `whoami`, `location`, `status`, `contact`, `links`, `help`, `clear`, `exit`)
- Smooth opacity crossfade between normal and terminal modes (`transition-all duration-500`)

### Background & Layout
- Subtle fixed grid pattern behind all content (48px squares, gray lines at 10% opacity, `z-0`)
- Content centered at `max-w-2xl` (672px), `z-10`, vertical padding `py-12 pb-24 sm:py-24`, horizontal padding `px-6`
- In desktop mode, content expands to full viewport with positioned windows

### Font System (defined in `src/app/globals.css`)
- **Sans-serif:** `Antic` (primary body font, applied via `font-sans` class), loaded as `--font-sans` via `next/font/google`
- **Serif:** `Signifier, Georgia, Cambria, "Times New Roman", Times, serif` (applied via `font-serif` class)
- **Monospace:** `JetBrains Mono, ui-monospace, monospace` (applied via `font-mono` class, used for code blocks, terminal-style UI elements, and section title bars)
- OG images use separate custom fonts: `Cabinet Grotesk` (medium) + `Clash Display` (semibold), self-hosted in `public/fonts/`

### Page Transitions
- View Transitions API default root animation disabled (`animation: none`) to let custom clip-path transitions take full control
- Wallpaper changes use the same VT mechanism with a circle crop reveal from the toggle button origin

### Custom Scrollbar
- 6px thin scrollbar with transparent track and `border`-colored rounded thumb

---

## Responsive Design

| Breakpoint | Adjustments |
|---|---|
| **Mobile (default)** | Avatar `size-24`, single-column layout, full-width cards, bottom-4 navbar |
| **sm (640px)** | Avatar still at `size-24`, 404 buttons `flex-col` → `flex-row` |
| **md (768px)** | Avatar `size-32`, hero text `text-3xl sm:text-4xl` → `lg:text-5xl` |
| **lg (1024px)** | Hero text scales to `lg:text-5xl`, desktop mode activates (hidden on smaller screens) |

- **Content width:** `max-w-2xl` (672px) — centered readable column
- **Desktop mode:** Only available on `lg:` screens and above
- **Grids:** Instagram 3-col, YouTube 2-col, Hardcover carousel drag-free
- **Navbar:** Fixed to bottom center, spans content width, backdrop blur; auto-hides with fullscreen windows
- **Text:** `text-balance` and `text-pretty` utilities for optimal typography
- **Padding:** `px-6`, `py-12 pb-24 sm:py-24`

---

## Architecture & Component Patterns

### Hybrid Rendering
- **Server Components** (async, fetch data, pass to children): `InstagramCard`, `HardcoverCard`, `LastFmCard`, `KofiCard`
- **Client Components** (interactivity only): `YoutubeSection`, `LastFmPlayer`, `HardcoverBooksCarousel`, `Navbar`, `SearchExplorer`, `MiniPlayer`, `WMCard`, `DesktopLayout`, `DesktopPanel`, `DesktopWindow`, `HeroSection`, `VercelProjects`, `ModeToggle`, `AnimatedThemeToggler`, `ThemeToggle`, `CardStyleToggle`

### Data Flow
- All personal data driven by a single config file: `src/data/resume.tsx` (`DATA` object)
- External API calls → Next.js `fetch` with `revalidate` → ISR cache → rendered in section components
- Theme state → React Context → consumed via `useTheme()` hook
- Wallpaper state → React Context → consumed via `useWallpaper()` hook; palette extracted from image pixels via k-means clustering
- Desktop mode state → `DesktopModeContext` → consumed via `useDesktopMode()`
- Window management → `WindowManagerContext` → consumed via `useWindowManager()`
- Card style → `CardStyleContext` → consumed via `useCardStyle()`
- Card window state → `CardWindowContext` → consumed via `useCardWindow()`

### Performance Optimizations
- `loading="lazy"` on all `<img>` tags
- ISR (`revalidate`) on every external API fetch
- Client components minimized (only where interactivity is required)
- Self-hosted fonts in `public/fonts/` (no external font requests for OG images)
- Inline anti-FOUC script runs before React hydration

### Security
- Security headers in `next.config.mjs`: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, strict `Referrer-Policy`, restrictive `Permissions-Policy`
- `noopener noreferrer` on all external links
- `suppressHydrationWarning` on HTML element

---

## Configuration & Data-Driven Design

Edit a single file — **`src/data/resume.tsx`** — to personalize:

| Data Section | What It Controls |
|---|---|
| `name`, `initials`, `url`, `location`, `description` | Hero identity & meta tags |
| `avatarUrl` | Profile picture |
| `skills` | Tech stack icons displayed on the page |
| `navbar` | Navigation dock items |
| `contact.email`, `contact.social.*` | Social links, visibility in navbar, icons |

---

## Environment Variables

| Variable | Required | Service | Used In |
|---|---|---|---|
| `YOUTUBE_API_KEY` / `NEXT_PUBLIC_YOUTUBE_API_KEY` | No (fallbacks work) | YouTube Data API v3 | YouTube playlist + music video search |
| `NEXT_PUBLIC_BEHOLD_FEED_ID` | Yes | Behold.so (Instagram proxy) | Instagram feed |
| `HARDCOVER_API_TOKEN` | Yes | Hardcover GraphQL API | Book data |
| `HARDCOVER_USER_ID` | Yes | Hardcover GraphQL API | Book data |
| `LASTFM_API_KEY` | Yes | Last.fm API | Recent scrobble |
| `LASTFM_USERNAME` | Yes | Last.fm API | Recent scrobble |
| `MY_VERCEL_API_TOKEN` | Yes | Vercel API | Top projects fetch |
| `MY_VERCEL_TEAM_ID` | Yes | Vercel API | Top projects fetch |

---

## Getting Started Locally

1. Clone this repository:

   ```bash
   git clone https://github.com/andreikennethmoreno/creator-portfolio
   ```

2. Move to the cloned directory:

   ```bash
   cd creator-portfolio
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Copy `.env.example` to `.env.local` and fill in the environment variables.

5. Start the local development server (with HTTPS):

   ```bash
   pnpm dev
   ```

6. Open the [Config file](./src/data/resume.tsx) and make changes to personalize.

### Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `next dev --experimental-https` | Start dev server with HTTPS |
| `build` | `next build` | Production build |
| `start` | `next start` | Start production server |
| `lint` | `eslint` | Run ESLint |
| `lint:fix` | `eslint --fix` | Run ESLint with auto-fix |

---

## License

Licensed under the [MIT license](https://github.com/dillionverma/portfolio/blob/main/LICENSE.md).
