"use client";

import { useEffect, useRef } from "react";
import { useWallpaper } from "@/lib/wallpaper-context";
import { applyWallpaperTheme } from "@/lib/use-wallpaper-theme";

export function WallpaperBackground() {
  const { wallpaper, setWallpaper } = useWallpaper();
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // trigger extraction on initial load
    setWallpaper(wallpaper);
  }, []);

  return (
    <>
      {/* hidden img used for color extraction — crossOrigin required */}
      <img
        ref={imgRef}
        src={wallpaper}
        crossOrigin="anonymous"
        className="hidden"
        aria-hidden
      />
      {/* actual visible background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${wallpaper})` }}
      />
    </>
  );
}
