"use client";

import Link from "next/link";
import { Flame, Zap } from "lucide-react";
import { cn } from "@/utils";
import { useLearn } from "@/contexts/learn-context";
import { resolveGamification, formatSovereigns, SOVEREIGN_SHORT } from "@/lib/learn-gamification";
import { heading } from "@/constants/fonts";

/** Centered column used on every /learn surface. */
export function LearnStage({
  children,
  className,
  pad = true,
}: {
  children: React.ReactNode;
  className?: string;
  pad?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[var(--learn-stage-width)]",
        pad && "px-4 py-5 pb-24 md:px-6 md:py-6 md:pb-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Slim progress + gamification chrome for module reading and hub. */
export function LearnProgressRail({
  fyLabel,
  moduleTitle,
  currentStep,
  totalSteps,
  className,
}: {
  fyLabel?: string;
  moduleTitle?: string;
  currentStep?: number;
  totalSteps?: number;
  className?: string;
}) {
  const segments = [
    fyLabel ?? "FY Chamber",
    moduleTitle,
    currentStep && totalSteps ? `Step ${currentStep}/${totalSteps}` : undefined,
  ].filter(Boolean);

  const stepPct =
    currentStep && totalSteps && totalSteps > 0
      ? Math.round((currentStep / totalSteps) * 100)
      : 0;

  return (
    <div className={cn("relative border-b border-border/40 bg-background/95", className)}>
      <div
        className="absolute inset-y-0 left-0 w-0.5 bg-[var(--learn-seal-gold)]"
        aria-hidden
      />
      <div className="mx-auto flex max-w-[var(--learn-stage-width)] flex-col gap-1 px-4 py-2 md:px-6">
        <nav
          className="flex flex-wrap items-center gap-1 text-[10px] font-semibold text-muted-foreground"
          aria-label="Learning progress"
        >
          {segments.map((seg, i) => (
            <span key={`${seg}-${i}`} className="flex items-center gap-1">
              {i > 0 && <span className="text-muted-foreground/40">·</span>}
              <span className={cn(i === segments.length - 1 && "text-foreground")}>{seg}</span>
            </span>
          ))}
        </nav>
        {totalSteps ? (
          <div className="h-0.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-[var(--learn-vote-green)] transition-all duration-500"
              style={{ width: `${stepPct}%` }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Top chrome: streak + sovereigns + level — shown when user is in learn hub. */
export function LearnTopChrome({ className }: { className?: string }) {
  const { gamification, activeLesson } = useLearn();
  const { points, level, streak } = resolveGamification(null, gamification);

  const breadcrumb = activeLesson
    ? `${activeLesson.stageTitle} · Step ${activeLesson.currentStep}/${activeLesson.totalSteps}`
    : "Budget literacy chamber";

  return (
    <div
      className={cn(
        "hidden border-b border-border/40 bg-[var(--learn-chamber-paper)]/80 backdrop-blur-sm dark:bg-[var(--learn-chamber-ink)]/90 md:block",
        className,
      )}
    >
      <div className="mx-auto flex max-w-[var(--learn-stage-width)] items-center justify-between gap-3 px-6 py-2">
        <p className="min-w-0 truncate text-xs font-medium text-muted-foreground">{breadcrumb}</p>
        <div className="flex shrink-0 items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-0.5 text-[10px] font-bold tabular-nums">
            <Flame className="size-3 text-amber-500" fill="currentColor" />
            {streak}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-0.5 font-mono text-[10px] font-bold tabular-nums">
            <Zap className="size-3 text-[var(--learn-seal-gold)]" />
            {points} {SOVEREIGN_SHORT}
          </span>
          <span className="rounded-md bg-[var(--learn-vote-green)]/15 px-2 py-0.5 text-[10px] font-bold text-[var(--learn-vote-green)]">
            Lv {level}
          </span>
        </div>
      </div>
    </div>
  );
}

export function LearnStageHeader({
  title,
  subtitle,
  eyebrow,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-5 flex flex-wrap items-start justify-between gap-3", className)}>
      <div className="min-w-0 space-y-1">
        {eyebrow ? (
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--learn-seal-gold)]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className={cn("text-xl font-bold tracking-tight md:text-2xl", heading.className)}>
          {title}
        </h1>
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action}
    </header>
  );
}

export function LearnStageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-h-0 flex-1 flex-col bg-background", className)}>
      {children}
    </div>
  );
}

export function LearnBackLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-[10px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
    </Link>
  );
}
