"use client";

import { Dock, DockIcon } from "@/components/magicui/dock";
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
import { useDesktopMode } from "@/lib/desktop-mode-context";
import { DATA } from "@/data/resume";
import MiniPlayer from "@/components/mini-player";
import { Search, Monitor, LayoutGrid, Folder, Camera, Play, BookOpen, Music, Code, MessageCircle, Heart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useWindowManager, APPS } from "@/lib/window-manager-context";

export default function Navbar() {
  const { isDesktop, toggleDesktop, revealSection } = useDesktopMode();
  const [searchOpen, setSearchOpen] = useState(false);
  const { windows, openWindow, minimizeWindow, restoreWindow, focusWindow, isAppOpen } = useWindowManager();

  const handleAppClick = (app: typeof APPS[number]) => {
    const win = windows.find(w => w.appId === app.id);
    if (!win) {
      openWindow(app);
    } else if (win.minimized) {
      restoreWindow(win.id);
    } else {
      minimizeWindow(win.id);
    }
  };

  const APP_ICONS: Record<string, React.ElementType> = {
    hero: Folder,
    instagram: Camera,
    youtube: Play,
    reading: BookOpen,
    listening: Music,
    projects: Code,
    threads: MessageCircle,
    support: Heart,
  };

  return (
    <>
      {isDesktop && (
        <SearchExplorer open={searchOpen} onClose={() => setSearchOpen(false)} onReveal={(section) => { revealSection(section); const app = APPS.find(a => a.id === section); if (app) openWindow(app); setSearchOpen(false); }} />
      )}

      <div
        className={cn(
          "pointer-events-none fixed inset-x-0 bottom-4 z-30 transition-all duration-300",
          isDesktop && searchOpen
            ? "opacity-0 translate-y-2 pointer-events-none"
            : "opacity-100"
        )}
      >
        <Dock className="hidden lg:flex absolute left-4 z-50 pointer-events-auto h-14 p-2 w-fit gap-2 border bg-card/90 backdrop-blur-3xl shadow-[0_0_10px_3px] shadow-primary/5">
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
        </Dock>
        {isDesktop && (
          <Dock className="absolute right-4 z-50 pointer-events-auto h-14 p-2 w-fit flex gap-2 border bg-card/90 backdrop-blur-3xl shadow-[0_0_10px_3px] shadow-primary/5">
            <MiniPlayer />
          </Dock>
        )}
        <Dock className="z-50 pointer-events-auto relative h-14 p-2 w-fit mx-auto flex gap-2 border bg-card/90 backdrop-blur-3xl shadow-[0_0_10px_3px] shadow-primary/5">
          {DATA.navbar.map((item) => {
            const isExternal = item.href.startsWith("http");
            const isHome = item.href === "/" || item.label?.toLowerCase() === "home";

            if (isDesktop && isHome) {
              return (
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
              );
            }

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
                const win = windows.find(w => w.appId === app.id);
                const isOpen = !!win;
                const isMinimized = win?.minimized;
                return (
                  <Tooltip key={app.id}>
                    <TooltipTrigger asChild>
                      <button onClick={() => handleAppClick(app)} className="relative">
                        <DockIcon className="rounded-xl cursor-pointer size-full bg-background p-0 text-muted-foreground hover:text-foreground hover:bg-muted backdrop-blur-3xl border border-border transition-colors">
                          {IconComp && <IconComp className="size-full rounded-sm overflow-hidden object-contain" />}
                        </DockIcon>
                        {(isOpen) && (
                          <span className={cn(
                            "absolute -top-0.5 -right-0.5 size-2 rounded-full border border-background transition-colors",
                            isMinimized ? "bg-muted-foreground/40" : "bg-primary"
                          )} />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      sideOffset={8}
                      className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm shadow-xl"
                    >
                      <p>{app.title}{isMinimized ? " (minimized)" : ""}</p>
                      <TooltipArrow className="fill-primary" />
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </>
          )}
        <Separator
          orientation="vertical"
          className="h-2/3 m-auto w-px bg-border"
        />
        {Object.entries(DATA.contact.social)
          .filter(([_, social]) => social.navbar)
          .map(([name, social], index) => {
            const isExternal = social.url.startsWith("http");
            const IconComponent = social.icon;
            return (
              <Tooltip key={`social-${name}-${index}`}>
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
            );
          })}
        <Separator
          orientation="vertical"
          className="h-2/3 m-auto w-px bg-border"
        />
        <DockIcon className="rounded-xl cursor-pointer size-full bg-background p-0 text-muted-foreground hover:text-foreground hover:bg-muted backdrop-blur-3xl border border-border transition-colors">
          <CardStyleToggle />
        </DockIcon>
        <Separator
          orientation="vertical"
          className="h-2/3 m-auto w-px bg-border"
        />
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
            <p>Wallpaper</p>
            <TooltipArrow className="fill-primary" />
          </TooltipContent>
        </Tooltip>
      </Dock>
    </div>
    </>
  );
}
