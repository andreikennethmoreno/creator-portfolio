import { NextResponse } from "next/server";
import { getRecentTrack } from "@/lib/lastfm";
import { getYouTubeVideoId } from "@/lib/youtube";

export const dynamic = "force-dynamic";

let lastTrackKey = "";
let lastVideoId: string | null = null;

export async function GET() {
  try {
    const track = await getRecentTrack();
    let videoId: string | null = null;
    if (track) {
      const trackKey = `${track.name}|${track.artist}`;
      if (trackKey === lastTrackKey) {
        videoId = lastVideoId;
      } else {
        try {
          videoId = await getYouTubeVideoId(track.name, track.artist);
          lastTrackKey = trackKey;
          lastVideoId = videoId;
        } catch {
          console.warn("YouTube search failed, will retry on next poll");
        }
      }
    }
    return NextResponse.json({ track, videoId });
  } catch {
    return NextResponse.json({ track: null, videoId: null });
  }
}
