"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";

/**
 * Learn route providers — motion + reduced-motion.
 * @sdp-provenance capability: CAP-learning-shell
 */
export function LmsProviders({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">{children}</MotionConfig>
  );
}
