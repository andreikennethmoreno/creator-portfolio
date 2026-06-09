'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import BlurFade from '@/components/magicui/blur-fade'
import { WMCard } from '@/components/wm-card'
import type { LastFmTrack } from '@/lib/lastfm'

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

type Props = {
  track: LastFmTrack | null
  videoId: string | null
}

let apiLoaded = false

function loadYouTubeAPI(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.YT?.Player) return Promise.resolve()
  if (apiLoaded) return Promise.resolve()

  return new Promise((resolve) => {
    if (window.YT?.Player) {
      apiLoaded = true
      resolve()
      return
    }
    const w = window as unknown as { onYouTubeIframeAPIReady?: () => void }
    const prev = w.onYouTubeIframeAPIReady
    w.onYouTubeIframeAPIReady = () => {
      apiLoaded = true
      prev?.()
      resolve()
    }
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(script)
  })
}

// ── Simplex-ish noise: cheap smooth random using sin ──────────────────────────
function smoothNoise(t: number, seed: number): number {
  return (
    Math.sin(t * 1.7 + seed * 13.1) * 0.4 +
    Math.sin(t * 3.1 + seed * 7.3) * 0.3 +
    Math.sin(t * 0.9 + seed * 4.7) * 0.3
  )
}

// ── Canvas visualizer ─────────────────────────────────────────────────────────
function AudioVisualizer({ playing }: { playing: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const timeRef = useRef<number>(0)
  // Persistent heights so bars ease smoothly when pausing
  const barHeightsRef = useRef<Float32Array | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const BAR_COUNT = 28
    const GAP = 2
    const MIN_H = 3
    const MAX_H = canvas.height - 4

    if (!barHeightsRef.current) {
      barHeightsRef.current = new Float32Array(BAR_COUNT).fill(MIN_H)
    }
    const heights = barHeightsRef.current

    // Read CSS variable for the primary color so it respects light/dark theme
    function getPrimaryColor() {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--primary')
        .trim() || '0 0% 50%'
    }

    function draw(timestamp: number) {
      if (!ctx || !canvas) return
      const dt = timestamp - timeRef.current
      timeRef.current = timestamp

      const barW = (canvas.width - GAP * (BAR_COUNT - 1)) / BAR_COUNT
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const primaryHsl = getPrimaryColor()

      for (let i = 0; i < BAR_COUNT; i++) {
        let target: number

        if (playing) {
          // Each bar has its own noise lane — gives organic, non-uniform movement
          const t = timestamp / 1000
          const n = smoothNoise(t, i)               // –1 … 1
          const normalized = (n + 1) / 2            // 0 … 1

          // Bass-ish shape: center bars taller than edge bars
          const centerBias = 1 - Math.abs((i / (BAR_COUNT - 1)) * 2 - 1) * 0.45
          // Occasional "beat" spike
          const beatPhase = Math.sin(timestamp / 380 + i * 0.4)
          const beat = beatPhase > 0.82 ? (beatPhase - 0.82) * 5 * centerBias : 0

          target = MIN_H + (MAX_H - MIN_H) * (normalized * 0.65 + beat * 0.35) * centerBias
        } else {
          // Idle: ease down to a flat low line
          target = MIN_H + (i % 3 === 0 ? 2 : 0)
        }

        // Ease toward target — faster attack, slower release
        const speed = target > heights[i] ? 0.18 : 0.09
        heights[i] += (target - heights[i]) * Math.min(1, (dt / 16) * speed)

        const x = i * (barW + GAP)
        const h = Math.max(MIN_H, heights[i])
        const y = (canvas.height - h) / 2   // vertically centered

        // Slightly dimmer for outer bars
        const alpha = 0.45 + 0.55 * (1 - Math.abs((i / (BAR_COUNT - 1)) * 2 - 1) * 0.4)

        ctx.fillStyle = `hsl(${primaryHsl} / ${alpha})`
        ctx.beginPath()
        ctx.roundRect(x, y, Math.max(1, barW), h, 2)
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame((ts) => {
      timeRef.current = ts
      draw(ts)
    })

    return () => cancelAnimationFrame(rafRef.current)
  }, [playing])

  return (
    <canvas
      ref={canvasRef}
      width={140}
      height={32}
      className="shrink-0 hidden sm:block"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}

// ─────────────────────────────────────────────────────────────────────────────

export default function LastFmPlayer({ track, videoId }: Props) {
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const playerRef = useRef<YT.Player | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  useEffect(() => {
    if (!videoId || !containerRef.current) return

    let cancelled = false
    let pollDuration: ReturnType<typeof setTimeout>

    ;(async () => {
      await loadYouTubeAPI()
      if (cancelled || !containerRef.current) return

      if (playerRef.current) {
        playerRef.current.loadVideoById(videoId)
        playerRef.current.pauseVideo()
        setPlaying(false)
        setCurrentTime(0)
        return
      }

      playerRef.current = new YT.Player(containerRef.current, {
        videoId,
        width: 1,
        height: 1,
        playerVars: {
          controls: 0,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: () => {
            const poll = () => {
              const d = playerRef.current?.getDuration()
              if (d && d > 0) {
                setDuration(d)
              } else {
                pollDuration = setTimeout(poll, 500)
              }
            }
            poll()
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) setPlaying(true)
            else if (e.data === YT.PlayerState.PAUSED) setPlaying(false)
            else if (e.data === YT.PlayerState.ENDED) {
              setPlaying(false)
              setCurrentTime(0)
            }
          },
        },
      })
    })()

    return () => {
      cancelled = true
      clearTimeout(pollDuration)
    }
  }, [videoId])

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        if (playerRef.current?.getCurrentTime) {
          setCurrentTime(playerRef.current.getCurrentTime())
        }
      }, 250)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [playing])

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return
    if (playing) playerRef.current.pauseVideo()
    else playerRef.current.playVideo()
  }, [playing])

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!playerRef.current || !progressRef.current || !duration) return
      const rect = progressRef.current.getBoundingClientRect()
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      const time = pct * duration
      playerRef.current.seekTo(time, true)
      setCurrentTime(time)
    },
    [duration],
  )

  return (
    <section id="lastfm">
      <WMCard
        title="lastfm.feed"
        href={`https://last.fm/user/${process.env.NEXT_PUBLIC_LASTFM_USERNAME}`}
        hrefLabel="Open Last.fm"
      >
        <BlurFade delay={0.48}>
          {track ? (
            <div className="flex flex-col gap-3">
              <div ref={containerRef} className="absolute -left-[9999px] top-0" aria-hidden="true" />

              <div className="flex gap-3 items-center">
                {/* Album art */}
                <div className="relative w-14 h-14 shrink-0 group/art">
                  {track.albumArt ? (
                    <img
                      src={track.albumArt}
                      alt={track.album}
                      className="w-14 h-14 object-cover rounded-sm border"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-muted rounded-sm flex items-center justify-center border text-lg">
                      🎵
                    </div>
                  )}
                  {videoId && (
                    <button
                      onClick={togglePlay}
                      className="absolute inset-0 flex items-center justify-center rounded-sm bg-black/50 opacity-0 group-hover/art:opacity-100 transition-opacity"
                      aria-label={playing ? 'Pause' : 'Play'}
                    >
                      {playing ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                          <rect x="6" y="4" width="4" height="16" rx="1" />
                          <rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                          <polygon points="5,3 19,12 5,21" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>

                {/* Track info */}
                <div className="flex flex-col justify-center gap-1 min-w-0 flex-1">
                  {track.playedAt ? (
                    <span className="text-[10px] font-mono text-muted-foreground">
                      last played · {timeAgo(track.playedAt)}
                    </span>
                  ) : null}
                  <p className="text-sm font-medium truncate leading-tight">{track.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                </div>

                {/* Visualizer — only shown when videoId is available */}
                {videoId && (
                  <AudioVisualizer playing={playing} />
                )}

                {/* Play/pause button */}
                {videoId && (
                  <button
                    onClick={togglePlay}
                    className="shrink-0 w-9 h-9 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
                    aria-label={playing ? 'Pause' : 'Play'}
                  >
                    {playing ? (
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
                )}
              </div>

              {/* Seekbar */}
              {videoId && duration > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground tabular-nums w-8 text-right">
                    {formatTime(currentTime)}
                  </span>
                  <div
                    ref={progressRef}
                    className="flex-1 h-1.5 bg-muted rounded-full cursor-pointer group/progress relative"
                    onClick={handleSeek}
                  >
                    <div
                      className="h-full bg-foreground/50 rounded-full transition-[width] duration-100"
                      style={{
                        width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground tabular-nums w-8">
                    {formatTime(duration)}
                  </span>
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
