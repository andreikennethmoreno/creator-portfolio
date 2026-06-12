import { NextResponse } from "next/server";

const PLAYLIST_ID = "PLX3Oq3YxWT0iZHgfDNIePM-2FSqaXQUWd";

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

export async function GET() {
  const key = process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  if (!key) {
    return NextResponse.json({ videos: [] });
  }

  try {
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&maxResults=50&key=${key}`,
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
    detailsData.items?.forEach((item: any) => {
      durationMap[item.id] = formatDuration(item.contentDetails.duration);
    });

    const videos = playlistData.items.map((item: any) => ({
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
