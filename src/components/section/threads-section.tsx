import { getThreadsPosts } from '@/lib/threads'
import BlurFade from "@/components/magicui/blur-fade"
import { Card, CardContent } from "@/components/ui/card"

export default async function ThreadsSection() {
  const posts = await getThreadsPosts(5)

  return (
    <section id="threads">
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/40">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-destructive/60" />
            <span className="size-2.5 rounded-full bg-primary/40" />
            <span className="size-2.5 rounded-full bg-primary/70" />
          </div>
          <span className="text-xs text-muted-foreground tracking-wide">
            threads.feed
          </span>
          <a
            href="https://threads.net/@ken.roms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary transition-colors leading-none"
            aria-label="Open Threads"
          >
            ↗
          </a>
        </div>
        <CardContent>
          <BlurFade delay={0.36}>
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
          </BlurFade>
        </CardContent>
      </Card>
    </section>
  )
}
