import BlurFade from "@/components/magicui/blur-fade";
import { WMCard } from "@/components/wm-card";

export default function ExperienceSection() {
  return (
    <section id="experience">
      <WMCard title="experience">
        <BlurFade delay={0.04}>
          <div className="flex flex-col gap-2">
            <p className="font-mono text-sm text-foreground/50">$ cat experience.json</p>
            <p className="text-foreground/80">
              experience section — placeholder
            </p>
          </div>
        </BlurFade>
      </WMCard>
    </section>
  );
}
