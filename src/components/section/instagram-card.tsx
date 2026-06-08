import { getInstagramPosts } from '@/lib/instagram'
import BlurFade from "@/components/magicui/blur-fade"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function InstagramCard() {
  const posts = await getInstagramPosts(6)

  return (
    <section id="instagram">
      <Card>
        <CardHeader>
          <BlurFade delay={0.28}>
            <CardTitle className="text-xl font-bold">Instagram</CardTitle>
          </BlurFade>
        </CardHeader>
        <CardContent>
          <BlurFade delay={0.32}>
            {posts.length > 0 ? (
              <div className="grid grid-cols-3 gap-1">
                {posts.map((post) => (
                  <a
                    key={post.id}
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden rounded-md border"
                  >
                    <img
                      src={post.sizes?.medium?.mediaUrl ?? post.mediaUrl}
                      alt={post.caption?.slice(0, 60) ?? ''}
                      className="w-full aspect-[4/5] object-cover"
                      loading="lazy"
                    />
                    {post.caption && (
                      <div className="absolute inset-0 bg-card/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {post.caption}
                        </p>
                      </div>
                    )}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">no posts found</p>
            )}

            <a
              href="https://instagram.com/ken.roms"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              &gt; open instagram →
            </a>
          </BlurFade>
        </CardContent>
      </Card>
    </section>
  )
}
