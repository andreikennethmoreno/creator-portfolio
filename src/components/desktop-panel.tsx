"use client"

import { useDesktopMode } from "@/lib/desktop-mode-context"
import { cn } from "@/lib/utils"

interface DesktopPanelProps {
  children: React.ReactNode
  className?: string
}

export function DesktopPanel({ children, className }: DesktopPanelProps) {
  const { isDesktop } = useDesktopMode()

  return (
    <div
      className={cn(
        isDesktop
          ? "overflow-auto rounded-xl border border-border/50 bg-background/60 backdrop-blur-md"
          : "contents",
        className
      )}
    >
      {children}
    </div>
  )
}
