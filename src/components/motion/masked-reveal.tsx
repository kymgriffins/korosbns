"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { cn } from "@/utils";

interface MaskedRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  innerClassName?: string;
  as?: "span" | "div" | "p" | "h1" | "h2" | "h3";
}

/**
 * MaskedReveal
 * Typographic emergence primitive inspired by Locomotive Scroll & Awwwards editorial sites.
 * Elements emerge from beneath an overflow: hidden clipping container via GPU-accelerated translate.
 */
export function MaskedReveal({
  children,
  delay = 0,
  duration = 0.85,
  className,
  innerClassName,
  as: Component = "span",
}: MaskedRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <Component className={className}>{children}</Component>;
  }

  return (
    <Component
      ref={ref as React.Ref<any>}
      className={cn("inline-block overflow-hidden align-top leading-tight", className)}
    >
      <motion.span
        className={cn("inline-block will-change-transform", innerClassName)}
        initial={{ y: "110%" }}
        animate={isInView ? { y: "0%" } : { y: "110%" }}
        transition={{
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1], // Quintic Out
        }}
      >
        {children}
      </motion.span>
    </Component>
  );
}
