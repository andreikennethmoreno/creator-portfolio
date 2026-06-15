"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, ArrowUpRight } from "lucide-react";
import BlurFade from "@/components/magicui/blur-fade";
import { WMCard } from "@/components/wm-card";
import { CONFIG } from "@/data/config";

export default function ProjectsSection() {
  const projects = CONFIG.dev.projects;
  const [expanded, setExpanded] = useState("nextgen-lms");
  const [screenshot, setScreenshot] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://api.microlink.io/?url=https://nextgen-lms.vercel.app&screenshot=true&meta=false")
      .then((res) => res.json())
      .then((data: any) => {
        if (data?.data?.screenshot?.url) {
          setScreenshot(data.data.screenshot.url);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="projects">
      <WMCard title="projects" href={CONFIG.dev.links.projects} hrefLabel="GitHub">
        <BlurFade delay={0.04}>
          <div className="p-6 space-y-3">
            {projects.map((proj, i) => (
              <div key={proj.id}>
                {i > 0 && <div className="h-px bg-border/20 -mx-6 mb-3" />}
                <div className="flex items-center justify-between gap-2">
                  <a
                    href={proj.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    {proj.name}
                    <ArrowUpRight className="size-3.5" />
                  </a>
                  <button
                    onClick={() => setExpanded(expanded === proj.id ? "" : proj.id)}
                    className="shrink-0 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    aria-label={expanded === proj.id ? "Collapse" : "Expand"}
                  >
                    {expanded === proj.id ? (
                      <ChevronDown className="size-4" />
                    ) : (
                      <ChevronRight className="size-4" />
                    )}
                  </button>
                </div>

                <div
                  className="grid transition-[grid-template-rows] duration-200 ease-in-out"
                  style={{ gridTemplateRows: expanded === proj.id ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div className="pt-3 space-y-3">
                      {proj.id === "nextgen-lms" && screenshot && (
                        <a
                          href={proj.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <img
                            src={screenshot}
                            alt="NextGen LMS landing page"
                            className="w-full rounded-md border border-border/40"
                          />
                        </a>
                      )}
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {proj.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {proj.stack.map((tech) => (
                          <span
                            key={tech}
                            className="inline-block text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <p className="font-mono text-sm text-foreground/50 text-center pt-2">
              $ <a href="https://github.com/andreikennethmoreno" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">view all projects</a>
            </p>
          </div>
        </BlurFade>
      </WMCard>
    </section>
  );
}
