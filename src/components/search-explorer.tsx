"use client";

import { useEffect, useRef, useState, startTransition } from "react";
import { Search, X, Clock, Folder, Music, BookOpen, Code, Heart, ArrowUpRight, Camera, MessageCircle, Play } from "lucide-react";
import { cn } from "@/lib/utils";

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
  { icon: Code, label: "projects", sub: "section" },
  { icon: MessageCircle, label: "threads", sub: "social" },
  { icon: Heart, label: "support", sub: "section" },
];

export function SearchExplorer({ open, onClose, onReveal }: SearchExplorerProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    } else {
      startTransition(() => setQuery(""));
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const filtered = query.trim()
    ? SECTIONS.filter((s) =>
        s.label.toLowerCase().includes(query.toLowerCase())
      )
    : null;

  const handleReveal = (label: string) => {
    onReveal(label);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && filtered !== null && filtered.length > 0) {
      handleReveal(filtered[0].label);
    }
  };

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center transition-all duration-300",
        open ? "opacity-100" : "opacity-0"
      )}
    >
      <div
        className={cn(
          "pointer-events-auto relative border bg-card/90 backdrop-blur-3xl shadow-[0_0_10px_3px] shadow-primary/5",
          "rounded-2xl overflow-hidden",
          "transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          open ? "w-[420px] max-w-[calc(100vw-2rem)]" : "w-14"
        )}
      >
        <div
          className={cn(
            "overflow-y-auto transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full",
            open ? "max-h-[40vh] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="p-2 flex flex-col gap-0.5">
            {!query.trim() && (
              <>
                <p className="text-[10px] font-mono text-muted-foreground/50 px-2 pt-1 pb-0.5 uppercase tracking-widest">
                  recent
                </p>
                {RECENTS.map((item) => (
                  <ResultRow key={item.label} {...item} onSelect={() => handleReveal(item.label)} />
                ))}
                <p className="text-[10px] font-mono text-muted-foreground/50 px-2 pt-2 pb-0.5 uppercase tracking-widest">
                  sections
                </p>
                {SECTIONS.map((item) => (
                  <ResultRow key={item.label} {...item} onSelect={() => handleReveal(item.label)} />
                ))}
              </>
            )}

            {filtered !== null && filtered.length > 0 && (
              <>
                <p className="text-[10px] font-mono text-muted-foreground/50 px-2 pt-1 pb-0.5 uppercase tracking-widest">
                  results
                </p>
                {filtered.map((item) => (
                  <ResultRow key={item.label} {...item} onSelect={() => handleReveal(item.label)} />
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
          </div>
        </div>

        <div
          className={cn(
            "h-px bg-border mx-3 transition-all duration-200",
            open ? "opacity-100" : "opacity-0"
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
              open ? "opacity-100" : "opacity-0"
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
