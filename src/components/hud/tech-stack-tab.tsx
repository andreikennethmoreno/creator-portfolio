'use client'

import { Code, Music, Server, Globe, BookOpen, Camera, Play, Heart } from "lucide-react"

const INTEGRATIONS = [
  { icon: Play, label: "YouTube Data API v3" },
  { icon: Camera, label: "Behold.so (Instagram)" },
  { icon: BookOpen, label: "Hardcover GraphQL API" },
  { icon: Music, label: "Last.fm API" },
  { icon: Server, label: "Vercel API" },
  { icon: Globe, label: "Microlink API" },
  { icon: Heart, label: "Ko-fi" },
]

export default function TechStackTab() {
  return (
    <div className="p-3 flex flex-col gap-3">
      <div>
        <p className="text-[10px] font-mono text-muted-foreground/50 px-1 pb-1.5 uppercase tracking-widest">
          stack
        </p>
        <div className="flex flex-wrap gap-1.5">
          {["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "shadcn/ui", "Motion"].map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-[10px] font-mono rounded-md bg-background border border-border text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-mono text-muted-foreground/50 px-1 pb-1.5 uppercase tracking-widest">
          integrations
        </p>
        <div className="flex flex-col gap-1">
          {INTEGRATIONS.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <span className="flex items-center justify-center size-6 shrink-0 rounded-md bg-background border border-border text-muted-foreground">
                <item.icon size={10} />
              </span>
              <span className="text-xs font-mono text-muted-foreground">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
