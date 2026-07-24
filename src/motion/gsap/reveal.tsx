"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/utils";
import { gsap, registerGsap, useGSAP } from "@/motion/gsap/register";
import { usePrefersReducedMotion } from "@/motion/gsap/use-prefers-reduced-motion";

registerGsap();

type RevealProps = {
  children: ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  as?: "div" | "section" | "article";
  id?: string;
};

/**
 * Scroll entrance that enhances already-visible content.
 * Reduced-motion users see content immediately with no animation.
 */
export function GsapReveal({
  children,
  className,
  y = 36,
  delay = 0,
  as: Tag = "div",
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced) return;

      gsap.fromTo(
        el,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          delay,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: ref, dependencies: [reduced, y, delay] },
  );

  return (
    <Tag ref={ref as never} id={id} className={cn(className)}>
      {children}
    </Tag>
  );
}
