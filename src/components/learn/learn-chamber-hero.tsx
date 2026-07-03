"use client";

import Link from "next/link";
import { Flame, Play, Zap } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { BitmojiAvatar } from "./bitmoji-avatar";
import { cn } from "@/utils";
import { heading } from "@/constants/fonts";
import { formatSovereigns, resolveGamification, SOVEREIGN_SHORT } from "@/lib/learn-gamification";
import { useReducedMotionSafe } from "@/motion/hooks";
import type { CivicModule } from "@/types/learn";
import type { LearnHubProfile } from "@/lib/learn-data";

type ResumeInfo = {
  total: number;
  completed: number;
  pct: number;
  currentStep: number;
} | null;

export function LearnChamberHero({
  profile,
  currentStage,
  resume,
  points: pointsProp,
  level: levelProp,
  streak: streakProp,
  xpIntoLevel: xpIntoLevelProp,
  isNewUser,
}: {
  profile: Partial<LearnHubProfile>;
  currentStage: CivicModule | null | undefined;
  resume: ResumeInfo;
  points?: number;
  level?: number;
  streak?: number;
  xpIntoLevel?: number;
  isNewUser?: boolean;
}) {
  const reduced = useReducedMotionSafe();
  const resolved = resolveGamification(profile);
  const points = pointsProp ?? resolved.points;
  const level = levelProp ?? resolved.level;
  const streak = streakProp ?? resolved.streak;
  const xpIntoLevel = xpIntoLevelProp ?? resolved.xpIntoLevel;

  const stepTitle =
    currentStage?.steps?.[(resume?.currentStep ?? 1) - 1]?.title ?? currentStage?.title;
  const moduleHref = currentStage ? `/learn/modules/${currentStage.slug}` : "/learn?tab=modules";
  const stepHref = currentStage && resume?.currentStep
    ? `/learn/modules/${currentStage.slug}?step=${resume.currentStep}`
    : moduleHref;

  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/50",
        "bg-[var(--learn-chamber-ink)] text-[var(--learn-chamber-paper)]",
        "dark:border-white/10",
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(196,160,53,0.18),transparent_65%)]"
        aria-hidden
      />
      <div className="relative p-5 md:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--learn-seal-gold)]">
              FY Chamber
            </p>
            <h1 className={cn("text-2xl font-bold leading-tight md:text-3xl", heading.className)}>
              {isNewUser
                ? "Pick up your first step in Kenya's budget"
                : resume?.pct
                  ? `Continue Step ${resume.currentStep} of ${resume.total}`
                  : "Pick up where you left off"}
            </h1>
            {!isNewUser && currentStage && (
              <p className="max-w-lg text-sm text-white/70">
                {stepTitle
                  ? `${currentStage.title} — ${stepTitle}`
                  : `Open ${currentStage.title} and keep going.`}
              </p>
            )}
            {isNewUser && (
              <p className="max-w-lg text-sm text-white/70">
                Learn the Finance Bill, BPS/BROP, and how to take part — one clear step at a time.
              </p>
            )}
            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                asChild
                size="sm"
                className="h-9 rounded-lg bg-[var(--learn-seal-gold)] font-bold text-[var(--learn-chamber-ink)] hover:bg-[var(--learn-seal-gold)]/90"
              >
                <Link href={stepHref}>
                  <Play className="mr-1.5 size-3.5" fill="currentColor" />
                  {isNewUser ? "Start learning path" : "Resume chamber"}
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="relative">
              <div className="size-12 overflow-hidden rounded-full ring-2 ring-[var(--learn-seal-gold)]/40">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="size-full object-cover" />
                ) : (
                  <BitmojiAvatar gender={(profile as { gender?: string }).gender as "male" | "female"} size="md" />
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--learn-seal-gold)] px-1 text-[9px] font-bold text-[var(--learn-chamber-ink)]">
                {level}
              </span>
            </div>
            <div className="space-y-1 text-right">
              <p className="truncate text-sm font-semibold">{profile.breakName || "Citizen"}</p>
              <p className="text-[10px] text-white/60">{profile.county || "Kenya"}</p>
              <div className="flex justify-end gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold tabular-nums">
                  <Flame className="size-3 text-amber-400" fill="currentColor" />
                  {streak}
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold tabular-nums text-[var(--learn-seal-gold)]">
                  <Zap className="size-3" />
                  {points} {SOVEREIGN_SHORT}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-1">
          <div className="flex justify-between text-[10px] font-medium text-white/50">
            <span>{formatSovereigns(points, { short: true })}</span>
            <span>
              {xpIntoLevel}/100 to Level {level + 1}
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[var(--learn-vote-green)] transition-all duration-700"
              style={{ width: `${xpIntoLevel}%` }}
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
