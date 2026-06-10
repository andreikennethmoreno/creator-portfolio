"use client";

import { createContext, useContext } from "react";
import type { AppWindow } from "./window-manager-context";

export type CardWindowCtx = {
  isWindow: boolean;
  win: AppWindow | null;
  onClose?: () => void;
  onMinimize?: () => void;
  onMove?: (x: number, y: number) => void;
  onResize?: (w: number, h: number) => void;
};

export const CardWindowContext = createContext<CardWindowCtx>({
  isWindow: false,
  win: null,
});

export function useCardWindow() {
  return useContext(CardWindowContext);
}
