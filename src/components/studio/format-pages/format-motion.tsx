"use client";

import { motion, useReducedMotion, type Easing } from "motion/react";
import type { StudioFormatExperience } from "@/lib/studio-format-themes";

/**
 * Per-format motion personalities - every narrative enters and reveals
 * like the medium it is. Film drifts in slow, feeds pop, dossiers rise
 * calm. Reduced motion always collapses to a plain fade.
 */

type PageMotion = {
  initial: Record<string, number | string>;
  animate: Record<string, number | string>;
  duration: number;
  ease: Easing;
};

const PAGE_MOTION: Record<StudioFormatExperience, PageMotion> = {
  podcast: {
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    duration: 0.55,
    ease: [0.22, 1, 0.36, 1],
  },
  cinema: {
    initial: { opacity: 0, scale: 1.035 },
    animate: { opacity: 1, scale: 1 },
    duration: 0.9,
    ease: [0.25, 0.46, 0.45, 1],
  },
  vertical: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    duration: 0.5,
    ease: [0.34, 1.3, 0.64, 1],
  },
  stage: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    duration: 0.65,
    ease: [0.25, 0.46, 0.45, 1],
  },
  brief: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    duration: 0.45,
    ease: [0.22, 1, 0.36, 1],
  },
};

export function FormatPageMotion({
  experience,
  children,
}: {
  experience: StudioFormatExperience;
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const preset = PAGE_MOTION[experience];
  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : preset.initial}
      animate={reduceMotion ? { opacity: 1 } : preset.animate}
      transition={
        reduceMotion
          ? { duration: 0.2 }
          : { duration: preset.duration, ease: preset.ease }
      }
    >
      {children}
    </motion.div>
  );
}

const REVEAL_OFFSET: Record<StudioFormatExperience, Record<string, number>> = {
  podcast: { y: 24 },
  cinema: { scale: 0.985, y: 16 },
  vertical: { y: 36 },
  stage: { y: 18 },
  brief: { y: 10 },
};

export function FormatReveal({
  experience,
  children,
  className,
  delay = 0,
}: {
  experience: StudioFormatExperience;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  const offset = REVEAL_OFFSET[experience];
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, ...offset }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={
        reduceMotion
          ? { duration: 0.2, delay }
          : {
              duration: experience === "cinema" ? 0.7 : 0.5,
              delay,
              ease: [0.22, 1, 0.36, 1],
            }
      }
    >
      {children}
    </motion.div>
  );
}
