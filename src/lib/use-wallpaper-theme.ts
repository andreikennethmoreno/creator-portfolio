"use client";

import { getSwatchesSync } from "colorthief";

export function applyWallpaperTheme(imgElement: HTMLImageElement) {
  const swatches = getSwatchesSync(imgElement);

  if (!swatches) return;

  const root = document.documentElement;
  const isDark = swatches.DarkVibrant?.color.isDark ?? true;

  // toggle dark/light class based on wallpaper
  root.classList.toggle("dark", isDark);

  // map semantic swatches → your CSS vars
  const bg       = swatches.DarkMuted?.color.css("oklch")    ?? "oklch(0.12 0 0)";
  const card     = swatches.DarkVibrant?.color.css("oklch")  ?? "oklch(0.16 0 0)";
  const primary  = swatches.Vibrant?.color.css("oklch")      ?? "oklch(0.72 0.17 145)";
  const accent   = swatches.Muted?.color.css("oklch")        ?? "oklch(0.20 0.03 145)";
  const border   = swatches.DarkVibrant?.color.css("oklch")  ?? "oklch(0.28 0.04 145)";
  const fg       = isDark ? "oklch(0.92 0 0)" : "oklch(0.15 0 0)";

  root.style.setProperty("--background", bg);
  root.style.setProperty("--card", card);
  root.style.setProperty("--primary", primary);
  root.style.setProperty("--accent", accent);
  root.style.setProperty("--border", border);
  root.style.setProperty("--foreground", fg);
  root.style.setProperty("--ring", primary);
  root.style.setProperty("--sidebar-primary", primary);
  root.style.setProperty("--sidebar-border", border);
}
