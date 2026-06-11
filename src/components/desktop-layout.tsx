"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useDesktopMode } from "@/lib/desktop-mode-context"
import { useWindowManager } from "@/lib/window-manager-context"

export function DesktopLayout({ children }: { children: React.ReactNode }) {
  const { isDesktop, revealedSection, revealSection } = useDesktopMode()
  const { activeScreen, isTransitioning, resetTransition } = useWindowManager()

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
      <AnimatePresence>
        <motion.div
          key={activeScreen}
          className="absolute inset-0"
          initial={isTransitioning ? { x: '-100%' } : { x: 0 }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 220, damping: 28, mass: 0.55 }}
          onAnimationComplete={resetTransition}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
