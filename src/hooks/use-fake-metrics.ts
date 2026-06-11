'use client'

import { useState, useEffect, useRef } from 'react'

function smoothNoise(t: number, seed: number): number {
  return (
    Math.sin(t * 0.7 + seed) * 0.3 +
    Math.sin(t * 1.3 + seed * 1.7) * 0.25 +
    Math.sin(t * 2.1 + seed * 0.9) * 0.15 +
    Math.sin(t * 0.3 + seed * 2.3) * 0.3
  )
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

export interface SparklinePoint {
  value: number
  timestamp: number
}

export interface FakeMetrics {
  cpu: number
  cpuHistory: SparklinePoint[]
  mem: number
  memHistory: SparklinePoint[]
  memUsedGB: number
  memTotalGB: number
  uptime: number
}

const HISTORY_LEN = 40
const MEM_TOTAL_GB = 16
const UPTIME_BASE = Math.floor(Math.random() * 60 * 60 * 24 * 3)

export function useFakeMetrics(tickMs = 2000): FakeMetrics {
  const tRef = useRef(0)
  const [metrics, setMetrics] = useState<FakeMetrics>(() => {
    const cpu = clamp(50 + smoothNoise(0, 1.1) * 40, 5, 95)
    const mem = clamp(58 + smoothNoise(0, 3.7) * 20, 30, 85)
    return {
      cpu,
      cpuHistory: [{ value: cpu, timestamp: Date.now() }],
      mem,
      memHistory: [{ value: mem, timestamp: Date.now() }],
      memUsedGB: parseFloat(((mem / 100) * MEM_TOTAL_GB).toFixed(1)),
      memTotalGB: MEM_TOTAL_GB,
      uptime: UPTIME_BASE,
    }
  })

  useEffect(() => {
    const id = setInterval(() => {
      setMetrics((prev) => ({ ...prev, uptime: prev.uptime + 1 }))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      tRef.current += 1
      const t = tRef.current
      const cpu = clamp(50 + smoothNoise(t * 0.4, 1.1) * 40, 5, 95)
      const mem = clamp(58 + smoothNoise(t * 0.2, 3.7) * 20, 30, 85)
      const memUsedGB = parseFloat(((mem / 100) * MEM_TOTAL_GB).toFixed(1))
      setMetrics((prev) => {
        const cpuHistory = [...prev.cpuHistory.slice(-(HISTORY_LEN - 1)), { value: cpu, timestamp: Date.now() }]
        const memHistory = [...prev.memHistory.slice(-(HISTORY_LEN - 1)), { value: mem, timestamp: Date.now() }]
        return { ...prev, cpu, cpuHistory, mem, memHistory, memUsedGB, memTotalGB: MEM_TOTAL_GB }
      })
    }, tickMs)
    return () => clearInterval(id)
  }, [tickMs])

  return metrics
}

export function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return `up ${d}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`
}
