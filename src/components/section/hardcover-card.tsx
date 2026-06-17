import { CONFIG } from "@/data/config"
import { env } from "@/lib/env"
import BlurFade from "@/components/magicui/blur-fade"
import { WMCard } from "@/components/wm-card"
import {
  getCurrentlyReading,
  getRecentlyRead,
  getWantToRead,
  getReadingStats,
} from '@/lib/hardcover'
import { HardcoverBooksCarousel } from "@/components/section/hardcover-books-carousel"

export default async function HardcoverCard() {
  if (!CONFIG.creator.sections.hardcover) return null;

  let currentlyReading: Awaited<ReturnType<typeof getCurrentlyReading>> = [];
  let recentlyRead: Awaited<ReturnType<typeof getRecentlyRead>> = [];
  let wantToRead: Awaited<ReturnType<typeof getWantToRead>> = [];
  let unavailable = false;

  try {
    if (!env.hardcoverToken() || !env.hardcoverUser()) {
      unavailable = true;
    } else {
      const results = await Promise.allSettled([
        getCurrentlyReading(),
        getRecentlyRead(15),
        getWantToRead(15),
        getReadingStats(),
      ]);
      if (results[0].status === "fulfilled") currentlyReading = results[0].value;
      if (results[1].status === "fulfilled") recentlyRead = results[1].value;
      if (results[2].status === "fulfilled") wantToRead = results[2].value;
      if (results.some(r => r.status === "rejected")) unavailable = true;
    }
  } catch {
    unavailable = true;
  }

  return (
    <section id="hardcover">
      <WMCard
          title="hardcover.feed"
          href={CONFIG.contact.social.Hardcover.url}
          hrefLabel="Open Hardcover"
        >
          <BlurFade delay={0.52}>
            {unavailable ? (
              <div className="h-[200px] flex items-center justify-center">
                <p className="font-mono text-sm text-muted-foreground">— not configured —</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <HardcoverBooksCarousel label="read" books={recentlyRead} />
                <HardcoverBooksCarousel label="currently reading" books={currentlyReading} />
                <HardcoverBooksCarousel label="want to read" books={wantToRead} />
              </div>
            )}
          </BlurFade>
      </WMCard>
    </section>
  )
}
