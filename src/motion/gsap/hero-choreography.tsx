"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/utils";
import { gsap, registerGsap, useGSAP } from "@/motion/gsap/register";
import { usePrefersReducedMotion } from "@/motion/gsap/use-prefers-reduced-motion";

registerGsap();

type HeroChoreographyProps = {
  children: ReactNode;
  className?: string;
  /** Media element inside (video/img wrapper) */
  mediaSelector?: string;
  contentSelector?: string;
};

/**
 * Signature brand entrance: media scale settle + content rise.
 * One hero moment per page — do not duplicate on every route.
 */
export function GsapHeroChoreography({
  children,
  className,
  mediaSelector = "[data-gsap-hero-media]",
  contentSelector = "[data-gsap-hero-content]",
}: HeroChoreographyProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || reduced) return;

      const media = root.querySelector(mediaSelector);
      const content = root.querySelectorAll(`${contentSelector} > *`);

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (media) {
        tl.fromTo(
          media,
          { scale: 1.08, autoAlpha: 0.85 },
          { scale: 1, autoAlpha: 1, duration: 1.35 },
          0,
        );
      }

      if (content.length) {
        tl.fromTo(
          content,
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 0.75, stagger: 0.09 },
          0.25,
        );
      }
    },
    { scope: ref, dependencies: [reduced, mediaSelector, contentSelector] },
  );

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
