# Dockers TL;DR

Three dock bars rendered inside `src/components/navbar.tsx`.

## Left Docker
- `absolute left-4`, hidden on mobile
- Contains: desktop mode toggle button, separator, screen switcher icons 1/2/3 (desktop mode only)

## Center Docker
- `relative mx-auto` (centered)
- Contains: nav links (home/social), desktop apps icons, card style toggle, wallpaper toggle (hidden on desktop)
- App icons appear only in desktop mode
- ThemeToggle (wallpaper cycler) hidden when `isDesktop` — tooltip says "change theme"

## Right Docker
- `absolute right-4`, visible only in desktop mode
- Contains: MiniPlayer (YouTube mini-player for current Last.fm track)

## Maximized Hide Behavior
When `isDesktop && hasMaximizedWindow` (any window maximized):
- All dockers hidden below viewport (`translate-y-[100px] opacity-0`)
- `mousemove` listener tracks bottom 100px of screen:
  - Left 25% → reveals left docker
  - Middle 50% → reveals center docker
  - Right 25% → reveals right docker
- Mouse above threshold → hides again
- Uses `transition-all duration-300` CSS transitions
