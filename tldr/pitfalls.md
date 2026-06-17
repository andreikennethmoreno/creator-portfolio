# Known Pitfalls & Fixes

## Hydration Errors

### `typeof window !== "undefined"` in component body
**Problem**: Using `typeof window` directly in a Client Component body causes SSR/CLIENT mismatch when the value affects rendering (e.g., reading URL params, checking screen size).

**Fix**: Use `useState` + `useEffect` pattern so initial render matches SSR:
```tsx
const [activeMode, setActiveMode] = useState(CONFIG.mode);
useEffect(() => {
  const params = new URL(window.location.href).searchParams;
  setActiveMode(...)
}, []);
```

**Affected files**: `src/components/navbar.tsx` (fixed — `activeMode` was using `typeof window`)

### DesktopModeProvider never sets isDesktop=true
**Problem**: `src/lib/desktop-mode-context.tsx` useEffect handler only sets `isDesktop = false` on small screens but never sets it to `true` on large screens.

**Impact**: Desktop Mode only activates via user toggle (button click), not automatically on wide screens. Media query only auto-disables it on screens ≤1023px.

## Dev Server

### `--experimental-https` removed
**Problem**: The `next dev --experimental-https` flag was added for a "Threads" integration that no longer exists. Without Threads, HTTPS is unnecessary for local dev.

**Fix**: Removed `--experimental-https`. Dev server now runs on `http://localhost:3000`.

**Affected files**: `package.json` (dev script), `README.md`, `SETUP.md`, `tldr/setup.md`

## Radix asChild
`TooltipTrigger asChild` with non-button elements (`<a>`) works correctly when the tree structure is consistent between SSR and client. Errors appear only when a parent mismatch forces React to re-hydrate incorrectly.
