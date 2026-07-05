/**
 * GOLDRULES §5 motion tokens — single source for durations/easing.
 * Import these in components; do not hardcode raw ms values in feature code.
 *
 * @see docs/zero-gap/TASKPLAN.md
 * @see ../../GOLDRULES/MASTER-FRAMEWORK.md Section 5
 */
export const motionTokens = {
  micro: {
    durationMs: 120,
    ease: "easeOut" as const,
    framer: { duration: 0.12, ease: [0.16, 1, 0.3, 1] as const },
  },
  enter: {
    durationMs: 200,
    easeIn: "easeIn" as const,
    easeOut: "easeOut" as const,
    framer: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
  },
  layout: {
    durationMs: 280,
    spring: { type: "spring" as const, stiffness: 300, damping: 30 },
  },
  route: {
    durationMs: 300,
    ease: "easeInOut" as const,
    framer: { duration: 0.3, ease: [0.83, 0, 0.17, 1] as const },
  },
  overlay: {
    durationMs: 200,
    ease: "easeOut" as const,
    framer: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
  },
  status: {
    inMs: 150,
    holdMs: 2000,
    outMs: 200,
    ease: "easeOut" as const,
  },
} as const;

export type MotionTokenName = keyof typeof motionTokens;

/** Use with useReducedMotionSafe — opacity-only when reduced motion preferred */
export const reducedMotionFallback = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.01 },
} as const;
