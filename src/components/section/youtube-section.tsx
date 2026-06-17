"use client";

import { useEffect, useState } from "react";
import { CONFIG } from "@/data/config";
import BlurFade from "@/components/magicui/blur-fade";
import { WMCard } from "@/components/wm-card";

export default function YoutubeSection() {
  const [videos, setVideos] = useState(CONFIG.creator.youtube.fallbackVideos);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    fetch("/api/youtube-playlist")
      .then((res) => res.json())
      .then((data) => {
        if (data.unavailable) { setUnavailable(true); return; }
        if (data.videos && data.videos.length > 0) setVideos(data.videos);
      })
      .catch(() => setUnavailable(true));
  }, []);

  if (!CONFIG.creator.sections.youtube) return null;

  return (
    <section id="youtube">
      <WMCard
          title="youtube.feed"
          count={unavailable ? undefined : videos.length}
          href={unavailable ? undefined : CONFIG.creator.youtube.channelUrl}
          hrefLabel="Open YouTube"
        >
          <BlurFade delay={0.44}>
            {unavailable ? (
              <div className="h-[200px] flex items-center justify-center">
                <p className="font-mono text-sm text-muted-foreground">— not configured —</p>
              </div>
            ) : (
            <div className="grid grid-cols-2 gap-4">
              {videos.map((video) => (
                <a
                  key={video.id}
                  href={video.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-card/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {video.title}
                      </p>
                    </div>
                    <span className="absolute bottom-1 right-1 text-xs font-semibold bg-black/80 text-white px-1.5 py-0.5 rounded leading-none">
                      {video.duration}
                    </span>
                  </div>
                </a>
              ))}
            </div>
            )}
          </BlurFade>
      </WMCard>
    </section>
  );
}
