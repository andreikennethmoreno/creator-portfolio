"use client";

import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { CONFIG } from "@/data/config";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { useCardStyle } from "@/lib/card-style-context";
import { WMCard } from "@/components/wm-card";
import MatrixRain from "@/components/matrix-rain";

const { bootLines: BOOT_LINES, prompt: PROMPT, commands: _baseCommands } = CONFIG.creator.terminal;
const COMMANDS: Record<string, string> = {
  ..._baseCommands,
  clear: "__CLEAR__",
  exit: "__EXIT__",
};

type HistoryEntry = { prompt: string; output: string | ReactNode };

export default function LinktreeLayout() {
  const { style } = useCardStyle();
  const isGlossy = style === "glossy";
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [matrixMode, setMatrixMode] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [booted, setBooted] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!terminalOpen) {
      setMatrixMode(false);
      return;
    }
    setBootLines([]);
    setBooted(false);
    setHistory([]);
    setInput("");

    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setBootLines((prev) => [...prev, BOOT_LINES[i]]);
        i++;
      } else {
        setBooted(true);
        clearInterval(interval);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [terminalOpen]);

  useEffect(() => {
    if (!matrixMode) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMatrixMode(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [matrixMode]);

  useEffect(() => {
    const el = bottomRef.current?.closest(".overflow-y-auto");
    if (el) el.scrollTop = el.scrollHeight;
  }, [history, bootLines]);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const cmd = input.trim().toLowerCase();
    if (!cmd) { setInput(""); return; }
    if (cmd === "clear") { setHistory([]); setInput(""); return; }
    if (cmd === "exit") { setInput(""); setTerminalOpen(false); return; }
    if (cmd === "matrix") { setMatrixMode(true); setInput(""); return; }
    const output = COMMANDS[cmd] ?? `command not found: ${cmd}. type 'help' for available commands.`;
    setHistory((prev) => [...prev, { prompt: cmd, output }]);
    setInput("");
  };

  return (
    <div className="lg:fixed lg:inset-0 lg:overflow-hidden flex flex-col items-center justify-center py-6 px-6">
      <div className="w-full max-w-sm relative">
        {/* ── NORMAL VIEW ── */}
        <div className={cn(
          "transition-all duration-500",
          terminalOpen ? "opacity-0 pointer-events-none absolute inset-0" : "opacity-100"
        )}>
          <div className="flex flex-col gap-4">
            <WMCard title="~/hello">
              <div className="flex items-center gap-4">
                <BlurFade delay={0.04} className="shrink-0">
                  <Avatar className="size-16 border rounded-xl shadow-lg ring-4 ring-muted">
                    <AvatarImage alt={CONFIG.name} src={CONFIG.avatarUrl} />
                    <AvatarFallback>{CONFIG.initials}</AvatarFallback>
                  </Avatar>
                </BlurFade>
                <div className="min-w-0">
                  <BlurFadeText
                    delay={0.04}
                    className="text-xl font-semibold tracking-tight"
                    yOffset={8}
                    text={CONFIG.name}
                  />
                  <BlurFade delay={0.08}>
                    <p className="text-sm text-foreground/80">
                      {CONFIG.description}
                    </p>
                  </BlurFade>
                </div>
              </div>
            </WMCard>

          <div className="flex flex-col gap-2.5">
            {CONFIG.linktree.links.map((key) => {
              const social = CONFIG.contact.social[key as keyof typeof CONFIG.contact.social];
              if (!social) return null;
              const IconComponent = social.icon;
              return (
                <a
                  key={key}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-3 w-full px-4 py-3 rounded-xl border transition-all hover:bg-card/60",
                    !isGlossy && "bg-card border-border",
                    isGlossy && [
                      "bg-card/80",
                      "backdrop-blur-[4px]",
                      "border-white/12",
                      "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]",
                    ],
                  )}
                >
                  <span className="flex items-center justify-center size-8 shrink-0 rounded-lg bg-background border border-border text-foreground/80">
                    <IconComponent className="size-4" />
                  </span>
                  <span className="flex-1 text-sm font-medium text-foreground/80">
                    {social.name}
                  </span>
                  <ArrowUpRight size={14} className="shrink-0 text-foreground/30" />
                </a>
              );
            })}
          </div>
          </div>
        </div>

        {/* ── TERMINAL OVERLAY ── */}
        <div className={cn(
          "transition-all duration-500 w-full",
          terminalOpen ? "opacity-100" : "opacity-0 pointer-events-none absolute inset-0"
        )}>
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs text-foreground/50">~/terminal</span>
            <button
              onClick={() => setTerminalOpen(false)}
              className="font-mono text-[11px] text-foreground/50 hover:text-foreground transition-colors"
            >
              [exit]
            </button>
          </div>
          <div
            className={cn(
              "font-mono text-sm cursor-text rounded-xl border border-border/50 bg-card/60 p-4",
              matrixMode ? "overflow-hidden" : "overflow-y-auto max-h-[60vh]",
            )}
            onClick={() => !matrixMode && inputRef.current?.focus()}
          >
            {matrixMode ? (
              <div className="w-full h-[300px]">
                <MatrixRain />
              </div>
            ) : (
              <>
                {bootLines.map((line, i) => (
                  <div
                    key={i}
                    className={
                      line?.startsWith(">")
                        ? "text-primary-foreground"
                        : line === ""
                        ? "h-2"
                        : "text-muted-foreground"
                    }
                  >
                    {line}
                  </div>
                ))}
                {booted && history.map((entry, i) => (
                  <div key={i} className="mt-1">
                    <div>
                      <span className="text-primary-foreground">{PROMPT}</span>
                      <span className="text-foreground">{entry.prompt}</span>
                    </div>
                    {typeof entry.output === "string" ? (
                      <div className="text-muted-foreground pl-2 whitespace-pre-wrap">{entry.output}</div>
                    ) : (
                      <div className="pl-2">{entry.output}</div>
                    )}
                  </div>
                ))}
                {booted && (
                  <div className="flex items-center gap-0 mt-1">
                    <span className="text-primary-foreground shrink-0">{PROMPT}</span>
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleCommand}
                      className="bg-transparent outline-none flex-1 text-foreground caret-foreground min-w-0"
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </div>
                )}
                <div ref={bottomRef} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
