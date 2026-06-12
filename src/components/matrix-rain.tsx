"use client";

import { useEffect, useRef } from "react";

const CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF";

export default function MatrixRain() {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;
    const preEl: HTMLElement = pre;

    let frameId: number;
    let ro: ResizeObserver | null = null;
    let cols = 0, rows = 0;
    let drops: number[] = [];

    function size() {
      const p = preEl.parentElement;
      if (!p) return;
      const w = p.clientWidth || 400;
      const h = p.clientHeight || 200;
      const fontSize = Math.max(11, Math.min(17, Math.floor(w / 50)));
      const cw = fontSize * 0.6;
      const lh = fontSize * 1.25;
      cols = Math.floor(w / cw);
      rows = Math.floor(h / lh);
      preEl.style.fontSize = fontSize + "px";
      preEl.style.lineHeight = lh + "px";
      preEl.style.letterSpacing = "0px";

      drops = Array.from({ length: cols }, (_, i) =>
        -Math.floor(Math.random() * rows * (1 + i / cols))
      );
    }

    size();
    ro = new ResizeObserver(() => size());
    if (preEl.parentElement) ro.observe(preEl.parentElement);

    function tick() {
      for (let c = 0; c < cols; c++) {
        drops[c] += Math.random() * 0.5 + 0.12;
        if (drops[c] > rows + 5) {
          drops[c] = -Math.floor(Math.random() * rows);
        }
      }

      const out: string[] = [];
      for (let c = 0; c < cols; c++) {
        const head = Math.floor(drops[c]);
        for (let r = 0; r < rows; r++) {
          const dist = head - r;
          if (dist >= 0 && dist < 7) {
            const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
            const alpha = Math.max(0.08, 1 - dist / 7);
            if (dist === 0) {
              out.push(`<b style="opacity:1">${ch}</b>`);
            } else {
              out.push(`<span style="opacity:${alpha.toFixed(2)}">${ch}</span>`);
            }
          } else {
            out.push(" ");
          }
        }
      }

      let html = "";
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          html += out[c * rows + r];
        }
        if (r < rows - 1) html += "\n";
      }

      preEl.innerHTML = html;
      frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      ro?.disconnect();
    };
  }, []);

  return (
    <pre
      ref={preRef}
      className="font-mono m-0 text-primary overflow-hidden whitespace-pre"
    />
  );
}
