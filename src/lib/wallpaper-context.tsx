"use client";

import {
  createContext, useContext, useState,
  useCallback, useEffect, ReactNode
} from "react";
import { extractAndApply, type Palette } from "./wallpaper-theme";

export const WALLPAPERS = [
  {
    name: "red_sun_mountains",
    label: "Red Sun",
    url: "https://images.weserv.nl/?url=raw.githubusercontent.com/dharmx/walls/main/solarized/a_red_sun_over_mountains.jpg",
  },
];

type WallpaperCtx = {
  wallpaper: string;
  palette: Palette | null;
  setWallpaper: (url: string) => void;
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

  useEffect(() => {
    extractAndApply(defaultUrl).then(setPalette).catch(console.error);
  }, []);

  return (
    <Ctx.Provider value={{ wallpaper, palette, setWallpaper }}>
      {children}
    </Ctx.Provider>
  );
}

export const useWallpaper = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWallpaper outside WallpaperProvider");
  return ctx;
};
