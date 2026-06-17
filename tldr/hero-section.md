# Hero Section TL;DR

File: `src/components/section/hero-section.tsx` — client component, WMCard wrapper.

## Normal Mode
- Avatar (96px mobile / 128px desktop, `rounded-xl`, ring-4)
- BlurFadeText: `"Hi, I'm Kenroms"` with per-character stagger
- Description tagline with pulsing `$ click me` button
- Click anywhere on card (or button) → opens terminal mode

## Terminal Mode
- **Boot sequence**: prints `CONFIG.creator.terminal.bootLines` at 100ms intervals via `setInterval`
- **Prompt**: `CONFIG.creator.terminal.prompt` (e.g. `$`)
- **Commands** (from `CONFIG.creator.terminal.commands`):
  - `whoami`, `location`, `status`, `contact`, `links`, `help` — return text/JSX from config
  - `clear` — clears history (`__CLEAR__` sentinel)
  - `exit` — closes terminal (`__EXIT__` sentinel)
  - `matrix` — activates Matrix Rain overlay
  - anything else — `"command not found: ..."`
- **History**: array of `{ prompt, output }`, auto-scrolls via `bottomRef`
- **Card title**: `~/hello — terminal` in terminal mode
- **[exit] button**: top-right titlebar button to close terminal
- **Transition**: 500ms opacity crossfade between normal/terminal modes

## Matrix Rain Mode
- Triggered by `matrix` command
- Full-size `<MatrixRain />` overlay replacing terminal content
- Exit via **Escape** key or **[exit]** button
- **Card title**: `~/hello — matrix`

## MatrixRain Component (`src/components/matrix-rain.tsx`)
- DOM `<pre>`-based, auto-sizes to parent via ResizeObserver
- Dense straight-down columns (one per char width)
- Katakana + ASCII characters
- `--primary` CSS color with opacity fade trail (7 chars deep)
- `requestAnimationFrame` loop, pauses when tab hidden
- Used standalone — no deps on hero state

## Desktop Mode
- Click on card anywhere opens terminal (not just button)
- Terminal fills window height when `isWindow && terminalOpen`
