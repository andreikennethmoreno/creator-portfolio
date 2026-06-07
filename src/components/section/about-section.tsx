import BlurFade from "@/components/magicui/blur-fade";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DATA } from "@/data/resume";
import Markdown from "react-markdown";

export default function AboutSection() {
  return (
    <section id="about">
      <Card>
        <CardHeader>
          <BlurFade delay={0.12}>
            <CardTitle className="text-xl font-bold">About</CardTitle>
          </BlurFade>
        </CardHeader>
        <CardContent>
          <BlurFade delay={0.16}>
            <div className="prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground">
              <Markdown>
                {DATA.summary}
              </Markdown>
            </div>
          </BlurFade>
        </CardContent>
      </Card>
    </section>
  );
}
