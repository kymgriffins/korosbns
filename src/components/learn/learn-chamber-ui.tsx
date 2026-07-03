"use client";

import { motion } from "motion/react";
import { cn } from "@/utils";
import { useReducedMotionSafe } from "@/motion/hooks";
import { SOVEREIGN_SHORT } from "@/lib/learn-gamification";

/** Seal glyph used for Sovereigns currency — not XP/Zap icons. */
export function SovereignSealGlyph({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-3.5 shrink-0 items-center justify-center rounded-full border border-[var(--learn-seal-gold)]/60 bg-[var(--learn-seal-gold)]/15 text-[8px] font-black text-[var(--learn-seal-gold)]",
        className,
      )}
      aria-hidden
    >
      S
    </span>
  );
}

export function SovereignChip({
  amount,
  className,
}: {
  amount: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-0.5 font-mono text-[10px] font-bold tabular-nums",
        className,
      )}
    >
      <SovereignSealGlyph />
      {amount.toLocaleString()} {SOVEREIGN_SHORT}
    </span>
  );
}

export function StreakChip({
  days,
  className,
}: {
  days: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-0.5 text-[10px] font-bold tabular-nums",
        className,
      )}
    >
      {days}-day streak
    </span>
  );
}

/** Document-page visual for chamber hero — not a progress bar. */
export function ChamberDocumentPage({
  stepNum,
  totalSteps,
  stepTitle,
  moduleTitle,
  className,
}: {
  stepNum?: number;
  totalSteps?: number;
  stepTitle?: string;
  moduleTitle?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative hidden w-36 shrink-0 overflow-hidden rounded-lg border border-white/15 bg-white/5 shadow-lg md:block lg:w-44",
        className,
      )}
      aria-hidden
    >
      <div className="border-b border-white/10 px-3 py-2">
        <p className="font-mono text-[8px] uppercase tracking-widest text-[var(--learn-seal-gold)]">
          Case file
        </p>
        <p className="mt-0.5 line-clamp-2 text-[10px] font-semibold leading-tight text-white/90">
          {moduleTitle ?? "FY Chamber"}
        </p>
      </div>
      <div className="space-y-1.5 p-3">
        {stepNum && totalSteps ? (
          <p className="font-mono text-[9px] text-white/50">
            Step {stepNum} of {totalSteps}
          </p>
        ) : null}
        <div className="space-y-1">
          <div className="h-1 w-full rounded bg-white/10" />
          <div className="h-1 w-4/5 rounded bg-white/10" />
          <div className="h-1 w-full rounded bg-white/10" />
          <div className="h-1 w-2/3 rounded bg-white/10" />
        </div>
        {stepTitle ? (
          <p className="line-clamp-3 text-[9px] leading-snug text-white/70">{stepTitle}</p>
        ) : null}
      </div>
      <div
        className="absolute bottom-2 right-2 flex size-7 items-center justify-center rounded-full border-2 border-[var(--learn-seal-gold)]/50 bg-[var(--learn-seal-gold)]/20 text-[7px] font-black text-[var(--learn-seal-gold)]"
      >
        BNS
      </div>
    </div>
  );
}

/** Official wax-seal celebration — one beat, not confetti. */
export function ChamberSealOverlay({
  show,
  label = "Step recorded",
  onDone,
}: {
  show: boolean;
  label?: string;
  onDone?: () => void;
}) {
  const reduced = useReducedMotionSafe();

  if (!show) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={() => {
        if (reduced) onDone?.();
      }}
    >
      <motion.div
        initial={reduced ? false : { scale: 0.6, opacity: 0, rotate: -12 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 18 }}
        onAnimationComplete={() => {
          if (!reduced) {
            window.setTimeout(() => onDone?.(), 900);
          }
        }}
        className="flex flex-col items-center gap-2"
      >
        <div className="flex size-20 items-center justify-center rounded-full border-4 border-[var(--learn-seal-gold)] bg-[var(--learn-chamber-ink)] shadow-2xl">
          <span className="text-center text-[10px] font-black uppercase leading-tight tracking-wider text-[var(--learn-seal-gold)]">
            Official
            <br />
            seal
          </span>
        </div>
        <p className="text-sm font-semibold text-white">{label}</p>
      </motion.div>
    </motion.div>
  );
}
