<div align="center">
<img alt="Portfolio" src="https://storage.ko-fi.com/cdn/useruploads/27d854e4-a478-41ec-acbe-f79865f858be_149867fb-a92d-4a0f-a16d-5e06c123c8c5.png" width="90%">
</div>

# Kenroms Portfolio [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdillionverma%2Fportfolio)

A fully dynamic, single-page portfolio built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **shadcn/ui** (New York style), **Magic UI** components, and **Motion** (Framer Motion API). Deployed on Vercel with ISR-based data fetching. Originally forked from [Dillion Verma's portfolio](https://github.com/dillionverma/portfolio), now heavily customized for **Kenroms** — a Software Engineer and Content Creator based in the Philippines.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features & Sections](#features--sections)
- [Pages & Routing](#pages--routing)
- [External Integrations](#external-integrations)
- [Theme System](#theme-system)
- [Animations & Visual Aesthetics](#animations--visual-aesthetics)
- [Blog & Content System](#blog--content-system)
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
| **Content** | [Content Collections](https://content-collections.dev/) with MDX, Shiki syntax highlighting |
| **Carousel** | Embla Carousel (via shadcn/ui) |
| **Icons** | Lucide React, Radix Icons, custom SVG components |
| **Package Manager** | pnpm |
| **Deployment** | Vercel |
| **License** | MIT |

---

## Features & Sections

The portfolio is a **single-scroll landing page** (`/`) with a separate **blog subpage** (`/blog`). Each section below is a self-contained card with staggered scroll-reveal animations.

### Hero Section
- Avatar image (96px mobile / 128px desktop, `rounded-xl` with ring)
- Greeting with the creator's name ("Kenroms")
- Description tagline: *"Software Engineer, Content Creator. Love building things and learning shit. Very active on YouTube and Threads."*
- Location: Philippines
- Background: subtle fixed grid pattern (48px squares, gray 10% opacity)

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
  - Proper cleanup on unmount (destroy player, clear intervals)

### Threads Feed
- **Async server component** fetching posts via Meta's Threads Graph API
- Renders up to 5 posts as clickable cards with text preview, optional media image, and timestamp
- Hover effect (`hover:bg-muted/50`)
- Links to `https://threads.net/@ken.roms`
- Includes an **API route** (`/api/refresh-threads-token`) to refresh the Threads long-lived access token

### Ko-fi Support
- **Ko-fi Card** (static server component): Displays two support tiers — "coffee" (PHP 150) and "large coffee" (PHP 300) — with terminal-style styling (`>` prefix, monospace font)
- **Ko-fi Floating Button** (client component): Renders the `kofi-react-widget` floating support button on the page
- Contact email displayed: `kennonirom@gmail.com`
- Links to `https://ko-fi.com/kenroms`

### Navigation (Dock Bar)
- macOS-style **magnification dock** (Magic UI `Dock` component) fixed to the bottom of the viewport
- Spring-physics icon scaling: each icon expands proportionally based on cursor proximity (40px base, 60px at closest, spring `{ mass: 0.1, stiffness: 150, damping: 12 }`)
- Home link + social links with `navbar: true` (YouTube, Threads, GitHub, Email) + animated theme toggle + wallpaper toggle
- All items wrapped in Radix Tooltips with arrows
- Backdrop blur, primary-tinted shadow, responsive positioning

### Skills Display
- 11 technology icons rendered as inline SVG React components: React, Next.js, TypeScript, Node.js, Python, Go, PostgreSQL, Docker, Kubernetes, Java, C++
- Displayed below the hero section in the portfolio layout

---

## Pages & Routing

| Route | File | Description |
|---|---|---|
| `/` | `src/app/page.tsx` | Home page — single-scroll layout with all sections above |
| `/blog` | `src/app/blog/page.tsx` | Blog listing — paginated (5 posts/page), date-sorted descending, sequential index numbering (01., 02., etc.) |
| `/blog/[slug]` | `src/app/blog/[slug]/page.tsx` | Individual blog post — MDX-rendered content with Shiki syntax highlighting, JSON-LD (BlogPosting schema) for SEO, prev/next post navigation |
| `/*` (catch-all) | `src/app/not-found.tsx` | Custom 404 page — large gradient "404", "Page Not Found" heading, "Go to Home" button |
| `/api/refresh-threads-token` | `src/app/api/refresh-threads-token/route.ts` | GET endpoint to refresh Threads long-lived access token |

### Dynamic OpenGraph Images
- **Edge runtime** (`runtime = "edge"`) using `next/og` (`ImageResponse`)
- Separate OG images for home, blog listing, and each individual blog post (dynamic title/summary/date/avatar)

---

## External Integrations

| Service | Purpose | API / Method | Caching (ISR) |
|---|---|---|---|
| **YouTube Data API v3** | Fetch playlist videos + search music videos for Last.fm tracks | `NEXT_PUBLIC_YOUTUBE_API_KEY` | Client-side fetch |
| **Behold.so** | Instagram feed proxy (no official Instagram API needed) | `NEXT_PUBLIC_BEHOLD_FEED_ID` | `revalidate: 3600` (1 hour) |
| **Meta Threads Graph API** | Fetch Threads posts | `THREADS_ACCESS_TOKEN`, `THREADS_USER_ID` | `revalidate: 3600` (1 hour) |
| **Hardcover GraphQL API** | Fetch books (reading, read, want to read) + stats | `HARDCOVER_API_TOKEN`, `HARDCOVER_USER_ID` | `revalidate: 3600` (1 hour) |
| **Last.fm API** | Fetch most recent scrobble (now playing / recently played) | `LASTFM_API_KEY`, `NEXT_PUBLIC_LASTFM_USERNAME` | `revalidate: 60` (60 seconds) |
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
- **Light mode:** Warm off-white background (`oklch(0.9818 0.0054 95.0986)`), warm rose/terracotta primary accent (`oklch(0.6171 0.1375 39.0427)`)
- **Dark mode:** Near-black background (`oklch(0.2679 0.0036 106.6427)`), slightly lighter rose primary (`oklch(0.6724 0.1308 38.7559)`)
- Full shadcn-compatible semantic color system (background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, ring, chart colors, sidebar colors)
- Border radius: `1rem` (16px) globally — large, rounded design
- Shadows defined as custom properties across 7 levels (2xs through 2xl)

### Theme Toggle: View Transitions API
- `AnimatedThemeToggler` component using `document.startViewTransition()`
- 7 clip-path shape variants selected randomly: `circle`, `square`, `triangle`, `diamond`, `hexagon`, `rectangle`, `star`
- Default duration: 700ms
- Falls back to instant class toggle when View Transitions API is unavailable (e.g., Firefox)
- Uses `flushSync` from `react-dom` for synchronous class application within the transition callback
- Mobile-optimized with `fromCenter` to avoid off-screen clip origins

### Wallpaper System
- **React Context** in `src/lib/wallpaper-context.tsx` providing `{ wallpaper, palette, setWallpaper, cycleWallpaper }`
- **3 wallpapers** cycle on click: Blue and Black, Hillside Walk, Watercolor Town
- **Dynamic palette extraction**: Wallpaper colors sampled via k-means clustering → OKLCH CSS custom properties applied to DOM in real time
- **Wallpaper toggle** in the navbar dock with a circle clip-path View Transition (no CSS crossfade, pure drop-reveal)
- Powered by `WallpaperBackground` component (`bg-cover bg-center`, no CSS transitions) on a fixed `-z-10` layer

---

## Animations & Visual Aesthetics

### Scroll-Reveal Animations (Magic UI)
- **BlurFade:** Each section card fades in with a vertical offset (6px) + CSS blur (6px) as the user scrolls, triggered by `useInView`. Staggered delays create a cascading reveal: `[0.04, 0.28, 0.32, 0.36, 0.40, 0.44, 0.48, 0.52, 0.56]`
- **BlurFadeText:** Per-character staggered blur-fade animation for the hero greeting, creating a typewriter-like reveal effect (each letter at 0.03s delay)

### Dock Magnification (Magic UI)
- macOS-style spring-physics icon scaling: tracks mouse X position, scales nearest icons to 60px from 40px base
- `motion/react` motion values with spring config `{ mass: 0.1, stiffness: 150, damping: 12 }`

### Hover Effects
- **Instagram/Youtube/Hardcover cards:** Dark gradient overlay with truncated text, opacity transition (`opacity-0` → `opacity-100`)
- **Blog list items:** ChevronRight icon slides horizontally on hover (`-translate-x-2` → `translate-x-0`)
- **Back button:** Subtle horizontal translation (`-translate-x-px`)
- **Navigation icons:** Smooth color transitions (`transition-colors`)
- **Threads cards:** Background change on hover (`hover:bg-muted/50`)

### Music Player Visuals
- **Now Playing:** Green dot with `animate-pulse` for currently playing track
- **Progress bar:** Smooth width transition (`transition-[width] duration-100`)
- **Time formatting:** `timeAgo()` for relative timestamps, `formatTime()` for MM:SS progress display

### Background & Layout
- Subtle fixed grid pattern behind all content (48px squares, gray lines at 10% opacity, `z-0`)
- Content centered at `max-w-2xl` (672px), `z-10`, vertical padding `py-12 pb-24 sm:py-24`, horizontal padding `px-6`
- Typography: `text-balance` and `text-pretty` for optimal line breaks

### Font System (defined in `src/app/globals.css`)
- **Sans-serif:** `Outfit` (primary body font, applied via `font-sans` class)
- **Serif:** `ui-serif, Georgia, Cambria, "Times New Roman", Times, serif` (applied via `font-serif` class)
- **Monospace:** `Geist Mono, ui-monospace, monospace` (applied via `font-mono` class, used for code blocks, terminal-style UI elements, and section title bars)
- OG images use separate custom fonts: `Cabinet Grotesk` (medium) + `Clash Display` (semibold), self-hosted in `public/fonts/`

### Page Transitions
- View Transitions API default root animation disabled (`animation: none`) to let custom clip-path transitions take full control
- Wallpaper changes use the same VT mechanism with a circle crop reveal from the toggle button origin

---

## Blog & Content System

### Content Collections (MDX)
- **Source:** `content/*.mdx` — 7 blog posts covering:
  1. API Design Principles
  2. Building Design Systems
  3. Git Workflow Guide
  4. Next.js Performance Tips
  5. Remote Work Productivity
  6. Testing React Apps
  7. TypeScript Best Practices
- **Schema:** `title`, `publishedAt` (required), `updatedAt`, `author`, `summary`, `image`, MDX body
- **Transform:** Compiles MDX with `remarkGfm` (GitHub-flavored markdown) + custom `remarkCodeMeta` plugin (extracts `title="..."` from fenced code blocks)
- **Generated types** in `.content-collections/generated/`

### Blog Features
- **Pagination:** 5 posts per page via `?page=` query parameter, with previous/next navigation
- **SEO:** JSON-LD structured data (BlogPosting schema), dynamic OG images per post
- **Article navigation:** Previous/Next post links at the bottom of each article
- **Syntax highlighting:** Shiki-powered code blocks with dual theme (`github-light` / `github-dark`), copy-to-clipboard button, optional title bar from code block metadata
- **Custom MDX components:**
  - `<MediaContainer>` — embed images/videos with ringed border, 300px fixed height, centered, object-fit cover
  - `<pre>` → `CodeBlock` (Shiki syntax highlighting)
  - `<hr>` → decorative gradient-faded divider
  - `<table>` → rounded-bordered overflow container for mobile responsiveness
  - Inline `<code>` → styled with `bg-muted/60` pill

### Post Listing UX
- Sequential index numbering (01., 02., etc.)
- Hover animation on list items (ChevronRight slides in)
- Date sorting (newest first)
- Responsive layout (`items-start gap-x-2`)

---

## Responsive Design

| Breakpoint | Adjustments |
|---|---|
| **Mobile (default)** | Avatar `size-24`, single-column layout, full-width cards, bottom-4 navbar |
| **sm (640px)** | Avatar still at `size-24` (unchanged from default), blog nav switches from `flex-col` to `flex-row`, 404 buttons `flex-col` → `flex-row` |
| **md (768px)** | Avatar `size-32`, blog post title `text-3xl` → `text-4xl`, hero text `text-3xl sm:text-4xl` → `lg:text-5xl` |
| **lg (1024px)** | Hero text scales to `lg:text-5xl` |

- **Content width:** `max-w-2xl` (672px) — centered readable column
- **Grids:** Instagram 3-col, YouTube 2-col, Hardcover carousel drag-free
- **Navbar:** Fixed to bottom center, spans content width, backdrop blur
- **Text:** `text-balance` and `text-pretty` utilities for optimal typography
- **Padding:** `px-6`, `py-12 pb-24 sm:py-24`

---

## Architecture & Component Patterns

### Hybrid Rendering
- **Server Components** (async, fetch data, pass to children): `InstagramCard`, `HardcoverCard`, `LastFmCard`, `ThreadsSection`, `KofiCard`
- **Client Components** (interactivity only): `YoutubeSection`, `LastFmPlayer`, `HardcoverBooksCarousel`, `Navbar`, `ModeToggle`, `AnimatedThemeToggler`, `ThemeToggle`, `CodeBlock`
- **Static:** HeroSection, KofiCard, blog pages with `generateStaticParams`

### Data Flow
- All personal data driven by a single config file: `src/data/resume.tsx` (`DATA` object)
- External API calls → Next.js `fetch` with `revalidate` → ISR cache → rendered in section components
- Theme state → React Context → consumed via `useTheme()` hook
- Wallpaper state → React Context → consumed via `useWallpaper()` hook; palette extracted from image pixels via k-means clustering

### Performance Optimizations
- `loading="lazy"` on all `<img>` tags
- ISR (`revalidate`) on every external API fetch
- Static generation (`generateStaticParams`) for blog posts
- Client components minimized (only where interactivity is required)
- Self-hosted fonts in `public/fonts/` (no external font requests)
- Inline anti-FOUC script runs before React hydration

### Security
- Security headers in `next.config.mjs`: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, strict `Referrer-Policy`, restrictive `Permissions-Policy`
- `noopener noreferrer` on all external links
- `suppressHydrationWarning` on JSON-LD script tags

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
| `education` | Education history with logos |
| `projects` | Featured projects with tech tags, links, demo videos |
| `hackathons` | Hackathon history with descriptions, images, awards |

---

## Environment Variables

| Variable | Required | Service |
|---|---|---|
| `THREADS_ACCESS_TOKEN` | Yes | Meta Threads Graph API |
| `THREADS_USER_ID` | Yes | Meta Threads Graph API |
| `NEXT_PUBLIC_YOUTUBE_API_KEY` | No (fallbacks work) | YouTube Data API v3 |
| `NEXT_PUBLIC_BEHOLD_FEED_ID` | Yes | Behold.so (Instagram) |
| `HARDCOVER_API_TOKEN` | Yes | Hardcover GraphQL API |
| `HARDCOVER_USER_ID` | Yes | Hardcover GraphQL API |
| `LASTFM_API_KEY` | Yes | Last.fm API |
| `NEXT_PUBLIC_LASTFM_USERNAME` | Yes | Last.fm API |

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
