import { DesktopLayout } from "@/components/desktop-layout"
import { DesktopPanel } from "@/components/desktop-panel"
import HeroSection from "@/components/section/hero-section";
import InstagramCard from "@/components/section/instagram-card";
import YoutubeSection from "@/components/section/youtube-section";
import HardcoverCard from "@/components/section/hardcover-card";
import KofiCard from "@/components/KofiCard"
import LastFmCard from "@/components/section/lastfm-card"
import VercelProjects from "@/components/vercel-projects"
import LinktreeLayout from "@/components/linktree-layout"
import AboutSection from "@/components/section/about-section";
import ExperienceSection from "@/components/section/experience-section";
import EducationSection from "@/components/section/education-section";
import ProjectsSection from "@/components/section/projects-section";
import { CONFIG } from "@/data/config";
import { env } from "@/lib/env";
import { getTopVercelProjects } from "@/lib/vercel";

export const dynamic = 'force-dynamic'

export default async function Page() {
  if (CONFIG.mode === "linktree") {
    return <LinktreeLayout />;
  }

  if (CONFIG.mode === "dev") {
    return (
      <DesktopLayout>
        <main className="min-h-dvh flex flex-col gap-14 relative contents">
          <DesktopPanel sectionId="hero">
            <HeroSection />
          </DesktopPanel>
          <DesktopPanel sectionId="about">
            <AboutSection />
          </DesktopPanel>
          <DesktopPanel sectionId="experience">
            <ExperienceSection />
          </DesktopPanel>
          <DesktopPanel sectionId="education">
            <EducationSection />
          </DesktopPanel>
          <DesktopPanel sectionId="projects">
            <ProjectsSection />
          </DesktopPanel>
        </main>
      </DesktopLayout>
    );
  }

  const vercelUnavailable = !(CONFIG.creator.sections.vercel && env.vercelToken());
  const projects = vercelUnavailable ? [] : await getTopVercelProjects(4);
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
        <DesktopPanel sectionId="listening">
          <LastFmCard />
        </DesktopPanel>
        <DesktopPanel sectionId="reading">
          <HardcoverCard />
        </DesktopPanel>
        <DesktopPanel sectionId="vercel">
          <VercelProjects projects={projects} unavailable={vercelUnavailable} />
        </DesktopPanel>
        <DesktopPanel sectionId="support">
          <KofiCard />
        </DesktopPanel>
      </main>
    </DesktopLayout>
  );
}
