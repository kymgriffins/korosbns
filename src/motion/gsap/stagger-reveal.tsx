"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/utils";
import { gsap, registerGsap, useGSAP } from "@/motion/gsap/register";
import { usePrefersReducedMotion } from "@/motion/gsap/use-prefers-reduced-motion";

registerGsap();

type StaggerRevealProps = {
  children: ReactNode;
  className?: string;
  /** Child selector inside scope */
  itemSelector?: string;
  stagger?: number;
  y?: number;
};

/** Stagger children once into view — use for programme grids / galleries, not every fold. */
export function GsapStaggerReveal({
  children,
  className,
  itemSelector = "[data-gsap-item]",
  stagger = 0.1,
  y = 28,
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || reduced) return;
      const items = root.querySelectorAll(itemSelector);
      if (!items.length) return;

      gsap.fromTo(
        items,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 85%",
            once: true,
          },
        },
      );
    },
    { scope: ref, dependencies: [reduced, itemSelector, stagger, y] },
  );

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
