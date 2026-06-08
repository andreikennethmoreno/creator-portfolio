import BlurFade from "@/components/magicui/blur-fade"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
      <Card>
        <CardHeader>
          <BlurFade delay={0.52}>
            <CardTitle className="text-xl font-bold">Reading</CardTitle>
          </BlurFade>
        </CardHeader>
        <CardContent>
          <BlurFade delay={0.56}>
            <div className="flex items-center justify-between mb-3">
              
            </div>
            <div className="flex flex-col gap-4">
              <HardcoverBooksCarousel label="read" books={recentlyRead} />
              <HardcoverBooksCarousel label="currently reading" books={currentlyReading} />
              <HardcoverBooksCarousel label="want to read" books={wantToRead} />
            </div>
            <a
              href="https://hardcover.app/@kenroms"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              &gt; open hardcover →
            </a>
          </BlurFade>
        </CardContent>
      </Card>
    </section>
  )
}
