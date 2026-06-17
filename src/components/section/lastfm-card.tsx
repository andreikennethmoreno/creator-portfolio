import { CONFIG } from "@/data/config"
import { env } from "@/lib/env"
import BlurFade from "@/components/magicui/blur-fade"
import { WMCard } from "@/components/wm-card"
import LastFmPlayer from './lastfm-player'

export default async function LastFmCard() {
  if (!CONFIG.creator.sections.lastfm) return null;

  if (!env.lastfmKey() || !env.lastfmUserPublic()) {
    return (
      <section id="lastfm">
        <WMCard title="lastfm.feed" hrefLabel="Open Last.fm">
          <BlurFade delay={0.48}>
            <div className="h-[100px] flex items-center justify-center">
              <p className="font-mono text-sm text-muted-foreground">— not configured —</p>
            </div>
          </BlurFade>
        </WMCard>
      </section>
    );
  }

  return <LastFmPlayer />
}
