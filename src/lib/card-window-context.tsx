"use client";

import { createContext, useContext } from "react";
import type { AppWindow } from "./window-manager-context";

export type CardWindowCtx = {
  isWindow: boolean;
  win: AppWindow | null;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onMove?: (x: number, y: number) => void;
  onResizeRect?: (x: number, y: number, w: number, h: number) => void;
  onFocus?: () => void;
};

export const CardWindowContext = createContext<CardWindowCtx>({
  isWindow: false,
  win: null,
});

export function useCardWindow() {
  return useContext(CardWindowContext);
}
