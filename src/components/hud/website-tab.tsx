'use client'

import { useEffect, useState, useRef } from 'react'

type ApiStatus = 'checking' | 'ok' | 'error' | 'degraded'

interface ApiHealth {
  name: string
  status: ApiStatus
  latencyMs: number | null
  detail: string
}

interface VercelStats {
  totalDeploys: number
  activeProjects: number
  lastDeployAt: string | null
}

interface LastFmStats {
  recentTrack: string | null
  artist: string | null
  albumArt: string | null
}

type ConnType = '4g' | '3g' | '2g' | 'slow-2g' | 'unknown'

function StatusDot({ status }: { status: ApiStatus }) {
  const colors: Record<ApiStatus, string> = {
    ok: 'bg-primary',
    error: 'bg-destructive',
    degraded: 'bg-muted-foreground',
    checking: 'bg-muted-foreground animate-pulse',
  }
  return <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${colors[status]}`} />
}

function relativeTime(iso: string | null): string {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  const h = Math.floor(m / 60)
  const d = Math.floor(h / 24)
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  return `${d}d ago`
}

async function checkEndpoint(name: string, url: string): Promise<ApiHealth> {
  const start = Date.now()
  try {
    const res = await fetch(url, { cache: 'no-store' })
    const latencyMs = Date.now() - start
    if (!res.ok) return { name, status: 'error', latencyMs, detail: `HTTP ${res.status}` }
    const status: ApiStatus = latencyMs > 3000 ? 'degraded' : 'ok'
    return { name, status, latencyMs, detail: `${latencyMs}ms` }
  } catch {
    return { name, status: 'error', latencyMs: null, detail: 'unreachable' }
  }
}

function TelemetryChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const historyRef = useRef<number[]>([])
  const [conn, setConn] = useState<{ type: ConnType; rtt: number; downlink: number } | null>(null)
  const [liveTime, setLiveTime] = useState('')
  const [sessionStart] = useState(Date.now())
  const [sessionElapsed, setSessionElapsed] = useState('0s')

  const COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--accent))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--secondary))',
  ]

  useEffect(() => {
    const nav = navigator as any
    if (nav.connection) {
      const update = () => {
        const rtt = Math.max(nav.connection.rtt || 40, 1)
        setConn({
          type: nav.connection.effectiveType || 'unknown',
          rtt,
          downlink: nav.connection.downlink || 1,
        })
        historyRef.current = [...historyRef.current.slice(-39), rtt]
      }
      update()
      nav.connection.addEventListener('change', update)
      return () => nav.connection.removeEventListener('change', update)
    } else {
      const seed = () => {
        const rtt = Math.floor(Math.random() * 120 + 20)
        historyRef.current = [...historyRef.current.slice(-39), rtt]
        setConn({ type: 'unknown', rtt, downlink: Math.random() * 5 + 1 })
      }
      seed()
      const id = setInterval(seed, 3000)
      return () => clearInterval(id)
    }
  }, [])

  useEffect(() => {
    const tick = () => {
      setLiveTime(new Date().toLocaleTimeString('en-US', { hour12: false }))
      const secs = Math.floor((Date.now() - sessionStart) / 1000)
      const m = Math.floor(secs / 60)
      const s = secs % 60
      setSessionElapsed(m > 0 ? `${m}m ${s}s` : `${s}s`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [sessionStart])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || historyRef.current.length < 2) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = canvas.offsetWidth
    const h = 48
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, w, h)

    const data = historyRef.current
    const min = Math.min(...data) * 0.8
    const max = Math.max(...data) * 1.2
    const range = max - min || 1
    const pointW = w / (data.length - 1)

    for (let i = 1; i < data.length; i++) {
      const x1 = (i - 1) * pointW
      const y1 = h - 6 - ((data[i - 1] - min) / range) * (h - 12)
      const x2 = i * pointW
      const y2 = h - 6 - ((data[i] - min) / range) * (h - 12)

      const ci = (i - 1) % COLORS.length
      ctx.strokeStyle = COLORS[ci]
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }
  }, [liveTime, conn])

  const quality = conn ? Math.min(100, Math.round((conn.downlink / 10) * 50 + (1 - conn.rtt / 500) * 50)) : 0
  const bars = [1, 2, 3, 4, 5]
  const activeBars = Math.ceil(quality / 20)

  return (
    <div className="flex flex-col gap-2">
      <span className="text-muted-foreground text-[11px]">LIVE</span>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          {bars.map((b) => (
            <div
              key={b}
              className="w-1.5 rounded-full transition-all"
              style={{
                height: `${b * 4 + 4}px`,
                background: b <= activeBars ? COLORS[b % COLORS.length] : 'hsl(var(--border))',
                opacity: b <= activeBars ? 1 : 0.3,
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="text-muted-foreground">{liveTime}</span>
          <span className="text-muted-foreground/50">+{sessionElapsed}</span>
        </div>
      </div>

      {conn && (
        <div className="flex justify-between text-[10px]">
          <span className="text-muted-foreground">
            <span style={{ color: COLORS[0] }}>{conn.type}</span>
            <span className="text-muted-foreground/50"> / </span>
            <span style={{ color: COLORS[2] }}>{conn.rtt}ms</span>
          </span>
          <span className="text-muted-foreground">
            <span style={{ color: COLORS[3] }}>{conn.downlink.toFixed(1)}</span>
            <span className="text-muted-foreground/50"> Mbps</span>
          </span>
        </div>
      )}

      <canvas ref={canvasRef} style={{ width: '100%', height: '48px' }} className="mt-0.5" />
    </div>
  )
}

export default function WebsiteTab() {
  const [apis, setApis] = useState<ApiHealth[]>([])
  const [vercel, setVercel] = useState<VercelStats | null>(null)
  const [lfm, setLfm] = useState<LastFmStats | null>(null)
  const [checksRan, setChecksRan] = useState(false)

  useEffect(() => {
    const run = async () => {
      const endpoints = [
        { name: 'lastfm', url: '/api/lastfm' },
      ]
      setApis(endpoints.map((e) => ({ name: e.name, status: 'checking' as ApiStatus, latencyMs: null, detail: 'checking…' })))
      const results = await Promise.all(endpoints.map((e) => checkEndpoint(e.name, e.url)))
      setApis(results)
      setChecksRan(true)
    }
    run()
  }, [])

  useEffect(() => {
    fetch('/api/lastfm')
      .then((r) => r.json())
      .then((data) => {
        if (data.track) setLfm({ recentTrack: data.track.name, artist: data.track.artist, albumArt: data.track.albumArt || null })
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetch('/api/vercel-stats')
      .then((r) => r.json())
      .then((data: VercelStats) => setVercel(data))
      .catch(() => {})
  }, [])

  return (
    <div className="p-3 grid grid-cols-2 gap-x-4 gap-y-3 text-[11px] font-mono">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">API HEALTH</span>
          {apis.length === 0 ? (
            <span className="text-muted-foreground animate-pulse">scanning…</span>
          ) : (
            apis.map((api) => (
              <div key={api.name} className="flex items-center gap-1.5">
                <StatusDot status={api.status} />
                <span className="text-muted-foreground w-14">{api.name}</span>
                <span className={api.status === 'ok' ? 'text-primary' : api.status === 'error' ? 'text-destructive' : 'text-muted-foreground'}>
                  {api.detail}
                </span>
              </div>
            ))
          )}
          {checksRan && <span className="text-muted-foreground/40 text-[10px]">checked at {new Date().toLocaleTimeString()}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-muted-foreground">LAST.FM</span>
          {lfm ? (
            <div className="flex items-center gap-2">
              {lfm.albumArt ? (
                <img src={lfm.albumArt} alt="" className="w-8 h-8 rounded object-cover shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">🎵</div>
              )}
              <div className="min-w-0">
                <p className="truncate text-foreground leading-tight">{lfm.recentTrack}</p>
                <p className="truncate text-muted-foreground leading-tight">{lfm.artist}</p>
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground animate-pulse">fetching…</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">ISR CACHE</span>
          <div className="flex flex-col gap-0.5 text-[10px]">
            {[
              { route: 'instagram', ttl: '3600s' },
              { route: 'lastfm', ttl: '60s' },
              { route: 'hardcover', ttl: '3600s' },
              { route: 'vercel', ttl: '3600s' },
            ].map((r) => (
              <div key={r.route} className="flex justify-between">
                <span className="text-muted-foreground">{r.route}</span>
                <span className="text-foreground/70">{r.ttl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">VERCEL</span>
          {vercel ? (
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">projects</span>
                <span className="text-foreground">{vercel.activeProjects}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">deploys</span>
                <span className="text-foreground">{vercel.totalDeploys}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">last deploy</span>
                <span className="text-foreground">{relativeTime(vercel.lastDeployAt)}</span>
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground animate-pulse">fetching…</span>
          )}
        </div>

        <TelemetryChart />

        <div className="flex flex-col gap-0.5 mt-auto pt-2 border-t border-border/40">
          <span className="text-muted-foreground/50 text-[10px]">next.js 16 · react 19 · tailwind v4</span>
          <span className="text-muted-foreground/50 text-[10px]">{new Date().toLocaleDateString('en-US', { dateStyle: 'medium' })}</span>
        </div>
      </div>
    </div>
  )
}
