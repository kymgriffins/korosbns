"use client";

import Link from "next/link";
import { BookOpen, Brain, CheckCircle2, Clapperboard, ListVideo, X } from "lucide-react";
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
 * Udemy-style course content list: typed Article / Video / Quiz lectures
 * for every chapter, with completion and active highlight.
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

  return (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-[60] bg-foreground/20 md:hidden"
          aria-label="Close curriculum"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={cn(
          "learn-curriculum z-[70] flex w-full max-w-[20rem] flex-col border-border/50 bg-background",
          "fixed inset-y-0 left-0 transition-transform duration-200 ease-out md:static md:z-0 md:max-w-none md:w-[17.5rem] md:shrink-0 md:translate-x-0 md:border-r",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "md:flex",
          !open && "max-md:pointer-events-none",
        )}
        aria-label="Course content"
      >
        <div className="flex items-center justify-between gap-2 border-b border-border/40 px-4 py-3">
          <div className="flex items-center gap-2">
            <ListVideo className="size-4 text-muted-foreground" aria-hidden />
            <p className="text-sm font-semibold tracking-tight">Course content</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted md:hidden"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          {[...byStep.entries()].map(([stepNumber, items]) => {
            const stepDone = completedOrders.has(mod.steps[stepNumber - 1]?.order ?? -1);
            const title = items[0]?.stepTitle ?? `Lesson ${stepNumber}`;
            return (
              <section key={stepNumber} className="border-b border-border/30">
                <div className="flex items-start gap-2 px-4 py-3">
                  <span
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded text-[10px] font-bold",
                      stepDone
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {stepDone ? <CheckCircle2 className="size-3" aria-hidden /> : stepNumber}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold leading-snug text-foreground">{title}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {items.map((i) => i.label).join(" · ")}
                    </p>
                  </div>
                </div>
                <ul className="pb-2">
                  {items.map((lec) => {
                    const Icon = KIND_ICON[lec.kind];
                    const active = lec.stepNumber === activeStep && lec.mode === activeMode;
                    return (
                      <li key={`${lec.stepNumber}-${lec.mode}`}>
                        <Link
                          href={lec.href}
                          onClick={onClose}
                          className={cn(
                            "mx-2 flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            active
                              ? "bg-primary/10 font-semibold text-primary"
                              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
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
      className="inline-flex items-center gap-1.5 rounded-md bg-muted/60 px-2.5 py-1.5 text-[12px] font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
      aria-label="Open course content"
    >
      <ListVideo className="size-3.5" aria-hidden />
      Content
    </button>
  );
}
