"use client";

import { Download } from "lucide-react";
import BlurFade from "@/components/magicui/blur-fade";
import { WMCard } from "@/components/wm-card";
import { CONFIG } from "@/data/config";

export default function ResumeSection() {
  return (
    <section id="resume">
      <WMCard title="resume" href={CONFIG.dev.links.resume} hrefLabel="Download Resume">
        <BlurFade delay={0.04}>
          <div className="p-6 flex items-center justify-center">
            <a
              href={CONFIG.dev.links.resume}
              download
              className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors group"
            >
              <Download className="size-4 group-hover:-translate-y-0.5 transition-transform" />
              download resume (pdf)
            </a>
          </div>
        </BlurFade>
      </WMCard>
    </section>
  );
}
