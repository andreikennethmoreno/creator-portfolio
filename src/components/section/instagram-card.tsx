import { getInstagramPosts } from "@/lib/instagram";
import BlurFade from "@/components/magicui/blur-fade";
import { Card, CardContent } from "@/components/ui/card";

export default async function InstagramCard() {
  const posts = await getInstagramPosts(6);

  return (
    <section id="instagram">
      <BlurFade delay={0.28}>
        <Card className="overflow-hidden">
          {/* WM Title Bar */}
          <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/40">
            <div className="flex items-center gap-2">
              {/* window dots */}
              <span className="size-2.5 rounded-full bg-destructive/60" />
              <span className="size-2.5 rounded-full bg-primary/40" />
              <span className="size-2.5 rounded-full bg-primary/70" />
            </div>
            <span className="text-xs text-muted-foreground tracking-wide">
              instagram.feed
            </span>
            <a
              href="https://instagram.com/ken.roms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors leading-none"
              aria-label="Open Instagram"
            >
              ↗
            </a>
          </div>

          <CardContent className="pt-3">
            <BlurFade delay={0.32}>
              {posts.length > 0 ? (
                <div className="grid grid-cols-3 gap-1">
                  {posts.map((post) => (
                    <a
                      key={post.id}
                      href={post.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative overflow-hidden rounded-sm border"
                    >
                      <img
                        src={post.sizes?.medium?.mediaUrl ?? post.mediaUrl}
                        alt={post.caption?.slice(0, 60) ?? ""}
                        className="w-full aspect-4/5 object-cover"
                        loading="lazy"
                      />
                      {post.caption && (
                        <div className="absolute inset-0 bg-card/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {post.caption}
                          </p>
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="font-mono text-sm text-muted-foreground">
                  ~ no posts found
                </p>
              )}
            </BlurFade>
          </CardContent>
        </Card>
      </BlurFade>
    </section>
  );
}