/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { WMCard } from "@/components/wm-card";
import { DATA } from "@/data/resume";

const BOOT_LINES = [
  "booting kenroms.dev...",
  "loading modules... done.",
  "establishing connection... ok",
  "> whoami",
  "kenroms — software engineer, content creator",
  "> location",
  "Philippines 🇵🇭",
  "> status",
  "very active on YouTube and Threads",
  "",
  "type 'help' for available commands.",
];

const PROMPT = "visitor@kenroms.dev:~$ ";

const COMMANDS: Record<string, string> = {
  whoami: "kenroms — software engineer, content creator",
  location: "Philippines 🇵🇭",
  status: "very active on YouTube and Threads",
  contact: "kennonirom@gmail.com",
  links: "youtube: @kenroms  |  threads: @ken.roms  |  github: kenroms",
  help: "available commands: whoami, location, status, contact, links, clear, exit",
  clear: "__CLEAR__",
  exit: "__EXIT__",
};

type HistoryEntry = { prompt: string; output: string };

export default function HeroSection() {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [booted, setBooted] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Reset + run boot sequence whenever terminal opens
  useEffect(() => {
    if (!terminalOpen) return;
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

    const output = COMMANDS[cmd] ?? `command not found: ${cmd}. type 'help' for available commands.`;
    setHistory((prev) => [...prev, { prompt: cmd, output }]);
    setInput("");
  };

  return (
    <section id="hero">
      <WMCard
        title={terminalOpen ? "~/hello — terminal" : "~/hello"}
        rightSlot={terminalOpen ? (
          <button
            onClick={(e) => { e.stopPropagation(); setTerminalOpen(false); }}
            className="font-mono text-[11px] text-foreground/50 hover:text-foreground transition-colors leading-none"
          >
            [exit]
          </button>
        ) : undefined}
      >
        <div className="relative min-h-[120px]">

          {/* ── NORMAL MODE ── */}
          <div
            className={`transition-all duration-500 ${
              terminalOpen ? "opacity-0 pointer-events-none absolute inset-0" : "opacity-100"
            }`}
          >
            <div className="flex items-center gap-5">
              <BlurFade delay={0.04} className="shrink-0">
                <Avatar className="size-24 md:size-32 border rounded-xl shadow-lg ring-4 ring-muted">
                  <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                  <AvatarFallback>{DATA.initials}</AvatarFallback>
                </Avatar>
              </BlurFade>
              <div className="flex flex-col gap-1 min-w-0">
                <BlurFadeText
                  delay={0.04}
                  className="text-3xl font-semibold tracking-tighter sm:text-4xl lg:text-5xl"
                  yOffset={8}
                  text={`Hi, I'm ${DATA.name.split(" ")[0]}`}
                />
                <BlurFade delay={0.08}>
                  <p className="text-muted-foreground max-w-150 md:text-lg lg:text-xl">
                    {DATA.description}
                    <button
                      onClick={() => setTerminalOpen(true)}
                      className="inline-flex items-center gap-1 ml-2 px-2 py-0 rounded font-mono text-xs bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-colors cursor-pointer animate-pulse hover:animate-none leading-none align-middle"
                    >
                      <span>$</span>
                      <span>click me</span>
                      <span className="inline-block w-1.5 h-3 bg-primary animate-pulse" />
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
              className="font-mono text-sm min-h-[160px] max-h-[260px] overflow-y-auto cursor-text [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full"
              onClick={() => inputRef.current?.focus()}
            >
                {bootLines.map((line, i) => (
                  <div
                    key={i}
                    className={
                      line?.startsWith(">")
                        ? "text-primary"
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
                      <span className="text-primary">{PROMPT}</span>
                      <span className="text-foreground">{entry.prompt}</span>
                    </div>
                    <div className="text-muted-foreground pl-2 whitespace-pre-wrap">{entry.output}</div>
                  </div>
                ))}

                {booted && (
                  <div className="flex items-center gap-0 mt-1">
                    <span className="text-primary shrink-0">{PROMPT}</span>
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleCommand}
                      className="bg-transparent outline-none flex-1 text-foreground caret-primary min-w-0"
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </div>
                )}

                <div ref={bottomRef} />
              </div>
          </div>

        </div>
      </WMCard>
    </section>
  );
}
