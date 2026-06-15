"use client";

import { useEffect, useState } from "react";
import { CONFIG } from "@/data/config";
import BlurFade from "@/components/magicui/blur-fade";
import { WMCard } from "@/components/wm-card";
import { getTopVercelProjects } from "@/lib/vercel";

type Project = Awaited<ReturnType<typeof getTopVercelProjects>>[number];

function FrameworkBadge({ framework }: { framework: string | null }) {
  if (!framework) return null;
  return (
    <span className="font-mono text-[10px] text-foreground/30 border border-border/40 rounded-sm px-1 py-0.5 shrink-0">
      {framework}
    </span>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!project.deployedUrl) { setLoading(false); return; }
    const url = `https://${project.deployedUrl}`;
    fetch(
      `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&screenshot[viewport][width]=1920&screenshot[viewport][height]=1080&screenshot[deviceScaleFactor]=2&screenshot[type]=png&screenshot[viewport][prefersColorScheme]=dark`
    )
      .then((r) => r.json())
      .then((data) => {
        if (data?.data?.screenshot?.url) {
          setScreenshot(data.data.screenshot.url);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [project.deployedUrl]);

  return (
    <a
      href={`https://${project.deployedUrl}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
        {/* Screenshot / skeleton */}
        {loading ? (
          <div className="w-full h-full animate-pulse bg-muted" />
        ) : screenshot ? (
          <img
            src={screenshot}
            alt={project.name}
            className="w-full h-full object-cover object-top"
            loading="lazy"
          />
        ) : (
          /* Fallback: favicon + name centred */
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-muted/60">
            <img
              src={project.favicon}
              alt=""
              className="size-8 object-contain opacity-40"
              loading="lazy"
            />
            <span className="text-xs text-muted-foreground font-mono">
              {project.deployedUrl}
            </span>
          </div>
        )}

        {/* Hover overlay — project name + framework */}
        <div className="absolute inset-0 bg-card/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 gap-1">
          <div className="flex items-center gap-1.5">
            <img
              src={project.favicon}
              alt=""
              className="size-3.5 object-contain shrink-0"
              loading="lazy"
            />
            <p className="text-xs font-medium text-foreground truncate">
              {project.name}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground">
              {project.deploymentCount} deploys
            </span>
            <FrameworkBadge framework={project.framework} />
          </div>
        </div>

        {/* URL badge — bottom right, always visible */}
        <span className="absolute bottom-1 right-1 text-[10px] font-mono bg-black/75 text-white/80 px-1.5 py-0.5 rounded leading-none truncate max-w-[calc(100%-8px)]">
          {project.deployedUrl}
        </span>
      </div>
    </a>
  );
}

export default function VercelProjects({
  projects,
  unavailable,
}: {
  projects: Awaited<ReturnType<typeof getTopVercelProjects>>;
  unavailable?: boolean;
}) {
  if (!CONFIG.sections.vercel) return null;

  return (
    <section id="projects">
      <WMCard
        title="vercel.projects"
        count={unavailable ? undefined : projects.length}
        href={unavailable ? undefined : "https://vercel.com/dashboard"}
        hrefLabel="Open Vercel Dashboard"
      >
        <BlurFade delay={0.4}>
          {unavailable ? (
            <div className="h-[200px] flex items-center justify-center">
              <p className="font-mono text-sm text-foreground/30">— not configured —</p>
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {projects.map((project) => (
                <ProjectCard key={project.name} project={project} />
              ))}
            </div>
          ) : (
            <p className="font-mono text-sm text-foreground/50">
              ~ no projects found
            </p>
          )}
        </BlurFade>
      </WMCard>
    </section>
  );
}
