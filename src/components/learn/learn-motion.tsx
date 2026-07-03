"use client";

import { AnimatePresence, motion, type Transition, type Variants } from "motion/react";
import { useReducedMotionSafe } from "@/motion/hooks";

const EASE_OUT: Transition["ease"] = [0.25, 0.1, 0.25, 1];

export const learnTabVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const learnStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

export const learnStaggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_OUT } },
};

export const learnStepAdvance: Variants = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
};

export function learnTransition(reduced: boolean, duration = 0.15): Transition {
  return reduced ? { duration: 0 } : { duration, ease: "easeOut" };
}

export function LearnTabPanel({
  tabKey,
  active,
  children,
  className,
}: {
  tabKey: string;
  active: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotionSafe();
  if (!active) return null;

  return (
    <motion.div
      key={tabKey}
      initial={reduced ? false : "initial"}
      animate="animate"
      exit="exit"
      variants={learnTabVariants}
      transition={learnTransition(reduced)}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function LearnTabPresence({
  activeTab,
  children,
}: {
  activeTab: string;
  children: (tab: string) => React.ReactNode;
}) {
  const reduced = useReducedMotionSafe();
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={activeTab}
        initial={reduced ? false : "initial"}
        animate="animate"
        exit="exit"
        variants={learnTabVariants}
        transition={learnTransition(reduced)}
      >
        {children(activeTab)}
      </motion.div>
    </AnimatePresence>
  );
}
