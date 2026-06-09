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
  const [currentlyReading, recentlyRead, wantToRead, stats] = await Promise.all([
    getCurrentlyReading(),
    getRecentlyRead(15),
    getWantToRead(15),
    getReadingStats(),
  ])

  return (
    <section id="hardcover">
      <WMCard
          title="hardcover.feed"
          href="https://hardcover.app/@kenroms"
          hrefLabel="Open Hardcover"
        >
          <BlurFade delay={0.52}>
            <div className="flex flex-col gap-4">
              <HardcoverBooksCarousel label="read" books={recentlyRead} />
              <HardcoverBooksCarousel label="currently reading" books={currentlyReading} />
              <HardcoverBooksCarousel label="want to read" books={wantToRead} />
            </div>
          </BlurFade>
      </WMCard>
    </section>
  )
}
