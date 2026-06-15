"use client";

import {
  useEffect,
  useRef,
  useState,
  startTransition,
  useCallback,
} from "react";
import {
  Search,
  X,
  Clock,
  Folder,
  Music,
  BookOpen,
  Code,
  Heart,
  ArrowUpRight,
  Camera,
  MessageCircle,
  Play,
  Palette,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWallpaper } from "@/lib/wallpaper-context";
import { CONFIG } from "@/data/config";

const WALLPAPERS = CONFIG.general.wallpapers;
import { flushSync } from "react-dom";

interface SearchExplorerProps {
  open: boolean;
  onClose: () => void;
  onReveal: (section: string) => void;
}

const RECENTS = [
  { icon: Clock, label: "hero", sub: "section" },
  { icon: Clock, label: "instagram", sub: "social" },
  { icon: Clock, label: "youtube", sub: "social" },
];

const SECTIONS = [
  { icon: Folder, label: "hero", sub: "section" },
  { icon: Camera, label: "instagram", sub: "social" },
  { icon: Play, label: "youtube", sub: "social" },
  { icon: BookOpen, label: "reading", sub: "section" },
  { icon: Music, label: "listening", sub: "section" },
  { icon: Code, label: "vercel", sub: "section", keywords: ["projects"] },
  { icon: MessageCircle, label: "twitter", sub: "social" },
  { icon: Heart, label: "support", sub: "section" },
  { icon: Palette, label: "themes", sub: "wallpapers", keywords: ["wallpaper"] },
];

