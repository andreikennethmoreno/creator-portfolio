# Multi-Mode Architecture TL;DR

## Concept
One root config (`CONFIG`), four modes — each renders a different layout.

## Mode Switch
`CONFIG.mode` at root level: `"creator"` | `"linktree"` | `"dev"` | `"custom"`

## What Each Mode Reads

| Mode | Config Namespace | Layout |
|------|-----------------|--------|
| **creator** | `CONFIG.creator.*` | Current portfolio (sections, dock, desktop mode, etc.) |
| **linktree** | `CONFIG.linktree.*` | Linktree-style page (ordered links, terminal easter egg, dock) |
| **dev** | `CONFIG.dev.*` | Dev-focused portfolio (hero, about, experience, education, projects) |
| **custom** | (none) | Minimal layout (hero, about, instagram) |

## Dev Mode Sections (All Live)

| Section | Config Source | Status |
|---------|--------------|--------|
| hero | always rendered | ✅ |
| about | `CONFIG.dev.aboutSegments` | ✅ config-driven bullet list |
| experience | `CONFIG.dev.experience` | ✅ config-driven accordion |
| education | `CONFIG.dev.education` + `certificates` | ✅ config-driven list |
| projects | `CONFIG.dev.projects` | ✅ config-driven accordion |

Each section uses `WMCard` + `BlurFade`. See `tldr/dev-sections.md` for full details.

## Shared Identity (root level)
`CONFIG.name`, `CONFIG.initials`, `CONFIG.url`, `CONFIG.description`, `CONFIG.avatarUrl`, `CONFIG.contact.*`

Every mode reads from these — change once, updates everywhere.

## Files Referencing CONFIG
18+ files import from `@/data/config`. All reference their mode's namespace explicitly.

## Settings (Navbar Dock)
- Settings gear icon in center dock (non-desktop only, toggle: `CONFIG.creator.dock.settings`)
- Popover with mode switcher, card style toggle, wallpaper picker with view-transition ripple
- See `tldr/floating-toolbar.md` for full details

## Current State
- `CONFIG.creator` — fully populated with all existing portfolio config
- `CONFIG.linktree` — `{ links: [social keys], showTerminal: true, showDock: true }`
- `CONFIG.dev` — fully populated (sections, links, aboutSegments, experience, education, certificates, projects)
- `CONFIG.custom` — no dedicated namespace; reads root identity only

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
