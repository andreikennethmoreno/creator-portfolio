import { Icons } from "@/components/icons";
import { HomeIcon } from "lucide-react";

export const DATA = {
  sections: {
    lastfm: true,
    instagram: true,
    youtube: true,
    hardcover: true,
    vercel: true,
    kofi: true,
  },
  name: "Kenroms",
  initials: "KN",
  url: "https://github.com/andreikennethmoreno",
  location: "Philippines",
  locationLink: "https://www.google.com/maps/place/philippines",
  description:
    "Software Engineer, Content Creator. Love building things and learning shit. Very active on YouTube and Twitter.",

  avatarUrl: "https://storage.ko-fi.com/cdn/useruploads/27d854e4-a478-41ec-acbe-f79865f858be_149867fb-a92d-4a0f-a16d-5e06c123c8c5.png",
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
  ],
  contact: {
    email: "kennonirom@gmail.com",
    tel: "+123456789",
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
} as const;
