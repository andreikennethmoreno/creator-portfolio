export async function GET() {
  const res = await fetch(
    `https://graph.threads.net/refresh_access_token` +
    `?grant_type=th_refresh_token` +
    `&access_token=${process.env.THREADS_ACCESS_TOKEN}`
  )
  const data = await res.json()
  console.log('Refreshed token expires in:', data.expires_in, 'seconds')
  return Response.json(data)
}
