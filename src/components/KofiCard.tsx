import BlurFade from "@/components/magicui/blur-fade"
import { WMCard } from "@/components/wm-card"

export default function KofiCard() {
  return (
    <section id="kofi">
      <WMCard
        title="kofi.feed"
        href="https://ko-fi.com/kenroms"
        hrefLabel="Open Ko-fi"
      >
        <BlurFade delay={0.6}>
          <p className="text-sm text-muted-foreground mb-4">
            if something here helped you, saved you time, or just didn&rsquo;t suck &mdash;
            a coffee keeps the builds going.
          </p>
          <div className="flex flex-col gap-1 mb-4">
            {[
              { label: 'coffee', amount: '$5 USD', note: 'one-time tip' },
              { label: 'large coffee', amount: '$10 USD', note: 'you\'re a legend' },
            ].map((tier) => (
              <a
                key={tier.label}
                href="https://ko-fi.com/kenroms"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border px-2 py-1 text-sm hover:bg-muted/40 transition-colors"
              >
                <span className="font-mono text-foreground">
                  &gt; {tier.label}
                </span>
                <span className="text-muted-foreground">
                  {tier.amount} &middot; {tier.note}
                </span>
              </a>
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
      </WMCard>
    </section>
  )
}
