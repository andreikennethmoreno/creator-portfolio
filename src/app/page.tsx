import HeroSection from "@/components/section/hero-section";
import AboutSection from "@/components/section/about-section";
import WorkSection from "@/components/section/work-section";

export default function Page() {
  return (
    <main className="min-h-dvh flex flex-col gap-14 relative">
      <HeroSection />
      <AboutSection />
      <WorkSection />
    </main>
  );
}