export function SearchExplorer({
  open,
  onClose,
  onReveal,
}: SearchExplorerProps) {
  const [query, setQuery] = useState("");
  const [themeMode, setThemeMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { wallpaper, setWallpaper } = useWallpaper();

  // Auto-scroll carousel to keep active wallpaper centered
  useEffect(() => {
    if (!themeMode || !scrollRef.current) return;
    const activeIndex = WALLPAPERS.findIndex((w) => w.url === wallpaper);
    if (activeIndex < 0) return;
    requestAnimationFrame(() => {
      const container = scrollRef.current;
      if (!container) return;
      const itemWidth = 140 + 8; // w-[140px] + gap-2
      container.scrollLeft =
        activeIndex * itemWidth - container.clientWidth / 2 + itemWidth / 2;
    });
  }, [themeMode, wallpaper]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    } else {
      startTransition(() => {
        setQuery("");
        setThemeMode(false);
      });
    }
  }, [open]);

  const filtered = query.trim()
    ? SECTIONS.filter((s) =>
        s.label.toLowerCase().includes(query.toLowerCase()) ||
        s.keywords?.some((k) => k.includes(query.toLowerCase())),
      )
    : null;

  const handleReveal = (label: string) => {
    if (label === "themes") {
      setThemeMode(true);
      setQuery("");
      return;
    }
    onReveal(label);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && filtered !== null && filtered.length > 0) {
      handleReveal(filtered[0].label);
    }
  };

  // View-transition ripple — always originates from bottom-center of the panel
  const rippleTransition = useCallback(
    (applyChange: () => void, duration = 700) => {
      const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
      const viewportHeight =
        window.visualViewport?.height ?? window.innerHeight;

      let x = viewportWidth / 2;
      let y = viewportHeight - 32; // bottom of panel area (bottom-4 = 16px + some panel height)
      if (panelRef.current) {
        const rect = panelRef.current.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.bottom;
      }

      const maxRadius = Math.hypot(
        Math.max(x, viewportWidth - x),
        Math.max(y, viewportHeight - y),
      );

      const clipPath: [string, string] = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${maxRadius}px at ${x}px ${y}px)`,
      ];

      if (typeof document.startViewTransition !== "function") {
        applyChange();
        return;
      }

      const root = document.documentElement;
      root.style.setProperty("--magicui-theme-vt-clip-from", clipPath[0]);
      const cleanup = () =>
        root.style.removeProperty("--magicui-theme-vt-clip-from");

      const transition = document.startViewTransition(() => {
        flushSync(() => applyChange());
      });

      if (typeof transition?.finished?.finally === "function") {
        transition.finished.finally(cleanup);
      } else {
        cleanup();
      }

      const ready = transition?.ready;
      if (ready && typeof ready.then === "function") {
        ready.then(() => {
          document.documentElement.animate(
            { clipPath },
            {
              duration,
              easing: "ease-in-out",
              fill: "forwards",
              pseudoElement: "::view-transition-new(root)",
            },
          );
        });
      }
    },
    [],
  );

  const handlePrev = useCallback(() => {
    const activeIndex = WALLPAPERS.findIndex((w) => w.url === wallpaper);
    const prevUrl =
      WALLPAPERS[(activeIndex - 1 + WALLPAPERS.length) % WALLPAPERS.length].url;
    rippleTransition(() => setWallpaper(prevUrl));
  }, [wallpaper, setWallpaper, rippleTransition]);

  const handleNext = useCallback(() => {
    const activeIndex = WALLPAPERS.findIndex((w) => w.url === wallpaper);
    const nextUrl = WALLPAPERS[(activeIndex + 1) % WALLPAPERS.length].url;
    rippleTransition(() => setWallpaper(nextUrl));
  }, [wallpaper, setWallpaper, rippleTransition]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") {
        if (themeMode) {
          setThemeMode(false);
          inputRef.current?.focus();
        } else {
          onClose();
        }
        return;
      }
      if (themeMode) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          handlePrev();
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          handleNext();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose, themeMode, handlePrev, handleNext]);

  const activeThemeIndex = WALLPAPERS.findIndex((w) => w.url === wallpaper);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center transition-all duration-300",
        open ? "opacity-100" : "opacity-0",
      )}
    >
      <div
        ref={panelRef}
        className={cn(
          "pointer-events-auto relative border bg-card/90 backdrop-blur-3xl shadow-[0_0_10px_3px] shadow-primary/5",
          "rounded-2xl overflow-hidden",
          "transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          open
            ? themeMode
              ? "w-[580px] max-w-[calc(100vw-2rem)]"
              : "w-[420px] max-w-[calc(100vw-2rem)]"
            : "w-14",
        )}
      >
        <div
          className={cn(
            "overflow-y-auto transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full",
            open ? "max-h-[40vh] opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="p-2 flex flex-col gap-0.5">
            {themeMode ? (
              <div className="px-1 py-2">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest">
                    themes
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground/30">
                    {activeThemeIndex + 1} / {WALLPAPERS.length}
                  </span>
                </div>
                <div className="relative">
                  <button
                    onClick={handlePrev}
                    className="absolute -left-1 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center size-6 rounded-full bg-background/80 border border-border text-muted-foreground hover:text-foreground backdrop-blur-sm transition-colors"
                  >
                    <ChevronLeft size={12} />
                  </button>
                  <div
                    ref={scrollRef}
                    className="flex gap-2 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
                  >
                    {WALLPAPERS.map((wp, i) => (
                      <button
                        key={wp.name}
                        onClick={() =>
                          rippleTransition(() => setWallpaper(wp.url))
                        }
                        className="snap-start shrink-0 w-[140px] group"
                      >
                        <div
                          className={cn(
                            "relative w-full aspect-video rounded-lg overflow-hidden bg-muted border transition-colors",
                            i === activeThemeIndex
                              ? "border-primary/60 ring-1 ring-primary/40"
                              : "border-border/50 group-hover:border-primary/40",
                          )}
                        >
                          <img
                            src={wp.url}
                            alt={wp.label}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-card/0 group-hover:bg-card/60 transition-colors flex items-end p-1.5">
                            <span className="text-[10px] font-mono text-foreground/0 group-hover:text-foreground transition-colors truncate">
                              {wp.label}
                            </span>
                          </div>
                        </div>
                        <p
                          className={cn(
                            "mt-1 text-[10px] font-mono truncate text-left px-0.5",
                            i === activeThemeIndex
                              ? "text-primary/70"
                              : "text-muted-foreground/60",
                          )}
                        >
                          {wp.label}
                        </p>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleNext}
                    className="absolute -right-1 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center size-6 rounded-full bg-background/80 border border-border text-muted-foreground hover:text-foreground backdrop-blur-sm transition-colors"
                  >
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                {!query.trim() && (
                  <>
                    <p className="text-[10px] font-mono text-muted-foreground/50 px-2 pt-1 pb-0.5 uppercase tracking-widest">
                      recent
                    </p>
                    {RECENTS.map((item) => (
                      <ResultRow
                        key={item.label}
                        {...item}
                        onSelect={() => handleReveal(item.label)}
                      />
                    ))}
                    <p className="text-[10px] font-mono text-muted-foreground/50 px-2 pt-2 pb-0.5 uppercase tracking-widest">
                      sections
                    </p>
                    {SECTIONS.map((item) => (
                      <ResultRow
                        key={item.label}
                        {...item}
                        onSelect={() => handleReveal(item.label)}
                      />
                    ))}
                  </>
                )}

                {filtered !== null && filtered.length > 0 && (
                  <>
                    <p className="text-[10px] font-mono text-muted-foreground/50 px-2 pt-1 pb-0.5 uppercase tracking-widest">
                      results
                    </p>
                    {filtered.map((item) => (
                      <ResultRow
                        key={item.label}
                        {...item}
                        onSelect={() => handleReveal(item.label)}
                      />
                    ))}
                  </>
                )}

                {filtered !== null && filtered.length === 0 && (
                  <div className="py-6 text-center">
                    <p className="text-xs font-mono text-muted-foreground/50">
                      no results for &ldquo;{query}&rdquo;
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div
          className={cn(
            "h-px bg-border mx-3 transition-all duration-200",
            open ? "opacity-100" : "opacity-0",
          )}
        />

        <div className="flex items-center gap-2 h-14 px-3">
          <div className="flex items-center justify-center size-8 shrink-0 text-primary">
            <Search size={15} />
          </div>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="search sections, links, cards..."
            className={cn(
              "flex-1 bg-transparent text-sm font-mono text-foreground placeholder:text-muted-foreground/60",
              "outline-none border-none focus:ring-0",
              "transition-opacity duration-200",
              open ? "opacity-100" : "opacity-0",
            )}
          />
          <button
            onClick={onClose}
            className="flex items-center justify-center size-8 shrink-0 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted border border-border transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ResultRow({
  icon: Icon,
  label,
  sub,
  onSelect,
}: {
  icon: React.ElementType;
  label: string;
  sub: string;
  onSelect?: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="group flex items-center gap-3 w-full rounded-xl px-2 py-1.5 text-left hover:bg-muted transition-colors"
    >
      <span className="flex items-center justify-center size-7 shrink-0 rounded-lg bg-background border border-border text-muted-foreground group-hover:text-foreground transition-colors">
        <Icon size={12} />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-mono text-foreground truncate">
          {label}
        </span>
        <span className="block text-[10px] font-mono text-muted-foreground/60 truncate">
          {sub}
        </span>
      </span>
      <ArrowUpRight
        size={12}
        className="shrink-0 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors"
      />
    </button>
  );
}
