import { getThreadsPosts } from '@/lib/threads'
import BlurFade from "@/components/magicui/blur-fade"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ThreadsSection() {
  const posts = await getThreadsPosts(5)

  return (
    <section id="threads">
      <Card>
        <CardHeader>
          <BlurFade delay={0.36}>
            <CardTitle className="text-xl font-bold">Threads</CardTitle>
          </BlurFade>
        </CardHeader>
        <CardContent>
          <BlurFade delay={0.40}>
            {posts.length > 0 ? (
              <div className="flex flex-col gap-3">
                {posts.map((post) => (
                  <a
                    key={post.id}
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-md border p-3 hover:bg-muted/50 transition-colors"
                  >
                    <p className="text-sm text-foreground line-clamp-3">
                      {post.text}
                    </p>
                    {post.media_url && (
                      <img
                        src={post.media_url}
                        alt=""
                        className="mt-2 rounded-md w-full object-cover max-h-60"
                        loading="lazy"
                      />
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(post.timestamp).toLocaleDateString()}
                    </p>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">no threads found</p>
            )}

            <a
              href="https://threads.net/@ken.roms"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              &gt; open threads →
            </a>
          </BlurFade>
        </CardContent>
      </Card>
    </section>
  )
}
