"use client";

import { useWallpaper } from "@/lib/wallpaper-context";

export function WallpaperBackground() {
  const { wallpaper } = useWallpaper();

  return (
    <div
      className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat transition-all duration-700"
      style={{ backgroundImage: `url(${wallpaper})` }}
    />
  );
}
