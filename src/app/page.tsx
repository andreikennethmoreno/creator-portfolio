import { DesktopLayout } from "@/components/desktop-layout"
import { DesktopPanel } from "@/components/desktop-panel"
import HeroSection from "@/components/section/hero-section";
import InstagramCard from "@/components/section/instagram-card";
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
        <DesktopPanel sectionId="hero">
          <HeroSection />
        </DesktopPanel>
        <DesktopPanel sectionId="instagram">
          <section id="instagram">
            <InstagramCard />
          </section>
        </DesktopPanel>
        <DesktopPanel sectionId="youtube">
          <YoutubeSection />
        </DesktopPanel>
        <DesktopPanel sectionId="reading">
          <HardcoverCard />
        </DesktopPanel>
        <DesktopPanel sectionId="listening">
          <LastFmCard />
        </DesktopPanel>
        <DesktopPanel sectionId="vercel">
          <VercelProjects projects={projects} />
        </DesktopPanel>
        <DesktopPanel sectionId="support">
          <KofiCard />
        </DesktopPanel>
      </main>
    </DesktopLayout>
  );
}
