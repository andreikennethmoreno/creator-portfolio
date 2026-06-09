import { getThreadsPosts } from '@/lib/threads'
import BlurFade from "@/components/magicui/blur-fade"
import { WMCard } from "@/components/wm-card"

export default async function ThreadsSection() {
  const posts = await getThreadsPosts(5)

  return (
    <section id="threads">
      <WMCard
          title="threads.feed"
          count={posts.length}
          href="https://threads.net/@ken.roms"
          hrefLabel="Open Threads"
        >
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
      </WMCard>
    </section>
  )
}
