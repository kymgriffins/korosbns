"use client";

import React from "react";
import { motion } from "motion/react";
import { Badge } from "@/ui/badge";
import {
  Check,
  Loader2,
  Circle,
  TrendingUp,
  TrendingDown,
  Minus,
  CalendarDays,
  ClipboardList,
  FileText,
  CheckCircle2,
  BarChart3,
  Megaphone,
  Mic,
  Scale,
  Rocket,
  FileSignature,
  type LucideIcon,
} from "lucide-react";
import { SectionHeader, SectionShell } from "@/layouts/section-shell";
import {
  budgetHighlights,
  budgetMilestones,
  economicIndicators,
  sectorAllocations,
  formatKesBillions,
  BUDGET_SOURCE,
  type BudgetMilestone,
  type MilestoneIcon,
  type Trend,
} from "@/constants/budget-data";
import { Routes } from "@/constants/routes";

const MILESTONE_ICONS: Record<MilestoneIcon, LucideIcon> = {
  circular: ClipboardList,
  policy: FileText,
  approve: CheckCircle2,
  estimates: BarChart3,
  participation: Megaphone,
  vote: CheckCircle2,
  reading: Mic,
  "finance-bill": Scale,
  "fiscal-year": Rocket,
  appropriation: FileSignature,
};

function trendMeta(trend: Trend): { Icon: LucideIcon; color: string } {
  switch (trend) {
    case "up":
      return { Icon: TrendingUp, color: "text-emerald-500" };
    case "down":
      return { Icon: TrendingDown, color: "text-amber-500" };
    default:
      return { Icon: Minus, color: "text-muted-foreground" };
  }
}

function isTimelineReached(status: BudgetMilestone["status"]): boolean {
  return status === "completed" || status === "running";
}

