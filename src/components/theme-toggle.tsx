"use client"

import { useCallback, useRef } from "react"
import { Image } from "lucide-react"
import { flushSync } from "react-dom"
import { cn } from "@/lib/utils"
import { useWallpaper } from "@/lib/wallpaper-context"

interface ThemeToggleProps extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number
  fromCenter?: boolean
}

export const ThemeToggle = ({
  className,
  duration = 700,
  fromCenter = false,
  ...props
}: ThemeToggleProps) => {
  const { cycleWallpaper } = useWallpaper()
  const buttonRef = useRef<HTMLButtonElement>(null)

  const toggleWallpaper = useCallback(() => {
    const button = buttonRef.current
    if (!button) return

    const viewportWidth = window.visualViewport?.width ?? window.innerWidth
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight

    let x: number
    let y: number
    if (fromCenter) {
      x = viewportWidth / 2
      y = viewportHeight / 2
    } else {
      const { top, left, width, height } = button.getBoundingClientRect()
      x = left + width / 2
      y = top + height / 2
    }

    const maxRadius = Math.hypot(
      Math.max(x, viewportWidth - x),
      Math.max(y, viewportHeight - y)
    )

    const clipPath: [string, string] = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${maxRadius}px at ${x}px ${y}px)`,
    ]

    if (typeof document.startViewTransition !== "function") {
      cycleWallpaper()
      return
    }

    const root = document.documentElement
    root.style.setProperty("--magicui-theme-vt-clip-from", clipPath[0])
    const cleanup = () => {
      root.style.removeProperty("--magicui-theme-vt-clip-from")
    }

    const transition = document.startViewTransition(() => {
      flushSync(() => cycleWallpaper())
    })

    if (typeof transition?.finished?.finally === "function") {
      transition.finished.finally(cleanup)
    } else {
      cleanup()
    }

    const ready = transition?.ready
    if (ready && typeof ready.then === "function") {
      ready.then(() => {
        document.documentElement.animate(
          { clipPath },
          {
            duration,
            easing: "ease-in-out",
            fill: "forwards",
            pseudoElement: "::view-transition-new(root)",
          }
        )
      })
    }
  }, [fromCenter, duration, cycleWallpaper])

  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={toggleWallpaper}
      className={cn(className)}
      {...props}
    >
      <Image />
      <span className="sr-only">Toggle wallpaper</span>
    </button>
  )
}
