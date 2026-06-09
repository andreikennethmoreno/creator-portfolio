"use client";

import { useCardStyle } from "@/lib/card-style-context";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type WMCardProps = {
  title: string;
  count?: number | string;
  href?: string;
  hrefLabel?: string;
  children: ReactNode;
};

export function WMCard({ title, count, href, hrefLabel, children }: WMCardProps) {
  const { style } = useCardStyle();
  const isGlossy = style === "glossy";

  return (
    <div className={cn(
      "rounded-[var(--radius)] overflow-hidden transition-all duration-300",
      // base — always present
      "border",
      !isGlossy && "bg-card border-border",
      // linux WM glossy — barely there
      isGlossy && [
        "bg-card/70",
        "backdrop-blur-[6px]",
        "border-white/12",
        // the actual gloss: just a 1px top line
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]",
      ]
    )}>

      {/* Title bar — the WM chrome */}
      <div className={cn(
        "flex items-center justify-between px-3 py-1.5 border-b",
        !isGlossy && "bg-muted/30 border-border",
        isGlossy && "bg-black/8 border-white/8"
      )}>
        <div className="flex items-center gap-1.5">
          {/* dots are small and muted, not macOS circus colors */}
          <span className="size-2 rounded-full bg-foreground/15" />
          <span className="size-2 rounded-full bg-foreground/15" />
          <span className="size-2 rounded-full bg-primary/50" />
        </div>

        <span className="font-mono text-[11px] text-foreground/50 tracking-wide">
          {title}
        </span>

        <div className="flex items-center gap-2">
          {count !== undefined && (
            <span className="font-mono text-[10px] text-foreground/30">
              [{count}]
            </span>
          )}
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] text-foreground/40 hover:text-primary transition-colors leading-none"
              aria-label={hrefLabel}
            >
              ↗
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {children}
      </div>
    </div>
  );
}