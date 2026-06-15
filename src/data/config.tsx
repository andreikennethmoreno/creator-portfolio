import { Icons } from "@/components/icons";
import { HomeIcon } from "lucide-react";

// ──────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH — Edit only this file
// ──────────────────────────────────────────────
//
// HOW TO SET UP:
// 1. Replace name, initials, description, avatarUrl with your own
// 2. Set `url` to your site's canonical domain (used in SEO meta/open graph)
// 3. Update contact.email and social URLs to your profiles
// 4. Set youtube.playlistId to the ID of your featured YouTube playlist
//    (the part after ?list= in the URL, e.g. PLX3Oq3YxWT...)
// 5. Replace fallbackVideos with your own video IDs/titles — these show
//    when the YouTube API key is missing or the fetch fails
// 6. Swap wallpapers: each entry needs a unique `name`, display `label`,
//    and direct image `url` (raw.githubusercontent.com or public CDN)
// 7. Update terminal bootLines/prompt/commands to match your personality
// 8. Adjust kofi.tiers for your support page's tip amounts
// 9. Toggle sections on/off via sections.* booleans
// 10. Change defaultCardStyle to "glossy" if you prefer glassmorphism
// 11. Control dock social links via dock.socials array (list any contact.social key)
// 12. Hide dock features you don't want via dock.* booleans
//     (cardStyleToggle, themeToggle, search)
// 13. Disable onboarding notifications by setting show*Notification to false
//
// Social links live under contact.social — this is the single source.
// The navbar renders them via generic Object.entries iteration.
// Individual card components access their specific entry directly.

