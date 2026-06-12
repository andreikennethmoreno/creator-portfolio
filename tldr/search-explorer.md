# Search Explorer TL;DR

File: `src/components/search-explorer.tsx` — spotlight-style search overlay, desktop mode only.

## Search Data
- `SECTIONS` (9 items): hero, instagram, youtube, reading, listening, vercel, twitter, support, themes
- `RECENTS` (3 items): hero, instagram, youtube (shown when no query)
- Each item: `{ icon, label, sub, keywords? }`

## Filter Logic
```ts
SECTIONS.filter(s =>
  s.label.toLowerCase().includes(query.toLowerCase()) ||
  s.keywords?.some(k => k.includes(query.toLowerCase()))
)
```
- `vercel` has `keywords: ["projects"]` — typing "projects" shows Vercel section
- `themes` has `keywords: ["wallpaper"]` — typing "wallpaper" shows themes section

## Actions
- **themes**: opens inline wallpaper carousel (arrow keys + click to switch)
- **other**: `onReveal(label)` → navbar finds app in `APPS` via `id === label` → opens window
- **Escape**: back to search (if in theme mode) / close (if in search mode)

## Key constants
- `APPS` in `window-manager-context.tsx`: `{ id: "vercel", title: "Projects" }`, etc.
- `sectionId` in `page.tsx` `DesktopPanel` components must match `APPS` ids
