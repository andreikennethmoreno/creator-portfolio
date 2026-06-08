import BlurFade from "@/components/magicui/blur-fade"
import { Card, CardContent } from "@/components/ui/card"

export default function KofiCard() {
  return (
    <section id="kofi">
      <Card>
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
            <a
              href="https://ko-fi.com/kenroms"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              &gt; support on ko-fi &rarr;
            </a>
          </BlurFade>
        </CardContent>
      </Card>
    </section>
  )
}
