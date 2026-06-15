"use client";

import {
  createContext, useContext, useState,
  useCallback, useEffect, ReactNode
} from "react";
import { extractAndApply, type Palette } from "./wallpaper-theme";
import { CONFIG } from "@/data/config";

const WALLPAPERS = CONFIG.general.wallpapers;

type WallpaperCtx = {
  wallpaper: string;
  palette: Palette | null;
  setWallpaper: (url: string) => void;
  cycleWallpaper: () => void;
};

const Ctx = createContext<WallpaperCtx | null>(null);

export function WallpaperProvider({
  children,
  defaultUrl = WALLPAPERS[0].url,
}: {
  children: ReactNode;
  defaultUrl?: string;
}) {
  const [wallpaper, setWallpaperUrl] = useState(defaultUrl);
  const [palette, setPalette] = useState<Palette | null>(null);

  const setWallpaper = useCallback((url: string) => {
    setWallpaperUrl(url);
    extractAndApply(url).then(setPalette).catch(console.error);
  }, []);

  const cycleWallpaper = useCallback(() => {
    const currentIndex = WALLPAPERS.findIndex((w) => w.url === wallpaper);
    const nextIndex = (currentIndex + 1) % WALLPAPERS.length;
    setWallpaper(WALLPAPERS[nextIndex].url);
  }, [wallpaper, setWallpaper]);

  useEffect(() => {
    extractAndApply(defaultUrl).then(setPalette).catch(console.error);
    WALLPAPERS.forEach((w) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = w.url;
    });
  }, []);

  return (
    <Ctx.Provider value={{ wallpaper, palette, setWallpaper, cycleWallpaper }}>
      {children}
    </Ctx.Provider>
  );
}

export const useWallpaper = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWallpaper outside WallpaperProvider");
  return ctx;
};
