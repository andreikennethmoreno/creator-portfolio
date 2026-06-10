"use client"

import { createContext, useContext, useState, useCallback } from "react"

type DesktopModeContextType = {
  isDesktop: boolean
  toggleDesktop: () => void
  revealedSection: string | null
  revealSection: (section: string | null) => void
}

const DesktopModeContext = createContext<DesktopModeContextType>({
  isDesktop: false,
  toggleDesktop: () => {},
  revealedSection: null,
  revealSection: () => {},
})

export function DesktopModeProvider({ children }: { children: React.ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(false)
  const [revealedSection, setRevealedSection] = useState<string | null>(null)

  const toggleDesktop = () => {
    setIsDesktop((prev) => {
      if (prev) setRevealedSection(null)
      return !prev
    })
  }

  const revealSection = useCallback((section: string | null) => {
    setRevealedSection(section)
  }, [])

  return (
    <DesktopModeContext.Provider value={{ isDesktop, toggleDesktop, revealedSection, revealSection }}>
      {children}
    </DesktopModeContext.Provider>
  )
}

export const useDesktopMode = () => useContext(DesktopModeContext)
