"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HeroOrbit } from "../illustrations/hero-orbit";
import { StudioPage } from "../components/studio-page";
import type { CivicModule } from "@/types/learn";
import { readProgress } from "@/lib/module-progress";
import { cn } from "@/lib/utils";

export function LearnHomeView({
  stages,
  currentStage,
  displayName,
  points,
  level,
  streak,
  onContinue,
  onBrowsePath,
  onSelectStage,
}: {
  stages: CivicModule[];
  currentStage: CivicModule | null;
  displayName: string;
  points: number;
  level: number;
  streak: number;
  onContinue: () => void;
  onBrowsePath: () => void;
  onSelectStage: (stage: CivicModule) => void;
}) {
  const resume = currentStage
    ? (() => {
        const p = readProgress(currentStage.slug, currentStage.order);
        const total = currentStage.steps?.length ?? 0;
        const done = total ? Object.values(p.stepsCompleted ?? {}).filter(Boolean).length : 0;
        return { pct: total ? Math.round((done / total) * 100) : 0, step: p.currentStep || 1, total };
      })()
    : null;

  return (
    <StudioPage width="default" className="space-y-10">
      <section className="text-center">
        <HeroOrbit className="mx-auto h-40 w-full max-w-sm opacity-90" />
        <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Budget Ndio Story
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Hello, {displayName.split(" ")[0]}.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-muted-foreground">
          A calm space to understand Kenya&apos;s budget — one clear module at a time.
        </p>
      </section>

      {currentStage && resume ? (
        <Card className="overflow-hidden border-border/50 shadow-none">
          <CardContent className="p-0">
            <div className="border-b border-border/40 bg-muted/30 px-6 py-4">
              <p className="text-xs font-medium text-muted-foreground">Continue</p>
              <p className="mt-1 text-lg font-semibold tracking-tight">{currentStage.title}</p>
            </div>
            <div className="space-y-4 px-6 py-5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Step {resume.step} of {resume.total || "—"}</span>
                <span>{resume.pct}%</span>
              </div>
              <Progress value={resume.pct} className="h-1.5" />
              <Button className="w-full rounded-full" size="lg" onClick={onContinue}>
                Resume learning
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed border-border/60 bg-muted/20 shadow-none">
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <Sparkles className="size-8 text-primary/70" />
            <p className="text-sm text-muted-foreground">Pick your first module on the Path.</p>
            <Button className="rounded-full" onClick={onBrowsePath}>
              Explore path
            </Button>
          </CardContent>
        </Card>
      )}

      <section className="grid grid-cols-3 gap-3">
        {[
          { label: "Level", value: level },
          { label: "XP", value: points },
          { label: "Streak", value: `${streak}d` },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border/40 bg-card/80 px-4 py-5 text-center backdrop-blur-sm"
          >
            <p className="text-2xl font-semibold tabular-nums tracking-tight">{stat.value}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {stat.label}
            </p>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">On your path</h2>
            <p className="text-sm text-muted-foreground">{stages.length} modules</p>
          </div>
          <Button variant="ghost" size="sm" className="text-xs" onClick={onBrowsePath}>
            See all
          </Button>
        </div>
        <ul className="space-y-2">
          {stages.slice(0, 4).map((stage, i) => (
            <li key={stage.slug}>
              <button
                type="button"
                onClick={() => onSelectStage(stage)}
                className={cn(
                  "flex w-full items-center gap-4 rounded-2xl border border-border/40 bg-card px-4 py-3 text-left transition-colors hover:bg-muted/40",
                  currentStage?.slug === stage.slug && "ring-1 ring-primary/30",
                )}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                  {stage.badge || i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{stage.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">{stage.description}</span>
                </span>
                <BookOpen className="size-4 shrink-0 text-muted-foreground/60" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-center text-xs text-muted-foreground">
        <Link href="/reports" className="underline-offset-4 hover:underline">
          Explore national budget reports
        </Link>
      </p>
    </StudioPage>
  );
}
