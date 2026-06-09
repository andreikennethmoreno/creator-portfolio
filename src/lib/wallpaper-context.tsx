"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { applyWallpaperTheme } from "./use-wallpaper-theme";

type WallpaperContextType = {
  wallpaper: string;
  setWallpaper: (url: string) => void;
};

const WallpaperContext = createContext<WallpaperContextType | null>(null);

export function WallpaperProvider({ children, defaultWallpaper }: { children: ReactNode; defaultWallpaper: string }) {
  const [wallpaper, setWallpaperState] = useState(defaultWallpaper);

  const setWallpaper = useCallback((url: string) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => {
      applyWallpaperTheme(img);
      setWallpaperState(url);
    };
  }, []);

  return (
    <WallpaperContext.Provider value={{ wallpaper, setWallpaper }}>
      {children}
    </WallpaperContext.Provider>
  );
}

export const useWallpaper = () => {
  const ctx = useContext(WallpaperContext);
  if (!ctx) throw new Error("useWallpaper must be used inside WallpaperProvider");
  return ctx;
};
