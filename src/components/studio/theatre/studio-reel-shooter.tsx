"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { fadeInUp } from "@/motion/variants";

type Props = {
  /** When true, calls onComplete after the shooter sequence */
  onComplete?: () => void;
  className?: string;
  /** CMS-controlled duration (ms). Defaults to 2200 when enabled. */
  durationMs?: number;
};

/**
 * Cinematic intro shown only when CMS enables studio-reel loading.
 * Prefer leaving pages.studio.loading.enabled=false.
 */
export function StudioReelShooter({
  onComplete,
  className,
  durationMs = 2200,
}: Props) {
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const shooterMs = Math.max(0, durationMs);

  useEffect(() => {
    if (reduceMotion || shooterMs <= 0) {
      onComplete?.();
      return;
    }

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const next = Math.min(1, elapsed / shooterMs);
      setProgress(next);
      if (next < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        onComplete?.();
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onComplete, reduceMotion, shooterMs]);

  return (
    <div
      className={className}
      role="status"
      aria-live="polite"
      aria-label="Loading BNS Studios"
    >
      <div className="studio-reel-shooter-inner">
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="studio-reel-shooter-title"
        >
          BNS
          <span className="studio-reel-shooter-title-accent">Studios</span>
        </motion.p>
        <div className="studio-reel-shooter-track" aria-hidden>
          <div
            className="studio-reel-shooter-fill"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      </div>
    </div>
  );
}
