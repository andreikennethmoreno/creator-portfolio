# Top Panel TL;DR

File: `src/components/top-panel.tsx` — desktop-only hover-triggered panel. Rendered in `navbar.tsx` when `isDesktop` is true.

## Behavior
- **Hover zone**: top 30px center 30% of viewport → triggers pop-up
- **Transition**: scale+fade pop-up (`scale-95` → `scale-100`, `opacity-0` → `opacity-100`) with spring easing
- **Auto-hide**: mouse leaves panel → closes after 400ms delay
- **Escape / X button**: closes immediately

## Design
- `pointer-events-auto relative border bg-card/90 backdrop-blur-3xl shadow-[0_0_10px_3px] shadow-primary/5 rounded-2xl overflow-hidden w-[420px] max-w-[calc(100vw-2rem)]`
- Floating at `fixed inset-x-0 top-4 z-40`
- `font-mono` throughout, `text-[10px]` labels
- Supports card style toggle (glossy/default) via `useCardStyle()`

## Tabs (4)
1. **Website** — `hud/website-tab.tsx`: real Vercel stats + API health check + Last.fm current track + live telemetry (connection quality bars, RTT rolling chart, live clock)
2. **Tech Stack** — `hud/tech-stack-tab.tsx`: stack chips + integrations
3. **Music** — `hud/player-tab.tsx`: reads from shared MusicPlayerContext
4. **About** — `hud/about-tab.tsx`: bio, contact, links, skills, education

## Live Telemetry (website tab right column)
- Multi-color signal bars (primary/accent/chart-2/chart-3/secondary)
- Live clock (HH:MM:SS) + session elapsed counter
- Connection info: effectiveType, RTT (ms), downlink (Mbps)
- Rolling 40-point RTT canvas line chart cycling through 5 theme colors
- Always has data (uses navigator.connection or seeded fallback)

## State
- `openRef` (ref, not state) for mousemove handler
- `hoverTimeout` ref for 400ms close delay
- `isHoveringPanel` ref
- `activeTab` state for tab switching
