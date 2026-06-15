"use client";

import { flushSync } from "react-dom";

export function rippleTransition(
  x: number,
  y: number,
  applyChange: () => void,
  duration = 700,
) {
  const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;

  const maxRadius = Math.hypot(
    Math.max(x, viewportWidth - x),
    Math.max(y, viewportHeight - y),
  );

  const clipPath: [string, string] = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${maxRadius}px at ${x}px ${y}px)`,
  ];

  if (typeof document.startViewTransition !== "function") {
    applyChange();
    return;
  }

  const root = document.documentElement;
  root.style.setProperty("--magicui-theme-vt-clip-from", clipPath[0]);
  const cleanup = () => {
    root.style.removeProperty("--magicui-theme-vt-clip-from");
  };

  const transition = document.startViewTransition(() => {
    flushSync(() => applyChange());
  });

  if (typeof transition?.finished?.finally === "function") {
    transition.finished.finally(cleanup);
  } else {
    cleanup();
  }

  const ready = transition?.ready;
  if (ready && typeof ready.then === "function") {
    ready.then(() => {
      document.documentElement.animate(
        { clipPath },
        {
          duration,
          easing: "ease-in-out",
          fill: "forwards",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  }
}
