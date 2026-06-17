# View Transitions API TL;DR

Used for animated theme/wallpaper changes. No page navigation — all same-page visual flips.

## Core Helper: `src/lib/view-transition.ts`

```ts
rippleTransition(x, y, applyChange, duration = 700)
```

- Calculates clip-path radius from click point to farthest viewport corner (`Math.hypot`)
- Sets `--magicui-theme-vt-clip-from` CSS var on `<html>`
- Calls `document.startViewTransition(() => flushSync(applyChange))`
- On `transition.ready`: animates `clipPath` from `circle(0px at x y)` → `circle(maxRadius at x y)` via `document.documentElement.animate()` with `::view-transition-new(root)` pseudo-element
- Falls back to instant `applyChange()` if VT API unavailable (Firefox)

## Global CSS (globals.css)
```css
::view-transition-old(root) { animation: none !important; }
::view-transition-new(root) { animation: none !important; }
```
Default root VT animation disabled — custom clip-path takes full control.

## Usage Sites

| Component | Trigger | Behavior |
|-----------|---------|----------|
| `theme-toggle.tsx` | Theme button click | 7 random clip shapes (circle/square/triangle/diamond/hexagon/rectangle/star), 700ms default |
| `theme-provider.tsx` (AnimatedThemeToggler) | Theme toggle | Same 7 random shapes, flushSync for class change |
| `search-explorer.tsx` | Wallpaper carousel pick | Circle ripple from thumbnail center |
| `navbar.tsx` (floating toolbar) | Wallpaper thumbnail click | Circle ripple from thumbnail center |
