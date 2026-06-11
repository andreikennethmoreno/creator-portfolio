"use client";

import { useEffect, useRef, useState } from "react";
import { X, Music, User, Code, Globe, Server, BookOpen, Camera, Play, MessageCircle, Heart, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { DATA } from "@/data/resume";

export function TopPanel() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"website" | "music" | "about">("website");
  const openRef = useRef(false);
  const hoverTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const isHoveringPanel = useRef(false);

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

  const INTEGRATIONS = [
    { icon: Play, label: "YouTube Data API v3" },
    { icon: Camera, label: "Behold.so (Instagram)" },
    { icon: BookOpen, label: "Hardcover GraphQL API" },
    { icon: Music, label: "Last.fm API" },
    { icon: Server, label: "Vercel API" },
    { icon: Globe, label: "Microlink API" },
    { icon: Heart, label: "Ko-fi" },
  ];

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
      <div
        className={cn(
          "pointer-events-auto relative border bg-card/90 backdrop-blur-3xl shadow-[0_0_10px_3px] shadow-primary/5",
          "rounded-2xl overflow-hidden w-[420px] max-w-[calc(100vw-2rem)]",
          "transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
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

            {activeTab === "website" && (
              <div className="p-3 flex flex-col gap-3">
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground/50 px-1 pb-1.5 uppercase tracking-widest">
                    stack
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "shadcn/ui", "Motion"].map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-[10px] font-mono rounded-md bg-background border border-border text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground/50 px-1 pb-1.5 uppercase tracking-widest">
                    integrations
                  </p>
                  <div className="flex flex-col gap-1">
                    {INTEGRATIONS.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors"
                      >
                        <span className="flex items-center justify-center size-6 shrink-0 rounded-md bg-background border border-border text-muted-foreground">
                          <item.icon size={10} />
                        </span>
                        <span className="text-xs font-mono text-muted-foreground">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "music" && (
              <div className="p-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border">
                  <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Music size={16} className="text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-mono text-foreground truncate">
                      No track playing
                    </p>
                    <p className="text-[10px] font-mono text-muted-foreground/60 truncate">
                      Open the Last.fm player to start
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "about" && (
              <div className="p-3 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center size-9 shrink-0 rounded-xl bg-background border border-border text-primary">
                    <User size={15} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-mono text-foreground truncate">
                      {DATA.name}
                    </p>
                    <p className="text-[10px] font-mono text-muted-foreground/60 truncate">
                      {DATA.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground/70">
                  <MapPin size={11} />
                  <span>{DATA.location}</span>
                </div>
              </div>
            )}
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
            {activeTab === "website" ? "apis & stack" : activeTab === "music" ? "now playing" : "about the creator"}
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
