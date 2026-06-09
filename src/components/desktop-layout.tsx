"use client"

import { useDesktopMode } from "@/lib/desktop-mode-context"

export function DesktopLayout({ children }: { children: React.ReactNode }) {
  const { isDesktop } = useDesktopMode()

  if (!isDesktop) return <>{children}</>

  return (
    <div className="hidden lg:grid fixed inset-0 z-10 p-3 gap-3"
      style={{
        gridTemplateColumns: "1fr 1.4fr 1fr",
        gridTemplateRows: "1fr 1fr",
      }}
    >
      {children}
    </div>
  )
}
