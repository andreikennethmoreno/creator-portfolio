/* eslint-disable @next/next/no-img-element */
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { WMCard } from "@/components/wm-card";
import { DATA } from "@/data/resume";

export default function HeroSection() {
  return (
    <section id="hero">
      <WMCard title="~/hello">
        <div className="flex items-center gap-5">
            <BlurFade delay={0.04} className="shrink-0">
              <Avatar className="size-24 md:size-32 border rounded-xl shadow-lg ring-4 ring-muted">
                <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                <AvatarFallback>{DATA.initials}</AvatarFallback>
              </Avatar>
            </BlurFade>
            <div className="flex flex-col gap-1 min-w-0">
              <BlurFadeText
                delay={0.04}
                className="text-3xl font-semibold tracking-tighter sm:text-4xl lg:text-5xl"
                yOffset={8}
                text={`Hi, I'm ${DATA.name.split(" ")[0]}`}
              />
              <BlurFadeText
                className="text-muted-foreground max-w-150 md:text-lg lg:text-xl"
                delay={0.04}
                text={DATA.description}
              />
            </div>
          </div>
      </WMCard>
    </section>
  );
}
