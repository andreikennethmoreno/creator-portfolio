"use client";

import {
  createContext, useContext, useState,
  useCallback, useEffect, ReactNode
} from "react";
import { extractAndApply, type Palette } from "./wallpaper-theme";

export const WALLPAPERS = [
  {
    name: "hillside_walk",
    label: "Hillside Walk",
    url: "https://raw.githubusercontent.com/dharmx/walls/main/nord/a_group_of_people_walking_on_a_hill.png",
  },
  {
    name: "sunset_boulevard",
    label: "Sunset Boulevard",
    url: "https://raw.githubusercontent.com/whoisYoges/lwalpapers/PicturesOnly/wallpapers/b-004.jpg",
  },
  {
    name: "blue_black_pattern",
    label: "Blue and Black",
    url: "https://images.weserv.nl/?url=raw.githubusercontent.com/dharmx/walls/main/tile/a_blue_and_black_pattern.png",
  },

  {
    name: "watercolor_town",
    label: "Watercolor Town",
    url: "https://raw.githubusercontent.com/dharmx/walls/main/unsorted/a_watercolor_of_a_town.jpg",
  },
  {
    name: "dessert_scenery",
    label: "Sunset Scenery",
    url: "https://raw.githubusercontent.com/mylinuxforwork/wallpaper/refs/heads/main/sunset-scenery-minimalist.jpg",
  },
  {
    name: "ghibli_plains",
    label: "Ghibli Plains",
    url: "https://raw.githubusercontent.com/whoisYoges/lwalpapers/PicturesOnly/wallpapers/b-003.jpg",
  },

  {
    name: "red_sun_mountains",
    label: "Red Sun Over Mountains",
    url: "https://images.weserv.nl/?url=raw.githubusercontent.com/dharmx/walls/main/solarized/a_red_sun_over_mountains.jpg",
  },
];

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
