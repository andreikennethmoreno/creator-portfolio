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
- **macOS Spaces style**: forward (1→2, 2→3, 3→1) = new from RIGHT (`100%`), old exits LEFT (`-100%`) → like swiping left to show next screen. Backward (2→1, 3→2, 1→3) = new from LEFT (`-100%`), old exits RIGHT (`100%`) → like swiping right to show previous screen.
- No background overlay on container (transparent slide — no visual artifacts on empty screens)
- `isTransitioning` flag prevents animation on first mount
- Spring slide: stiffness 220, damping 28, mass 0.55
- `onAnimationComplete` resets transition state

## Dock Auto-Hide
- Dock hides only when a FULLSCREEN (covering viewport) window is visible — maximized OR single tiled window
- After restoring to smaller size via `+` → dock shows (not fullscreen anymore)
- After minimize → dock shows (no visible fullscreen windows)
- `hasFullscreenWindow`: checks if any non-minimized window has `width >= vw-18 && height >= vh-18`
- Bottom 100px hover reveals dock in 3 zones (left 25%, center 50%, right 25%)

### Maximize / Restore
- Click `+` in window chrome title bar → maximize: `x:8, y:8, width:vw-16, height:vh-16` (8px margin)
- Click `⤡` (same button, changes icon) → restore to `prevRect` dimensions
- When maximizing a window already at full viewport (tiled single window), saves smaller 640x480 centered as `prevRect` — so unmaximize actually makes the window smaller
- `toggleMaximize` in context dispatches `MAXIMIZE` directly (no stale closure — reducer checks current state via `state.screens.activeScreen.windows`)
- Button shows `+` normally, `⤡` when maximized (visual feedback)
- Resize listener re-tiles ALL windows when viewport changes

### Minimize on Maximized Window
- MINIMIZE reducer clears `maximized: false, prevRect: null` so window restores to smaller tiled size
- When minimized, that window is excluded from dock auto-hide check
