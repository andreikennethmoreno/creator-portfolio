"use client";

import { useEffect, useState } from "react";

import BlurFade from "@/components/magicui/blur-fade";
import { WMCard } from "@/components/wm-card";

function formatDuration(iso: string): string {
  const match = iso.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return "";
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function decodeHtml(text: string): string {
  const el = document.createElement("textarea");
  el.innerHTML = text;
  return el.value;
}

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
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    if (!apiKey) return;

    const playlistId = "PLX3Oq3YxWT0iZHgfDNIePM-2FSqaXQUWd";

    fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${apiKey}`,
    )
      .then((res) => res.json())
      .then((data) => {
        const videoIds = data.items
          .map((item: any) => item.snippet.resourceId.videoId)
          .join(",");
        return fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${apiKey}`,
        )
          .then((res) => res.json())
          .then((details) => ({ playlist: data, details }));
      })
      .then(({ playlist, details }) => {
        const durationMap: Record<string, string> = {};
        details.items.forEach((item: any) => {
          durationMap[item.id] = formatDuration(item.contentDetails.duration);
        });
        const fetched = playlist.items.map((item: any) => ({
          id: item.snippet.resourceId.videoId,
          title: decodeHtml(item.snippet.title),
          duration: durationMap[item.snippet.resourceId.videoId] || "",
          href: `https://youtu.be/${item.snippet.resourceId.videoId}`,
        }));
        if (fetched.length > 0) setVideos(fetched);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="youtube">
      <WMCard
          title="youtube.feed"
          count={videos.length}
          href="https://www.youtube.com/@kenroms"
          hrefLabel="Open YouTube"
        >
          <BlurFade delay={0.44}>
            <div className="grid grid-cols-2 gap-4 p-5">
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
