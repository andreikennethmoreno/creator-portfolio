import HeroSection from "@/components/section/hero-section";
import AboutSection from "@/components/section/about-section";
import WorkSection from "@/components/section/work-section";
import InstagramCard from "@/components/section/instagram-card";
import ThreadsSection from "@/components/section/threads-section";
import YoutubeSection from "@/components/section/youtube-section";
import HardcoverCard from "@/components/section/hardcover-card";
import KofiCard from "@/components/KofiCard"

export default function Page() {
  return (
    <main className="min-h-dvh flex flex-col gap-14 relative">
      <HeroSection />
      <AboutSection />
      <WorkSection />
      <section id="instagram">
        <InstagramCard />
      </section>
      <ThreadsSection />
      <YoutubeSection />
      <HardcoverCard />
      <KofiCard />
    </main>
  );
}
