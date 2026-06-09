import { getTopVercelProjects } from "@/lib/vercel";
import BlurFade from "@/components/magicui/blur-fade";
import { WMCard } from "@/components/wm-card";

function FrameworkBadge({ framework }: { framework: string | null }) {
  if (!framework) return null;
  return (
    <span className="font-mono text-[10px] text-foreground/30 border border-border/40 rounded-sm px-1 py-0.5 shrink-0">
      {framework}
    </span>
  );
}

export default async function VercelProjects() {
  const projects = await getTopVercelProjects(3);

  return (
    <section id="projects">
      <WMCard
        title="vercel.projects"
        count={projects.length}
        href="https://vercel.com/dashboard"
        hrefLabel="Open Vercel Dashboard"
      >
        <BlurFade delay={0.40}>
          {projects.length > 0 ? (
            <div className="flex flex-col gap-2">
              {projects.map((project) => (
                <a
                  key={project.name}
                  href={`https://${project.deployedUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-sm border border-border/50 px-3 py-2.5 hover:bg-muted/30 transition-colors group"
                >
                  <div className="size-8 rounded-md overflow-hidden shrink-0 bg-muted/50 flex items-center justify-center">
                    <img
                      src={project.favicon}
                      alt=""
                      className="size-6 object-contain"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <span className="font-mono text-xs text-foreground/80 truncate">
                      {project.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] text-foreground/35">
                        {project.deploymentCount} deploys
                      </span>
                      <FrameworkBadge framework={project.framework} />
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span className="font-mono text-[10px] text-foreground/30 group-hover:text-foreground/60 transition-colors truncate max-w-[130px] hidden sm:block">
                      {project.deployedUrl}
                    </span>
                    <span className="font-mono text-sm text-foreground/40 group-hover:text-primary transition-colors">
                      ↗
                    </span>
                  </div>
                </a>
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
