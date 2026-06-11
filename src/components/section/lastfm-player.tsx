'use client'

import { useRef, useCallback } from 'react'
import BlurFade from '@/components/magicui/blur-fade'
import { WMCard } from '@/components/wm-card'
import { useMusicPlayer } from '@/lib/music-player-context'
import AudioVisualizer from '@/components/audio-visualizer'

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

function formatTime(s: number): string {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function LastFmPlayer() {
  const { track, videoId, isPlaying, currentTime, duration, toggle, seek } = useMusicPlayer()
  const progressRef = useRef<HTMLDivElement>(null)

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !duration) return
    const rect = progressRef.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    seek(pct * duration)
  }, [duration, seek])

  return (
    <section id="lastfm">
      <WMCard title="lastfm.feed" href={`https://last.fm/user/${process.env.NEXT_PUBLIC_LASTFM_USERNAME}`} hrefLabel="Open Last.fm">
        <BlurFade delay={0.48}>
          {track ? (
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 items-center">
                <div className="relative w-14 h-14 shrink-0 group/art">
                  {track.albumArt ? (
                    <img src={track.albumArt} alt={track.album} className="w-14 h-14 object-cover rounded-sm border" />
                  ) : (
                    <div className="w-14 h-14 bg-muted rounded-sm flex items-center justify-center border text-lg">🎵</div>
                  )}
                  {videoId && (
                    <button onClick={toggle} className="absolute inset-0 flex items-center justify-center rounded-sm bg-black/50 opacity-0 group-hover/art:opacity-100 transition-opacity" aria-label={isPlaying ? 'Pause' : 'Play'}>
                      {isPlaying ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21" /></svg>
                      )}
                    </button>
                  )}
                </div>

                <div className="flex flex-col justify-center gap-1 min-w-0 flex-1">
                  {track.playedAt ? <span className="text-[10px] font-mono text-muted-foreground">last played · {timeAgo(track.playedAt)}</span> : null}
                  <p className="text-sm font-medium truncate leading-tight">{track.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                </div>

                {videoId && <AudioVisualizer playing={isPlaying} />}

                {videoId && (
                  <button onClick={toggle} className="shrink-0 w-9 h-9 rounded-full border flex items-center justify-center hover:bg-muted transition-colors" aria-label={isPlaying ? 'Pause' : 'Play'}>
                    {isPlaying ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,3 20,12 6,21" /></svg>
                    )}
                  </button>
                )}
              </div>

              {videoId && duration > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground tabular-nums w-8 text-right">{formatTime(currentTime)}</span>
                  <div ref={progressRef} className="flex-1 h-1.5 bg-muted rounded-full cursor-pointer" onClick={handleSeek}>
                    <div className="h-full bg-foreground/50 rounded-full transition-[width] duration-100" style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }} />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground tabular-nums w-8">{formatTime(duration)}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">nothing scrobbled yet</p>
          )}
        </BlurFade>
      </WMCard>
    </section>
  )
}
