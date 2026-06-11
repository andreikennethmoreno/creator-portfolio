# Desktop Mode TL;DR

Toggle in navbar left dock → `isDesktop` in `DesktopModeProvider`.
**DesktopModeNotification** — floating card above left dock on lg+ screens when desktop OFF & not dismissed. Has "Try it" (enters desktop mode) and "Later" buttons. Dismissed state in localStorage. Fade-in animation.

## Screens (Virtual Desktops)
- 3 screens in `window-manager-context.tsx` reducer
- Left dock shows 1/2/3 icons with separator after desktop toggle
- Each screen has independent window state (preserved on switch)
- Apps transfer between screens on click

## Behavior
- **Normal mode**: centered `max-w-2xl`, static cards
- **Desktop mode**: full-screen windowed overlay, sections become draggable/resizable windows

## Contexts
- `src/lib/desktop-mode-context.tsx` — `isDesktop`, `toggleDesktop`, `revealedSection`
- `src/lib/window-manager-context.tsx` — window state (open/close/minimize/maximize/move/resize), z-index stacking, `hasMaximizedWindow`, `retileAll`
- `src/lib/card-window-context.tsx` — per-window drag, resize, controls

## Components
- `src/components/desktop-layout.tsx` — wraps sections, Escape listener
- `src/components/desktop-panel.tsx` — bridges section ↔ window context
- `src/components/wm-card.tsx` — draggable/resizable window chrome
- `src/components/desktop-mode-toggle.tsx` — floating toggle (top-right) with animated callout badge + shadcn Button

## Window Manager (Tiling)
- `useReducer`-based, `MAX_MARGIN=8`
- **1w**: fills viewport | **2w**: 50/50 side-by-side | **3w**: 55% master + 2 stacked | **4+**: adaptive grid (snake pattern)
- New windows open **maximized** by default (`maximized: true`), fills viewport
- Maximized windows excluded from tiling (`retileWindows` filters them out)

### Re-tiling triggers
OPEN / CLOSE / MINIMIZE / RESTORE / MAXIMIZE(unmax) / window resize

## Screen Switch Animation
- `AnimatePresence` simultaneous exit/enter
- macOS Spaces: forward = new from RIGHT (+100%), old exits LEFT (-100%)
- Backward: new from LEFT (-100%), old exits RIGHT (+100%)
- Spring: stiffness 220, damping 28, mass 0.55

 ## Dock Auto-Hide
- Hidden when any non-minimized window exists (tiling state)
- Bottom 100px hover reveals in 3 zones (left 25%, center 50%, right 25%)
