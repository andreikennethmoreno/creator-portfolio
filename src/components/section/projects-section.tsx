import BlurFade from "@/components/magicui/blur-fade";
import { WMCard } from "@/components/wm-card";

export default function ProjectsSection() {
  return (
    <section id="projects">
      <WMCard title="projects">
        <BlurFade delay={0.04}>
          <div className="flex flex-col gap-2">
            <p className="font-mono text-sm text-foreground/50">$ cat projects.json</p>
            <p className="text-foreground/80">
              projects section — placeholder
            </p>
          </div>
        </BlurFade>
      </WMCard>
    </section>
  );
}
