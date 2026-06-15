import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  if (!url) return new NextResponse("Missing url", { status: 400 });

  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new NextResponse(blob, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
        "Content-Type": res.headers.get("Content-Type") ?? "image/png",
      },
    });
  } catch {
    return new NextResponse("Failed to fetch favicon", { status: 502 });
  }
}
