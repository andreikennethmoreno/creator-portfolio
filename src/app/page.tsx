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
    <main className="min-h-dvh flex flex-col gap-14 relative">
      <HeroSection />
      <section id="instagram">
        <InstagramCard />
      </section>
      <YoutubeSection />
      <HardcoverCard />
      <LastFmCard />
      <VercelProjects projects={projects} />
      <ThreadsSection />
      <KofiCard />
    </main>
  );
}
