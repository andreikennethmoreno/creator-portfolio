import { NextResponse } from "next/server";
import { getRecentTrack } from "@/lib/lastfm";
import { getYouTubeVideoId } from "@/lib/youtube";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const track = await getRecentTrack();
    let videoId: string | null = null;
    if (track) {
      videoId = await getYouTubeVideoId(track.name, track.artist);
    }
    return NextResponse.json({ track, videoId });
  } catch {
    return NextResponse.json({ track: null, videoId: null });
  }
}
