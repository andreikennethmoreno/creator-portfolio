# Multi-Mode Architecture TL;DR

## Concept
One root config (`CONFIG`), three modes — each renders a different layout.

## Mode Switch
`CONFIG.mode` at root level: `"creator"` | `"linktree"` | `"dev"`

## What Each Mode Reads

| Mode | Config Namespace | Layout |
|------|-----------------|--------|
| **creator** | `CONFIG.creator.*` | Current portfolio (sections, dock, desktop mode, etc.) |
| **linktree** | `CONFIG.linktree.*` | Linktree-style page (ordered links, terminal easter egg, dock) |
| **dev** | `CONFIG.dev.*` | Dev-focused portfolio (about, experience, education, projects sections) |

## Dev Mode Sections (Placeholders)

4 placeholder components created in `src/components/section/`:
- `about-section.tsx` — `$ cat about.md`
- `experience-section.tsx` — `$ cat experience.json`
- `education-section.tsx` — `$ cat education.md`
- `projects-section.tsx` — `$ cat projects.json`

Each wraps `WMCard` + `BlurFade` — same pattern as all existing sections.
Not yet wired into `page.tsx`. See `tldr/dev-sections.md` for full details.

## Shared Identity (root level)
`CONFIG.name`, `CONFIG.initials`, `CONFIG.url`, `CONFIG.description`, `CONFIG.avatarUrl`, `CONFIG.contact.*`

Every mode reads from these — change once, updates everywhere.

## Files Referencing CONFIG
18 files import from `@/data/config`. All reference their mode's namespace explicitly (e.g., `CONFIG.creator.sections.youtube`). Root-level identity props (`CONFIG.name`, `CONFIG.contact.*`) are unchanged.

## Current State
- `CONFIG.creator` — fully populated with all existing portfolio config
- `CONFIG.linktree` — `{ links: [social keys], showTerminal: true, showDock: true }`
- `CONFIG.dev` — empty `{}` (placeholder components exist, not wired yet)

## Linktree Mode Behavior
- `page.tsx` renders `<LinktreeLayout />` directly — no `DesktopLayout`, no sections
- `layout.tsx` always renders `<Navbar />` but left dock is hidden (desktop toggle + screen switchers removed)
- Center dock still renders (social links, card style toggle, theme toggle)
- `LinktreeLayout` in `src/components/linktree-layout.tsx`: avatar + name + description + link cards + optional terminal easter egg + Matrix Rain mode
- Uses `useCardStyle()` for flat/glossy link card styling
- Description text uses `text-foreground/80` (theme-aware foreground color)
- Link cards use uniform subtle hover: `hover:bg-muted/20` (same for flat & glossy)
- Top padding reduced to `py-6` for better vertical balance
- No wallpaper, no window manager, no desktop mode — relevant providers still wrap but are inactive
