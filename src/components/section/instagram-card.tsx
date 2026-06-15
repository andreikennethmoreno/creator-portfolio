import { CONFIG } from "@/data/config";
import { getInstagramPosts } from "@/lib/instagram";
import { env } from "@/lib/env";
import BlurFade from "@/components/magicui/blur-fade";
import { WMCard } from "@/components/wm-card";

export default async function InstagramCard() {
  if (!CONFIG.sections.instagram) return null;

  let posts: Awaited<ReturnType<typeof getInstagramPosts>> = [];
  let unavailable = false;
  try {
    if (!env.behold()) {
      unavailable = true;
    } else {
      posts = await getInstagramPosts(6);
    }
  } catch {
    unavailable = true;
  }

  return (
    <section id="instagram">
      <WMCard
        title="instagram.feed"
        count={unavailable ? undefined : posts.length}
        href={CONFIG.contact.social.Instagram.url}
        hrefLabel="Open Instagram"
      >
        <BlurFade delay={0.28}>
          {unavailable ? (
            <div className="h-[200px] flex items-center justify-center">
              <p className="font-mono text-sm text-foreground/30">— not configured —</p>
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-3 gap-1">
              {posts.map((post) => (
                <a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-sm border border-border/50"
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
            <p className="font-mono text-sm text-foreground/50">
              ~ no posts found
            </p>
          )}
        </BlurFade>
      </WMCard>
    </section>
  );
}