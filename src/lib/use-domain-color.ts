import { useEffect, useState } from "react";
import { getSwatchesSync } from "colorthief";

const SWATCH_ORDER = ["Vibrant", "DarkVibrant", "LightVibrant", "Muted", "DarkMuted", "LightMuted"] as const;

function proxyUrl(url: string) {
  return `/api/favicon?url=${encodeURIComponent(url)}`;
}

export function useDomainColor(faviconUrl: string | null) {
  const [color, setColor] = useState<string | null>(null);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!faviconUrl) return;
    let cancelled = false;

    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      try {
        const swatches = getSwatchesSync(img);
        for (const name of SWATCH_ORDER) {
          const swatch = swatches?.[name];
          if (swatch) {
            setColor(swatch.color.css("oklch"));
            return;
          }
        }
      } catch {}
    };
    img.onerror = () => {
      if (cancelled) return;
      if (!fallbackUrl) {
        try {
          const domain = new URL(faviconUrl).hostname;
          setFallbackUrl(`https://${domain}/favicon.ico`);
        } catch {}
      }
    };
    img.src = proxyUrl(faviconUrl);

    return () => { cancelled = true; };
  }, [faviconUrl]);

  useEffect(() => {
    if (!fallbackUrl) return;
    let cancelled = false;

    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      try {
        const swatches = getSwatchesSync(img);
        for (const name of SWATCH_ORDER) {
          const swatch = swatches?.[name];
          if (swatch) {
            setColor(swatch.color.css("oklch"));
            return;
          }
        }
      } catch {}
    };
    img.src = proxyUrl(fallbackUrl);

    return () => { cancelled = true; };
  }, [fallbackUrl]);

  return color;
}
