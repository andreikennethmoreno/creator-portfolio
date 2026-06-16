# TL;DR Index

Agent quick-start: read `quick-ref.md` first, then `project.md`. Everything below is expand-on-demand.

## File Map

| File | What It Covers |
|------|---------------|
| `project.md` | Routes, key files, config system, styling, desktop mode, navbar, modes |
| `quick-ref.md` | 30-second summary — modes, routes, patterns, file structure |
| `modes.md` | 4-mode architecture (creator/linktree/dev/custom), per-mode config |
| `data-config.md` | Config structure — all fields, derived exports |
| `sections.md` | All 7 sections + hover overlay pattern |
| `dev-sections.md` | Dev mode sections (about, experience, education, projects) |
| `api-routes.md` | All API routes + external dependencies |
| `env-vars.md` | All env vars, error handling, placeholder pattern |
| `architecture.md` | Hybrid rendering, client/server split |
| `component-patterns.md` | `env.*()` helper, imports convention |
| `contexts.md` | All 8 React contexts, data flow |
| `styling.md` | Tailwind v4, theme, wallpaper, dock, cards |
| `navbar.md` | 3 dockers (left/center/right), auto-hide behavior |
| `dockers.md` | Each docker's contents, magnification, auto-hide zones |
| `desktop-mode.md` | Screen manager, window manager, tiling algorithm |
| `screens.md` | 3 virtual screens, transitions, state per screen |
| `search-explorer.md` | Spotlight search, sections, filter logic |
| `top-panel.md` | HUD top panel (deprecated by hud-panel.md) |
| `hud-panel.md` | Desktop HUD panel, 4 tabs, provider |
| `mini-player.md` | Mini player in right dock, progress bar logic |
| `music-player-context.md` | Shared YT player state, fields, behaviors |
| `floating-toolbar.md` | Settings popover, mode switcher, wallpaper picker |
| `setup.md` | Agent-condensed setup guide (see also `SETUP.md` at root) |

## Key Entry Points for Agents

1. **Plumbing**: `contexts.md` → provider order in layout.tsx
2. **Data flow**: `data-config.md` → `config.tsx` drives everything
3. **Layout**: `project.md` → routes, `page.tsx` structure
4. **Styling**: `styling.md` → Tailwind v4 + OKLCH vars
5. **Desktop mode**: `desktop-mode.md` + `screens.md` → window manager
