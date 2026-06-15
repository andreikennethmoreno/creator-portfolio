"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { CONFIG } from "@/data/config";

type CardStyle = "default" | "glossy";
type CardStyleCtx = { style: CardStyle; toggle: () => void };

const CardStyleContext = createContext<CardStyleCtx | null>(null);

export function CardStyleProvider({ children }: { children: ReactNode }) {
  const [style, setStyle] = useState<CardStyle>(CONFIG.creator.defaultCardStyle);
  const toggle = () => setStyle(s => s === "default" ? "glossy" : "default");
  return (
    <CardStyleContext.Provider value={{ style, toggle }}>
      {children}
    </CardStyleContext.Provider>
  );
}

export const useCardStyle = () => {
  const ctx = useContext(CardStyleContext);
  if (!ctx) throw new Error("useCardStyle outside CardStyleProvider");
  return ctx;
};
