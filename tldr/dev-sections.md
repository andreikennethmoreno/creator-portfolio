# Dev Mode Sections TL;DR

Dev mode = `CONFIG.mode === "dev"` in page.tsx. Renders hero + 4 dev sections inside `DesktopLayout`. No creator sections.

## Sections

| Section | File | Status |
|---------|------|--------|
| About | `src/components/section/about-section.tsx` | ✅ Live — bullet list, wavy underlines, YouTube view count |
| Experience | `src/components/section/experience-section.tsx` | ⏳ Placeholder only |
| Education | `src/components/section/education-section.tsx` | ⏳ Placeholder only |
| Projects | `src/components/section/projects-section.tsx` | ⏳ Placeholder only |

## About Section Details

- **Type**: Client component (`"use client"`) — fetches YouTube channel view count on mount
- **Card**: `WMCard` with `title="about"` + `BlurFade`
- **Content**: 5 bullet points about the person
- **Dynamic links**: Neon, AI-powered LMS — underlined with `decoration-wavy decoration-primary/50` (no hardcoded colors)
- **Favicons**: Google favicons API for link icons (no local PNG)
- **Footer**: "Currently building NextGen LMS" line with `ChevronRight` icon + border-top separator

### Patterns used
```tsx
// Dynamic wavy underline (uses theme primary color via CSS var)
className="underline decoration-wavy decoration-primary/50 underline-offset-4"

// Favicon from domain
<img src="https://www.google.com/s2/favicons?domain={domain}&sz=16" />
```

## Dev mode config (`CONFIG.dev`)
```tsx
dev: {
  sections: { about: true, experience: true, education: true, projects: true },
  aboutContent: {
    bullet1: "...",
    neonUrl: "https://neon.tech",
    lmsUrl: "https://nextgen-lms.vercel.app/",
    footer: "...",
  },
}
```
