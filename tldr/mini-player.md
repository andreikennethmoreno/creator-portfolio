# Mini Player TL;DR

File: `src/components/mini-player.tsx` — desktop mode only, replaces old right dock.

## Layout (horizontal, ~320px+ wide)
`[Album Art 36x36] [Song Name + Artist] [Progress Bar OR Sound Wave] [Play/Pause]`

## Progress Bar Logic
- **Not playing** → always show normal progress bar
- **Playing + not hovering** → CSS sound wave animation (8 animated bars, pure CSS `@keyframes sw`)
- **Playing + hovering** → show normal progress bar

## Features
- Fetches `/api/lastfm` every 60s for track data
- Hidden YouTube iframe (1x1, offscreen) for audio
- Seekable progress bar (click to seek)
- Green pulsing dot next to currently playing track name
- Current time / duration display (MM:SS)
- Play/pause toggle

## Right Dock in navbar.tsx
- No longer wrapped in `<Dock>` (no magnification effect)
- Plain `<div>` with same bg/blur/border styling
- Auto-hides with fullscreen windows same as other docks
