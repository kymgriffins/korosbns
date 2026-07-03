"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { BitmojiAvatar } from "./bitmoji-avatar";
import { cn } from "@/utils";
import { heading } from "@/constants/fonts";
import { useReducedMotionSafe } from "@/motion/hooks";
import type { CivicModule } from "@/types/learn";
import type { LearnHubProfile } from "@/lib/learn-data";
import {
  ChamberDocumentPage,
  SovereignChip,
  StreakChip,
} from "@/components/learn/learn-chamber-ui";

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
  streak: streakProp,
  isNewUser,
}: {
  profile: Partial<LearnHubProfile>;
  currentStage: CivicModule | null | undefined;
  resume: ResumeInfo;
  points?: number;
  streak?: number;
  isNewUser?: boolean;
}) {
  const reduced = useReducedMotionSafe();
  const points = pointsProp ?? 0;
  const streak = streakProp ?? 0;

  const stepTitle =
    currentStage?.steps?.[(resume?.currentStep ?? 1) - 1]?.title ?? currentStage?.title;
  const moduleHref = currentStage ? `/learn/modules/${currentStage.slug}` : "/learn?tab=modules";
  const stepHref = currentStage && resume?.currentStep
    ? `/learn/modules/${currentStage.slug}?step=${resume.currentStep}`
    : moduleHref;

  const headline = isNewUser
    ? "Open your first case file"
    : resume?.currentStep && resume.total
      ? `Continue Step ${resume.currentStep} of ${resume.total}`
      : "Pick up where you left off";

  const subtitle = isNewUser
    ? "Learn the Finance Bill, BPS/BROP, and how to take part — one clear step at a time."
    : currentStage
      ? stepTitle
        ? `${currentStage.title} — ${stepTitle}`
        : `Open ${currentStage.title} and keep going.`
      : undefined;

  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
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
      <div className="relative flex gap-5 p-5 md:p-7">
        <div className="min-w-0 flex-1 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--learn-seal-gold)]">
            FY Chamber
          </p>
          <h1 className={cn("text-2xl font-bold leading-tight md:text-3xl", heading.className)}>
            {headline}
          </h1>
          {currentStage && !isNewUser && (
            <p className="text-sm font-medium text-[var(--learn-seal-gold)]/90">
              {currentStage.fiscal_year_label ?? currentStage.title}
            </p>
          )}
          {subtitle && (
            <p className="max-w-lg text-sm text-white/70">{subtitle}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <StreakChip days={streak} className="bg-white/10 text-white/90" />
            <SovereignChip amount={points} className="bg-white/10 text-white/90" />
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
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

        <ChamberDocumentPage
          stepNum={resume?.currentStep}
          totalSteps={resume?.total}
          stepTitle={stepTitle}
          moduleTitle={currentStage?.title}
        />

        <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
          <div className="size-11 overflow-hidden rounded-full ring-2 ring-[var(--learn-seal-gold)]/40">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="size-full object-cover" />
            ) : (
              <BitmojiAvatar gender={(profile as { gender?: string }).gender as "male" | "female"} size="md" />
            )}
          </div>
          <p className="max-w-[7rem] truncate text-right text-xs font-semibold">
            {profile.breakName || "Citizen"}
          </p>
          <p className="text-[10px] text-white/50">{profile.county || "Kenya"}</p>
        </div>
      </div>
    </motion.section>
  );
}
