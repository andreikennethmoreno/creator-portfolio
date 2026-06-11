# Desktop Mode TL;DR

Toggle in navbar left dock → sets `isDesktop` in `DesktopModeProvider`

## Screens (Virtual Desktops)
- 3 screens managed in `window-manager-context.tsx` reducer
- Left dock shows 1/2/3 icons with separator after desktop toggle
- Each screen has independent window state (preserved on switch)
- Apps transfer between screens on click (see `tldr/screens.md`)

## Behavior
- **Normal mode**: centered column `max-w-2xl`, sections are static cards
- **Desktop mode**: full-screen windowed overlay, sections become draggable/resizable windows

## Contexts
- `src/lib/desktop-mode-context.tsx` — `isDesktop`, `toggleDesktop`, `revealedSection`
- `src/lib/window-manager-context.tsx` — window state (open/close/minimize/maximize/move/resize), z-index stacking, `hasMaximizedWindow`, `retileAll`
- `src/lib/card-window-context.tsx` — per-window context for drag, resize, controls

## Components
- `src/components/desktop-layout.tsx` — wraps sections, listens for Escape
- `src/components/desktop-panel.tsx` — bridges section ↔ window context
- `src/components/wm-card.tsx` — draggable/resizable window chrome
- `src/components/desktop-mode-toggle.tsx` — floating toggle button (top-right)

## Window Manager (Tiling)
- `useReducer`-based state machine with Linux tiling WM-style layout
- `MAX_MARGIN=8` (tighter gap vs old 16)

### Tiling Layout Algorithm (`computeTilingLayout`)
Auto-tiles ALL non-maximized, non-minimized windows in a snake pattern:
- **1 window**: fills full viewport (minus margin)
- **2 windows**: 50/50 side by side
- **3 windows**: master 55% left + 2 stacked right (55/22.5/22.5)
- **4+ windows**: adaptive grid that minimizes empty cells (2x2, 3x2, 3x3, 4x3...)

### Re-tiling triggers
- **OPEN** → new window added → all non-maximized windows retiled
- **CLOSE** → window removed → remaining non-maximized windows retiled
- **MINIMIZE** → hidden window removed from tile → others expand
- **RESTORE** → window added back to tile → layout recalculated
- **MAXIMIZE (unmax)** → exits fullscreen → re-enters tile layout
- **window resize** → all non-maximized windows re-tile to new viewport

### Screen Switch Animation
- `AnimatePresence` (default simultaneous exit/enter) in `DesktopLayout`
- **Always slides right**: enters from left (-100%), exits to right (+100%). Same for all directions.
- No background overlay on container (transparent slide — no visual artifacts on empty screens)
- `isTransitioning` flag prevents animation on first mount
- Spring slide: stiffness 220, damping 28, mass 0.55
- `onAnimationComplete` resets transition state

## Dock Auto-Hide
- Dock hides when any visible (non-minimized) windows exist — same behavior as maximized
- `dockersHidden = isDesktop && (hasMaximizedWindow || hasVisibleWindows)`
- Bottom 100px hover reveals dock in 3 zones (left 25%, center 50%, right 25%)

### Maximize
- `x:8, y:8, width:vw-16, height:vh-16` (8px margin)
- Saves `prevRect` before maximize (not used on unmax — re-enters tile)
- Resize listener re-tiles ALL windows when viewport changes
