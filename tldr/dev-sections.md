# Dev Mode Sections TL;DR

Dev mode = `CONFIG.mode === "dev"` in page.tsx. Renders hero + 4 dev sections inside `DesktopLayout`. No creator sections.

## Sections

| Section | File | Status |
|---------|------|--------|
| About | `src/components/section/about-section.tsx` | ✅ Live — config-driven bullet list with inline links/bold |
| Experience | `src/components/section/experience-section.tsx` | ✅ Live — collapsible dropdown per entry, stack always visible |
| Education | `src/components/section/education-section.tsx` | ✅ Live — config-driven school + certificates list |
| Projects | `src/components/section/projects-section.tsx` | ✅ Live — config-driven accordion with screenshots |

## Projects Section Details

- **Type**: Client component (`"use client"`) — fetches Microlink screenshot for nextgen-lms on mount
- **Card**: `WMCard` with `title="projects"` + `BlurFade`
- **Data Source**: `CONFIG.dev.projects` — array of project entries
- **Each entry fields**: `id`, `name`, `description`, `stack` (string[]), `href`
- **Accordion**: Single-open (click to expand/collapse), default open = "nextgen-lms". `ChevronDown`/`ChevronRight` indicators.
- **Screenshot**: Microlink API screenshot for the first project rendered as clickable image
- **Stack tags**: `text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground` (same as experience)
- **Footer**: Centered `Button` ("View All Projects") linking to GitHub
- **Icons**: Inline GitHub SVG icon per row, `ArrowUpRight` on external links

## Education Section Details

- **Type**: Client component (`"use client"`) — no external fetches, pure config data
- **Card**: `WMCard` with `title="education"` + `BlurFade`
- **Data Source**: `CONFIG.dev.education` (school array) + `CONFIG.dev.certificates` (certificate array)
- **Education fields**: `school`, `degree`, `period`, `details` (string[])
- **Certificate fields**: `title`, `issuer`, `year`
- **Icons**: `GraduationCap` (lucide) for school, `Award` (lucide) for certificates — left-aligned
- **Period/Year**: Right-aligned in `font-mono text-muted-foreground text-xs`
- **Layout**: Single flat list inside p-6, separated by `h-px bg-border/20` divider

## About Section Details

- **Type**: Client component (`"use client"`) — fetches YouTube channel view count on mount
- **Card**: `WMCard` with `title="about"` + `BlurFade`
- **Data Source**: `CONFIG.dev.aboutSegments` — array of bullet groups, each group is an array of typed segments
- **Segment Types** (`t` field):
  - `"text"` → plain `<span>`, supports `{viewCount}` placeholder
  - `"bold"` → `<strong>` with `Eye` icon
  - `"link"` → `<BrandLink>` with underline styling
- **Dynamic data**: Fetches YouTube view count via API on mount, replaces `{viewCount}` placeholder in segments

## Experience Section Details

- **Type**: Client component (`"use client"`) — uses `useState` for collapsible toggle per entry
- **Card**: `WMCard` with `title="experience"` + `BlurFade`
- **Data Source**: `CONFIG.dev.experience` — array filtered by `visible: boolean`
- **Each entry fields**: `id`, `visible`, `company`, `location`, `role`, `period`, `active` (boolean), `responsibilities` (string[]), `stack` (string[])
- **Collapsible UI**: Responsibilities hidden behind circular toggle button (`ChevronDown` in a `size-4` bordered circle). Only one entry can be open at a time (single-toggle). Stack tags always visible below the toggle.
- **Animation**: `motion.div` with `AnimatePresence` for smooth height/opacity transition (200ms easeInOut)
- **Stack tags styling**: `inline-block text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground`

### Config structure (`CONFIG.dev`)

```tsx
dev: {
    sections: { about: true, experience: true, education: true, projects: true },
    links: {
      about: null,                              // no titlebar link
      experience: "https://www.linkedin.com/in/kennmoreno/",
      education: "https://cvsu.edu.ph/bacoor/",
      projects: "https://github.com/andreikennethmoreno",
    },
  experience: [
    {
      id: "youtube",
      visible: true,           // ← toggle individual entry visibility
      company: "Self-Employed / YouTube",
      location: "Remote",
      role: "Technical Content Creator",
      period: "October 2023 — Present",
      active: true,            // ← green dot indicator
      responsibilities: [
        "Produced and published in-depth technical tutorials...",
      ],
      stack: ["React", "Next.js", "TypeScript"],
    },
    // ...more entries
  ],
}
```

### Collapsible Toggle Pattern
```tsx
<button onClick={() => toggle(exp.id)} className="flex items-center gap-2 ...">
  <span className="inline-flex items-center justify-center size-4 rounded-full border border-border">
    <ChevronDown className="size-3 transition-transform duration-200"
      style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
  </span>
  Responsibilities
</button>
```

### Active Indicator Pattern
```tsx
{exp.active && <span className="w-2 h-2 rounded-full bg-primary" />}
```

### Period Format
```tsx
<span className="text-xs text-muted-foreground font-mono">{exp.period}</span>
```

## Patterns for New Dev Sections

When building a new dev section (like Education, Projects):

1. **Create data in `CONFIG.dev`** — typed array of objects
2. **Create component in `src/components/section/`** — use `WMCard` wrapper + `BlurFade`
3. **Wire into `page.tsx`** — add `DesktopPanel` wrapping the section (dev mode branch)
4. **Add to `CONFIG.dev.sections`** — toggle visibility
