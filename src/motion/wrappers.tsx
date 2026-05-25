"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { fadeInUp, staggerContainer, pageEnter } from "./variants";
import { ease } from "./variants";

// ─── Page-level transition wrapper ────────────────────────────────────────────
export function MotionPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageEnter}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

// ─── Section reveal on scroll ─────────────────────────────────────────────────
export function MotionSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.section
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ─── Staggered list ───────────────────────────────────────────────────────────
export function AnimateList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.ul
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </motion.ul>
  );
}

// ─── Reveal div (generic) ─────────────────────────────────────────────────────
export function Reveal({
  children,
  className,
  delay = 0,
  blur = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  blur?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, ...(blur ? { filter: "blur(6px)" } : {}) }}
      whileInView={{
        opacity: 1,
        y: 0,
        ...(blur ? { filter: "blur(0px)" } : {}),
      }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: ease.expo, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
