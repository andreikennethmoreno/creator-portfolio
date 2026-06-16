import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { CONFIG } from "@/data/config";

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

function parseDurationToSeconds(iso: string): number {
  const match = iso.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return 0;
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;
  return hours * 3600 + minutes * 60 + seconds;
}

function extractHandle(channelUrl: string): string | null {
  const match = channelUrl.match(/youtube\.com\/@([^/?]+)/);
  return match ? match[1] : null;
}

async function getUploadsPlaylistId(
  handle: string,
  key: string,
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${handle}&key=${key}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads ?? null;
  } catch {
    return null;
  }
}

export async function GET() {
  const key = env.youtubeServerKey() || env.youtube();
  if (!key) {
    return NextResponse.json({ videos: [] });
  }

  try {
    // Use explicit playlistId if configured, otherwise derive from channel URL
    let playlistId: string | null = CONFIG.creator.youtube.playlistId;
    if (!playlistId) {
      const handle = extractHandle(CONFIG.creator.youtube.channelUrl);
      if (!handle) return NextResponse.json({ videos: [] });
      const uploadsId = await getUploadsPlaylistId(handle, key);
      if (!uploadsId) return NextResponse.json({ videos: [] });
      playlistId = uploadsId;
    }

    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${key}`,
      { next: { revalidate: 3600 } },
    );
    if (!playlistRes.ok) {
      return NextResponse.json({ videos: [] });
    }
    const playlistData = await playlistRes.json();
    const videoIds = playlistData.items
      .map((item: any) => item.snippet.resourceId.videoId)
      .join(",");

    const detailsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${key}`,
      { next: { revalidate: 3600 } },
    );
    const detailsData = await detailsRes.json();
    const durationMap: Record<string, string> = {};
    const secondsMap: Record<string, number> = {};
    detailsData.items?.forEach((item: any) => {
      const iso = item.contentDetails.duration;
      durationMap[item.id] = formatDuration(iso);
      secondsMap[item.id] = parseDurationToSeconds(iso);
    });

    const videoType: string = CONFIG.creator.youtube.videoType;
    const videos = playlistData.items
      .filter((item: any) => {
        const sec = secondsMap[item.snippet.resourceId.videoId] || 0;
        if (videoType === "short") return sec > 0 && sec <= 60;
        if (videoType === "long") return sec > 60;
        return true;
      })
      .map((item: any) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        duration: durationMap[item.snippet.resourceId.videoId] || "",
        href: `https://youtu.be/${item.snippet.resourceId.videoId}`,
      }));

    return NextResponse.json({ videos });
  } catch {
    return NextResponse.json({ videos: [] });
  }
}
