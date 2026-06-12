export const env = {
  youtube: () => process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || undefined,
  youtubeServerKey: () => process.env.YOUTUBE_API_KEY || undefined,
  behold: () => process.env.NEXT_PUBLIC_BEHOLD_FEED_ID || undefined,
  hardcoverToken: () => process.env.HARDCOVER_API_TOKEN || undefined,
  hardcoverUser: () => process.env.HARDCOVER_USER_ID || undefined,
  lastfmKey: () => process.env.LASTFM_API_KEY || undefined,
  lastfmUser: () => process.env.LASTFM_USERNAME || undefined,
  lastfmUserPublic: () => process.env.NEXT_PUBLIC_LASTFM_USERNAME || undefined,
  vercelToken: () => process.env.MY_VERCEL_API_TOKEN || undefined,
  vercelTeam: () => process.env.MY_VERCEL_TEAM_ID || undefined,
  baseUrl: () => process.env.NEXT_PUBLIC_BASE_URL || undefined,
}
