"use client";

import { useEffect, useRef, useState } from "react";
import { X, Music, User, Code, Layout } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCardStyle } from "@/lib/card-style-context";
import WebsiteTab from "@/components/hud/website-tab";
import TechStackTab from "@/components/hud/tech-stack-tab";
import PlayerTab from "@/components/hud/player-tab";
import AboutTab from "@/components/hud/about-tab";

export function TopPanel({ panelTrigger }: { panelTrigger?: number }) {
  const { style } = useCardStyle();
  const isGlossy = style === "glossy";
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"website" | "tech" | "music" | "about">("website");
  const openRef = useRef(false);
  const hoverTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const isHoveringPanel = useRef(false);

  useEffect(() => {
    if (panelTrigger && panelTrigger > 0) {
      openRef.current = true;
      setOpen(true);
      setActiveTab("music");
    }
  }, [panelTrigger]);

  useEffect(() => {
    const THRESHOLD = 30;
    const CENTER_ZONE = 0.3;

    const handleMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const halfZone = (w * CENTER_ZONE) / 2;
      const mid = w / 2;
      const inZone = e.clientY < THRESHOLD && Math.abs(e.clientX - mid) < halfZone;

      if (inZone) {
        if (hoverTimeout.current) {
          clearTimeout(hoverTimeout.current);
          hoverTimeout.current = undefined;
        }
        if (!openRef.current) {
          openRef.current = true;
          setOpen(true);
        }
      } else if (!isHoveringPanel.current && openRef.current) {
        if (!hoverTimeout.current) {
          hoverTimeout.current = setTimeout(() => {
            openRef.current = false;
            setOpen(false);
            hoverTimeout.current = undefined;
          }, 400);
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        openRef.current = false;
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <div
      onMouseEnter={() => {
        isHoveringPanel.current = true;
        if (hoverTimeout.current) {
          clearTimeout(hoverTimeout.current);
          hoverTimeout.current = undefined;
        }
      }}
      onMouseLeave={() => {
        isHoveringPanel.current = false;
        if (openRef.current) {
          hoverTimeout.current = setTimeout(() => {
            openRef.current = false;
            setOpen(false);
            hoverTimeout.current = undefined;
          }, 400);
        }
      }}
      className={cn(
        "pointer-events-none fixed inset-x-0 top-4 z-40 flex justify-center"
      )}
    >
      {!open && (
        <div className="pointer-events-none absolute -top-1 flex flex-col items-center gap-1 animate-pulse">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-background/60 backdrop-blur-sm shadow-sm">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
            </span>
            <span className="text-[9px] font-mono text-primary/70 tracking-widest uppercase">HUD</span>
          </div>
          <div className="flex gap-0.5">
            <span className="size-0.5 rounded-full bg-primary/20" />
            <span className="size-0.5 rounded-full bg-primary/40" />
            <span className="size-0.5 rounded-full bg-primary/20" />
          </div>
        </div>
      )}
      <div
        className={cn(
          "pointer-events-auto relative border rounded-2xl overflow-hidden w-[480px] max-w-[calc(100vw-2rem)]",
          "shadow-[0_0_10px_3px] shadow-primary/5",
          "transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          !isGlossy && "bg-card/90 backdrop-blur-3xl",
          isGlossy && "bg-card/80 backdrop-blur-[4px] border-white/12 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]",
          open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        )}
      >
        <div
          className={cn(
            "overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full",
            open ? "max-h-[60vh] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="p-2 flex flex-col gap-0.5">
            <div className="flex items-center gap-1 px-2 pt-2 pb-1">
              <button
                onClick={() => setActiveTab("website")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-all",
                  activeTab === "website"
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Code size={12} />
                Website
              </button>
              <button
                onClick={() => setActiveTab("tech")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-all",
                  activeTab === "tech"
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Layout size={12} />
                Tech Stack
              </button>
              <button
                onClick={() => setActiveTab("music")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-all",
                  activeTab === "music"
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Music size={12} />
                Music
              </button>
              <button
                onClick={() => setActiveTab("about")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-all",
                  activeTab === "about"
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <User size={12} />
                About
              </button>
              <div className="flex-1" />
              <button
                onClick={() => {
                  openRef.current = false;
                  setOpen(false);
                }}
                className="flex items-center justify-center size-7 shrink-0 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted border border-border transition-colors"
              >
                <X size={12} />
              </button>
            </div>

            <div className="h-px bg-border mx-3 my-1" />

            {activeTab === "website" && <WebsiteTab />}
            {activeTab === "tech" && <TechStackTab />}
            {activeTab === "music" && <PlayerTab />}
            {activeTab === "about" && <AboutTab />}
          </div>
        </div>

        <div
          className={cn(
            "flex items-center gap-2 h-11 px-3 border-t border-border",
            "transition-all duration-200",
            open ? "opacity-100" : "opacity-0"
          )}
        >
          <span className="text-[10px] font-mono text-muted-foreground/40">
            {activeTab === "website" ? "vercel & apis" : activeTab === "tech" ? "tech stack" : activeTab === "music" ? "now playing" : "about the creator"}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground/20">·</span>
          <span className="text-[10px] font-mono text-muted-foreground/40">
            press <kbd className="px-1 py-0.5 rounded bg-muted border border-border text-[9px]">esc</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}
