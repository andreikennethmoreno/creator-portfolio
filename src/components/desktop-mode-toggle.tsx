"use client"

import { Monitor, LayoutGrid, ArrowRight } from "lucide-react"
import { useDesktopMode } from "@/lib/desktop-mode-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function DesktopModeToggle() {
  const { isDesktop, toggleDesktop } = useDesktopMode()

  return (
    <div className="hidden lg:flex fixed top-4 right-4 z-50 items-center gap-3">
      {!isDesktop && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-background/80 backdrop-blur-sm text-xs font-mono text-foreground shadow-sm animate-in fade-in slide-in-from-right-4 duration-500">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          desktop mode
          <ArrowRight size={12} className="text-primary -mr-1" />
        </div>
      )}
      <Button
        onClick={toggleDesktop}
        variant="ghost"
        size="sm"
        className={cn(
          "rounded-full font-mono text-xs gap-2 px-3 py-1.5 h-auto backdrop-blur-md border transition-all duration-200",
          isDesktop
            ? "bg-primary/20 border-primary/40 text-primary hover:bg-primary/30"
            : "bg-background/60 border-border text-muted-foreground hover:text-foreground"
        )}
      >
        {isDesktop ? <Monitor size={13} /> : <LayoutGrid size={13} />}
        {isDesktop ? "exit desktop" : "desktop mode"}
      </Button>
    </div>
  )
}
