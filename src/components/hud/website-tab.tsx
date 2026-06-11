'use client'

import { useEffect, useState } from 'react'

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
            <div className="flex flex-col gap-0.5">
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

        <div className="flex flex-col gap-0.5 mt-auto pt-2 border-t border-border/40">
          <span className="text-muted-foreground/50 text-[10px]">next.js 16 · react 19 · tailwind v4</span>
          <span className="text-muted-foreground/50 text-[10px]">{new Date().toLocaleDateString('en-US', { dateStyle: 'medium' })}</span>
        </div>
      </div>
    </div>
  )
}
