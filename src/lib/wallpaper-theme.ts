"use client";

type RGB = [number, number, number];
export type Palette = {
  bg: string;
  bgAlt: string;
  card: string;
  fg: string;
  fgMuted: string;
  primary: string;
  accent: string;
  border: string;
  muted: string;
  isDark: boolean;
};

function getImagePixels(img: HTMLImageElement, sampleSize = 200): RGB[] {
  const canvas = document.createElement("canvas");
  canvas.width = sampleSize;
  canvas.height = sampleSize;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
  const data = ctx.getImageData(0, 0, sampleSize, sampleSize).data;

  const pixels: RGB[] = [];
  for (let i = 0; i < data.length; i += 16) {
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
    if (a < 128) continue;
    pixels.push([r, g, b]);
  }
  return pixels;
}

function colorDistance(a: RGB, b: RGB): number {
  return Math.sqrt(
    2 * Math.pow(a[0] - b[0], 2) +
    4 * Math.pow(a[1] - b[1], 2) +
    3 * Math.pow(a[2] - b[2], 2)
  );
}

function kMeans(pixels: RGB[], k = 16, iterations = 10): RGB[] {
  const sorted = [...pixels].sort((a, b) =>
    (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2])
  );
  const step = Math.floor(sorted.length / k);
  let centroids: RGB[] = Array.from({ length: k }, (_, i) =>
    [...sorted[i * step]] as RGB
  );

  for (let iter = 0; iter < iterations; iter++) {
    const clusters: RGB[][] = Array.from({ length: k }, () => []);

    for (const pixel of pixels) {
      let minDist = Infinity;
      let closest = 0;
      for (let i = 0; i < k; i++) {
        const dist = colorDistance(pixel, centroids[i]);
        if (dist < minDist) { minDist = dist; closest = i; }
      }
      clusters[closest].push(pixel);
    }

    centroids = clusters.map((cluster, i) => {
      if (cluster.length === 0) return centroids[i];
      const avg = cluster.reduce(
        (acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]] as RGB,
        [0, 0, 0] as RGB
      );
      return avg.map(v => Math.round(v / cluster.length)) as RGB;
    });
  }

  return centroids;
}

function rgbToLinear(c: number): number {
  const n = c / 255;
  return n <= 0.04045 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
}

function rgbToOklch(r: number, g: number, b: number): [number, number, number] {
  const lr = rgbToLinear(r), lg = rgbToLinear(g), lb = rgbToLinear(b);

  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);

  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const bVal = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

  const C = Math.sqrt(a * a + bVal * bVal);
  const H = (Math.atan2(bVal, a) * 180) / Math.PI;

  return [
    Math.round(L * 10000) / 10000,
    Math.round(C * 10000) / 10000,
    ((H % 360) + 360) % 360,
  ];
}

function toOklchCss(rgb: RGB): string {
  const [l, c, h] = rgbToOklch(...rgb);
  return `oklch(${l} ${c} ${h})`;
}

function getLuminance(rgb: RGB): number {
  return 0.2126 * (rgb[0] / 255) + 0.7152 * (rgb[1] / 255) + 0.0722 * (rgb[2] / 255);
}

function darken(rgb: RGB, amount: number): RGB {
  return rgb.map(v => Math.max(0, Math.round(v * (1 - amount)))) as RGB;
}

function lighten(rgb: RGB, amount: number): RGB {
  return rgb.map(v => Math.min(255, Math.round(v + (255 - v) * amount))) as RGB;
}

function clampOklchLightness(css: string, minL: number, maxL: number): string {
  const match = css.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
  if (!match) return css;
  const l = Math.max(minL, Math.min(maxL, parseFloat(match[1])));
  return `oklch(${l} ${match[2]} ${match[3]})`;
}

