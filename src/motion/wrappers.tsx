"use client";

import React from "react";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "./variants";

export function MotionPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {children}
    </motion.div>
  );
}

export function MotionSection({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export function AnimateList({ children, className }: { children: React.ReactNode; className?: string }) {
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
