import BlurFade from "@/components/magicui/blur-fade"
import { Card, CardContent } from "@/components/ui/card"
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
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/40">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-destructive/60" />
            <span className="size-2.5 rounded-full bg-primary/40" />
            <span className="size-2.5 rounded-full bg-primary/70" />
          </div>
          <span className="text-xs text-muted-foreground tracking-wide">
            hardcover.feed
          </span>
          <a
            href="https://hardcover.app/@kenroms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary transition-colors leading-none"
            aria-label="Open Hardcover"
          >
            ↗
          </a>
        </div>
        <CardContent>
          <BlurFade delay={0.52}>
            <div className="flex flex-col gap-4">
              <HardcoverBooksCarousel label="read" books={recentlyRead} />
              <HardcoverBooksCarousel label="currently reading" books={currentlyReading} />
              <HardcoverBooksCarousel label="want to read" books={wantToRead} />
            </div>
          </BlurFade>
        </CardContent>
      </Card>
    </section>
  )
}
