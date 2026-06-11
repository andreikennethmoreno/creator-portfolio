"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { LastFmTrack } from "@/lib/lastfm";
import AudioVisualizer from "@/components/audio-visualizer";

type TrackData = {
  track: LastFmTrack | null;
  videoId: string | null;
};

let apiLoaded = false;

function loadYouTubeAPI(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if ((window as unknown as { YT?: { Player?: unknown } }).YT?.Player)
    return Promise.resolve();
  if (apiLoaded) return Promise.resolve();

  return new Promise((resolve) => {
    const w = window as unknown as { onYouTubeIframeAPIReady?: () => void };
    const prev = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      apiLoaded = true;
      prev?.();
      resolve();
    };
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    }
  });
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}



export default function MiniPlayer() {
  const [data, setData] = useState<TrackData | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hovering, setHovering] = useState(false);

  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const fetchTrack = useCallback(() => {
    fetch("/api/lastfm")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchTrack();
    const interval = setInterval(fetchTrack, 60000);
    return () => clearInterval(interval);
  }, [fetchTrack]);

  useEffect(() => {
    const vid = data?.videoId;
    if (!vid || !containerRef.current) return;

    let cancelled = false;
    let pollDuration: ReturnType<typeof setTimeout>;

    (async () => {
      await loadYouTubeAPI();
      if (cancelled || !containerRef.current) return;

      if (playerRef.current) {
        playerRef.current.loadVideoById(vid);
        playerRef.current.pauseVideo();
        setPlaying(false);
        setCurrentTime(0);
        return;
      }

      playerRef.current = new YT.Player(containerRef.current, {
        videoId: vid,
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
              const d = playerRef.current?.getDuration();
              if (d && d > 0) {
                setDuration(d);
              } else {
                pollDuration = setTimeout(poll, 500);
              }
            };
            poll();
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) setPlaying(true);
            else if (
              e.data === YT.PlayerState.PAUSED ||
              e.data === YT.PlayerState.ENDED
            ) {
              setPlaying(false);
              if (e.data === YT.PlayerState.ENDED) setCurrentTime(0);
            }
          },
        },
      });
    })();

    return () => {
      cancelled = true;
      clearTimeout(pollDuration);
    };
  }, [data?.videoId]);

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        if (playerRef.current?.getCurrentTime) {
          setCurrentTime(playerRef.current.getCurrentTime());
        }
      }, 250);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing]);

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return;
    if (playing) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
  }, [playing]);

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!playerRef.current || !progressRef.current || !duration) return;
      const rect = progressRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      playerRef.current.seekTo(pct * duration, true);
      setCurrentTime(pct * duration);
    },
    [duration]
  );

  const track = data?.track;
  const showProgressBar = !playing || (playing && hovering);
  const hasDuration = duration > 0;

  if (!track) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-muted-foreground">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
        <span className="text-xs">no track</span>
      </div>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        className="absolute -left-[9999px] top-0"
        aria-hidden="true"
      />
      <div
        className="flex items-center gap-2.5 px-2.5 py-1.5 min-w-[320px]"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* Album art */}
        <div className="size-9 shrink-0 rounded overflow-hidden border">
          {track.albumArt ? (
            <img
              src={track.albumArt}
              alt={track.album}
              className="size-full object-cover"
            />
          ) : (
            <div className="size-full flex items-center justify-center bg-muted text-muted-foreground">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
          )}
        </div>

        {/* Song info — shrink to fit text width */}
        <div className="flex flex-col min-w-0 shrink-0 max-w-[45%]">
          <p className="text-xs font-medium truncate leading-tight">
            {track.isNowPlaying && (
              <span className="inline-block size-1.5 rounded-full bg-green-500 mr-1.5 align-middle animate-pulse" />
            )}
            {track.name}
          </p>
          <p className="text-[10px] text-muted-foreground truncate leading-tight">
            {track.artist}
          </p>
        </div>

        {/* Progress bar or sound wave — fills remaining space */}
        <div className="flex-1 min-w-0 flex items-center gap-1.5">
          {showProgressBar && hasDuration ? (
            <>
              <div
                ref={progressRef}
                className="flex-1 h-1 bg-muted rounded-full cursor-pointer overflow-hidden"
                onClick={handleSeek}
              >
                <div
                  className="h-full bg-foreground/50 rounded-full transition-[width] duration-100"
                  style={{
                    width: `${(currentTime / duration) * 100}%`,
                  }}
                />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground tabular-nums whitespace-nowrap">
                {formatTime(currentTime)}/{formatTime(duration)}
              </span>
            </>
          ) : playing && !hovering ? (
            <AudioVisualizer playing={playing} className="w-full h-5" />
          ) : null}
        </div>

        {/* Play/pause */}
        <button
          onClick={togglePlay}
          className="size-7 shrink-0 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <polygon points="6,3 20,12 6,21" />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}
