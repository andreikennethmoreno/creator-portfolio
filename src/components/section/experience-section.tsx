"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import BlurFade from "@/components/magicui/blur-fade";
import { WMCard } from "@/components/wm-card";
import { CONFIG } from "@/data/config";

export default function ExperienceSection() {
  const experiences = CONFIG.dev.experience.filter((exp) => exp.visible);
  const [openSet, setOpenSet] = useState<Set<string>>(
    () => new Set(experiences.filter((e) => e.openedByDefault).map((e) => e.id)),
  );

  const toggle = (id: string) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section id="experience">
      <WMCard title="experience" href={CONFIG.dev.links.experience} hrefLabel="LinkedIn">
        <BlurFade delay={0.04}>
          <div className="p-6 space-y-3">
            {experiences.map((exp, i) => {
              const isOpen = openSet.has(exp.id);
              return (
                <div key={exp.id}>
                  {i > 0 && <div className="h-px bg-border/20 -mx-6 mb-3" />}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">{exp.company}</span>
                          {exp.active && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{exp.role}</span>
                          <span>•</span>
                          <span>{exp.location}</span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground font-mono whitespace-nowrap shrink-0">
                        {exp.period}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {exp.stack.map((tech) => (
                        <span
                          key={tech}
                          className="inline-block text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                      <button
                        onClick={() => toggle(exp.id)}
                        className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-muted transition-colors cursor-pointer shrink-0 ml-1"
                        aria-label={isOpen ? "Collapse" : "Expand"}
                      >
                        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                          {isOpen ? "Show less" : "Show more"}
                        </span>
                        <ChevronDown
                          className="size-3 text-muted-foreground transition-transform duration-200"
                          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                        />
                      </button>
                    </div>

                    <div
                      className="grid transition-[grid-template-rows] duration-200 ease-in-out"
                      style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <ul className="space-y-1.5 pt-3">
                          {exp.responsibilities.map((r, idx) => (
                            <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                              <span className="text-foreground/50 mt-0.5 shrink-0">—</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </BlurFade>
      </WMCard>
    </section>
  );
}
