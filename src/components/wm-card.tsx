"use client";

import { useCallback } from "react";
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

type EdgeDir = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

const EDGES: { dir: EdgeDir; className: string }[] = [
  { dir: "n", className: "top-0 left-3 right-3 h-1.5 cursor-n-resize" },
  { dir: "s", className: "bottom-0 left-3 right-3 h-1.5 cursor-s-resize" },
  { dir: "w", className: "left-0 top-3 bottom-3 w-1.5 cursor-w-resize" },
  { dir: "e", className: "right-0 top-3 bottom-3 w-1.5 cursor-e-resize" },
  { dir: "nw", className: "top-0 left-0 size-3 cursor-nw-resize" },
  { dir: "ne", className: "top-0 right-0 size-3 cursor-ne-resize" },
  { dir: "sw", className: "bottom-0 left-0 size-3 cursor-sw-resize" },
  { dir: "se", className: "bottom-0 right-0 size-3 cursor-se-resize" },
];

export function WMCard({ title, count, href, hrefLabel, rightSlot, children }: WMCardProps) {
  const { style } = useCardStyle();
  const isGlossy = style === "glossy";
  const { isWindow, win, onClose, onMinimize, onMaximize, onMove, onResizeRect, onFocus } = useCardWindow();

  const { onMouseDown: onTitlebarMouseDown } = useDrag(
    win?.x ?? 0,
    win?.y ?? 0,
    onMove ?? (() => {}),
    onFocus,
    win?.width,
    win?.height,
  );

  const onEdgeResize = useCallback(
    (e: React.MouseEvent) => {
      if (!onResizeRect || !win) return;
      e.preventDefault();
      e.stopPropagation();
      onFocus?.();

      const dir = (e.currentTarget as HTMLElement).dataset.dir as EdgeDir;
      const sx = e.clientX;
      const sy = e.clientY;
      const ox = win.x;
      const oy = win.y;
      const ow = win.width;
      const oh = win.height;

      const handleMove = (me: MouseEvent) => {
        const dx = me.clientX - sx;
        const dy = me.clientY - sy;

        let nx = ox, ny = oy, nw = ow, nh = oh;

        if (dir.includes("e")) nw = Math.max(200, ow + dx);
        if (dir.includes("w")) { nw = Math.max(200, ow - dx); nx = ox + ow - nw; }
        if (dir.includes("s")) nh = Math.max(120, oh + dy);
        if (dir.includes("n")) { nh = Math.max(120, oh - dy); ny = oy + oh - nh; }

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        if (nx < 0) { nx = 0; }
        if (ny < 0) { ny = 0; }
        if (nx + nw > vw) { nw = Math.max(200, vw - nx); }
        if (ny + nh > vh) { nh = Math.max(120, vh - ny); }

        onResizeRect(nx, ny, nw, nh);
      };

      const handleUp = () => {
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleUp);
      };

      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleUp);
    },
    [onResizeRect, win, onFocus],
  );

  if (isWindow && win?.minimized) return null;

  return (
    <div
      className={cn(
        "rounded-[var(--radius)] border",
        isWindow
          ? "absolute flex flex-col overflow-hidden min-w-[200px] min-h-[120px]"
          : "transition-all duration-300 overflow-hidden",
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
          "flex items-center justify-between px-3 py-1.5 border-b shrink-0",
          !isGlossy && "bg-muted/30 border-border",
          isGlossy && "bg-black/8 border-white/8",
          isWindow && "cursor-grab active:cursor-grabbing",
        )}
        onMouseDown={isWindow ? (e) => { onFocus?.(); onTitlebarMouseDown(e); } : undefined}
      >
        {!isWindow && (
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-foreground/15" />
            <span className="size-2 rounded-full bg-foreground/15" />
            <span className="size-2 rounded-full bg-primary/50" />
          </div>
        )}

        <span className={cn(
          "font-mono text-[11px] tracking-wide select-none",
          isWindow ? "text-foreground/70" : "text-foreground/50"
        )}>
          {title}
        </span>

        <div className="flex items-center gap-2 shrink-0">
          {rightSlot}
          {count !== undefined && (
            <span className="font-mono text-[10px] text-foreground/30">
              [{count}]
            </span>
          )}
          {isWindow ? (
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); onMinimize?.() }}
                className="font-mono text-[13px] text-foreground/40 hover:text-foreground transition-colors leading-none cursor-pointer px-0.5"
                aria-label="Minimize window"
              >
                ─
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onMaximize?.() }}
                className="font-mono text-[13px] text-foreground/40 hover:text-foreground transition-colors leading-none cursor-pointer px-0.5"
                aria-label="Maximize window"
              >
                +
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onClose?.() }}
                className="font-mono text-[13px] text-foreground/40 hover:text-destructive transition-colors leading-none cursor-pointer px-0.5"
                aria-label="Close window"
              >
                ✕
              </button>
            </div>
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

      <div className={cn(
        "p-3",
        isWindow && "flex-1 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full",
      )}>
        {children}
      </div>

      {isWindow && EDGES.map(({ dir, className }) => (
        <div
          key={dir}
          data-dir={dir}
          className={cn("absolute z-10", className)}
          onMouseDown={onEdgeResize}
        />
      ))}

      {isWindow && (
        <div className="absolute bottom-0 right-0 w-5 h-5 pointer-events-none flex items-end justify-end pr-0.5 pb-0.5">
          <svg width="10" height="10" viewBox="0 0 10 10" className="text-foreground/20">
            <line x1="3" y1="10" x2="10" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="6" y1="10" x2="10" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </div>
  );
}
