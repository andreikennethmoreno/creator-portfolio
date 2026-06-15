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
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useWindowManager, APPS } from "@/lib/window-manager-context";

export default function Navbar() {
  const { isDesktop, toggleDesktop, revealSection } = useDesktopMode();
  const [searchOpen, setSearchOpen] = useState(false);
  const [hoverZone, setHoverZone] = useState<
    "left" | "center" | "right" | null
  >(null);
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

  const APP_ICONS: Record<string, React.ElementType> = {
    hero: Folder,
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
              className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm shadow-xl"
            >
              <p>{isDesktop ? "exit desktop mode" : "desktop mode"}</p>
              <TooltipArrow className="fill-primary" />
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
                    className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm shadow-xl"
                  >
                    <p>Screen {screenIndex + 1}</p>
                    <TooltipArrow className="fill-primary" />
                  </TooltipContent>
                </Tooltip>
              ))}
            </>
          )}
        </Dock>
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
                className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm shadow-xl"
              >
                <p>Search</p>
                <TooltipArrow className="fill-primary" />
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
                    className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm shadow-xl"
                  >
                    <p>{item.label}</p>
                    <TooltipArrow className="fill-primary" />
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
              {APPS.map((app) => {
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
                      className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm shadow-xl"
                    >
                      <p>
                        {app.title}
                        {isMinimized ? " (minimized)" : ""}
                      </p>
                      <TooltipArrow className="fill-primary" />
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </>
          )}
          {CONFIG.creator.dock.socials.length > 0 && (
            <>
              <Separator
                orientation="vertical"
                className="h-2/3 m-auto w-px bg-border"
              />
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
                      className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm shadow-xl"
                    >
                      <p>{name}</p>
                      <TooltipArrow className="fill-primary" />
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
                className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm shadow-xl"
              >
                <p>card style</p>
                <TooltipArrow className="fill-primary" />
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
                className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm shadow-xl"
              >
                <p>change theme</p>
                <TooltipArrow className="fill-primary" />
              </TooltipContent>
            </Tooltip>
          )}
        </Dock>
      </div>
    </>
  );
}
