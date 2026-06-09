import BlurFade from "@/components/magicui/blur-fade"
import { Card, CardContent } from "@/components/ui/card"

export default function KofiCard() {
  return (
    <section id="kofi">
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/40">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-destructive/60" />
            <span className="size-2.5 rounded-full bg-primary/40" />
            <span className="size-2.5 rounded-full bg-primary/70" />
          </div>
          <span className="text-xs text-muted-foreground tracking-wide">
            kofi.feed
          </span>
          <a
            href="https://ko-fi.com/kenroms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary transition-colors leading-none"
            aria-label="Open Ko-fi"
          >
            ↗
          </a>
        </div>
        <CardContent className="pt-6">
          <BlurFade delay={0.6}>
            <p className="text-sm text-muted-foreground mb-4">
              if something here helped you, saved you time, or just didn&rsquo;t suck &mdash;
              a coffee keeps the builds going.
            </p>
            <div className="flex flex-col gap-1 mb-4">
              {[
                { label: 'coffee', amount: '₱150', note: 'one-time tip' },
                { label: 'large coffee', amount: '₱300', note: 'you\'re a legend' },
              ].map((tier) => (
                <div
                  key={tier.label}
                  className="flex items-center justify-between border px-2 py-1 text-sm"
                >
                  <span className="font-mono text-foreground">
                    &gt; {tier.label}
                  </span>
                  <span className="text-muted-foreground">
                    {tier.amount} &middot; {tier.note}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              want to collab or just say hi? &rarr;{" "}
              <a
                href="mailto:kennonirom@gmail.com"
                className="hover:text-foreground transition-colors"
              >
                kennonirom@gmail.com
              </a>
            </p>
          </BlurFade>
        </CardContent>
      </Card>
    </section>
  )
}
