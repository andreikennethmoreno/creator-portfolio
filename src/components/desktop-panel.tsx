"use client"

import { useWindowManager } from "@/lib/window-manager-context"
import { useDesktopMode } from "@/lib/desktop-mode-context"
import { CardWindowContext } from "@/lib/card-window-context"

interface DesktopPanelProps {
  children: React.ReactNode
  className?: string
  sectionId?: string
}

export function DesktopPanel({ children, sectionId }: DesktopPanelProps) {
  const { isDesktop } = useDesktopMode()
  const { getWindow, focusWindow, closeWindow, minimizeWindow, moveWindow, resizeWindow } = useWindowManager()

  if (!isDesktop) return <>{children}</>
  if (!sectionId) return null

  const win = getWindow(sectionId)
  if (!win) return null

  return (
    <CardWindowContext.Provider
      value={{
        isWindow: true,
        win,
        onClose: () => closeWindow(win.id),
        onMinimize: () => minimizeWindow(win.id),
        onMove: (x: number, y: number) => moveWindow(win.id, x, y),
        onResize: (w: number, h: number) => resizeWindow(win.id, w, h),
      }}
    >
      <div onClick={() => focusWindow(win.id)}>
        {children}
      </div>
    </CardWindowContext.Provider>
  )
}
