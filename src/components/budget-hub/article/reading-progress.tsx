"use client";

import { motion, useScroll, useSpring } from "motion/react";

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed left-0 right-0 top-14 z-50 h-0.5 origin-left bg-[var(--bh-accent-warm)]"
      style={{ scaleX }}
      aria-hidden
    />
  );
}
