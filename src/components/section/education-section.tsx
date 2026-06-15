import BlurFade from "@/components/magicui/blur-fade";
import { WMCard } from "@/components/wm-card";

export default function EducationSection() {
  return (
    <section id="education">
      <WMCard title="education">
        <BlurFade delay={0.04}>
          <div className="flex flex-col gap-2">
            <p className="font-mono text-sm text-foreground/50">$ cat education.md</p>
            <p className="text-foreground/80">
              education section — placeholder
            </p>
          </div>
        </BlurFade>
      </WMCard>
    </section>
  );
}
