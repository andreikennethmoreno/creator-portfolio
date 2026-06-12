import { WALLPAPER_URLS, DEFAULT_WALLPAPER_URL, WALLPAPER_HOSTS } from "@/lib/wallpaper-data";

import Navbar from "@/components/navbar";
import { WallpaperBackground } from "@/components/wallpaper-background";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WallpaperProvider } from "@/lib/wallpaper-context";
import { CardStyleProvider } from "@/lib/card-style-context";
import { DesktopModeProvider } from "@/lib/desktop-mode-context";
import { WindowManagerProvider } from "@/lib/window-manager-context";
import { LayoutShell } from "@/components/layout-shell";
import { MusicPlayerProvider } from "@/lib/music-player-context";
import HiddenIframeContainer from "@/components/hidden-iframe-container";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const DEFAULT_WALLPAPER = DEFAULT_WALLPAPER_URL;

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(DATA.url),
  title: {
    default: DATA.name,
    template: `%s | ${DATA.name}`,
  },
  description: DATA.description,
  openGraph: {
    title: `${DATA.name}`,
    description: DATA.description,
    url: DATA.url,
    siteName: `${DATA.name}`,
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: `${DATA.name}`,
    card: "summary_large_image",
  },
  verification: {
    google: "",
    yandex: "",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let initialTrack = null
  let initialVideoId = null
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/lastfm`, { next: { revalidate: 60 } })
    if (res.ok) {
      const data = await res.json()
      initialTrack = data.track ?? null
      initialVideoId = data.videoId ?? null
    }
  } catch {}

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased relative",
          geist.variable,
          geistMono.variable,
        )}
      >
        {WALLPAPER_HOSTS.map((host) => (
          <link key={host} rel="preconnect" href={host} />
        ))}
        <link rel="preload" as="image" href={DEFAULT_WALLPAPER_URL} fetchPriority="high" />
        {WALLPAPER_URLS.slice(1).map((url) => (
          <link key={url} rel="preload" as="image" href={url} />
        ))}
        <div
          aria-hidden="true"
          className="hidden"
          dangerouslySetInnerHTML={{
            __html: `<script>(function(){try{var e=localStorage.getItem("theme")||(window.matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light");document.documentElement.classList.add(e)}catch(e){}})()<\/script>`,
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="light">
          <TooltipProvider delayDuration={0}>
            <WallpaperProvider defaultUrl={DEFAULT_WALLPAPER}>
              <WallpaperBackground />
              <DesktopModeProvider>
              <WindowManagerProvider>
              <CardStyleProvider>
                 <MusicPlayerProvider initialTrack={initialTrack} initialVideoId={initialVideoId}>
                     <HiddenIframeContainer />
                     <div className="absolute inset-0 top-0 left-0 right-0 h-[100px] overflow-hidden z-0"></div>
                     <LayoutShell>
                       {children}
                     </LayoutShell>
                     <Navbar />
                 </MusicPlayerProvider>
              </CardStyleProvider>
              </WindowManagerProvider>
              </DesktopModeProvider>
            </WallpaperProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
