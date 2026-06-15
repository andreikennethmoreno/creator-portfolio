"use client";

import { GraduationCap, Award } from "lucide-react";
import BlurFade from "@/components/magicui/blur-fade";
import { WMCard } from "@/components/wm-card";
import { CONFIG } from "@/data/config";

export default function EducationSection() {
  return (
    <section id="education">
      <WMCard title="education" href={CONFIG.dev.links.education} hrefLabel="CvSU Bacoor">
        <BlurFade delay={0.04}>
          <div className="p-6 space-y-3">
            {CONFIG.dev.education.map((edu, i) => (
              <div key={i} className="flex items-start justify-between gap-3">
                <div className="flex gap-3 min-w-0">
                  <GraduationCap className="size-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{edu.school}</p>
                    <p className="text-xs text-muted-foreground">{edu.degree}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground font-mono shrink-0 whitespace-nowrap">
                  {edu.period}
                </span>
              </div>
            ))}

            <div className="h-px bg-border/20" />

            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Certificates
              </p>
              {CONFIG.dev.certificates.map((cert, i) => (
                <div key={i} className="flex items-start justify-between gap-3">
                  <div className="flex gap-3 min-w-0">
                    <Award className="size-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-foreground">{cert.title}</p>
                      <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono shrink-0 whitespace-nowrap">
                    {cert.year}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </BlurFade>
      </WMCard>
    </section>
  );
}
