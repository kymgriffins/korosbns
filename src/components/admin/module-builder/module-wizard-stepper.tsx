"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Teachable } from "@/components/admin/teaching/teachable";
import {
  MODULE_WIZARD_STEPS,
  type ModuleWizardStepKey,
  type StepStatus,
} from "./wizard-steps";

type Props = {
  active: ModuleWizardStepKey;
  status: Record<ModuleWizardStepKey, StepStatus>;
  /** When false, only overview is clickable (create flow). */
  allowAllSteps: boolean;
  onSelect: (step: ModuleWizardStepKey) => void;
};

export function ModuleWizardStepper({ active, status, allowAllSteps, onSelect }: Props) {
  const doneCount = MODULE_WIZARD_STEPS.filter((s) => status[s.key]?.complete).length;

  return (
    <div className="sticky top-[calc(var(--dashboard-header-height,3rem)+0.5rem)] z-10 space-y-2 rounded-lg border bg-background/95 p-3 shadow-sm backdrop-blur supports-backdrop-filter:bg-background/80">
      <Teachable
        tipId="stepper"
        title="Step strip"
        body="Jump between steps anytime. Green means that section looks ready — it never blocks you."
        className="w-full flex-col items-stretch gap-2 sm:flex-row sm:items-center"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-medium text-muted-foreground">
            Setup progress · {doneCount}/{MODULE_WIZARD_STEPS.length} ready
          </p>
          <p className="text-xs text-muted-foreground">Not strict — skip or revisit freely</p>
        </div>
      </Teachable>
      <nav aria-label="Module setup steps" className="w-full overflow-x-auto">
        <ol className="flex min-w-max items-stretch gap-1.5">
          {MODULE_WIZARD_STEPS.map((step, index) => {
            const disabled = !allowAllSteps && step.key !== "overview";
            const complete = status[step.key]?.complete;
            const isActive = active === step.key;
            return (
              <li key={step.key} className="flex flex-1">
                <button
                  type="button"
                  disabled={disabled}
                  title={status[step.key]?.hint}
                  onClick={() => onSelect(step.key)}
                  className={cn(
                    "flex w-full min-w-[8rem] flex-col gap-1 rounded-md border px-3 py-2.5 text-left transition-colors",
                    isActive && "border-foreground bg-muted text-foreground shadow-sm",
                    !isActive && !disabled && "border-border hover:bg-muted/50",
                    complete && !isActive && "border-emerald-600/35 bg-emerald-50/40 dark:bg-emerald-950/20",
                    disabled && "cursor-not-allowed opacity-45",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                        complete && "border-emerald-600 bg-emerald-600 text-white",
                        isActive && !complete && "border-foreground",
                      )}
                    >
                      {complete ? <Check className="size-3.5" aria-hidden /> : index + 1}
                    </span>
                    <span className="truncate text-sm font-medium">{step.label}</span>
                  </span>
                  <span className="pl-8 text-[11px] leading-snug text-muted-foreground">
                    {status[step.key]?.hint}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
