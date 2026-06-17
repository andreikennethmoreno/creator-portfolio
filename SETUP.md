# Setup Guide

Get this portfolio running, customized, and deployed — no coding experience needed.

---

## Quick Start (3 minutes)

```bash
git clone https://github.com/andreikennethmoreno/creator-portfolio
cd creator-portfolio
pnpm install
pnpm dev 
```

Open `http://localhost:3000` — the site runs immediately with placeholder data. No API keys, no config edits needed.

> **Prerequisites**: Node.js 18+, [pnpm](https://pnpm.io/installation)

---

## What You Need to Change

Everything lives in **one file**: `src/data/config.tsx`. Open it and scroll down.

### Step 1: Your Identity

Find these lines and replace with your info:

```ts
name: "Your Name",
initials: "YN",
description: "Your tagline here.",
avatarUrl: "https://your-avatar-url.com/image.png",
url: "https://yoursite.com",
```

### Step 2: Your Social Links

Find `contact.social` and update each URL:

```ts
contact: {
  email: "you@email.com",
  social: {
    YouTube: { name: "YouTube", url: "https://youtube.com/@yourchannel", ... },
    Twitter: { name: "Twitter", url: "https://twitter.com/yourhandle", ... },
    GitHub: { name: "GitHub", url: "https://github.com/yourhandle", ... },
    // update email URL too
  },
},
```

Don't want a social link showing in the nav dock? Set `navbar: false` on it.

### Step 3: Pick Your Mode

Set `mode` to one of four:

| Mode | What It Shows | Best For |
|------|--------------|----------|
| `"dev"` | About, Experience, Education, Projects, Resume | Developer portfolio |
| `"creator"` | Instagram, YouTube, Books, Music, Vercel, Ko-fi | Content creator landing page |
| `"linktree"` | Social links + optional terminal easter egg | Link-in-bio page |
| `"custom"` | Hero + About + Instagram | Minimal landing |

Switch between them anytime — each mode has its own config section (`creator.*`, `dev.*`, `linktree.*`).

---

## Try All Modes Without Changing Config

Open the site in desktop mode (1024px+ screen), click the **gear icon** in the bottom dock to open Settings, and switch modes on the fly. No reload needed.

---

## Per-Mode Configuration

### Dev Mode

| Field | Required | Notes |
|-------|----------|-------|
| `dev.aboutSegments` | Yes | Your bio as rich text segments |
| `dev.experience` | No | Work history accordion |
| `dev.education` | No | School details |
| `dev.projects` | No | Featured projects |
| `dev.links.*` | No | External links per section |

### Creator Mode

| Field | Required | Notes |
|-------|----------|-------|
| `creator.sections.*` | No | Toggle sections on/off |
| `creator.youtube.channelUrl` | No | Your YouTube channel — leave blank to skip live fetch |
| `creator.youtube.playlistId` | No | Specific playlist — leave empty to auto-fetch channel uploads |
| `creator.youtube.videoType` | No | `"long"` (default), `"short"`, or `"all"` |
| `creator.youtube.fallbackVideos` | No | Shown when API key missing |
| `creator.terminal.*` | No | Hero terminal easter egg |
| `creator.kofi.*` | No | Ko-fi support tiers |

### Linktree Mode

| Field | Required | Notes |
|-------|----------|-------|
| `linktree.links` | Yes | Ordered list of social keys from `contact.social` |
| `linktree.showTerminal` | No | Terminal easter egg toggle |
| `linktree.showDock` | No | Bottom dock toggle |

---

## Environment Variables

**None are required to see the site.** Every section falls back gracefully:

| Variable | Powers | Where to Get It |
|----------|--------|-----------------|
| `NEXT_PUBLIC_YOUTUBE_API_KEY` | YouTube video feed + music player | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `NEXT_PUBLIC_BEHOLD_FEED_ID` | Instagram feed | [behold.so](https://behold.so) |
| `HARDCOVER_API_TOKEN` + `HARDCOVER_USER_ID` | Books section | [hardcover.app/account/api](https://hardcover.app/account/api) |
| `LASTFM_API_KEY` + `NEXT_PUBLIC_LASTFM_USERNAME` | Music player + last scrobbled track | [last.fm/api](https://www.last.fm/api/account/create) |
| `MY_VERCEL_API_TOKEN` + `MY_VERCEL_TEAM_ID` | Vercel projects showcase | [vercel.com/account/tokens](https://vercel.com/account/tokens) |

Copy `.env.example` to `.env.local` and fill in only the sections you want live data for. Leave the rest empty — the site handles it.

---

## Available Scripts

```bash
pnpm dev       # Start dev server (HTTPS)
pnpm build     # Production build
pnpm start     # Start production server
pnpm lint      # Run ESLint
pnpm lint:fix  # Auto-fix lint issues
```

---

## Deployment (Vercel)

1. Push your fork to GitHub
2. Go to [vercel.com](https://vercel.com) → Add New Project → Import your repo
3. Framework preset: **Next.js**
4. Add your environment variables in Vercel's project settings
5. Deploy — ISR caches data at the edge automatically

No build command or output directory changes needed. The `vercel.json` and `next.config.mjs` work out of the box.

---

## Customizing Beyond Config

| What | Where |
|------|-------|
| Colors & theme | `src/app/globals.css` — OKLCH variables in `@theme inline` |
| Wallpapers | `CONFIG.general.wallpapers` array — URLs to any image |
| OG image (social preview) | `src/app/opengraph-image.tsx` |
| Card style | `CONFIG.general.defaultCardStyle` — `"glossy"` or `"default"` |
| Fonts | Swap `Antic` in `src/app/layout.tsx` |
| Section content text | Each section component in `src/components/section/` |
