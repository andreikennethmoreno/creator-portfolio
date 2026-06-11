# Navbar TL;DR

File: `src/components/navbar.tsx` — 3 dockers rendered with MagicUI Dock component.

## Left Docker
- `hidden lg:flex absolute left-4`
- Desktop mode toggle button (Monitor/LayoutGrid icons)
- Tooltip: "desktop mode" / "exit desktop mode"
- Screen switcher icons (1/2/3) with separator — only in desktop mode
  - Active screen: highlighted bg + primary dot
  - Non-active with windows: dimmed dot
  - Tooltip: "Screen N"

## Center Docker
- `relative mx-auto` centered
- Items: nav links from DATA.navbar, social links (navbar:true, filtered on desktop), app icons (desktop mode only), CardStyleToggle, wallpaper cycler
- **Social links on desktop**: GitHub and email are hidden via `.filter([name]) => !isDesktop || (name !== "GitHub" && name !== "email")`
- **ThemeToggle (wallpaper cycler)**: visible on all modes (both desktop & mobile/tablet). Tooltip: "change theme". Positioned beside CardStyleToggle with a separator.

## Right Docker
- Visible only in desktop mode (`isDesktop &&`)
- Contains: MiniPlayer (now a full mini player, not a dock icon)
- **NO magnification effect** — plain `<div>`, not wrapped in `<Dock>` component
- See `tldr/mini-player.md` for full details

 ## Dock Auto-Hide
- `hasVisibleWindows = windows.some(w => !w.minimized)` — any non-minimized window
- `dockersHidden = isDesktop && hasVisibleWindows`
- Hides dock during ALL tiling states (1/2/3/4+ windows), maximized, and manual
- Docks show when: no windows open, or all windows are minimized
- Bottom 100px hover reveals in 3 zones (left 25%, center 50%, right 25%)
- CSS: `transition-all duration-300` always applied; toggles `translate-y-[100px] opacity-0 pointer-events-none` vs `translate-y-0 opacity-100 pointer-events-auto`
