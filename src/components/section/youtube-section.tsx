"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import BlurFade from "@/components/magicui/blur-fade"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function formatDuration(iso: string): string {
  const match = iso.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
  if (!match) return ""
  const hours = match[1] ? parseInt(match[1]) : 0
  const minutes = match[2] ? parseInt(match[2]) : 0
  const seconds = match[3] ? parseInt(match[3]) : 0
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`
}

function decodeHtml(text: string): string {
  const el = document.createElement("textarea")
  el.innerHTML = text
  return el.value
}

const fallbackVideos = [
  {
    id: "WrTq4lRHEy8",
    title: "Build Your First 2D Game in Godot – Step-by-Step Beginner Guide + GitHub Source Upload",
    duration: "56:04",
    href: "https://youtu.be/WrTq4lRHEy8",
  },
  {
    id: "DupS46tLPn0",
    title: "Build & Deploy Full Stack Next.js & React CRUD App with Auth | ShadCN UI, PostgreSQL, Prisma",
    duration: "2:19:47",
    href: "https://youtu.be/DupS46tLPn0",
  },
  {
    id: "XeR_SGBUjTs",
    title: "Build an Anime Website with MyAnimeList API using React Tailwind Axios Postman | HOW TO REST API",
    duration: "2:16:53",
    href: "https://youtu.be/XeR_SGBUjTs",
  },
  {
    id: "gTD8b5Yxuuo",
    title: "Build a Full Stack CRUD App using React Tailwind Node PostgreSQL | Best practice & Industry standard",
    duration: "1:41:32",
    href: "https://youtu.be/gTD8b5Yxuuo",
  },
  {
    id: "s_DtrDkjyfA",
    title: "Build a Portfolio with Contact Page using Email JS React Bootstrap | JUST COPY PASTE! Quick and Easy",
    duration: "1:00:03",
    href: "https://youtu.be/s_DtrDkjyfA",
  },
]

export default function YoutubeSection() {
  const [videos, setVideos] = useState(fallbackVideos)

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
    if (!apiKey) return

    const playlistId = "PLX3Oq3YxWT0iZHgfDNIePM-2FSqaXQUWd"

    fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${apiKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        const videoIds = data.items.map((item: any) => item.snippet.resourceId.videoId).join(",")
        return fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${apiKey}`
        ).then((res) => res.json())
          .then((details) => ({ playlist: data, details }))
      })
      .then(({ playlist, details }) => {
        const durationMap: Record<string, string> = {}
        details.items.forEach((item: any) => {
          durationMap[item.id] = formatDuration(item.contentDetails.duration)
        })
        const fetched = playlist.items.map((item: any) => ({
          id: item.snippet.resourceId.videoId,
          title: decodeHtml(item.snippet.title),
          duration: durationMap[item.snippet.resourceId.videoId] || "",
          href: `https://youtu.be/${item.snippet.resourceId.videoId}`,
        }))
        if (fetched.length > 0) setVideos(fetched)
      })
      .catch(() => {})
  }, [])

  return (
    <section id="youtube">
      <Card>
        <CardHeader>
          <BlurFade delay={0.44}>
            <CardTitle className="text-xl font-bold">Youtube</CardTitle>
          </BlurFade>
        </CardHeader>
        <CardContent className="p-0">
          <BlurFade delay={0.48}>
            {videos.map((video, i) => (
              <div key={video.id}>
                <a
                  href={video.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-5 hover:bg-accent/30 transition-colors"
                >
                  <div className="flex gap-4">
                    <div className="relative shrink-0">
                      <img
                        src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                        alt={video.title}
                        className="w-40 h-[90px] object-cover rounded-md"
                        loading="lazy"
                      />
                      <span className="absolute bottom-1 right-1 text-[11px] font-mono bg-black/80 text-white px-1.5 py-0.5 rounded leading-none">
                        {video.duration}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground mb-1 leading-snug group-hover:text-foreground/80 transition-colors line-clamp-2">
                        {video.title}
                      </p>
                    </div>
                    <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                  </div>
                </a>
                {i < videos.length - 1 && <div className="border-t border-border/20" />}
              </div>
            ))}
            <div className="p-5 pt-3 border-t border-border/20">
              <a
                href="https://www.youtube.com/@kenroms"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                &gt; open youtube →
              </a>
            </div>
          </BlurFade>
        </CardContent>
      </Card>
    </section>
  )
}
