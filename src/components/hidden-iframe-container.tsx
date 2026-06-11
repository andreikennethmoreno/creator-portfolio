'use client'

import { useMusicPlayer } from '@/lib/music-player-context'

export default function HiddenIframeContainer() {
  const { iframeContainerRef } = useMusicPlayer()
  return (
    <div ref={iframeContainerRef} className="absolute pointer-events-none" style={{ left: '-9999px', top: 0, width: 1, height: 1 }} aria-hidden="true" />
  )
}
