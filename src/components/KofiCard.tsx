import { CONFIG } from "@/data/config"
import BlurFade from "@/components/magicui/blur-fade"
import { WMCard } from "@/components/wm-card"

const TIERS = CONFIG.kofi.tiers

export default function KofiCard() {
  if (!CONFIG.sections.kofi) return null;
  return (
    <section id="kofi">
      <WMCard
        title="kofi.feed"
        href={CONFIG.kofi.url}
        hrefLabel="Open Ko-fi"
      >
        <BlurFade delay={0.6}>
          <div className="grid grid-cols-[140px_1fr] -m-3">
            <div className="relative flex items-center justify-center overflow-hidden">
              <img
                src="/holdingsign.gif"
                alt="Ko-fi"
                className="h-52 w-full object-cover"
                style={{ imageRendering: 'auto', filter: 'brightness(1.02) contrast(1.02) blur(0.4px)' }}
              />
              <span className="absolute inset-0 flex items-center justify-center pt-18 text-[11px] font-mono font-bold text-black/90 leading-tight text-center pointer-events-none">
                good<br />karma
              </span>
            </div>

            <div className="flex flex-col gap-2 justify-center pr-3">
              {TIERS.map((tier) => (
                <a
                  key={tier.label}
                  href={CONFIG.kofi.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between border border-border/50 px-3 py-2 rounded-lg text-sm hover:bg-muted/30 transition-colors"
                >
                  <span className="font-mono text-foreground text-xs">
                    &gt; {tier.label}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {tier.amount}
                  </span>
                </a>
              ))}
              <a
                href={`mailto:${CONFIG.contact.email}`}
                className="text-[10px] font-mono text-muted-foreground/40 hover:text-foreground transition-colors text-center pt-1"
              >
                or say hi
              </a>
            </div>
          </div>
        </BlurFade>
      </WMCard>
    </section>
  );
}
