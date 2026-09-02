"use client";

import Link from "next/link";
import { CheckCircle2, Layers, X } from "lucide-react";
import { lessonHref, type ImmersiveMode } from "@/lib/immersive-module";
import { useImmersiveModule } from "./immersive-module-provider";
import { cn } from "@/utils";

type Props = {
  activeStep: number;
  activeMode: ImmersiveMode;
  open: boolean;
  onClose: () => void;
};

/** Lesson index — one guided entry per step (no article/video/quiz split). */
export function ImmersiveCurriculum({ activeStep, open, onClose }: Props) {
  const { mod, completedOrders } = useImmersiveModule();

  const completedCount = completedOrders.size;
  const totalSteps = mod.steps.length;
  const completionPct = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  return (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-xs"
          aria-label="Close lessons"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={cn(
          "learn-curriculum z-[70] flex w-full max-w-sm flex-col border-foreground/10 bg-card",
          "fixed inset-y-0 right-0 transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "translate-x-full",
          !open && "pointer-events-none",
        )}
        aria-label="Lessons"
      >
        <div className="flex items-center justify-between border-b border-foreground/10 p-4">
          <div>
            <p className="text-sm font-semibold text-foreground line-clamp-1">{mod.title}</p>
            <p className="text-xs text-muted-foreground">
              {completedCount}/{totalSteps} lessons · {completionPct}%
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="h-1 w-full bg-muted/60">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${completionPct}%` }}
          />
        </div>

        <ol className="flex-1 overflow-y-auto overscroll-contain divide-y divide-foreground/5">
          {mod.steps.map((step, index) => {
            const stepNumber = index + 1;
            const stepDone = completedOrders.has(step.order);
            const isCurrent = stepNumber === activeStep;

            return (
              <li key={step.id}>
                <Link
                  href={lessonHref(mod, stepNumber)}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3.5 transition-colors",
                    isCurrent && "bg-primary/5",
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      stepDone
                        ? "bg-primary text-primary-foreground"
                        : isCurrent
                          ? "border border-primary text-primary"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    {stepDone ? <CheckCircle2 className="size-4" aria-hidden /> : stepNumber}
                  </span>
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate text-sm",
                      isCurrent ? "font-semibold text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {step.title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </aside>
    </>
  );
}

export function CurriculumToggle({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-xl border border-foreground/10 bg-card/95 px-3 py-2 text-xs font-semibold text-foreground shadow-sm"
      aria-label="Open lessons"
    >
      <Layers className="size-3.5 text-primary" aria-hidden />
      Lessons
    </button>
  );
}