function oklchFgFor(bg: string): string {
  const match = bg.match(/oklch\(([\d.]+)/);
  const l = match ? parseFloat(match[1]) : 0.5;
  return l > 0.7 ? "oklch(0 0 0)" : "oklch(1 0 0)";
}

export function buildPalette(img: HTMLImageElement): Palette {
  const pixels = getImagePixels(img);
  const colors = kMeans(pixels, 16);

  colors.sort((a, b) => getLuminance(a) - getLuminance(b));

  const darkest = colors[0];
  const darkMid = colors[2];
  const accent1 = colors[4];
  const accent2 = colors[6];
  const midtone = colors[8];
  const lightMid = colors[12];
  const brightest = colors[15];

  const isDark = getLuminance(darkest) < 0.15;

  if (isDark) {
    return {
      isDark: true,
      bg:        toOklchCss(darken(darkest, 0.1)),
      bgAlt:     toOklchCss(darkest),
      card:      toOklchCss(darkMid),
      fg:        toOklchCss(brightest),
      fgMuted:   toOklchCss(lightMid),
      primary:   toOklchCss(accent1),
      accent:    toOklchCss(darken(accent2, 0.2)),
      border:    toOklchCss(midtone),
      muted:     toOklchCss(darken(darkMid, 0.1)),
    };
  } else {
    return {
      isDark: false,
      bg:        toOklchCss(lighten(brightest, 0.3)),
      bgAlt:     toOklchCss(brightest),
      card:      toOklchCss(lighten(lightMid, 0.4)),
      fg:        toOklchCss(darken(darkest, 0.2)),
      fgMuted:   toOklchCss(darkMid),
      primary:   toOklchCss(accent1),
      accent:    toOklchCss(lighten(accent2, 0.3)),
      border:    toOklchCss(lighten(midtone, 0.2)),
      muted:     toOklchCss(lighten(lightMid, 0.2)),
    };
  }
}

export function applyPaletteToDOM(palette: Palette) {
  const root = document.documentElement;

  root.classList.toggle("dark", palette.isDark);

  const accent = clampOklchLightness(palette.accent, palette.isDark ? 0.25 : 0, palette.isDark ? 1 : 0.65);
  const primary = clampOklchLightness(palette.primary, palette.isDark ? 0.40 : 0, palette.isDark ? 1 : 0.65);

  const chart1 = clampOklchLightness(primary, 0.35, 0.7);
  const chart2 = clampOklchLightness(accent, 0.3, 0.65);
  const chart3 = clampOklchLightness(primary, 0.25, 0.6);
  const chart4 = clampOklchLightness(accent, 0.2, 0.55);
  const chart5 = clampOklchLightness(palette.isDark ? palette.fgMuted : palette.muted, 0.1, 0.45);

  const vars: Record<string, string> = {
    "--background":           palette.bg,
    "--foreground":           palette.isDark ? "oklch(0.94 0 0)" : "oklch(0.12 0 0)",
    "--card":                 palette.card,
    "--card-foreground":      palette.isDark ? "oklch(0.94 0 0)" : "oklch(0.12 0 0)",
    "--popover":              palette.card,
    "--popover-foreground":   palette.isDark ? "oklch(0.94 0 0)" : "oklch(0.12 0 0)",
    "--primary":              primary,
    "--primary-foreground":   oklchFgFor(primary),
    "--secondary":            accent,
    "--secondary-foreground": palette.isDark ? "oklch(0.94 0 0)" : "oklch(0.12 0 0)",
    "--muted":                palette.muted,
    "--muted-foreground":     palette.isDark ? "oklch(0.68 0 0)" : "oklch(0.42 0 0)",
    "--accent":               accent,
    "--accent-foreground":    palette.isDark ? "oklch(0.94 0 0)" : "oklch(0.12 0 0)",
    "--border":               palette.border,
    "--input":                palette.card,
    "--ring":                 primary,
    "--chart-1":              chart1,
    "--chart-2":              chart2,
    "--chart-3":              chart3,
    "--chart-4":              chart4,
    "--chart-5":              chart5,
    "--sidebar":              palette.bgAlt,
    "--sidebar-foreground":   palette.isDark ? "oklch(0.94 0 0)" : "oklch(0.12 0 0)",
    "--sidebar-primary":      primary,
    "--sidebar-border":       palette.border,
    "--sidebar-ring":         primary,
  };

  for (const [prop, value] of Object.entries(vars)) {
    root.style.setProperty(prop, value);
  }
}

export function extractAndApply(imgSrc: string): Promise<Palette> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const palette = buildPalette(img);
      applyPaletteToDOM(palette);
      resolve(palette);
    };
    img.onerror = reject;
    img.src = imgSrc;
  });
}
