"use client"

import { createContext, useContext, useState } from "react"

type DesktopModeContextType = {
  isDesktop: boolean
  toggleDesktop: () => void
}

const DesktopModeContext = createContext<DesktopModeContextType>({
  isDesktop: false,
  toggleDesktop: () => {},
})

export function DesktopModeProvider({ children }: { children: React.ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(false)
  const toggleDesktop = () => setIsDesktop((prev) => !prev)
  return (
    <DesktopModeContext.Provider value={{ isDesktop, toggleDesktop }}>
      {children}
    </DesktopModeContext.Provider>
  )
}

export const useDesktopMode = () => useContext(DesktopModeContext)
