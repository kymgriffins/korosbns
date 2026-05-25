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
  AlertTriangle,
} from "lucide-react";
import { SectionHeader, SectionShell } from "@/layouts/section-shell";

interface TimelineItem {
  id: number;
  date: string;
  title: string;
  description: string;
  status: "completed" | "running" | "pending";
  icon: string;
  details: string;
  impact?: string;
}

const financeBillTimeline: TimelineItem[] = [
  {
    id: 1,
    date: "Apr 30, 2026",
    title: "Finance Bill Published",
    description: "Kenya's Finance Bill 2026 released with proposed tax reforms",
    status: "completed",
    icon: "📄",
    details: "Published by National Treasury with amendments to tax laws",
  },
  {
    id: 2,
    date: "May 5, 2026",
    title: "Submitted to National Assembly",
    description: "Bill submitted to Parliament for first reading",
    status: "completed",
    icon: "🏛️",
    details: "Cabinet submission completed successfully",
  },
  {
    id: 3,
    date: "May 10, 2026",
    title: "Public Participation Opened",
    description: "National Assembly opens public participation period",
    status: "completed",
    icon: "📢",
    details: "Citizens can submit written feedback and concerns",
    impact: "Active Engagement",
  },
  {
    id: 4,
    date: "Current Stage",
    title: "Committee Review Stage",
    description: "Bill under review by National Assembly committees",
    status: "running",
    icon: "🔄",
    details: "Stakeholder engagements and hearings ongoing",
    impact: "Ongoing Feedback",
  },
  {
    id: 5,
    date: "Jun-Jul 2026",
    title: "National Assembly Debate",
    description: "Second and third reading in National Assembly",
    status: "pending",
    icon: "🗳️",
    details: "Expected voting and parliamentary amendments",
  },
  {
    id: 6,
    date: "Aug 2026",
    title: "Senate Review",
    description: "Bill proceeds to Senate for consideration",
    status: "pending",
    icon: "🏛️",
    details: "Senate debate and approval required",
  },
  {
    id: 7,
    date: "Sep 2026",
    title: "Presidential Assent",
    description: "Bill presented to President for signing",
    status: "pending",
    icon: "✍️",
    details: "Becomes Finance Act 2026 upon presidential assent",
  },
  {
    id: 8,
    date: "Jan 1, 2027",
    title: "Implementation",
    description: "Finance Act 2026 comes into effect",
    status: "pending",
    icon: "🚀",
    details: "New tax measures and economic reforms take effect",
  },
];

function isTimelineReached(status: TimelineItem["status"]): boolean {
  return status === "completed" || status === "running";
}

const economicIndicators = [
  {
    label: "GDP Growth 2025",
    value: "4.6%",
    trend: "stable",
    trendIcon: Minus,
    trendColor: "text-zinc-400",
  },
  {
    label: "GDP Forecast 2026",
    value: "4.9-5.3%",
    trend: "up",
    trendIcon: TrendingUp,
    trendColor: "text-green-500",
  },
  {
    label: "Inflation Rate",
    value: "4.6%",
    trend: "down",
    trendIcon: TrendingDown,
    trendColor: "text-green-500",
  },
  {
    label: "Central Bank Rate",
    value: "9.5%",
    trend: "stable",
    trendIcon: Minus,
    trendColor: "text-zinc-400",
  },
];

function TimelineCard({
  item,
  isReached,
  isCompleted,
  isRunning,
}: {
  item: TimelineItem;
  isReached: boolean;
  isCompleted: boolean;
  isRunning: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border bg-card p-5 transition-all duration-300 md:rounded-3xl md:p-7 ${
        isRunning
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
        className={`mb-3 flex items-center gap-2 text-xl font-bold tracking-tight md:text-2xl ${
          isReached ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        <span className={`text-xl ${isReached ? "" : "opacity-50"}`}>{item.icon}</span>
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
        className={`border-t pt-4 text-xs ${
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
    <SectionShell className="relative overflow-x-clip border-t border-border/40 bg-background text-foreground">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-1/2 w-4/5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <SectionHeader
        eyebrow="Finance Bill 2026"
        title={
          <>
            Legislative Tracker &{" "}
            <span className="font-heading italic text-primary">Context</span>.
          </>
        }
        description="Real-time tracking of the legislative process and economic context surrounding the proposed tax reforms."
      />

      <div className="mx-auto mb-12 grid max-w-6xl grid-cols-2 gap-4 md:mb-16 md:grid-cols-4 md:gap-6">
        {economicIndicators.map((indicator, index) => {
          const Icon = indicator.trendIcon;
          return (
            <motion.div
              key={indicator.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="flex min-w-0 flex-col justify-between rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/30"
            >
              <div>
                <span className="mb-2 block text-xs text-muted-foreground">
                  {indicator.label}
                </span>
                <span className="text-2xl font-black tracking-tight md:text-3xl">
                  {indicator.value}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-1.5">
                <Icon className={`h-4 w-4 ${indicator.trendColor}`} />
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${indicator.trendColor}`}
                >
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
          {financeBillTimeline.map((item, index) => {
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
                      <TimelineCard
                        item={item}
                        isReached={isReached}
                        isCompleted={isCompleted}
                        isRunning={isRunning}
                      />
                    </div>
                    <div className="hidden md:block" aria-hidden />
                  </>
                ) : (
                  <>
                    <div className="hidden md:block" aria-hidden />
                    <div className="min-w-0 max-w-full pl-12 md:col-start-2 md:pl-6">
                      <TimelineCard
                        item={item}
                        isReached={isReached}
                        isCompleted={isCompleted}
                        isRunning={isRunning}
                      />
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
        className="mx-auto flex max-w-4xl flex-col items-start gap-5 rounded-3xl border border-yellow-500/20 bg-yellow-500/5 p-6 md:flex-row md:p-8"
      >
        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-3 text-yellow-500">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div>
          <h3 className="mb-2 text-lg font-bold text-yellow-500">
            Key Proposals in Finance Bill 2026:
          </h3>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-2 text-sm text-muted-foreground md:grid-cols-2">
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-yellow-500" />
              Rental income tax increase: 7.5% → 10%
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-yellow-500" />
              Excise duty adjustments on tobacco products
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-yellow-500" />
              Enhanced digital service tax enforcement
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-yellow-500" />
              Aggressive tax compliance tracking desk
            </li>
          </ul>
        </div>
      </motion.div>
    </SectionShell>
  );
}
