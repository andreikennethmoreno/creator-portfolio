'use client'

const STACK = [
  { label: 'framework', value: 'next.js 16 · react 19' },
  { label: 'language', value: 'typescript 5.9 strict' },
  { label: 'styling', value: 'tailwind v4 · oklch' },
  { label: 'ui', value: 'shadcn/ui new york' },
  { label: 'animation', value: 'motion v12 · vt api' },
  { label: 'deploy', value: 'vercel · isr' },
]

import { CONFIG } from "@/data/config"

const LINKS = [
  { label: 'youtube', href: CONFIG.contact.social.YouTube.url, value: '@kenroms' },
  { label: 'twitter', href: CONFIG.contact.social.Twitter.url, value: '@Kenroms' },
  { label: 'github', href: CONFIG.contact.social.GitHub.url, value: 'andreikennethmoreno' },
  { label: 'ko-fi', href: CONFIG.contact.social["Ko-fi"].url, value: 'ko-fi.com/kenroms' },
]

export default function AboutTab() {
  return (
    <div className="p-3 grid grid-cols-2 gap-x-4 gap-y-3 text-[11px] font-mono">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">WHOAMI</span>
          <p className="text-foreground leading-relaxed">Kenroms — software eng + content creator based in the Philippines.</p>
          <p className="text-muted-foreground leading-relaxed text-[10px]">building TracePaper · shipping solo products · loves books and linux ricing</p>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">STATUS</span>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-primary">available for freelance</span>
          </div>
          <p className="text-muted-foreground/60 text-[10px]">based in Cavite, PH · open to remote</p>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">CONTACT</span>
          <a href={`mailto:${CONFIG.contact.email}`} className="text-foreground hover:underline truncate">{CONFIG.contact.email}</a>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">LINKS</span>
          {LINKS.map((l) => (
            <div key={l.label} className="flex justify-between gap-2">
              <span className="text-muted-foreground w-14 shrink-0">{l.label}</span>
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline truncate text-right">{l.value}</a>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">STACK</span>
          {STACK.map((s) => (
            <div key={s.label} className="flex justify-between gap-2">
              <span className="text-muted-foreground w-20 shrink-0">{s.label}</span>
              <span className="text-foreground/80 truncate text-right">{s.value}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-1 mt-auto">
          <span className="text-muted-foreground">EDUCATION</span>
          <p className="text-foreground/80 leading-tight">Cavite State University</p>
          <p className="text-muted-foreground/60 text-[10px]">BS Computer Science · 2024</p>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">CHANNEL</span>
          <p className="text-foreground/80 leading-tight">TracePaper</p>
          <p className="text-muted-foreground/60 text-[10px] leading-relaxed">dev + tech content · builder doc format · linux ricing · build in public</p>
        </div>

        <div className="border-t border-border/30 pt-2 flex flex-col gap-0.5">
          <span className="text-muted-foreground/40 text-[10px]">this portfolio is open source</span>
          <a href="https://github.com/andreikennethmoreno/creator-portfolio" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/60 hover:text-foreground text-[10px] hover:underline">github.com/andreikennethmoreno/creator-portfolio</a>
        </div>
      </div>
    </div>
  )
}
