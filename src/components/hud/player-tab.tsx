'use client'

import { useRef, useCallback } from 'react'
import { useMusicPlayer } from '@/lib/music-player-context'

function formatTime(s: number): string {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr.replace(',', ''))
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  const hrs = Math.floor(mins / 60)
  const days = Math.floor(hrs / 24)
  if (mins < 60) return `${mins}m ago`
  if (hrs < 24) return `${hrs}h ago`
  return `${days}d ago`
}

export default function PlayerTab() {
  const { track, videoId, isPlaying, currentTime, duration, toggle, seek } = useMusicPlayer()
  const progressRef = useRef<HTMLDivElement>(null)

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !duration) return
    const rect = progressRef.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    seek(pct * duration)
  }, [duration, seek])

  if (!track) {
    return (
      <div className="p-4 flex items-center justify-center h-32">
        <p className="text-xs font-mono text-muted-foreground">nothing scrobbled yet</p>
      </div>
    )
  }

  const isNowPlaying = !track.playedAt
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="p-4 flex flex-col gap-3">
      <div className="flex gap-3 items-start">
        <div className="relative shrink-0">
          {track.albumArt ? (
            <img src={track.albumArt} alt={track.album} className="w-[72px] h-[72px] rounded-xl object-cover shadow-md" />
          ) : (
            <div className="w-[72px] h-[72px] rounded-xl bg-muted flex items-center justify-center text-2xl shadow-md">🎵</div>
          )}
        </div>

        <div className="flex flex-col justify-center gap-1 min-w-0 flex-1 pt-1">
          <p className="text-sm font-medium truncate leading-tight">{track.name}</p>
          <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
          {track.album && <p className="text-[10px] text-muted-foreground/60 truncate font-mono">{track.album}</p>}
          <div className="flex items-center gap-1.5 mt-0.5">
            {isNowPlaying ? (
              <>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-mono text-primary uppercase tracking-wide">now playing</span>
              </>
            ) : (
              <>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                <span className="text-[10px] font-mono text-muted-foreground">{timeAgo(track.playedAt!)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {videoId && (
        <div className="flex flex-col gap-1">
          <div ref={progressRef} className="w-full h-1 bg-muted rounded-full cursor-pointer relative group/seek" onClick={handleSeek}>
            <div className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-100" style={{ width: `${progress}%`, backgroundColor: 'var(--color-primary, #22c55e)' }} />
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full opacity-0 group-hover/seek:opacity-100 transition-opacity" style={{ left: `${progress}%`, backgroundColor: 'var(--color-primary, #22c55e)' }} />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-muted-foreground tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      )}

      {videoId && (
        <div className="flex items-center justify-center gap-4">
          <button className="text-muted-foreground hover:text-foreground transition-colors p-1" aria-label="Restart" onClick={() => seek(0)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="19,20 9,12 19,4" />
              <rect x="5" y="4" width="2" height="16" rx="1" />
            </svg>
          </button>
          <button onClick={toggle} className="w-9 h-9 rounded-full border-2 border-border flex items-center justify-center hover:bg-muted transition-colors" aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6,3 20,12 6,21" />
              </svg>
            )}
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors p-1" aria-label="Next">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,4 15,12 5,20" />
              <rect x="17" y="4" width="2" height="16" rx="1" />
            </svg>
          </button>
        </div>
      )}

      {!videoId && (
        <p className="text-[10px] font-mono text-muted-foreground/50 text-center">no youtube match — scrobble data only</p>
      )}
    </div>
  )
}
