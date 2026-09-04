"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";
import { cn } from "@/utils";

type ScrollMotionProgressProps = {
  className?: string;
};

/**
 * Universal Scroll Motion Token
 * Ultra-thin physics-smoothed momentum bar tracking user scroll depth across the page.
 */
export function ScrollMotionProgress({ className }: ScrollMotionProgressProps) {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  if (reduced) return null;

  return (
    <div
      className={cn(
        "absolute inset-x-0 bottom-0 h-[2px] overflow-hidden pointer-events-none z-50",
        className,
      )}
      aria-hidden="true"
    >
      <motion.div
        className="h-full w-full origin-left bg-gradient-to-r from-primary via-sky-400 to-primary shadow-[0_0_8px_rgba(37,99,235,0.6)]"
        style={{ scaleX }}
      />
    </div>
  );
}
