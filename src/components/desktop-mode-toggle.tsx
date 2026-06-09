"use client"

import { Monitor, LayoutGrid } from "lucide-react"
import { useDesktopMode } from "@/lib/desktop-mode-context"
import { cn } from "@/lib/utils"

export function DesktopModeToggle() {
  const { isDesktop, toggleDesktop } = useDesktopMode()

  return (
    <button
      onClick={toggleDesktop}
      className={cn(
        "hidden lg:flex fixed top-4 right-4 z-50",
        "items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono",
        "backdrop-blur-md border transition-all duration-200",
        isDesktop
          ? "bg-primary/20 border-primary/40 text-primary"
          : "bg-background/60 border-border text-muted-foreground hover:text-foreground"
      )}
    >
      {isDesktop ? <Monitor size={13} /> : <LayoutGrid size={13} />}
      {isDesktop ? "exit desktop" : "desktop mode"}
    </button>
  )
}
