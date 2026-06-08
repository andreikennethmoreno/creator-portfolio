import HeroSection from "@/components/section/hero-section";
import InstagramCard from "@/components/section/instagram-card";
import ThreadsSection from "@/components/section/threads-section";
import YoutubeSection from "@/components/section/youtube-section";
import HardcoverCard from "@/components/section/hardcover-card";
import KofiCard from "@/components/KofiCard"

export default function Page() {
  return (
    <main className="min-h-dvh flex flex-col gap-14 relative">
      <HeroSection />
      <section id="instagram">
        <InstagramCard />
      </section>
      <YoutubeSection />
      <HardcoverCard />
      <ThreadsSection />
      <KofiCard />
    </main>
  );
}
