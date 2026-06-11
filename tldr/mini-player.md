# Mini Player TL;DR

File: `src/components/mini-player.tsx` — desktop mode only, right dock.

## Layout (horizontal, ~320px+ wide)
`[Album Art 36x36] [Song Name + Artist] [Progress Bar OR Sound Wave] [Play/Pause]`

## Progress Bar Logic
- **Not playing** → always show normal progress bar
- **Playing + not hovering** → CSS sound wave animation (canvas AudioVisualizer)
- **Playing + hovering** → show normal progress bar

## Features
- **No own YT player** — reads state from shared `MusicPlayerContext` (`useMusicPlayer()`)
- Single source of truth: `track`, `isPlaying`, `currentTime`, `duration`, `toggle`, `seek` all from context
- Seekable progress bar (click to seek)
- Green pulsing dot next to currently playing track name
- Current time / duration display (MM:SS)
- Play/pause toggle (delegates to context)

## Right Dock in navbar.tsx
- Plain `<div>` with same bg/blur/border styling (no Dock magnification)
- Auto-hides with fullscreen windows same as other docks
