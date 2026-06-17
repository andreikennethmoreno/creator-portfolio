"use client";

import { useCardStyle } from "@/lib/card-style-context";
import { PanelTop, Sparkles } from "lucide-react";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function CardStyleToggle() {
  const { style, toggle } = useCardStyle();
  const isGlossy = style === "glossy";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button onClick={toggle} className="size-full flex items-center justify-center">
          {isGlossy ? (
            <Sparkles className="size-full text-foreground/50 hover:text-foreground/80 transition-colors" />
          ) : (
            <PanelTop className="size-full text-foreground/50 hover:text-foreground/80 transition-colors" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={8}
        className="rounded-xl bg-foreground text-background px-4 py-2 text-sm shadow-xl"
      >
        <p>{isGlossy ? "glass" : "flat"}</p>
        <TooltipArrow className="fill-foreground" />
      </TooltipContent>
    </Tooltip>
  );
}