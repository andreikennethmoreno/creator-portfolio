"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { DockIcon } from "@/components/magicui/dock";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { LastFmTrack } from "@/lib/lastfm";

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

export default function MiniPlayer() {
  const [data, setData] = useState<TrackData | null>(null);
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

    (async () => {
      await loadYouTubeAPI();
      if (cancelled || !containerRef.current) return;

      if (playerRef.current) {
        playerRef.current.loadVideoById(vid);
        playerRef.current.pauseVideo();
        setPlaying(false);
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
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) setPlaying(true);
            else if (
              e.data === YT.PlayerState.PAUSED ||
              e.data === YT.PlayerState.ENDED
            )
              setPlaying(false);
          },
        },
      });
    })();

    return () => {
      cancelled = true;
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

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return;
    if (playing) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
  }, [playing]);

  const track = data?.track;

  return (
    <>
      <div
        ref={containerRef}
        className="absolute -left-[9999px] top-0"
        aria-hidden="true"
      />
      {track ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={togglePlay} className="block">
              <DockIcon className="rounded-xl size-full bg-background p-0 overflow-hidden backdrop-blur-3xl border border-border transition-colors">
                <div className="relative size-full">
                  {track.albumArt ? (
                    <img
                      src={track.albumArt}
                      alt={track.album}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="size-full flex items-center justify-center bg-muted text-muted-foreground">
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
                    </div>
                  )}
                  {playing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <rect x="6" y="4" width="4" height="16" rx="1" />
                        <rect x="14" y="4" width="4" height="16" rx="1" />
                      </svg>
                    </div>
                  )}
                </div>
              </DockIcon>
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            sideOffset={8}
            className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm shadow-xl"
          >
            <p className="font-medium truncate max-w-[160px]">{track.name}</p>
            <p className="text-xs opacity-80 truncate max-w-[160px]">
              {track.artist}
            </p>
            <TooltipArrow className="fill-primary" />
          </TooltipContent>
        </Tooltip>
      ) : (
        <DockIcon className="rounded-xl size-full bg-background p-0 flex items-center justify-center backdrop-blur-3xl border border-border transition-colors">
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
        </DockIcon>
      )}
    </>
  );
}
