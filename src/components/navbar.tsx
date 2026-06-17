"use client";

import { Dock, DockIcon } from "@/components/magicui/dock";
import { TopPanel } from "@/components/top-panel";
import { CardStyleToggle } from "@/components/card-style-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchExplorer } from "@/components/search-explorer";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DesktopModeNotification } from "@/components/desktop-mode-notification";
import { ThemeToggleNotification } from "@/components/theme-toggle-notification";
import { useDesktopMode } from "@/lib/desktop-mode-context";
import { CONFIG } from "@/data/config";
import MiniPlayer from "@/components/mini-player";
import {
  Search,
  Monitor,
  LayoutGrid,
  Folder,
  Camera,
  Play,
  BookOpen,
  Music,
  Code,
  MessageCircle,
  Heart,
  User,
  Briefcase,
  GraduationCap,
  Star,
  Download,
  Settings,
  X,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useWindowManager, APPS } from "@/lib/window-manager-context";
import { useWallpaper } from "@/lib/wallpaper-context";
import { useCardStyle } from "@/lib/card-style-context";
import { rippleTransition } from "@/lib/view-transition";

export default function Navbar() {
  const { isDesktop, toggleDesktop, revealSection } = useDesktopMode();
  const [searchOpen, setSearchOpen] = useState(false);
  const [hoverZone, setHoverZone] = useState<
    "left" | "center" | "right" | null
  >(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { wallpaper, setWallpaper } = useWallpaper();
  const { style, toggle: toggleStyle } = useCardStyle();
  const [activeMode, setActiveMode] = useState(CONFIG.mode);
  useEffect(() => {
    const params = new URL(window.location.href).searchParams;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveMode((params.get("mode") ?? CONFIG.mode) as (typeof MODES)[number])
  }, []);
  const MODES = ["dev", "creator", "custom", "linktree"] as const;
  const {
    windows,
    openWindow,
    minimizeWindow,
    restoreWindow,
    focusWindow,
    isAppOpen,
    activeScreen,
    setActiveScreen,
    screenWindows,
    hasMaximizedWindow,
  } = useWindowManager();

  const [isSmallScreen, setIsSmallScreen] = useState(true);

  useEffect(() => {
    const check = () => setIsSmallScreen(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [panelTrigger, setPanelTrigger] = useState(0);

  const visibleWindowCount = windows.filter((w) => !w.minimized).length;
  const dockersHidden =
    isDesktop && (hasMaximizedWindow || visibleWindowCount >= 2);
  const isLeftVisible = !dockersHidden || hoverZone === "left";
  const isCenterVisible = !dockersHidden || hoverZone === "center";
  const isRightVisible = !dockersHidden || hoverZone === "right";

  useEffect(() => {
    if (!dockersHidden) {
      setHoverZone(null);
      return;
    }

    const THRESHOLD = 100;

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY >= window.innerHeight - THRESHOLD) {
        const w = window.innerWidth;
        if (e.clientX < w * 0.25) setHoverZone("left");
        else if (e.clientX > w * 0.75) setHoverZone("right");
        else setHoverZone("center");
      } else {
        setHoverZone(null);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [dockersHidden]);

  const handleAppClick = (app: (typeof APPS)[number]) => {
    openWindow(app);
  };

  const SECTION_FILTER: Record<string, keyof typeof CONFIG.creator.sections | null> = {
    instagram: "instagram",
    youtube: "youtube",
    reading: "hardcover",
    listening: "lastfm",
    vercel: "vercel",
    support: "kofi",
  };

  const modeAppIds = (CONFIG.modeApps as Record<string, readonly string[]>)[activeMode] ?? CONFIG.modeApps.creator;
  const availableApps = APPS.filter((app) => {
    if (!modeAppIds.includes(app.id)) return false;
    const section = SECTION_FILTER[app.id];
    if (section && !CONFIG.creator.sections[section]) return false;
    return true;
  });

  const APP_ICONS: Record<string, React.ElementType> = {
    hero: User,
    about: Star,
    experience: Briefcase,
    education: GraduationCap,
    projects: Folder,
    resume: Download,
    instagram: Camera,
    youtube: Play,
    reading: BookOpen,
    listening: Music,
    vercel: Code,
    twitter: MessageCircle,
    support: Heart,
  };

  return (
    <>
      {isDesktop && (
        <SearchExplorer
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          onReveal={(section) => {
            revealSection(section);
            const app = APPS.find((a) => a.id === section);
            if (app) openWindow(app);
            setSearchOpen(false);
          }}
        />
      )}
      {isDesktop && <TopPanel panelTrigger={panelTrigger} />}

      <DesktopModeNotification />
      <ThemeToggleNotification />

      <div
        className={cn(
          "pointer-events-none fixed inset-x-0 bottom-4 z-30 transition-all duration-300",
          isDesktop && searchOpen
            ? "opacity-0 translate-y-2 pointer-events-none"
            : "opacity-100",
        )}
      >
        {activeMode !== "linktree" && (
        <Dock
          className={cn(
            "hidden lg:flex absolute left-4 z-50 h-14 p-2 w-fit gap-2 border border-primary/15 bg-card/90 backdrop-blur-3xl shadow-[0_0_15px_5px] shadow-primary/15 transition-all duration-300",
            dockersHidden && !isLeftVisible
              ? "translate-y-[100px] opacity-0 pointer-events-none"
              : "translate-y-0 opacity-100 pointer-events-auto",
          )}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={toggleDesktop}>
                <DockIcon className="rounded-xl cursor-pointer size-full bg-background p-0 text-muted-foreground hover:text-foreground hover:bg-muted backdrop-blur-3xl border border-border transition-colors">
                  {isDesktop ? <Monitor size={14} /> : <LayoutGrid size={14} />}
                </DockIcon>
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              sideOffset={8}
              className="rounded-xl bg-foreground text-background px-4 py-2 text-sm shadow-xl"
            >
              <p>{isDesktop ? "exit desktop mode" : "desktop mode"}</p>
              <TooltipArrow className="fill-foreground" />
            </TooltipContent>
          </Tooltip>
          {isDesktop && (
            <>
              <Separator
                orientation="vertical"
                className="h-2/3 m-auto w-px bg-border"
              />
              {[0, 1, 2].map((screenIndex) => (
                <Tooltip key={`screen-${screenIndex}`}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setActiveScreen(screenIndex)}
                      className="relative"
                    >
                      <DockIcon
                        className={cn(
                          "rounded-xl cursor-pointer size-full bg-background p-0 text-muted-foreground hover:text-foreground hover:bg-muted backdrop-blur-3xl border border-border transition-colors font-mono text-xs",
                          activeScreen === screenIndex &&
                            "text-foreground bg-muted",
                        )}
                      >
                        {screenIndex + 1}
                      </DockIcon>
                      {screenWindows[screenIndex].length > 0 && (
                        <span
                          className={cn(
                            "absolute -top-0.5 -right-0.5 size-2 rounded-full border border-background transition-colors",
                            activeScreen === screenIndex
                              ? "bg-primary"
                              : "bg-muted-foreground/40",
                          )}
                        />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    sideOffset={8}
                    className="rounded-xl bg-foreground text-background px-4 py-2 text-sm shadow-xl"
                  >
                    <p>Screen {screenIndex + 1}</p>
                    <TooltipArrow className="fill-foreground" />
                  </TooltipContent>
                </Tooltip>
              ))}
            </>
          )}
        </Dock>
        )}
        {isDesktop && (
          <div
            className={cn(
              "absolute right-4 z-50 border border-primary/20 bg-background/90 backdrop-blur-3xl shadow-[0_0_15px_5px] shadow-primary/20 rounded-xl transition-all duration-300 cursor-pointer",
              dockersHidden && !isRightVisible
                ? "translate-y-[100px] opacity-0 pointer-events-none"
                : "translate-y-0 opacity-100 pointer-events-auto",
            )}
            onClick={() => setPanelTrigger(p => p + 1)}
          >
            <MiniPlayer />
          </div>
        )}
        <Dock
          disableMagnification={isSmallScreen}
          className={cn(
            "z-50 relative h-14 p-2 w-fit mx-auto flex gap-2 border border-l-0 lg:border-l border-primary/15 bg-card/90 backdrop-blur-3xl shadow-[0_0_15px_5px] shadow-primary/15 transition-all duration-300",
            dockersHidden && !isCenterVisible
              ? "translate-y-[100px] opacity-0 pointer-events-none"
              : "translate-y-0 opacity-100 pointer-events-auto",
          )}
        >
          {/* Renders Search Icon only in desktop mode */}
          {isDesktop && CONFIG.creator.dock.search && (
            <Tooltip key="search-trigger">
              <TooltipTrigger asChild>
                <button onClick={() => setSearchOpen(true)}>
                  <DockIcon className="rounded-xl cursor-pointer size-full bg-background p-0 text-muted-foreground hover:text-foreground hover:bg-muted backdrop-blur-3xl border border-border transition-colors">
                    <Search className="size-full rounded-sm overflow-hidden object-contain" />
                  </DockIcon>
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                sideOffset={8}
                className="rounded-xl bg-foreground text-background px-4 py-2 text-sm shadow-xl"
              >
                <p>Search</p>
                <TooltipArrow className="fill-foreground" />
              </TooltipContent>
            </Tooltip>
          )}

          {/* Renders other navbar items (skips anything labeled "home" or with "/" href completely) */}
          {CONFIG.creator.navbar
            .filter(
              (item) =>
                item.href !== "/" && item.label?.toLowerCase() !== "home",
            )
            .map((item) => {
              const isExternal = item.href.startsWith("http");

              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <a
                      href={item.href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                    >
                      <DockIcon className="rounded-xl cursor-pointer size-full bg-background p-0 text-muted-foreground hover:text-foreground hover:bg-muted backdrop-blur-3xl border border-border transition-colors">
                        <item.icon className="size-full rounded-sm overflow-hidden object-contain" />
                      </DockIcon>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    sideOffset={8}
                    className="rounded-xl bg-foreground text-background px-4 py-2 text-sm shadow-xl"
                  >
                    <p>{item.label}</p>
                    <TooltipArrow className="fill-foreground" />
                  </TooltipContent>
                </Tooltip>
              );
            })}
          {isDesktop && (
            <>
              <Separator
                orientation="vertical"
                className="h-2/3 m-auto w-px bg-border"
              />
              {availableApps.map((app) => {
                const IconComp = APP_ICONS[app.id];
                const win = windows.find((w) => w.appId === app.id);
                const isOpen = !!win;
                const isMinimized = win?.minimized;
                return (
                  <Tooltip key={app.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleAppClick(app)}
                        className="relative"
                      >
                        <DockIcon className="rounded-xl cursor-pointer size-full bg-background p-0 text-muted-foreground hover:text-foreground hover:bg-muted backdrop-blur-3xl border border-border transition-colors">
                          {IconComp && (
                            <IconComp className="size-full rounded-sm overflow-hidden object-contain" />
                          )}
                        </DockIcon>
                        {isOpen && (
                          <span
                            className={cn(
                              "absolute -top-0.5 -right-0.5 size-2 rounded-full border border-background transition-colors",
                              isMinimized
                                ? "bg-muted-foreground/40"
                                : "bg-primary",
                            )}
                          />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      sideOffset={8}
                      className="rounded-xl bg-foreground text-background px-4 py-2 text-sm shadow-xl"
                    >
                      <p>
                        {app.title}
                        {isMinimized ? " (minimized)" : ""}
                      </p>
                      <TooltipArrow className="fill-foreground" />
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </>
          )}
          {!isDesktop && CONFIG.creator.dock.socials.length > 0 && (
            <>
              {CONFIG.creator.dock.socials.map((name) => {
                const social = CONFIG.contact.social[name as keyof typeof CONFIG.contact.social]
                const isExternal = social.url.startsWith("http");
                const IconComponent = social.icon;
                return (
                  <Tooltip key={`social-${name}`}>
                    <TooltipTrigger asChild>
                      <a
                        href={social.url}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                      >
                        <DockIcon className="rounded-xl cursor-pointer size-full bg-background p-0 text-muted-foreground hover:text-foreground hover:bg-muted backdrop-blur-3xl border border-border transition-colors">
                          <IconComponent className="size-full rounded-sm overflow-hidden object-contain" />
                        </DockIcon>
                      </a>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      sideOffset={8}
                      className="rounded-xl bg-foreground text-background px-4 py-2 text-sm shadow-xl"
                    >
                      <p>{name}</p>
                      <TooltipArrow className="fill-foreground" />
                    </TooltipContent>
                  </Tooltip>
                )
              })}
              <Separator
                orientation="vertical"
                className="h-2/3 m-auto w-px bg-border"
              />
            </>
          )}
          {!isDesktop && CONFIG.general.debugSettings && (
            <div className="relative">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setSettingsOpen((p) => !p)}
                    className="size-full"
                  >
                    <DockIcon className="rounded-xl cursor-pointer size-full bg-background p-0 text-muted-foreground hover:text-foreground hover:bg-muted backdrop-blur-3xl border border-border transition-colors">
                      <Settings className="size-full rounded-sm overflow-hidden object-contain" />
                    </DockIcon>
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  sideOffset={8}
                  className="rounded-xl bg-foreground text-background px-4 py-2 text-sm shadow-xl"
                >
                  <p>debug settings</p>
                  <TooltipArrow className="fill-foreground" />
                </TooltipContent>
              </Tooltip>

              {settingsOpen && (
                <div
                  className={cn(
                    "absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-56 rounded-xl border p-3 space-y-3 shadow-lg z-50",
                    "bg-card/90 backdrop-blur-3xl border-primary/15",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] tracking-wide text-foreground/50 uppercase">
                      Debug Settings
                    </span>
                    <button onClick={() => setSettingsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      <X className="size-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Mode</p>
                    <div className="flex flex-wrap gap-1">
                      {MODES.map((m) => (
                        <button
                          key={m}
                          onClick={() => {
                            const url = new URL(window.location.href);
                            if (m === activeMode && url.searchParams.get("mode")) url.searchParams.delete("mode");
                            else url.searchParams.set("mode", m);
                            window.location.href = url.toString();
                          }}
                          className={cn(
                            "font-mono text-[11px] px-2 py-1 rounded-md border transition-colors cursor-pointer",
                            activeMode === m
                              ? "bg-primary/20 border-primary/40 text-foreground"
                              : "bg-muted border-border text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Card Style</p>
                    <div className="flex gap-1">
                      {(["default", "glossy"] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => { if (style !== s) toggleStyle() }}
                          className={cn(
                            "font-mono text-[11px] px-2 py-1 rounded-md border transition-colors cursor-pointer",
                            style === s
                              ? "bg-primary/20 border-primary/40 text-foreground"
                              : "bg-muted border-border text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Wallpaper</p>
                    <div className="flex flex-wrap gap-1">
                      {CONFIG.general.wallpapers.map((w) => (
                        <button
                          key={w.name}
                          onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = rect.left + rect.width / 2;
                            const y = rect.top + rect.height / 2;
                            rippleTransition(x, y, () => setWallpaper(w.url));
                          }}
                          className={cn(
                            "size-5 rounded-full border-2 transition-all cursor-pointer shrink-0",
                            wallpaper === w.url
                              ? "border-primary scale-110"
                              : "border-border/40 hover:border-foreground/30",
                          )}
                          style={{
                            backgroundImage: `url(${w.url})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                          title={w.label}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {CONFIG.creator.dock.cardStyleToggle && (
            <Tooltip>
              <TooltipTrigger asChild>
                <DockIcon className="rounded-xl cursor-pointer size-full bg-background p-0 text-muted-foreground hover:text-foreground hover:bg-muted backdrop-blur-3xl border border-border transition-colors">
                  <CardStyleToggle />
                </DockIcon>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                sideOffset={8}
                className="rounded-xl bg-foreground text-background px-4 py-2 text-sm shadow-xl"
              >
                <p>card style</p>
                <TooltipArrow className="fill-foreground" />
              </TooltipContent>
            </Tooltip>
          )}
          {CONFIG.creator.dock.themeToggle && (
            <Tooltip>
              <TooltipTrigger asChild>
                <DockIcon className="rounded-xl cursor-pointer size-full bg-background p-0 text-muted-foreground hover:text-foreground hover:bg-muted backdrop-blur-3xl border border-border transition-colors">
                  <ThemeToggle className="size-full cursor-pointer" />
                </DockIcon>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                sideOffset={8}
                className="rounded-xl bg-foreground text-background px-4 py-2 text-sm shadow-xl"
              >
                <p>change theme</p>
                <TooltipArrow className="fill-foreground" />
              </TooltipContent>
            </Tooltip>
          )}
        </Dock>
      </div>
    </>
  );
}
