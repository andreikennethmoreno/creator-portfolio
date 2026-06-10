"use client";

import { useCallback, useRef } from "react";
import { useCardStyle } from "@/lib/card-style-context";
import { cn } from "@/lib/utils";
import { useCardWindow } from "@/lib/card-window-context";
import { useDrag } from "@/lib/use-drag";
import type { ReactNode } from "react";

type WMCardProps = {
  title: string;
  count?: number | string;
  href?: string;
  hrefLabel?: string;
  rightSlot?: ReactNode;
  children: ReactNode;
};

export function WMCard({ title, count, href, hrefLabel, rightSlot, children }: WMCardProps) {
  const { style } = useCardStyle();
  const isGlossy = style === "glossy";
  const { isWindow, win, onClose, onMove, onResize } = useCardWindow();

  const { onMouseDown: onTitlebarMouseDown } = useDrag(
    win?.x ?? 0,
    win?.y ?? 0,
    onMove ?? (() => {}),
  );

  const resizeRef = useRef({ mx: 0, my: 0, ow: 0, oh: 0 });

  const onResizeStart = useCallback(
    (e: React.MouseEvent) => {
      if (!onResize || !win) return;
      e.preventDefault();
      e.stopPropagation();
      resizeRef.current = { mx: e.clientX, my: e.clientY, ow: win.width, oh: win.height };

      const handleMove = (me: MouseEvent) => {
        onResize(
          Math.max(200, resizeRef.current.ow + me.clientX - resizeRef.current.mx),
          Math.max(100, resizeRef.current.oh + me.clientY - resizeRef.current.my),
        );
      };

      const handleUp = () => {
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleUp);
      };

      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleUp);
    },
    [onResize, win],
  );

  return (
    <div
      className={cn(
        "rounded-[var(--radius)] overflow-hidden border",
        isWindow
          ? "absolute"
          : "transition-all duration-300",
        !isGlossy && "bg-card border-border",
        isGlossy && [
          "bg-card/80",
          "backdrop-blur-[4px]",
          "border-white/12",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]",
        ],
      )}
      style={
        isWindow && win
          ? { left: win.x, top: win.y, width: win.width, height: win.height, zIndex: win.zIndex }
          : undefined
      }
    >
      <div
        className={cn(
          "flex items-center justify-between px-3 py-1.5 border-b",
          !isGlossy && "bg-muted/30 border-border",
          isGlossy && "bg-black/8 border-white/8",
          isWindow && "cursor-grab active:cursor-grabbing",
        )}
        onMouseDown={isWindow ? onTitlebarMouseDown : undefined}
      >
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-foreground/15" />
          <span className="size-2 rounded-full bg-foreground/15" />
          <span className="size-2 rounded-full bg-primary/50" />
        </div>

        <span className="font-mono text-[11px] text-foreground/50 tracking-wide select-none">
          {title}
        </span>

        <div className="flex items-center gap-2">
          {rightSlot}
          {count !== undefined && (
            <span className="font-mono text-[10px] text-foreground/30">
              [{count}]
            </span>
          )}
          {isWindow ? (
            <button
              onClick={(e) => { e.stopPropagation(); onClose?.() }}
              className="font-mono text-[11px] text-foreground/40 hover:text-destructive transition-colors leading-none cursor-pointer"
              aria-label="Close window"
            >
              ✕
            </button>
          ) : href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] text-foreground/40 hover:text-primary transition-colors leading-none"
              aria-label={hrefLabel}
            >
              ↗
            </a>
          ) : null}
        </div>
      </div>

      <div className="p-3">
        {children}
      </div>

      {isWindow && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={onResizeStart}
        />
      )}
    </div>
  );
}
