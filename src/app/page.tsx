import { DesktopLayout } from "@/components/desktop-layout"
import { DesktopPanel } from "@/components/desktop-panel"
import HeroSection from "@/components/section/hero-section";
import InstagramCard from "@/components/section/instagram-card";
import ThreadsSection from "@/components/section/threads-section";
import YoutubeSection from "@/components/section/youtube-section";
import HardcoverCard from "@/components/section/hardcover-card";
import KofiCard from "@/components/KofiCard"
import LastFmCard from "@/components/section/lastfm-card"
import VercelProjects from "@/components/vercel-projects"
import { getTopVercelProjects } from "@/lib/vercel";

export const dynamic = 'force-dynamic'

export default async function Page() {
  const projects = await getTopVercelProjects(4);
  return (
    <DesktopLayout>
      <main className="min-h-dvh flex flex-col gap-14 relative contents">
        <DesktopPanel>
          <HeroSection />
        </DesktopPanel>
        <DesktopPanel>
          <section id="instagram">
            <InstagramCard />
          </section>
        </DesktopPanel>
        <DesktopPanel>
          <YoutubeSection />
        </DesktopPanel>
        <DesktopPanel>
          <HardcoverCard />
        </DesktopPanel>
        <DesktopPanel>
          <LastFmCard />
        </DesktopPanel>
        <DesktopPanel>
          <VercelProjects projects={projects} />
        </DesktopPanel>
        <DesktopPanel>
          <ThreadsSection />
        </DesktopPanel>
        <DesktopPanel>
          <KofiCard />
        </DesktopPanel>
      </main>
    </DesktopLayout>
  );
}
