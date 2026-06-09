"use client"

import { useDesktopMode } from "@/lib/desktop-mode-context"
import { cn } from "@/lib/utils"

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const { isDesktop } = useDesktopMode()

  return (
    <div
      className={cn(
        "relative z-10",
        isDesktop
          ? "opacity-0 pointer-events-none"
          : "max-w-2xl mx-auto py-12 pb-24 sm:py-24 px-6"
      )}
    >
      {children}
    </div>
  )
}
