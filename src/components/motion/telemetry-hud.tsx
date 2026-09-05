"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";
import { useState, useEffect } from "react";
import { cn } from "@/utils";

interface TelemetryHUDProps {
  activeDesk: string;
  focusArea: string;
  badgeLabel?: string;
  className?: string;
}

/**
 * TelemetryHUD
 * Persistent technical HUD inspired by Locomotive Scroll documentation and Bloomberg/FT visual investigations.
 * Pinned at top with live scroll telemetry, active desk metadata, and a physics-smoothed spring progress track.
 */
export function TelemetryHUD({
  activeDesk,
  focusArea,
  badgeLabel = "LIVE INVESTIGATION",
  className,
}: TelemetryHUDProps) {
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const [percent, setPercent] = useState(0);

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      setPercent(Math.round(Math.min(Math.max(v, 0), 1) * 100));
    });
  }, [scrollYProgress]);

  return (
    <aside
      aria-label="Investigation reading telemetry"
      className={cn(
        "sticky top-14 md:top-16 z-30 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-colors",
        className,
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
        {/* Left: Operational Metadata */}
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="inline-flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400 shrink-0">
            <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
            {badgeLabel}
          </span>
          <span className="text-border hidden sm:inline">/</span>
          <span className="text-foreground font-semibold truncate shrink-0">
            {activeDesk}
          </span>
          <span className="text-border hidden md:inline">/</span>
          <span className="hidden md:inline truncate text-muted-foreground">
            {focusArea}
          </span>
        </div>

        {/* Right: Scroll Depth Scrubber */}
        <div className="flex items-center gap-2.5 shrink-0 pl-4">
          <span className="text-[10px] tracking-wider text-muted-foreground hidden sm:inline">
            DEPTH
          </span>
          <span className="font-bold text-foreground tabular-nums w-9 text-right">
            {percent.toString().padStart(2, "0")}%
          </span>
        </div>
      </div>

      {/* Physics-smoothed progress line */}
      {!shouldReduceMotion && (
        <div className="relative h-[2px] w-full overflow-hidden bg-border/20">
          <motion.div
            className="absolute inset-y-0 left-0 w-full origin-left bg-gradient-to-r from-amber-500 via-primary to-amber-500"
            style={{ scaleX }}
          />
        </div>
      )}
    </aside>
  );
}
