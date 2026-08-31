"use client";

import Link from "next/link";
import { BookOpen, Brain, CheckCircle2, Clapperboard, Layers, X, Sparkles } from "lucide-react";
import { lecturesForModule, type ImmersiveMode, type LectureKind } from "@/lib/immersive-module";
import { useImmersiveModule } from "./immersive-module-provider";
import { cn } from "@/utils";

const KIND_ICON: Record<LectureKind, typeof BookOpen> = {
  article: BookOpen,
  video: Clapperboard,
  quiz: Brain,
};

type Props = {
  activeStep: number;
  activeMode: ImmersiveMode;
  open: boolean;
  onClose: () => void;
};

/**
 * Editorial Specimen Course Rail:
 * Clean curriculum index with completion meter, step badges, and active state highlights.
 */
export function ImmersiveCurriculum({ activeStep, activeMode, open, onClose }: Props) {
  const { mod, completedOrders } = useImmersiveModule();
  const lectures = lecturesForModule(mod);

  // Group by step for scannable sections
  const byStep = new Map<number, typeof lectures>();
  for (const lec of lectures) {
    const list = byStep.get(lec.stepNumber) ?? [];
    list.push(lec);
    byStep.set(lec.stepNumber, list);
  }

  const completedCount = completedOrders.size;
  const totalSteps = mod.steps.length;
  const completionPct = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  return (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs md:hidden"
          aria-label="Close curriculum"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={cn(
          "learn-curriculum z-[70] flex w-full max-w-[21rem] flex-col border-foreground/10 bg-card/95 backdrop-blur-md",
          "fixed inset-y-0 left-0 transition-transform duration-200 ease-out md:static md:z-0 md:max-w-none md:w-[19rem] md:shrink-0 md:translate-x-0 md:border-r",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "md:flex",
          !open && "max-md:pointer-events-none",
        )}
        aria-label="Course content"
      >
        {/* Editorial Rail Masthead */}
        <div className="border-b border-foreground/10 p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex size-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] font-mono font-bold tracking-widest text-primary uppercase">
                COURSE SYLLABUS
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted md:hidden"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-foreground line-clamp-1">
              {mod.title}
            </p>
            <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
              <span>{completedCount}/{totalSteps} Lessons Completed</span>
              <span className="font-bold text-foreground">{completionPct}%</span>
            </div>
            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-muted/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Scrollable Curriculum Steps */}
        <div className="flex-1 overflow-y-auto overscroll-contain divide-y divide-foreground/5">
          {[...byStep.entries()].map(([stepNumber, items]) => {
            const stepDone = completedOrders.has(mod.steps[stepNumber - 1]?.order ?? -1);
            const title = items[0]?.stepTitle ?? `Lesson ${stepNumber}`;
            const isCurrentStep = stepNumber === activeStep;

            return (
              <section key={stepNumber} className={cn("p-3 space-y-2", isCurrentStep && "bg-muted/30")}>
                <div className="flex items-start gap-2.5 px-1 pt-1">
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-lg font-mono text-[11px] font-bold border transition-colors",
                      stepDone
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                        : isCurrentStep
                        ? "bg-primary/10 text-primary border-primary/30"
                        : "bg-muted text-muted-foreground border-foreground/10",
                    )}
                  >
                    {stepDone ? (
                      <CheckCircle2 className="size-3.5" aria-hidden />
                    ) : (
                      String(stepNumber).padStart(2, "0")
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-xs font-bold leading-snug truncate", isCurrentStep ? "text-foreground" : "text-muted-foreground")}>
                      {title}
                    </p>
                    <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                      {items.map((i) => i.label).join(" · ")}
                    </p>
                  </div>
                </div>

                <ul className="space-y-1 pl-7">
                  {items.map((lec) => {
                    const Icon = KIND_ICON[lec.kind];
                    const active = lec.stepNumber === activeStep && lec.mode === activeMode;
                    return (
                      <li key={`${lec.stepNumber}-${lec.mode}`}>
                        <Link
                          href={lec.href}
                          onClick={onClose}
                          className={cn(
                            "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-mono transition-all",
                            active
                              ? "bg-primary text-primary-foreground font-bold shadow-xs"
                              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                          )}
                          aria-current={active ? "page" : undefined}
                        >
                          <Icon className="size-3.5 shrink-0" aria-hidden />
                          <span className="truncate">{lec.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </aside>
    </>
  );
}

export function CurriculumToggle({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-xl border border-foreground/10 bg-card/90 backdrop-blur-md px-3 py-2 text-xs font-mono font-bold text-foreground shadow-sm transition-colors hover:bg-muted md:hidden"
      aria-label="Open course content"
    >
      <Layers className="size-3.5 text-primary" aria-hidden />
      Syllabus
    </button>
  );
}
