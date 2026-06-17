# Dockers TL;DR

Three dock bars rendered inside `src/components/navbar.tsx`.

## Left Docker
- `absolute left-4`, hidden on mobile
- Contains: desktop mode toggle button, separator, screen switcher icons 1/2/3 (desktop mode only)

## Center Docker
- `relative mx-auto` (centered)
- Contains: nav links (home/social), desktop apps icons, debug settings toggle, card style toggle, wallpaper toggle (hidden on desktop)
- App icons appear only in desktop mode
- ThemeToggle (wallpaper cycler) hidden when `isDesktop` — tooltip says "change theme"

## Right Docker
- `absolute right-4`, visible only in desktop mode
- Plain `<div>` (not `<Dock>` — no magnification effect)
- Contains: MiniPlayer (full mini player with album art, track info, progress bar/sound wave, play/pause)

## Auto-Hide Behavior
When `isDesktop && hasVisibleWindows` (any non-minimized window exists):
- All dockers hidden below viewport (`translate-y-[100px] opacity-0`)
- `hasVisibleWindows` checks: `windows.some(w => !w.minimized)` — triggers for ALL tiled layouts (1, 2, 3, 4+ windows), maximized windows, and regular windows
- `mousemove` listener tracks bottom 100px of screen:
  - Left 25% → reveals left docker
  - Middle 50% → reveals center docker
  - Right 25% → reveals right docker
- Mouse above threshold → hides again
- Uses `transition-all duration-300` CSS transitions (always applied, not conditional)
- Docks show when: no windows open, or all windows are minimized
