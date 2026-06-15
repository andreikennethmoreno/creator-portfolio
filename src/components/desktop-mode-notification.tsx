"use client"

import { Monitor, X } from "lucide-react"
import { useDesktopMode } from "@/lib/desktop-mode-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CONFIG } from "@/data/config"
import { useEffect, useState } from "react"

const LS_KEY = "desktop-mode-notification-dismissed"

export function DesktopModeNotification() {
  const { isDesktop, toggleDesktop } = useDesktopMode()
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    if (window.location.search.includes("showDesktop")) {
      setDismissed(false)
      return
    }
    const val = localStorage.getItem(LS_KEY)
    if (!val) setDismissed(false)
  }, [])

  const dismiss = () => {
    setDismissed(true)
    localStorage.setItem(LS_KEY, "true")
  }

  if (!CONFIG.creator.showDesktopModeNotification || isDesktop || dismissed) return null

  return (
    <div className="hidden lg:block fixed bottom-20 left-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative w-64 rounded-xl border bg-background shadow-xl">
        <div className="p-4 pb-3">
          <button
            onClick={dismiss}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={14} />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center justify-center size-7 rounded-lg bg-primary/10 text-primary">
              <Monitor size={14} />
            </span>
            <span className="text-sm font-medium">Desktop Mode</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Transform this page into a virtual desktop with draggable windows,
            multiple screens, and a window manager.
          </p>
        </div>
        <div className="flex gap-2 px-4 pb-4">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 h-8 text-xs font-mono"
            onClick={() => { toggleDesktop(); dismiss() }}
          >
            Try it
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-8 text-xs font-mono text-muted-foreground"
            onClick={dismiss}
          >
            Later
          </Button>
        </div>
      </div>
    </div>
  )
}
