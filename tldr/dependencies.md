# Dependencies TL;DR

## Runtime

| Package | Purpose |
|---------|---------|
| `next@16.2.7` | Framework (App Router, Turbopack) |
| `react@19.2.7` + `react-dom@19.2.7` | UI library |
| `motion@12` | Framer Motion API v12 for animations (dock spring, window transitions) |
| `@radix-ui/*` | Primitives: tooltip, avatar, slot, separator, accordion |
| `tailwindcss@4` + `@tailwindcss/postcss` | Utility CSS framework v4 |
| `tailwindcss-animate` + `tw-animate-css` | Tailwind animation utilities |
| `clsx` + `tailwind-merge` | `cn()` class merging utility |
| `class-variance-authority` | shadcn/ui component variants |
| `lucide-react` | Icon library (used in dock, sections, tabs) |
| `@radix-ui/react-icons` | Secondary icon set |
| `embla-carousel-react` | Hardcover books carousel (dragFree) |
| `colorthief` | Favicon color extraction (alt wallpaper palette method) |
| `kofi-react-widget` | Ko-fi floating support button |

## Dev Dependencies

| Package | Purpose |
|---------|---------|
| `typescript@5.9` | Type checking |
| `eslint@9` + `eslint-config-next@16` | Linting |
| `postcss@8` | PostCSS for Tailwind |
| `@types/*` | TypeScript type definitions |
| `@types/youtube` | YouTube IFrame API types |

## No Runtime State Management Library
All state via React Context (8 providers). No Zustand, Redux, Jotai, etc.

## No CSS-in-JS
Tailwind v4 + CSS custom properties (OKLCH). No styled-components, Emotion, etc.

## Key Version Overrides (pnpm)
```json
"@types/react": "19.2.17",
"@types/react-dom": "19.2.3"
```