export const CONFIG = {
  // ── Mode ────────────────────────────────────
  // "creator" | "linktree" | "dev"
  mode: "linktree" as "creator" | "linktree" | "dev",

  // ── Identity ────────────────────────────────
  name: "Kenroms",
  initials: "KN",
  // Canonical site URL — used for metadataBase, opengraph, SEO
  url: "https://github.com/andreikennethmoreno",
  description:
    "Software Engineer, Content Creator. Love building things and learning shit. Very active on YouTube and Twitter.",
  avatarUrl: "https://storage.ko-fi.com/cdn/useruploads/27d854e4-a478-41ec-acbe-f79865f858be_149867fb-a92d-4a0f-a16d-5e06c123c8c5.png",

  // ── General (app-wide toggles) ──────────────
  general: {
    defaultCardStyle: "glossy" as "default" | "glossy",
    showDesktopModeNotification: true,
    showThemeToggleNotification: true,
  },

  // ── Contact / Social Links ──────────────────
  // The SINGLE source for all social/profile URLs.
  contact: {
    email: "kennonirom@gmail.com",
    social: {
      YouTube: {
        name: "YouTube",
        url: "https://www.youtube.com/@kenroms",
        icon: Icons.youtube,
        navbar: true,
      },
      Instagram: {
        name: "Instagram",
        url: "https://www.instagram.com/ken.roms/",
        icon: Icons.instagram,
        navbar: false,
      },
      Twitter: {
        name: "Twitter",
        url: "https://twitter.com/Kenroms",
        icon: Icons.twitter,
        navbar: true,
      },
      GitHub: {
        name: "GitHub",
        url: "https://github.com/andreikennethmoreno",
        icon: Icons.github,
        navbar: true,
      },
      Hardcover: {
        name: "Hardcover",
        url: "https://hardcover.app/@Kenroms",
        icon: Icons.hardcover,
        navbar: false,
      },
      "Ko-fi": {
        name: "Ko-fi",
        url: "https://ko-fi.com/kenroms",
        icon: Icons.kofi,
        navbar: false,
      },
      email: {
        name: "Send Email",
        url: "https://mail.google.com/mail/?view=cm&fs=1&to=kennonirom@gmail.com",
        icon: Icons.email,
        navbar: true,
      },
    },
  },

  // ── Creator Mode (portfolio) ────────────────
  creator: {
    sections: {
      lastfm: true,
      instagram: true,
      youtube: true,
      hardcover: true,
      vercel: true,
      kofi: true,
    },
    navbar: [
      { href: "/", icon: HomeIcon, label: "Home" },
    ],
    dock: {
      cardStyleToggle: true,
      themeToggle: true,
      search: true,
      socials: ["YouTube", "Twitter", "GitHub", "email"],
    },
    youtube: {
      channelUrl: "https://www.youtube.com/@kenroms",
      playlistId: "PLX3Oq3YxWT0iZHgfDNIePM-2FSqaXQUWd",
      fallbackVideos: [
        { id: "WrTq4lRHEy8", title: "Build Your First 2D Game in Godot – Step-by-Step Beginner Guide + GitHub Source Upload", duration: "56:04", href: "https://youtu.be/WrTq4lRHEy8" },
        { id: "DupS46tLPn0", title: "Build & Deploy Full Stack Next.js & React CRUD App with Auth | ShadCN UI, PostgreSQL, Prisma", duration: "2:19:47", href: "https://youtu.be/DupS46tLPn0" },
        { id: "XeR_SGBUjTs", title: "Build an Anime Website with MyAnimeList API using React Tailwind Axios Postman | HOW TO REST API", duration: "2:16:53", href: "https://youtu.be/XeR_SGBUjTs" },
        { id: "gTD8b5Yxuuo", title: "Build a Full Stack CRUD App using React Tailwind Node PostgreSQL | Best practice & Industry standard", duration: "1:41:32", href: "https://youtu.be/gTD8b5Yxuuo" },
        { id: "s_DtrDkjyfA", title: "Build a Portfolio with Contact Page using Email JS React Bootstrap | JUST COPY PASTE! Quick and Easy", duration: "1:00:03", href: "https://youtu.be/s_DtrDkjyfA" },
      ],
    },
    wallpapers: [
      { name: "hillside_walk", label: "Hillside Walk", url: "https://raw.githubusercontent.com/dharmx/walls/main/nord/a_group_of_people_walking_on_a_hill.png" },
      { name: "sunset_boulevard", label: "Sunset Boulevard", url: "https://raw.githubusercontent.com/whoisYoges/lwalpapers/PicturesOnly/wallpapers/b-004.jpg" },
      { name: "blue_black_pattern", label: "Blue and Black", url: "https://images.weserv.nl/?url=raw.githubusercontent.com/dharmx/walls/main/tile/a_blue_and_black_pattern.png" },
      { name: "watercolor_town", label: "Watercolor Town", url: "https://raw.githubusercontent.com/dharmx/walls/main/unsorted/a_watercolor_of_a_town.jpg" },
      { name: "dessert_scenery", label: "Sunset Scenery", url: "https://raw.githubusercontent.com/mylinuxforwork/wallpaper/refs/heads/main/sunset-scenery-minimalist.jpg" },
      { name: "ghibli_plains", label: "Ghibli Plains", url: "https://raw.githubusercontent.com/whoisYoges/lwalpapers/PicturesOnly/wallpapers/b-003.jpg" },
      { name: "red_sun_mountains", label: "Red Sun Over Mountains", url: "https://images.weserv.nl/?url=raw.githubusercontent.com/dharmx/walls/main/solarized/a_red_sun_over_mountains.jpg" },
    ],
    terminal: {
      bootLines: [
        "booting kenroms.dev...",
        "loading modules... done.",
        "establishing connection... ok",
        "> whoami",
        "kenroms — software engineer, content creator",
        "> location",
        "Philippines 🇵🇭",
        "> status",
        "very active on YouTube and Twitter",
        "",
        "type 'help' for available commands.",
      ],
      prompt: "visitor@kenroms.dev:~$ ",
      commands: {
        whoami: "kenroms — software engineer, content creator",
        location: "Philippines 🇵🇭",
        status: "very active on YouTube and Twitter",
        contact: "kennonirom@gmail.com",
        links: "youtube: @kenroms  |  twitter: @Kenroms  |  github: kenroms",
        help: "available commands: whoami, location, status, contact, links, matrix, clear, exit",
      },
    },
    kofi: {
      url: "https://ko-fi.com/kenroms",
      tiers: [
        { label: "coffee", amount: "$5 USD", note: "one-time tip" },
        { label: "large coffee", amount: "$10 USD", note: "you're a legend" },
      ],
    },
  },

  // ── Linktree Mode ───────────────────────────
  // Ordered list of social keys (references contact.social)
  linktree: {
    links: ["YouTube", "Instagram", "Twitter", "GitHub", "email", "Ko-fi"],
    showTerminal: true,
    showDock: true,
  },

  // ── Dev Mode ────────────────────────────────
  dev: {},
} as const;

export const WALLPAPER_URLS = CONFIG.creator.wallpapers.map((w) => w.url);
export const DEFAULT_WALLPAPER_URL = WALLPAPER_URLS[0];
export const WALLPAPER_HOSTS = [
  "https://raw.githubusercontent.com",
  "https://images.weserv.nl",
];
