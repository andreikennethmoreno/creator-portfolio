"use client";

import type { ReactNode } from "react";
import { useDomainColor } from "@/lib/use-domain-color";

export function BrandLink({
  href,
  children,
  favicon,
}: {
  href: string;
  children: ReactNode;
  favicon?: string;
}) {
  const domain = new URL(href).hostname;
  const directFavicon = favicon ?? `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  const proxiedFavicon = `/api/favicon?url=${encodeURIComponent(directFavicon)}`;
  const color = useDomainColor(directFavicon);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-wavy decoration-2 underline-offset-4 inline-flex items-center gap-1.5 font-bold transition-colors"
      style={{
        textDecorationColor: color ? color.replace(")", " / 0.85)") : undefined,
      }}
    >
      <img
        src={proxiedFavicon}
        alt=""
        className="size-4 shrink-0"
      />
      {children}
    </a>
  );
}
