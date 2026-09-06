"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import {
  SOVEREIGN_TICKER_ITEMS,
  type SovereignTickerItem,
} from "@/components/programmes/programmes-sovereign-ticker";
import { cn } from "@/utils";

interface TelemetryHUDProps {
  activeDesk: string;
  focusArea?: string;
  badgeLabel?: string;
  tickerItems?: SovereignTickerItem[];
  className?: string;
}

/**
 * TelemetryHUD
 * Persistent technical HUD inspired by Locomotive Scroll documentation and Bloomberg/FT visual investigations.
 * Pinned at top under navbar with an active sovereign marquee ticker stream, desk badge, and spring progress track.
 */
export function TelemetryHUD({
  activeDesk,
  focusArea,
  badgeLabel = "SOVEREIGN STANDARD",
  tickerItems = SOVEREIGN_TICKER_ITEMS,
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
        "sticky top-14 md:top-16 z-30 w-full border-b border-border/40 bg-background/85 backdrop-blur-md transition-colors",
        className,
      )}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-9 flex items-center justify-between gap-3 text-[11px] font-mono uppercase tracking-widest text-muted-foreground overflow-hidden">
        {/* Left: Operational Metadata */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400 shrink-0">
            <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
            {badgeLabel}
          </span>
          <span className="text-border hidden sm:inline">/</span>
          <span className="text-foreground font-semibold truncate hidden sm:inline shrink-0">
            {activeDesk}
          </span>
          {focusArea && (
            <>
              <span className="text-border hidden lg:inline">/</span>
              <span className="hidden lg:inline truncate text-muted-foreground">
                {focusArea}
              </span>
            </>
          )}
        </div>

        {/* Center: Live Sovereign Marquee Ticker Stream */}
        <div className="relative min-w-0 flex-1 overflow-hidden">
          <Marquee
            pauseOnHover
            repeat={3}
            className="py-0.5 w-full min-w-0 max-w-full overflow-hidden [--duration:80s] [--gap:2.25rem]"
          >
            {tickerItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="inline-flex items-center gap-1.5 group/ticker whitespace-nowrap text-[11px] text-foreground/85 hover:text-primary transition-colors shrink-0"
              >
                <span className="font-semibold text-foreground tracking-tight">
                  {item.topic}
                </span>
                <span className="text-muted-foreground font-normal">
                  — {item.text}
                </span>
                <ArrowUpRight className="size-3 text-muted-foreground/60 group-hover/ticker:text-primary transition-colors inline shrink-0" />
              </Link>
            ))}
          </Marquee>
          {/* Subtle edge fades for smooth marquee blending */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-background/90 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-background/90 to-transparent" />
        </div>

        {/* Right: Scroll Depth Scrubber */}
        <div className="flex items-center gap-2 shrink-0 pl-2">
          <span className="text-[10px] tracking-wider text-muted-foreground hidden sm:inline">
            DEPTH
          </span>
          <span className="font-bold text-foreground tabular-nums w-8 text-right">
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
