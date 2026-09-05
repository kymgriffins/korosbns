"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { cn } from "@/utils";

interface ParallaxWrapperProps {
  children: React.ReactNode;
  /**
   * Speed multiplier.
   * Negative values (e.g. -0.4) move slower than the scroll, creating background depth.
   * Positive values (e.g. 0.6) move faster than the scroll, creating foreground elevation.
   */
  speed?: number;
  className?: string;
  innerClassName?: string;
}

/**
 * ParallaxWrapper
 * Replicates Locomotive Scroll's `data-scroll-speed` without virtual scroll hijacking.
 * Uses GPU-accelerated translate transforms mapped to scroll progression.
 */
export function ParallaxWrapper({
  children,
  speed = 0.5,
  className,
  innerClassName,
}: ParallaxWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Calculate delta range. Sane defaults: ±75px scaled by speed.
  const distance = 80 * speed;
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={cn("relative overflow-visible", className)}>
      <motion.div
        style={{ y }}
        className={cn("will-change-transform", innerClassName)}
      >
        {children}
      </motion.div>
    </div>
  );
}
