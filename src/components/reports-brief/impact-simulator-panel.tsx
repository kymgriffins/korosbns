"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, SlidersHorizontal } from "lucide-react";
import { formatKesBillions } from "@/lib/budget-format";

type Props = {
  /** Baseline from IN_APP episode seed — used only as scenario starting point */
  totalExpenditureBillions: number;
  educationBillions: number;
  healthBillions: number;
  fiscalYear: string;
};

/**
 * Lightweight what-if realloc slider. Clearly labeled SCENARIO — not official.
 */
export function ImpactSimulatorPanel({
  totalExpenditureBillions,
  educationBillions,
  healthBillions,
  fiscalYear,
}: Props) {
  const eduShare0 = educationBillions / Math.max(totalExpenditureBillions, 1);
  const healthShare0 = healthBillions / Math.max(totalExpenditureBillions, 1);
  const [eduDelta, setEduDelta] = useState(0);
  const [healthDelta, setHealthDelta] = useState(0);

  const scenario = useMemo(() => {
    const edu = educationBillions * (1 + eduDelta / 100);
    const health = healthBillions * (1 + healthDelta / 100);
    const other =
      totalExpenditureBillions - educationBillions - healthBillions - (edu - educationBillions) - (health - healthBillions);
    return {
      edu,
      health,
      other: Math.max(0, other),
      eduShare: edu / Math.max(totalExpenditureBillions, 1),
      healthShare: health / Math.max(totalExpenditureBillions, 1),
    };
  }, [eduDelta, healthDelta, educationBillions, healthBillions, totalExpenditureBillions]);

  return (
    <section className="rounded-3xl border border-dashed border-amber-500/40 bg-amber-500/5 p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-900 dark:text-amber-200">
          <AlertTriangle className="size-3" aria-hidden />
          Scenario — not official
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          FY {fiscalYear} what-if
        </span>
      </div>
      <h3 className="mt-3 flex items-center gap-2 font-heading text-sm font-bold">
        <SlidersHorizontal className="size-4 text-primary" aria-hidden />
        Impact simulator
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Reallocate Education and Health relative to the seeded FY totals. This is a teaching toy —
        not a Budget Policy Statement or Appropriation Act.
      </p>

      <div className="mt-4 space-y-4">
        <label className="block space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-semibold">Education</span>
            <span className="tabular-nums text-muted-foreground">
              {eduDelta >= 0 ? "+" : ""}
              {eduDelta}% · baseline {(eduShare0 * 100).toFixed(1)}%
            </span>
          </div>
          <input
            type="range"
            min={-30}
            max={30}
            step={1}
            value={eduDelta}
            onChange={(e) => setEduDelta(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </label>
        <label className="block space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-semibold">Health</span>
            <span className="tabular-nums text-muted-foreground">
              {healthDelta >= 0 ? "+" : ""}
              {healthDelta}% · baseline {(healthShare0 * 100).toFixed(1)}%
            </span>
          </div>
          <input
            type="range"
            min={-30}
            max={30}
            step={1}
            value={healthDelta}
            onChange={(e) => setHealthDelta(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </label>
      </div>

      <ul className="mt-4 grid gap-2 sm:grid-cols-3">
        <li className="rounded-2xl border border-border/40 bg-background/70 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Education</p>
          <p className="mt-1 text-sm font-bold tabular-nums">
            {formatKesBillions(scenario.edu, { prefix: true })}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {(scenario.eduShare * 100).toFixed(1)}% of total
          </p>
        </li>
        <li className="rounded-2xl border border-border/40 bg-background/70 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Health</p>
          <p className="mt-1 text-sm font-bold tabular-nums">
            {formatKesBillions(scenario.health, { prefix: true })}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {(scenario.healthShare * 100).toFixed(1)}% of total
          </p>
        </li>
        <li className="rounded-2xl border border-border/40 bg-background/70 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Rest of budget</p>
          <p className="mt-1 text-sm font-bold tabular-nums">
            {formatKesBillions(scenario.other, { prefix: true })}
          </p>
          <p className="text-[10px] text-muted-foreground">Held constant envelope</p>
        </li>
      </ul>
    </section>
  );
}
