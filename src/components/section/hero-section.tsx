/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { WMCard } from "@/components/wm-card";
import { useCardWindow } from "@/lib/card-window-context";
import { cn } from "@/lib/utils";
import { CONFIG } from "@/data/config";
import MatrixRain from "@/components/matrix-rain";

const { bootLines: BOOT_LINES, prompt: PROMPT, commands: _baseCommands } = CONFIG.creator.terminal;
const COMMANDS: Record<string, string> = {
  ..._baseCommands,
  clear: "__CLEAR__",
  exit: "__EXIT__",
};

type HistoryEntry = { prompt: string; output: string | ReactNode };

export default function HeroSection() {
  const { isWindow } = useCardWindow();
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [matrixMode, setMatrixMode] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [booted, setBooted] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Reset + run boot sequence whenever terminal opens
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

    if (cmd === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    if (cmd === "exit") {
      setInput("");
      setTerminalOpen(false);
      return;
    }

    if (cmd === "matrix") {
      setMatrixMode(true);
      setInput("");
      return;
    }

    const output = COMMANDS[cmd] ?? `command not found: ${cmd}. type 'help' for available commands.`;
    setHistory((prev) => [...prev, { prompt: cmd, output }]);
    setInput("");
  };

  return (
    <section id="hero" onClick={!terminalOpen ? () => setTerminalOpen(true) : undefined}>
      <WMCard
        title={terminalOpen ? (matrixMode ? "~/hello — matrix" : "~/hello — terminal") : "~/hello"}
        rightSlot={terminalOpen ? (
          <button
            onClick={(e) => { e.stopPropagation(); setTerminalOpen(false); }}
            className="font-mono text-[11px] text-foreground/50 hover:text-foreground transition-colors leading-none"
          >
            [exit]
          </button>
        ) : undefined}
      >
        <div className={cn("relative", isWindow && terminalOpen ? "h-full" : "min-h-[120px]")}>

          {/* ── NORMAL MODE ── */}
          <div
            className={`transition-all duration-500 ${
              terminalOpen ? "opacity-0 pointer-events-none absolute inset-0" : "opacity-100"
            }`}
          >
            <div className="flex items-center gap-5">
              <BlurFade delay={0.04} className="shrink-0">
                <Avatar className="size-24 md:size-32 border rounded-xl shadow-lg ring-4 ring-muted">
                  <AvatarImage alt={CONFIG.name} src={CONFIG.avatarUrl} />
                  <AvatarFallback>{CONFIG.initials}</AvatarFallback>
                </Avatar>
              </BlurFade>
              <div className="flex flex-col gap-1 min-w-0">
                <BlurFadeText
                  delay={0.04}
                  className="text-3xl font-semibold tracking-tighter sm:text-4xl lg:text-5xl"
                  yOffset={8}
                  text={`Hi, I'm ${CONFIG.name.split(" ")[0]}`}
                />
                <BlurFade delay={0.08}>
                  <p className="text-muted-foreground max-w-150 md:text-lg lg:text-xl">
                    {CONFIG.description}
                    <button
                      onClick={() => setTerminalOpen(true)}
                      className="inline-flex items-center gap-1 ml-2 px-2 py-0 rounded font-mono text-xs dark:bg-primary dark:text-primary-foreground bg-primary/15 text-primary-foreground hover:dark:bg-primary/80 hover:bg-primary/30 transition-colors cursor-pointer animate-pulse leading-none align-middle"
                    >
                      <span>$</span>
                      <span>click me</span>
                      <span className="inline-block w-1.5 h-3 dark:bg-primary-foreground bg-primary-foreground animate-pulse" />
                    </button>
                  </p>
                </BlurFade>
              </div>
            </div>
          </div>

          {/* ── TERMINAL MODE ── */}
          <div
            className={`transition-all duration-500 ${
              terminalOpen ? "opacity-100" : "opacity-0 pointer-events-none absolute inset-0"
            }`}
          >
            {/* Terminal body */}
            <div
              className={cn(
                "font-mono text-sm cursor-text [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full",
                matrixMode ? "overflow-hidden" : "overflow-y-auto",
                isWindow && terminalOpen ? "h-full" : "min-h-[160px] max-h-[260px]"
              )}
              onClick={() => !matrixMode && inputRef.current?.focus()}
            >
              {matrixMode ? (
                <div className="w-full h-full min-h-[160px]">
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
      </WMCard>
    </section>
  );
}
