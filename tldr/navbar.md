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
- **ThemeToggle (wallpaper cycler)**: hidden on desktop (`!isDesktop &&`), visible on mobile/tablet. Tooltip: "change theme"

## Right Docker
- Visible only in desktop mode (`isDesktop &&`)
- Contains: MiniPlayer

## Dock Auto-Hide
- When `isDesktop && (hasMaximizedWindow || hasVisibleWindows)` — all dockers hidden
- Bottom 100px hover reveals in 3 zones (left 25%, center 50%, right 25%)
- CSS transition: `translate-y-[100px] opacity-0` ↔ `translate-y-0 opacity-100`
