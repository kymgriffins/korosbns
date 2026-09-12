"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { fadeInUp } from "@/motion/variants";

type Props = {
  /** When true, calls onComplete after the shooter sequence */
  onComplete?: () => void;
  className?: string;
};

const SHOOTER_MS = 2200;

/**
 * Cinematic intro shown while the studio route loads - "shooter" before the reel hero.
 */
export function StudioReelShooter({ onComplete, className }: Props) {
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      onComplete?.();
      return;
    }

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const next = Math.min(1, elapsed / SHOOTER_MS);
      setProgress(next);
      if (next < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        onComplete?.();
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onComplete, reduceMotion]);

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
