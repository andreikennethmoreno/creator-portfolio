import { env } from "@/lib/env"

const HARDCOVER_ENDPOINT = 'https://api.hardcover.app/v1/graphql'

async function hardcoverQuery<T>(query: string): Promise<T | null> {
  const res = await fetch(HARDCOVER_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': env.hardcoverToken() ?? '',
    },
    body: JSON.stringify({ query }),
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    console.error('Hardcover fetch failed:', res.status)
    return null
  }

  const json = await res.json()
  if (json.errors) {
    console.error('Hardcover GraphQL errors:', json.errors)
    return null
  }

  return json.data
}

export type HardcoverBook = {
  id: number
  status_id: number
  rating: number | null
  date_added: string
  book: {
    title: string
    slug: string
    pages: number | null
    image: { url: string } | null
    contributions: { author: { name: string } }[]
  }
}

export async function getCurrentlyReading(): Promise<HardcoverBook[]> {
  const userId = env.hardcoverUser()
  const data = await hardcoverQuery<{ user_books: HardcoverBook[] }>(`
    query CurrentlyReading {
      user_books(
        where: {
          user_id: {_eq: ${userId}}
          status_id: {_eq: 2}
        }
        order_by: {updated_at: desc}
      ) {
        id
        status_id
        rating
        date_added
        book {
          title
          slug
          pages
          image { url }
          contributions {
            author { name }
          }
        }
      }
    }
  `)
  return data?.user_books ?? []
}

export async function getRecentlyRead(limit = 5): Promise<HardcoverBook[]> {
  const userId = env.hardcoverUser()
  const data = await hardcoverQuery<{ user_books: HardcoverBook[] }>(`
    query RecentlyRead {
      user_books(
        where: {
          user_id: {_eq: ${userId}}
          status_id: {_eq: 3}
        }
        order_by: {date_added: desc}
        limit: ${limit}
      ) {
        id
        status_id
        rating
        date_added
        book {
          title
          slug
          pages
          image { url }
          contributions {
            author { name }
          }
        }
      }
    }
  `)
  return data?.user_books ?? []
}

export async function getWantToRead(limit = 5): Promise<HardcoverBook[]> {
  const userId = env.hardcoverUser()
  const data = await hardcoverQuery<{ user_books: HardcoverBook[] }>(`
    query WantToRead {
      user_books(
        where: {
          user_id: {_eq: ${userId}}
          status_id: {_eq: 1}
        }
        order_by: {date_added: desc}
        limit: ${limit}
      ) {
        id
        status_id
        rating
        date_added
        book {
          title
          slug
          pages
          image { url }
          contributions {
            author { name }
          }
        }
      }
    }
  `)
  return data?.user_books ?? []
}

export type ReadingStats = {
  total: number
  avgRating: number
}

export async function getReadingStats(): Promise<ReadingStats> {
  const userId = env.hardcoverUser()
  const data = await hardcoverQuery<{
    user_books_aggregate: { aggregate: { count: number; avg: { rating: number } } }
  }>(`
    query ReadingStats {
      user_books_aggregate(
        where: {
          user_id: {_eq: ${userId}}
          status_id: {_eq: 3}
        }
      ) {
        aggregate {
          count
          avg { rating }
        }
      }
    }
  `)
  return {
    total: data?.user_books_aggregate.aggregate.count ?? 0,
    avgRating: data?.user_books_aggregate.aggregate.avg?.rating ?? 0,
  }
}
