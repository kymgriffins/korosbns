"use client";

import React, { useState } from "react";
import Image from "next/image";
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
  ChevronDown,
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

const LATEST_MILESTONE_ID = 6;
const MOBILE_SECTOR_PREVIEW = 4;

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

function KpiTile({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend: Trend;
}) {
  const { Icon, color } = trendMeta(trend);
  return (
    <div className="flex min-w-[44%] snap-start flex-col justify-between rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/30 md:min-w-0 md:p-5">
      <div>
        <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground md:text-xs">
          {label}
        </span>
        <span className="text-lg font-black tracking-tight md:text-2xl">{value}</span>
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        <Icon className={`h-3.5 w-3.5 ${color}`} />
        <span className={`text-[9px] font-bold uppercase tracking-wider ${color}`}>{trend}</span>
      </div>
    </div>
  );
}

function TimelineCard({
  item,
  isReached,
}: {
  item: BudgetMilestone;
  isReached: boolean;
}) {
  const Icon = MILESTONE_ICONS[item.icon];
  return (
    <div
      className={`rounded-2xl border bg-card p-4 transition-all duration-300 md:rounded-3xl md:p-7 ${
        item.status === "running"
          ? "border-primary/30 hover:border-primary/40"
          : isReached
            ? "border-border hover:border-primary/20"
            : "border-muted bg-card/60 opacity-60 hover:border-muted"
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-4">
        <span
          className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest md:text-xs ${
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
        className={`mb-2.5 flex items-center gap-2.5 text-base font-bold tracking-tight md:mb-3 md:text-2xl ${
          isReached ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        <span
          className={`flex size-8 shrink-0 items-center justify-center rounded-xl border md:size-9 ${
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
        className={`mb-3 text-sm leading-relaxed md:mb-4 md:text-base ${
          isReached ? "text-muted-foreground" : "text-muted-foreground/80"
        }`}
      >
        {item.description}
      </p>

      <div
        className={`border-t pt-3 text-xs leading-relaxed md:pt-4 ${
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
  const [showAllMilestones, setShowAllMilestones] = useState(false);
  const [showAllSectors, setShowAllSectors] = useState(false);

  const hiddenMilestoneCount = budgetMilestones.filter(
    (m) => m.status === "completed" && m.id !== LATEST_MILESTONE_ID
  ).length;
  const hiddenSectorCount = Math.max(0, sectorAllocations.length - MOBILE_SECTOR_PREVIEW);

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
        className="mx-auto mb-8 max-w-5xl overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-5 text-center md:p-10"
      >
        <div className="mb-2 inline-block rounded-full bg-primary/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary md:px-4 md:text-[11px]">
          Budget Statement — June 11, 2026
        </div>
        <h2 className="mb-3 text-xl font-black tracking-tight md:text-4xl">
          CS John Mbadi Reads a {formatKesBillions(4820.4)} Budget
        </h2>
        <p className="mx-auto mb-0 max-w-2xl text-xs text-muted-foreground md:mb-5 md:text-base">
          Revenue {formatKesBillions(3630.5)} · Deficit {formatKesBillions(1146.2)} (5.5% of GDP) ·
          Interest &amp; pensions {formatKesBillions(1501.3)}
        </p>
        <div className="mx-auto hidden max-w-md flex-wrap items-center justify-center gap-3 md:flex">
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

        <figure className="mx-auto mt-5 max-w-3xl md:mt-7">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-primary/20 shadow-sm sm:aspect-[2/1]">
            <Image
              src="https://pbs.twimg.com/media/HKhWiDKXkAANe71?format=jpg&name=large"
              alt="CS John Mbadi presenting the FY2026/27 Budget"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
          <figcaption className="mt-2 text-[11px] text-muted-foreground/70">
            CS John Mbadi presents the FY2026/27 Budget in Parliament, 11 June 2026.
          </figcaption>
        </figure>
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

      <div className="mx-auto mb-3 max-w-6xl md:mb-8">
        <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground md:hidden">
          Headline figures · swipe →
        </span>
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden">
          {budgetHighlights.map((indicator) => (
            <KpiTile
              key={indicator.label}
              label={indicator.label}
              value={indicator.value}
              trend={indicator.trend}
            />
          ))}
        </div>
      </div>

      <div className="mx-auto mb-8 max-w-6xl md:mb-12">
        <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground md:hidden">
          Economic indicators · swipe →
        </span>
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden">
          {economicIndicators.map((indicator) => (
            <KpiTile
              key={indicator.label}
              label={indicator.label}
              value={indicator.value}
              trend={indicator.trend}
            />
          ))}
        </div>
      </div>

      <div className="relative mx-auto mb-6 w-full min-w-0 max-w-5xl px-1 md:mb-16">
        <div className="absolute bottom-2 left-4 top-2 hidden w-0.5 bg-gradient-to-b from-primary/10 via-primary/30 to-primary/10 md:left-1/2 md:block md:-translate-x-1/2" />
        <div className="absolute bottom-2 left-4 top-2 w-0.5 bg-gradient-to-b from-primary/10 via-primary/30 to-primary/10 md:hidden" />

        <div className="space-y-6 md:space-y-12">
          {budgetMilestones.map((item, index) => {
            const isCompleted = item.status === "completed";
            const isRunning = item.status === "running";
            const isReached = isTimelineReached(item.status);
            const isLeft = index % 2 === 0;
            const hideOnMobile =
              !showAllMilestones && isCompleted && item.id !== LATEST_MILESTONE_ID;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className={`relative min-w-0 w-full gap-6 md:grid md:grid-cols-2 md:gap-x-12 ${
                  hideOnMobile ? "hidden md:grid" : "grid"
                }`}
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
                      <TimelineCard item={item} isReached={isReached} />
                    </div>
                    <div className="hidden md:block" aria-hidden />
                  </>
                ) : (
                  <>
                    <div className="hidden md:block" aria-hidden />
                    <div className="min-w-0 max-w-full pl-12 md:col-start-2 md:pl-6">
                      <TimelineCard item={item} isReached={isReached} />
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>

        {hiddenMilestoneCount > 0 ? (
          <div className="mt-6 flex justify-center md:hidden">
            <button
              onClick={() => setShowAllMilestones((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 text-xs font-bold text-foreground transition-colors hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              {showAllMilestones
                ? "Show fewer milestones"
                : `Show ${hiddenMilestoneCount} earlier milestones`}
              <ChevronDown
                className={`size-4 transition-transform ${showAllMilestones ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        ) : null}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mx-auto flex max-w-5xl flex-col gap-6 rounded-3xl border border-primary/20 bg-primary/5 p-5 md:p-8"
      >
        <div className="flex items-start gap-4">
          <div className="hidden rounded-2xl border border-primary/20 bg-primary/10 p-3 text-primary shrink-0 sm:block">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div className="w-full">
            <h3 className="mb-3 text-base font-bold text-primary md:text-lg">
              FY 2026/27 Sector Allocations — selected sectors (KES)
            </h3>
            <div className="grid grid-cols-1 gap-x-8 gap-y-2.5 text-sm text-muted-foreground md:grid-cols-2">
              {sectorAllocations.map((sector, index) => {
                const hideOnMobile = !showAllSectors && index >= MOBILE_SECTOR_PREVIEW;
                return (
                  <div
                    key={sector.key}
                    className={`items-center justify-between gap-2 rounded-lg border border-border/60 bg-card/50 px-3 py-2 ${
                      hideOnMobile ? "hidden md:flex" : "flex"
                    }`}
                  >
                    <span className="font-semibold text-foreground">{sector.label}</span>
                    <span className="font-mono font-bold text-primary">
                      {formatKesBillions(sector.allocationBillions)}
                    </span>
                  </div>
                );
              })}
            </div>

            {hiddenSectorCount > 0 ? (
              <button
                onClick={() => setShowAllSectors((v) => !v)}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 md:hidden"
              >
                {showAllSectors ? "Show fewer sectors" : `View all ${sectorAllocations.length} sectors`}
                <ChevronDown
                  className={`size-3.5 transition-transform ${showAllSectors ? "rotate-180" : ""}`}
                />
              </button>
            ) : null}

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
