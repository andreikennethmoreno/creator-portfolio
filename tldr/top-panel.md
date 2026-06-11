# Top Panel TL;DR

File: `src/components/top-panel.tsx` — desktop-only hover-triggered panel. Rendered in `navbar.tsx` when `isDesktop` is true.

## Behavior
- **Hover zone**: top 30px center 30% of viewport → triggers pop-up
- **Transition**: scale+fade pop-up (`scale-95` → `scale-100`, `opacity-0` → `opacity-100`) with spring easing
- **Auto-hide**: mouse leaves panel → closes after 400ms delay
- **Escape / X button**: closes immediately

## Design (identical container to SearchExplorer)
- `pointer-events-auto relative border bg-card/90 backdrop-blur-3xl shadow-[0_0_10px_3px] shadow-primary/5 rounded-2xl overflow-hidden w-[420px] max-w-[calc(100vw-2rem)]`
- Floating at `fixed inset-x-0 top-4 z-40` (same as search at `bottom-4`)
- `font-mono` throughout, `text-[10px]` labels, `text-xs`/`text-sm` content
- Springy easing: `cubic-bezier(0.34,1.56,0.64,1)`

## Tabs (3) — single source of truth (no HUD panel)
1. **Website** — imports `hud/website-tab.tsx` (stack badges + integrations)
2. **Music** — imports `hud/player-tab.tsx` (reads from shared MusicPlayerContext)
3. **About** — inline minimal content (name, description, location)

## State
- `openRef` (ref, not state) for mousemove handler to read without re-renders
- `hoverTimeout` ref for 400ms close delay
- `isHoveringPanel` ref to prevent close while mouse is on panel
- `activeTab` state for tab switching

## Deleted: HUD panel dropdown
- Removed `hud-panel.tsx` (floating dropdown + context provider)
- Removed `HUDPanelProvider` from layout.tsx
- Removed orphaned tab files: `system-tab.tsx`, `about-tab.tsx`, `sparkline.tsx`, `music-pill.tsx`
- MiniPlayer click no longer opens anything
