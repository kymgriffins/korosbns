"use client";

import { useEffect } from "react";

/** Locks document scroll — for full-viewport studio home reel. */
export function StudioViewportLock({ active }: { active: boolean }) {
  useEffect(() => {
    if (!active) return;

    const { overflow, height } = document.documentElement.style;
    const bodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = overflow;
      document.documentElement.style.height = height;
      document.body.style.overflow = bodyOverflow;
    };
  }, [active]);

  return null;
}
