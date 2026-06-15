# Multi-Mode Architecture TL;DR

## Concept
One root config (`CONFIG`), three modes — each renders a different layout.

## Mode Switch
`CONFIG.mode` at root level: `"creator"` | `"linktree"` | `"dev"`

## What Each Mode Reads

| Mode | Config Namespace | Layout |
|------|-----------------|--------|
| **creator** | `CONFIG.creator.*` | Current portfolio (sections, dock, desktop mode, wallpapers, etc.) |
| **linktree** | `CONFIG.linktree.*` | Linktree-style page (ordered links, terminal easter egg, dock) |
| **dev** | `CONFIG.dev.*` | Older/dev portfolio (TBD) |

## Shared Identity (root level)
`CONFIG.name`, `CONFIG.initials`, `CONFIG.url`, `CONFIG.description`, `CONFIG.avatarUrl`, `CONFIG.contact.*`

Every mode reads from these — change once, updates everywhere.

## Files Referencing CONFIG
18 files import from `@/data/config`. All reference their mode's namespace explicitly (e.g., `CONFIG.creator.sections.youtube`). Root-level identity props (`CONFIG.name`, `CONFIG.contact.*`) are unchanged.

## Current State
- `CONFIG.creator` — fully populated with all existing portfolio config
- `CONFIG.linktree` — empty shell: `{ links: [], showTerminal: true, showDock: true }`
- `CONFIG.dev` — empty: `{}`
