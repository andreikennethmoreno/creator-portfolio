# HUD Panel TL;DR

File: `src/components/hud/hud-panel.tsx` — desktop-only drop-down panel replacing old TopPanel.

## Behavior
- **Hot zone**: top 12px center → triggers panel slide-down
- **Transition**: spring slide from top (`stiffness: 280, damping: 26`)
- **Auto-hide**: mouse leaves panel → closes after 320ms delay
- **Spring tab indicator**: `layoutId="hud-tab-indicator"` with spring physics

## Tabs (4)
1. **System** — CPU/MEM sparklines, API health checks, Last.fm card, ISR cache TTLs, Vercel stats
2. **Now Playing** — full player with album art (72px), progress bar, controls, 40-bar audio visualizer
3. **Website** — stack badges + integrations list (from old TopPanel)
4. **Whoami** — bio, status, links, education, stack details

## Provider/Context
- `HUDPanelProvider` wraps app in layout.tsx
- `useHUDPanel()` → `{ open, close, isOpen, activeTab }`
- `open(tab?)` opens panel to specific tab
- Auto-renders the panel (no manual render needed)

## Components
- `system-tab.tsx` — `useFakeMetrics` hook + live API pings + Vercel stats
- `player-tab.tsx` — reads from `MusicPlayerContext`
- `website-tab.tsx` — static tech stack + integrations
- `about-tab.tsx` — static personal info
- `sparkline.tsx` — canvas-based sparkline chart
