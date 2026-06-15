"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import BlurFade from "@/components/magicui/blur-fade";
import { WMCard } from "@/components/wm-card";
import { BrandLink } from "@/components/brand-link";
import { CONFIG } from "@/data/config";

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

type Segment = (typeof CONFIG.dev.aboutSegments)[number][number];

function renderSegment(seg: Segment, viewCount: string) {
  const content = seg.c.replace("{viewCount}", viewCount);

  if (seg.t === "bold") {
    return (
      <span key={content} className="inline-flex items-center gap-1">
        <Eye className="size-3.5 opacity-70" />
        <strong>{content}</strong>
      </span>
    );
  }

  if (seg.t === "link") {
    return <BrandLink key={seg.h} href={seg.h}>{content}</BrandLink>;
  }

  return <span key={content}>{content}</span>;
}

export default function AboutSection() {
  const [viewCount, setViewCount] = useState<string>(formatNumber(100000));

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    if (!apiKey) return;

    fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&forHandle=@kenroms&key=${apiKey}`,
    )
      .then((res) => res.json())
      .then((data: any) => {
        const views = data?.items?.[0]?.statistics?.viewCount;
        if (views) {
          setViewCount(formatNumber(Number(views)));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="about">
      <WMCard title="about" hideDots>
        <BlurFade delay={0.04}>
          <div className="p-6 space-y-3">
            <ul className="space-y-2 text-sm leading-relaxed">
              {CONFIG.dev.aboutSegments.map((bullet, i) => (
                <li key={i} className="flex gap-2">
                  <span className="opacity-60 mt-0.5 shrink-0">•</span>
                  <span>
                    {bullet.map((seg) => renderSegment(seg, viewCount))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </BlurFade>
      </WMCard>
    </section>
  );
}
