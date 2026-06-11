"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { useDrag } from "@/lib/use-drag";
import { useWindowManager, type AppWindow } from "@/lib/window-manager-context";
import { cn } from "@/lib/utils";

interface DesktopWindowProps {
  window: AppWindow;
  children: ReactNode;
  className?: string;
}

export function DesktopWindow({ window: win, children, className }: DesktopWindowProps) {
  const { focusWindow, moveWindow, closeWindow, minimizeWindow, toggleMaximize } = useWindowManager();

  if (win.minimized) return null;
  const contentRef = useRef<HTMLDivElement>(null);

  const drag = useDrag(win.x, win.y, (x, y) => moveWindow(win.id, x, y), () => focusWindow(win.id), win.width, win.height);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const handleScrollWheel = (e: WheelEvent) => {
      e.stopPropagation();
    };
    el.addEventListener("wheel", handleScrollWheel, { passive: true });
    return () => el.removeEventListener("wheel", handleScrollWheel);
  }, []);

  return (
    <div
      className={cn(
        "absolute rounded-[var(--radius)] overflow-hidden border border-border/60",
        "bg-card/85 backdrop-blur-md shadow-lg",
        "transition-shadow duration-150",
        "group",
        className,
      )}
      style={{
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      }}
      onMouseDown={() => focusWindow(win.id)}
    >
      <div
        className="flex items-center h-9 px-2 cursor-default select-none bg-muted/30 border-b border-border/40"
        {...drag}
      >
        <div className="flex items-center gap-1.5 mr-3">
          <button
            className="size-3 rounded-full bg-destructive/70 hover:bg-destructive transition-colors flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }}
          >
            <span className="text-[7px] text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity">✕</span>
          </button>
          <button
            className="size-3 rounded-full bg-amber-400/70 hover:bg-amber-400 transition-colors flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id); }}
          >
            <span className="text-[7px] text-amber-950 opacity-0 group-hover:opacity-100 transition-opacity">─</span>
          </button>
          <button
            className="size-3 rounded-full bg-emerald-500/70 hover:bg-emerald-500 transition-colors flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); toggleMaximize(win.id); }}
          >
            <span className="text-[7px] text-emerald-950 opacity-0 group-hover:opacity-100 transition-opacity">{win.maximized ? "⤡" : "+"}</span>
          </button>
        </div>
        <span className="flex-1 text-center text-[11px] font-mono text-foreground/60 truncate mr-8">
          {win.title}
        </span>
      </div>

      <div
        ref={contentRef}
        className="overflow-y-auto h-[calc(100%-36px)] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        {children}
      </div>
    </div>
  );
}
