# Component Patterns TL;DR

## How to Build a New Section

### 1. Data → Config
Add data to `CONFIG.dev` (or appropriate mode namespace) in `src/data/config.tsx`.

### 2. Component → WMCard wrapper
Every section wraps in `WMCard` + `BlurFade`:

```tsx
import BlurFade from "@/components/magicui/blur-fade";
import { WMCard } from "@/components/wm-card";

export default function MySection() {
  return (
    <section id="my-section">
      <WMCard title="my section">
        <BlurFade delay={0.04}>
          {/* content */}
        </BlurFade>
      </WMCard>
    </section>
  );
}
```

### 3. Wire → page.tsx
```tsx
<div className="min-h-dvh flex flex-col gap-14 relative contents">
  <DesktopPanel sectionId="my-section">
    <MySection />
  </DesktopPanel>
</div>
```

## Section Types

### Static Server Component
No `"use client"`, no interactivity. Data passed as props or fetched server-side with ISR.

### Client Component
`"use client"` at top. Needed for interactivity, lifecycle, hooks.

## WMCard Features
| Prop | Type | Purpose |
|------|------|---------|
| `title` | string | Card title (mono, top-left) |
| `count` | number/string | Badge in `[count]` format |
| `hideDots` | boolean | Hides the 3 dot indicators |
| `rightSlot` | ReactNode | Extra content in titlebar |
| `href` | string | External link arrow ↗ |

- Auto-handles window mode (drag, resize, minimize, maximize, close)
- Respects card style (flat/glossy) from `useCardStyle()`
- Titlebar dots: 2 gray + 1 primary (when not a window)
- When in window mode: macOS traffic-light minimize/maximize/close buttons

## BlurFade Stagger Delays
```tsx
[0.04, 0.28, 0.32, 0.36, 0.40, 0.44, 0.48, 0.52, 0.56]
```
Use `delay={0.04}` for first item, increment by 0.04 for each subsequent.

## Config Access Pattern
Always import from `@/data/config`:
```tsx
import { CONFIG } from "@/data/config";
// CONFIG.dev.myData  — dev mode
// CONFIG.creator.*    — creator/portfolio mode
// CONFIG.linktree.*   — linktree mode
```

## Env Var Access
```tsx
import { env } from "@/lib/env";
env.youtube();    // NEXT_PUBLIC_YOUTUBE_API_KEY
env.lastfmKey();  // LASTFM_API_KEY
// All return undefined if missing — never throw
```
