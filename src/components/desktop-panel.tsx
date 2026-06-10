"use client"

import { useWindowManager } from "@/lib/window-manager-context"
import { useDesktopMode } from "@/lib/desktop-mode-context"
import { DesktopWindow } from "@/components/desktop-window"
import { cn } from "@/lib/utils"

interface DesktopPanelProps {
  children: React.ReactNode
  className?: string
  sectionId?: string
}

export function DesktopPanel({ children, className, sectionId }: DesktopPanelProps) {
  const { isDesktop } = useDesktopMode()
  const { getWindow } = useWindowManager()

  if (!isDesktop) return <>{children}</>
  if (!sectionId) return null

  const win = getWindow(sectionId)
  if (!win) return null

  return (
    <DesktopWindow window={win} className={cn("flex flex-col", className)}>
      <div className="flex-1 p-0">
        {children}
      </div>
    </DesktopWindow>
  )
}
