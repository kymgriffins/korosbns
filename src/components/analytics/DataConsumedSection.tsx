"use client";

import React from "react";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import {
  HardDrive,
  FileText,
  BarChart3,
  Video,
  Database,
  FileCheck,
  Coins,
  Smartphone,
  Zap,
  TrendingUp,
  Sparkles,
  Layers,
} from "lucide-react";
import { TrendBadge } from "./TrendBadge";
import { type DataConsumedInterpretation, type TimeRangePeriod } from "./analytics-data";

type Props = {
  data: DataConsumedInterpretation;
  period: TimeRangePeriod;
};

const CATEGORY_ICONS = {
  "file-text": FileText,
  "bar-chart-3": BarChart3,
  video: Video,
  database: Database,
};

const INSIGHT_ICONS = {
  "file-check": FileCheck,
  coins: Coins,
  smartphone: Smartphone,
  zap: Zap,
};

export function DataConsumedSection({ data, period }: Props) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="space-y-6"
    >
      {/* Hero Banner for Data Consumed */}
      <motion.div
        variants={fadeInUp}
        className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 p-6 md:p-8 shadow-sm"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <HardDrive className="size-48 text-primary" />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
              <Sparkles className="size-3.5" />
              <span>Data Consumed & Interpreted</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-heading tracking-tight">
              Bandwidth & Civic Payload Distribution
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              Transparent reporting on total platform data served to citizens, broken down by content type and interpreted into real-world civic impact.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-background/80 backdrop-blur p-4 rounded-xl border border-border/60 shrink-0">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <HardDrive className="size-8" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Total Data Consumed
              </div>
              <div className="text-3xl font-extrabold font-heading tabular-nums text-foreground flex items-center gap-2">
                {data.totalBytesFormatted}
              </div>
              <div className="mt-1">
                <TrendBadge changePct={data.changePct} direction={data.direction} periodLabel="vs prior period" />
              </div>
            </div>
          </div>
        </div>

        {/* Category Payload Distribution Bars */}
        <div className="mt-8 space-y-4 pt-6 border-t border-border/60">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Layers className="size-4 text-primary" />
              <span>Payload Share by Category</span>
            </h3>
            <span className="text-xs text-muted-foreground">Percentages of total traffic served</span>
          </div>

          {/* Combined Progress Bar */}
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden flex shadow-inner">
            {data.categories.map((cat) => {
              const bgColors: Record<string, string> = {
                "text-emerald-500": "bg-emerald-500",
                "text-blue-500": "bg-blue-500",
                "text-amber-500": "bg-amber-500",
                "text-purple-500": "bg-purple-500",
              };
              return (
                <div
                  key={cat.id}
                  style={{ width: `${cat.percentage}%` }}
                  className={`h-full ${bgColors[cat.colorClass] || "bg-primary"} transition-all duration-500`}
                  title={`${cat.label}: ${cat.percentage}% (${cat.formattedSize})`}
                />
              );
            })}
          </div>

          {/* Detailed Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {data.categories.map((cat) => {
              const IconComp = CATEGORY_ICONS[cat.iconName] || FileText;
              return (
                <div
                  key={cat.id}
                  className="p-4 rounded-xl border border-border/50 bg-card/60 hover:bg-card transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${cat.bgClass} ${cat.colorClass}`}>
                      <IconComp className="size-4" />
                    </div>
                    <span className="text-xs font-bold tabular-nums px-2 py-0.5 rounded-md bg-muted">
                      {cat.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold truncate" title={cat.label}>
                      {cat.label}
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-lg font-bold tabular-nums text-foreground">{cat.formattedSize}</span>
                      <span className="text-xs text-muted-foreground">
                        {cat.itemCount.toLocaleString()} {cat.itemLabel}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Human Interpretation Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-heading tracking-tight flex items-center gap-2">
            <TrendingUp className="size-5 text-primary" />
            <span>Data Consumed Interpreted into Civic Value</span>
          </h3>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Real-world impact metrics of Budget Ndio Story digital delivery
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.insights.map((insight) => {
            const IconComp = INSIGHT_ICONS[insight.icon] || FileCheck;
            return (
              <motion.div
                key={insight.id}
                variants={fadeInUp}
                className="p-5 rounded-xl border border-border/60 bg-card hover:border-primary/40 transition-all shadow-xs flex gap-4"
              >
                <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0 self-start">
                  <IconComp className="size-6" />
                </div>
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-muted text-primary border border-primary/20">
                      {insight.badge}
                    </span>
                    <span className="text-xs font-bold text-foreground tabular-nums">{insight.stat}</span>
                  </div>
                  <h4 className="text-base font-semibold leading-tight text-foreground">{insight.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
