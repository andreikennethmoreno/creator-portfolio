"use client";

import { useCallback, useRef } from "react";

export function useDrag(
  currentX: number,
  currentY: number,
  onMove: (x: number, y: number) => void,
  onStart?: () => void,
  width?: number,
  height?: number,
) {
  const startRef = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      startRef.current = { mx: e.clientX, my: e.clientY, ox: currentX, oy: currentY };
      onStart?.();

      const handleMove = (me: MouseEvent) => {
        let newX = startRef.current.ox + me.clientX - startRef.current.mx;
        let newY = startRef.current.oy + me.clientY - startRef.current.my;

        if (width !== undefined && height !== undefined) {
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          newX = Math.max(0, Math.min(newX, vw - width));
          newY = Math.max(0, Math.min(newY, vh - height));
        }

        onMove(newX, newY);
      };

      const handleUp = () => {
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleUp);
      };

      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleUp);
    },
    [currentX, currentY, onMove, onStart, width, height],
  );

  return { onMouseDown };
}
