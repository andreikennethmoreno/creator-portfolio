"use client";

import { useState, useRef, useCallback } from "react";
import AudioVisualizer from "@/components/audio-visualizer";
import { useMusicPlayer } from "@/lib/music-player-context";

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function MiniPlayer() {
  const { track, isPlaying, currentTime, duration, toggle, seek } = useMusicPlayer();
  const [hovering, setHovering] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current || !duration) return;
      const rect = progressRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      seek(pct * duration);
    },
    [duration, seek]
  );

  const showProgressBar = !isPlaying || (isPlaying && hovering);
  const hasDuration = duration > 0;

  if (!track) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-muted-foreground">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
        <span className="text-xs">no track</span>
      </div>
    );
  }

  const isNowPlaying = !track.playedAt;

  return (
    <div
      className="flex items-center gap-2.5 px-2.5 py-1.5 min-w-[320px]"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Album art */}
      <div className="size-9 shrink-0 rounded overflow-hidden border">
        {track.albumArt ? (
          <img src={track.albumArt} alt={track.album} className="size-full object-cover" />
        ) : (
          <div className="size-full flex items-center justify-center bg-muted text-muted-foreground">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
        )}
      </div>

      {/* Song info */}
      <div className="flex flex-col min-w-0 shrink-0 max-w-[45%]">
        <p className="text-xs font-medium truncate leading-tight">
          {isNowPlaying && (
            <span className="inline-block size-1.5 rounded-full bg-primary mr-1.5 align-middle animate-pulse" />
          )}
          {track.name}
        </p>
        <p className="text-[10px] text-muted-foreground truncate leading-tight">{track.artist}</p>
      </div>

      {/* Progress bar or sound wave */}
      <div className="flex-1 min-w-0 flex items-center gap-1.5">
        {showProgressBar && hasDuration ? (
          <>
            <div ref={progressRef} className="flex-1 h-1 bg-muted rounded-full cursor-pointer overflow-hidden" onClick={handleSeek}>
              <div className="h-full bg-foreground/50 rounded-full transition-[width] duration-100" style={{ width: `${(currentTime / duration) * 100}%` }} />
            </div>
            <span className="text-[10px] font-mono text-muted-foreground tabular-nums whitespace-nowrap">
              {formatTime(currentTime)}/{formatTime(duration)}
            </span>
          </>
        ) : isPlaying && !hovering ? (
          <AudioVisualizer playing={isPlaying} />
        ) : null}
      </div>

      {/* Play/pause */}
      <button onClick={(e) => { e.stopPropagation(); toggle() }} className="size-7 shrink-0 rounded-full border flex items-center justify-center hover:bg-muted transition-colors" aria-label={isPlaying ? "Pause" : "Play"}>
        {isPlaying ? (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="6,3 20,12 6,21" />
          </svg>
        )}
      </button>
    </div>
  );
}
