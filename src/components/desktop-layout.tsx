"use client"

import { useEffect } from "react"
import { useDesktopMode } from "@/lib/desktop-mode-context"
import { useWindowManager, APPS } from "@/lib/window-manager-context"
import { cn } from "@/lib/utils"

export function DesktopLayout({ children }: { children: React.ReactNode }) {
  const { isDesktop, revealedSection, revealSection } = useDesktopMode()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && revealedSection) {
        revealSection(null)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [revealedSection, revealSection])

  if (!isDesktop) return <>{children}</>

  return (
    <div className="hidden lg:block fixed inset-0 z-10">
      <div className="relative size-full">
        {children}
      </div>
    </div>
  )
}
