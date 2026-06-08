export type ThreadsPost = {
  id: string
  text: string
  timestamp: string
  permalink: string
  media_type: 'TEXT_POST' | 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM' | 'AUDIO' | 'REPOST_FACADE'
  media_url?: string
  thumbnail_url?: string
  username: string
  is_quote_post: boolean
}

export async function getThreadsPosts(limit = 5): Promise<ThreadsPost[]> {
  const { THREADS_ACCESS_TOKEN, THREADS_USER_ID } = process.env

  if (!THREADS_ACCESS_TOKEN || !THREADS_USER_ID) {
    console.warn('Threads env vars not set')
    return []
  }

  const fields = 'id,text,timestamp,permalink,media_type,media_url,thumbnail_url,username,is_quote_post'

  const res = await fetch(
    `https://graph.threads.net/v1.0/me/threads` +
    `?fields=${fields}` +
    `&limit=${limit}` +
    `&access_token=${THREADS_ACCESS_TOKEN}`,
    { next: { revalidate: 3600 } }
  )

  if (!res.ok) {
    console.error('Threads fetch failed:', res.status, await res.text())
    return []
  }

  const data = await res.json()
  return data.data ?? []
}
