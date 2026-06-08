"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import type { HardcoverBook } from '@/lib/hardcover'

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return null
  const stars = Math.round(rating * 2) / 2
  return (
    <span className="text-[10px] text-amber-400">
      {'★'.repeat(Math.floor(stars))}
      {stars % 1 ? '½' : ''}
      {'☆'.repeat(5 - Math.ceil(stars))}
    </span>
  )
}

function BookCover({ book }: { book: HardcoverBook }) {
  const author = book.book.contributions[0]?.author.name ?? 'Unknown'
  const hardcoverUrl = `https://hardcover.app/books/${book.book.slug}`

  return (
    <a
      href={hardcoverUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative w-24"
    >
      {book.book.image?.url ? (
        <img
          src={book.book.image.url}
          alt={book.book.title}
          className="w-24 h-36 object-cover border rounded group-hover:border-primary transition-colors"
          loading="lazy"
        />
      ) : (
        <div className="w-24 h-36 bg-muted flex items-center justify-center border rounded">
          <span className="text-[10px] text-muted-foreground">?</span>
        </div>
      )}
      <div className="absolute inset-0 bg-card/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-start justify-end p-1.5 rounded">
        <p className="text-[10px] leading-tight text-card-foreground line-clamp-2">
          {book.book.title}
        </p>
        <p className="text-[9px] text-muted-foreground truncate">{author}</p>
        <StarRating rating={book.rating} />
      </div>
    </a>
  )
}

export function HardcoverBooksCarousel({ label, books }: { label: string; books: HardcoverBook[] }) {
  if (books.length === 0) return null

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1.5 capitalize">
        {label}
      </p>
      <Carousel opts={{ align: "start", dragFree: true }}>
        <CarouselContent className="-ml-2">
          {books.map((b) => (
            <CarouselItem key={b.id} className="pl-2 basis-auto">
              <BookCover book={b} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
