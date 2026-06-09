"use client";

import { useCardStyle } from "@/lib/card-style-context";
import { cn } from "@/lib/utils";

export function CardStyleToggle() {
  const { style, toggle } = useCardStyle();
  const isGlossy = style === "glossy";

  return (
    <button
      onClick={toggle}
      className={cn(
        "font-mono text-[11px] px-2 py-1 rounded-[var(--radius-sm)] border transition-all duration-200",
        "text-foreground/50 hover:text-foreground/80",
        isGlossy
          ? "bg-white/5 border-white/10"
          : "bg-muted/40 border-border"
      )}
    >
      {isGlossy ? "⬡ glass" : "⬡ flat"}
    </button>
  );
}