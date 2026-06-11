# Screen Manager TL;DR

3 virtual screens (like Linux workspaces). Each screen holds independent window state.

## Behavior
- **Screen switching**: click 1/2/3 in left dock → slide transition (spring animation)
- **State preservation**: windows stay on their screen when you switch away/back
- **App transfer**: clicking an app icon on another screen moves the window there (closes source, opens target)
- **App toggle**: clicking on same screen → minimize/restore

## Implementation
- `src/lib/window-manager-context.tsx` — reducer holds `screens: [ScreenState, ScreenState, ScreenState]`
- `ScreenState` = `{ windows, zTop, idCounter }` (independent per screen)
- `activeScreen` (0/1/2) determines which screen's windows are rendered
- `openWindow()` checks ALL screens — transfers if found elsewhere

## Actions
- `SET_ACTIVE_SCREEN` — switches active screen, sets transition direction
- `TRANSFER_WINDOW` — moves app from one screen to another (used by OPEN when cross-screen)
- `TRANSITION_END` — resets animation state after spring completes

## Context additions (via `useWindowManager()`)
| Field | Type | Purpose |
|-------|------|---------|
| `activeScreen` | number | Current screen index |
| `setActiveScreen` | (n) => void | Switch to screen |
| `screenWindows` | AppWindow[][] | All 3 screens' windows |
| `isTransitioning` | boolean | Animation in progress |
| `transitionDirection` | 'left'\|'right'\|null | Slide direction |
| `resetTransition` | () => void | Called after animation |

## Transition
- `src/components/desktop-layout.tsx` — wraps content in `AnimatePresence` + `motion.div`
- Higher index → slides in from right
- Lower index → slides in from left
- Spring: stiffness 250, damping 30

## Dock indicators
- Active screen icon: filled primary dot + highlighted bg
- Non-active screens with windows: dimmed dot
- Empty screens: no dot
