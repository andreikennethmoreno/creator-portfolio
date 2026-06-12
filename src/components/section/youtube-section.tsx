"use client";

import { useEffect, useState } from "react";

import { DATA } from "@/data/resume";
import BlurFade from "@/components/magicui/blur-fade";
import { WMCard } from "@/components/wm-card";

const fallbackVideos = [
  {
    id: "WrTq4lRHEy8",
    title:
      "Build Your First 2D Game in Godot – Step-by-Step Beginner Guide + GitHub Source Upload",
    duration: "56:04",
    href: "https://youtu.be/WrTq4lRHEy8",
  },
  {
    id: "DupS46tLPn0",
    title:
      "Build & Deploy Full Stack Next.js & React CRUD App with Auth | ShadCN UI, PostgreSQL, Prisma",
    duration: "2:19:47",
    href: "https://youtu.be/DupS46tLPn0",
  },
  {
    id: "XeR_SGBUjTs",
    title:
      "Build an Anime Website with MyAnimeList API using React Tailwind Axios Postman | HOW TO REST API",
    duration: "2:16:53",
    href: "https://youtu.be/XeR_SGBUjTs",
  },
  {
    id: "gTD8b5Yxuuo",
    title:
      "Build a Full Stack CRUD App using React Tailwind Node PostgreSQL | Best practice & Industry standard",
    duration: "1:41:32",
    href: "https://youtu.be/gTD8b5Yxuuo",
  },
  {
    id: "s_DtrDkjyfA",
    title:
      "Build a Portfolio with Contact Page using Email JS React Bootstrap | JUST COPY PASTE! Quick and Easy",
    duration: "1:00:03",
    href: "https://youtu.be/s_DtrDkjyfA",
  },
];

export default function YoutubeSection() {
  const [videos, setVideos] = useState(fallbackVideos);

  useEffect(() => {
    fetch("/api/youtube-playlist")
      .then((res) => res.json())
      .then((data) => {
        if (data.videos && data.videos.length > 0) setVideos(data.videos);
      })
      .catch(() => {});
  }, []);

  if (!DATA.sections.youtube) return null;

  return (
    <section id="youtube">
      <WMCard
          title="youtube.feed"
          count={videos.length}
          href="https://www.youtube.com/@kenroms"
          hrefLabel="Open YouTube"
        >
          <BlurFade delay={0.44}>
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
          </BlurFade>
      </WMCard>
    </section>
  );
}