function TimelineCard({
  item,
  isReached,
}: {
  item: BudgetMilestone;
  isReached: boolean;
  isRunning: boolean;
}) {
  const Icon = MILESTONE_ICONS[item.icon];
  return (
    <div
      className={`rounded-2xl border bg-card p-5 transition-all duration-300 md:rounded-3xl md:p-7 ${
        item.status === "running"
          ? "border-primary/30 hover:border-primary/40"
          : isReached
            ? "border-border hover:border-primary/20"
            : "border-muted bg-card/60 opacity-60 hover:border-muted"
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-4">
        <span
          className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest ${
            isReached ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <CalendarDays className="h-3.5 w-3.5" />
          {item.date}
        </span>
        {item.impact && isReached ? (
          <Badge
            variant="outline"
            className="border-primary/30 text-[9px] font-bold uppercase tracking-wider text-primary"
          >
            {item.impact}
          </Badge>
        ) : null}
      </div>

      <h3
        className={`mb-3 flex items-center gap-2.5 text-xl font-bold tracking-tight md:text-2xl ${
          isReached ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-xl border ${
            isReached
              ? "border-primary/20 bg-primary/10 text-primary"
              : "border-border bg-muted/40 text-muted-foreground"
          }`}
        >
          <Icon className="size-4" />
        </span>
        {item.title}
      </h3>

      <p
        className={`mb-4 text-sm leading-relaxed md:text-base ${
          isReached ? "text-muted-foreground" : "text-muted-foreground/80"
        }`}
      >
        {item.description}
      </p>

      <div
        className={`border-t pt-4 text-xs leading-relaxed ${
          isReached
            ? "border-border/60 text-muted-foreground"
            : "border-muted text-muted-foreground/70"
        }`}
      >
        {item.details}
      </div>
    </div>
  );
}

export default function KenyaFinanceTimeline() {
  return (
    <SectionShell
      id="budget-tracker"
      className="relative overflow-x-clip border-t border-border/40 bg-background text-foreground scroll-mt-24"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-1/2 w-4/5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-8 max-w-5xl overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6 text-center md:p-10"
      >
        <div className="mb-2 inline-block rounded-full bg-primary/20 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
          Budget Statement — June 11, 2026
        </div>
        <h2 className="mb-3 text-2xl font-black tracking-tight md:text-4xl">
          CS John Mbadi Reads a {formatKesBillions(4820.4)} Budget
        </h2>
        <p className="mx-auto mb-5 max-w-2xl text-sm text-muted-foreground md:text-base">
          Revenue {formatKesBillions(3630.5)} · Deficit {formatKesBillions(1146.2)} (5.5% of GDP) ·
          Interest &amp; pensions {formatKesBillions(1501.3)}
        </p>
        <div className="mx-auto flex max-w-md flex-wrap items-center justify-center gap-3">
          <span className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
            {formatKesBillions(4820.4)} Total Budget
          </span>
          <span className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm font-bold text-amber-500">
            {formatKesBillions(1146.2)} Deficit
          </span>
          <span className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-500">
            {formatKesBillions(1501.3)} Debt Service
          </span>
        </div>
      </motion.div>

      <SectionHeader
        eyebrow="FY 2026/27 Budget Cycle"
        title={
          <>
            Budget Tracker &{" "}
            <span className="font-heading italic text-primary">Allocations</span>.
          </>
        }
        description="Tracking Kenya's live FY2026/27 budget cycle from formulation through implementation, with verified sector-by-sector allocations."
      />

      <div className="mx-auto mb-4 grid max-w-6xl grid-cols-2 gap-3 md:mb-8 md:grid-cols-4 md:gap-4">
        {budgetHighlights.map((indicator, index) => {
          const { Icon, color } = trendMeta(indicator.trend);
          return (
            <motion.div
              key={indicator.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="flex min-w-0 flex-col justify-between rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/30 md:p-5"
            >
              <div>
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground md:text-xs">
                  {indicator.label}
                </span>
                <span className="text-lg font-black tracking-tight md:text-2xl">
                  {indicator.value}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <Icon className={`h-3.5 w-3.5 ${color}`} />
                <span className={`text-[9px] font-bold uppercase tracking-wider ${color}`}>
                  {indicator.trend}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mx-auto mb-8 grid max-w-6xl grid-cols-2 gap-3 md:mb-12 md:grid-cols-4 md:gap-4">
        {economicIndicators.map((indicator, index) => {
          const { Icon, color } = trendMeta(indicator.trend);
          return (
            <motion.div
              key={indicator.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="flex min-w-0 flex-col justify-between rounded-2xl border border-border bg-card/80 p-4 transition-all hover:border-primary/30 md:p-5"
            >
              <div>
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground md:text-xs">
                  {indicator.label}
                </span>
                <span className="text-lg font-black tracking-tight md:text-2xl">
                  {indicator.value}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <Icon className={`h-3.5 w-3.5 ${color}`} />
                <span className={`text-[9px] font-bold uppercase tracking-wider ${color}`}>
                  {indicator.trend}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="relative mx-auto mb-12 w-full min-w-0 max-w-5xl px-1 md:mb-16">
        <div className="absolute bottom-2 left-4 top-2 hidden w-0.5 bg-gradient-to-b from-primary/10 via-primary/30 to-primary/10 md:left-1/2 md:block md:-translate-x-1/2" />
        <div className="absolute bottom-2 left-4 top-2 w-0.5 bg-gradient-to-b from-primary/10 via-primary/30 to-primary/10 md:hidden" />

        <div className="space-y-8 md:space-y-12">
          {budgetMilestones.map((item, index) => {
            const isCompleted = item.status === "completed";
            const isRunning = item.status === "running";
            const isReached = isTimelineReached(item.status);
            const isLeft = index % 2 === 0;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="relative grid min-w-0 w-full gap-6 md:grid-cols-2 md:gap-x-12"
              >
                <div className="absolute left-4 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-background md:left-1/2 md:-translate-x-4">
                  {isCompleted ? (
                    <span className="flex size-6 items-center justify-center rounded-full border border-green-500 bg-green-500/20 text-green-500">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  ) : isRunning ? (
                    <span className="flex size-6 animate-pulse items-center justify-center rounded-full border border-primary bg-primary/20 text-primary">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    </span>
                  ) : (
                    <span className="flex size-6 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
                      <Circle className="h-2.5 w-2.5 fill-current" />
                    </span>
                  )}
                </div>

                {isLeft ? (
                  <>
                    <div className="min-w-0 max-w-full pl-12 md:col-start-1 md:pr-6 md:pl-0">
                      <TimelineCard item={item} isReached={isReached} isRunning={isRunning} />
                    </div>
                    <div className="hidden md:block" aria-hidden />
                  </>
                ) : (
                  <>
                    <div className="hidden md:block" aria-hidden />
                    <div className="min-w-0 max-w-full pl-12 md:col-start-2 md:pl-6">
                      <TimelineCard item={item} isReached={isReached} isRunning={isRunning} />
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mx-auto flex max-w-5xl flex-col gap-6 rounded-3xl border border-primary/20 bg-primary/5 p-6 md:p-8"
      >
        <div className="flex items-start gap-4">
          <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3 text-primary shrink-0">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div className="w-full">
            <h3 className="mb-3 text-lg font-bold text-primary">
              FY 2026/27 Sector Allocations — selected sectors (KES)
            </h3>
            <div className="grid grid-cols-1 gap-x-8 gap-y-2.5 text-sm text-muted-foreground md:grid-cols-2">
              {sectorAllocations.map((sector) => (
                <div
                  key={sector.key}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-card/50 px-3 py-2"
                >
                  <span className="font-semibold text-foreground">{sector.label}</span>
                  <span className="font-mono font-bold text-primary">
                    {formatKesBillions(sector.allocationBillions)}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground/70">
              Source: {BUDGET_SOURCE.label}. Figures are selected ministerial sector ceilings and
              do not sum to total expenditure.
            </p>
            <div className="mt-4">
              <a
                href={Routes.BudgetNews}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
              >
                View Full Budget News Analysis
                <TrendingUp className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </SectionShell>
  );
}
