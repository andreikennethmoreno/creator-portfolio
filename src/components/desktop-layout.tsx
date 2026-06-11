"use client"

import { useEffect } from "react"
import { motion } from "motion/react"
import { useDesktopMode } from "@/lib/desktop-mode-context"
import { useWindowManager, ScreenProvider } from "@/lib/window-manager-context"

export function DesktopLayout({ children }: { children: React.ReactNode }) {
  const { isDesktop, revealedSection, revealSection } = useDesktopMode()
  const { activeScreen } = useWindowManager()

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
    <div className="hidden lg:block fixed inset-0 z-10 overflow-hidden">
      <motion.div
        className="flex h-full"
        animate={{ x: `-${activeScreen * 100}%` }}
        transition={{ type: 'spring', stiffness: 220, damping: 28, mass: 0.55 }}
      >
        {[0, 1, 2].map(screenIndex => (
          <div key={screenIndex} className="w-screen h-full shrink-0">
            <ScreenProvider screenIndex={screenIndex}>
              {children}
            </ScreenProvider>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
