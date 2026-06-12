"use client";

import { useRef, useEffect } from "react";

function smoothNoise(t: number, seed: number): number {
  return (
    Math.sin(t * 1.7 + seed * 13.1) * 0.4 +
    Math.sin(t * 3.1 + seed * 7.3) * 0.3 +
    Math.sin(t * 0.9 + seed * 4.7) * 0.3
  );
}

type Props = {
  playing: boolean;
  className?: string;
};

const CSS_VARS = ["--primary", "--secondary", "--accent", "--chart-1", "--chart-2", "--chart-3", "--ring"];

function getThemeColors(): string[] {
  const style = getComputedStyle(document.documentElement);
  return CSS_VARS.map((v) => style.getPropertyValue(v).trim()).filter(Boolean);
}

function pickColor(colors: string[], index: number, total: number): string {
  if (colors.length === 0) return "oklch(0.5 0.1 200)";
  const segment = total / colors.length;
  const idx = Math.min(Math.floor(index / segment), colors.length - 1);
  return colors[idx];
}

function applyAlpha(color: string, alpha: number): string {
  const match = color.match(/^(oklch|hsl|hwb|lch|lab)\((.+)\)$/);
  if (match) {
    return `${match[1]}(${match[2]} / ${alpha})`;
  }
  return color;
}

export default function AudioVisualizer({ playing, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const barHeightsRef = useRef<Float32Array | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const BAR_COUNT = 28;
    const GAP = 2;
    const MIN_H = 3;

    if (!barHeightsRef.current) {
      barHeightsRef.current = new Float32Array(BAR_COUNT).fill(MIN_H);
    }
    const heights = barHeightsRef.current;

    function draw(timestamp: number) {
      if (!ctx || !canvas) return;
      const dt = timestamp - timeRef.current;
      timeRef.current = timestamp;

      const MAX_H = canvas.height - 4;
      const barW = (canvas.width - GAP * (BAR_COUNT - 1)) / BAR_COUNT;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const colors = getThemeColors();

      for (let i = 0; i < BAR_COUNT; i++) {
        let target: number;

        if (playing) {
          const t = timestamp / 1000;
          const n = smoothNoise(t, i);
          const normalized = (n + 1) / 2;
          const centerBias =
            1 - Math.abs((i / (BAR_COUNT - 1)) * 2 - 1) * 0.45;
          const beatPhase = Math.sin(timestamp / 380 + i * 0.4);
          const beat =
            beatPhase > 0.82
              ? (beatPhase - 0.82) * 5 * centerBias
              : 0;

          target =
            MIN_H +
            (MAX_H - MIN_H) *
              (normalized * 0.65 + beat * 0.35) *
              centerBias;
        } else {
          target = MIN_H + (i % 3 === 0 ? 2 : 0);
        }

        const speed = target > heights[i] ? 0.18 : 0.09;
        heights[i] +=
          (target - heights[i]) * Math.min(1, (dt / 16) * speed);

        const x = i * (barW + GAP);
        const h = Math.max(MIN_H, heights[i]);
        const y = (canvas.height - h) / 2;
        const alpha =
          0.75 +
          0.25 *
            (1 -
              Math.abs((i / (BAR_COUNT - 1)) * 2 - 1) * 0.4);

        const raw = pickColor(colors, i, BAR_COUNT);
        ctx.fillStyle = applyAlpha(raw, alpha);
        ctx.beginPath();
        ctx.roundRect(x, y, Math.max(1, barW), h, 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame((ts) => {
      timeRef.current = ts;
      draw(ts);
    });

    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

  return (
    <canvas
      ref={canvasRef}
      width={140}
      height={32}
      className={className ?? "shrink-0"}
      style={{ imageRendering: "pixelated" }}
    />
  );
}
