'use client'

import { createContext, useContext, useRef, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { LastFmTrack } from '@/lib/lastfm'

let ytApiLoaded = false

function loadYouTubeAPI(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if ((window as any).YT?.Player) return Promise.resolve()
  if (ytApiLoaded) {
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if ((window as any).YT?.Player) { clearInterval(check); resolve() }
      }, 100)
    })
  }
  ytApiLoaded = true
  return new Promise((resolve) => {
    const w = window as any
    const prev = w.onYouTubeIframeAPIReady
    w.onYouTubeIframeAPIReady = () => { prev?.(); resolve() }
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(script)
  })
}

interface MusicPlayerState {
  track: LastFmTrack | null
  videoId: string | null
  isPlaying: boolean
  currentTime: number
  duration: number
  toggle: () => void
  seek: (time: number) => void
  iframeContainerRef: React.RefObject<HTMLDivElement | null>
}

const MusicPlayerContext = createContext<MusicPlayerState | null>(null)

export function useMusicPlayer() {
  const ctx = useContext(MusicPlayerContext)
  if (!ctx) throw new Error('useMusicPlayer must be used inside MusicPlayerProvider')
  return ctx
}

interface Props {
  initialTrack: LastFmTrack | null
  initialVideoId: string | null
  children: ReactNode
}

export function MusicPlayerProvider({ initialTrack, initialVideoId, children }: Props) {
  const [track, setTrack] = useState<LastFmTrack | null>(initialTrack)
  const [videoId, setVideoId] = useState<string | null>(initialVideoId)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const playerRef = useRef<YT.Player | null>(null)
  const iframeContainerRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const pollDurationRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch('/api/lastfm')
        if (!res.ok) return
        const data = await res.json()
        if (data.track) setTrack(data.track)
        if (data.videoId && data.videoId !== videoId) setVideoId(data.videoId)
      } catch {}
    }
    const id = setInterval(poll, 10_000)
    return () => clearInterval(id)
  }, [videoId])

  useEffect(() => {
    if (!videoId || !iframeContainerRef.current) return
    let cancelled = false
    ;(async () => {
      await loadYouTubeAPI()
      if (cancelled || !iframeContainerRef.current) return
      if (playerRef.current) {
        playerRef.current.loadVideoById(videoId)
        playerRef.current.pauseVideo()
        setIsPlaying(false)
        setCurrentTime(0)
        setDuration(0)
        return
      }
      playerRef.current = new YT.Player(iframeContainerRef.current, {
        videoId,
        width: 1,
        height: 1,
        playerVars: { controls: 0, modestbranding: 1, rel: 0, iv_load_policy: 3 },
        events: {
          onReady: () => {
            const pollDuration = () => {
              const d = playerRef.current?.getDuration()
              if (d && d > 0) { setDuration(d) }
              else { pollDurationRef.current = setTimeout(pollDuration, 500) }
            }
            pollDuration()
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) setIsPlaying(true)
            else if (e.data === YT.PlayerState.PAUSED) setIsPlaying(false)
            else if (e.data === YT.PlayerState.ENDED) { setIsPlaying(false); setCurrentTime(0) }
          },
        },
      })
    })()
    return () => { cancelled = true; clearTimeout(pollDurationRef.current) }
  }, [videoId])

  useEffect(() => {
    return () => { playerRef.current?.destroy(); playerRef.current = null }
  }, [])

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        const t = playerRef.current?.getCurrentTime?.()
        if (t !== undefined) setCurrentTime(t)
      }, 250)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isPlaying])

  const toggle = useCallback(() => {
    if (!playerRef.current) return
    if (isPlaying) playerRef.current.pauseVideo()
    else playerRef.current.playVideo()
  }, [isPlaying])

  const seek = useCallback((time: number) => {
    if (!playerRef.current) return
    playerRef.current.seekTo(time, true)
    setCurrentTime(time)
  }, [])

  return (
    <MusicPlayerContext.Provider value={{ track, videoId, isPlaying, currentTime, duration, toggle, seek, iframeContainerRef }}>
      {children}
    </MusicPlayerContext.Provider>
  )
}
