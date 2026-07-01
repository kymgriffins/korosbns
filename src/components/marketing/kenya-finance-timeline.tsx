"use client";

import React from "react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, Circle, TrendingUp, TrendingDown, Minus, CalendarDays, ArrowRight } from "lucide-react";
import { SectionHeader, SectionShell } from "@/layouts/section-shell";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface TimelineItem { id: number; date: string; title: string; description: string; status: "completed" | "running" | "pending"; icon: string; details: string; impact?: string; }

const budgetCycleTimeline: TimelineItem[] = [
  { id: 1, date: "Aug 30, 2025", title: "MTEF Budget Circular Issued", description: "Treasury issued spending ceilings to all MDAs for FY2026/27", status: "completed", icon: "📋", details: "Sector Working Groups began reviewing bids against strategic priorities under BETA" },
  { id: 2, date: "Feb 15, 2026", title: "BPS 2026 Tabled in Parliament", description: "Budget Policy Statement submitted by Cabinet Secretary John Mbadi", status: "completed", icon: "🏛️", details: "Theme: 'Consolidating Gains Under BETA for Inclusive and Sustainable Growth'. Projected revenue KES 3.3T, expenditure KES 4.2T", impact: "Policy Blueprint" },
  { id: 3, date: "Mar 10, 2026", title: "BPS Approved by Parliament", description: "National Assembly approved BPS 2026 setting sector spending ceilings", status: "completed", icon: "✅", details: "MPs approved with amendments. County allocation set at KES 420B equitable share", impact: "Approved" },
  { id: 4, date: "Apr 30, 2026", title: "Budget Estimates Published", description: "Detailed revenue & expenditure estimates tabled: KES 4.82 trillion budget", status: "completed", icon: "📊", details: "Total budget KES 4.82T. Education KES 781.4B, Security KES 308.6B, Health KES 175.5B, Infrastructure KES 230B" },
  { id: 5, date: "May–Jun 2026", title: "Budget & Committee Review", description: "Budget and Appropriations Committee review with public participation", status: "completed", icon: "📢", details: "Public hearings held across counties. Civil society submitted memoranda on sector allocations", impact: "Public Input" },
  { id: 6, date: "Jun 2, 2026", title: "Parliament Approves Budget", description: "National Assembly approved FY2026/27 expenditure estimates", status: "completed", icon: "🗳️", details: "MPs approved KES 4.82T budget. Health KES 175.5B, Education KES 781.4B prioritized", impact: "Approved" },
  { id: 7, date: "Jun 11, 2026", title: "Budget Reading: CS Mbadi Presents KES 4.82T Budget", description: "CS John Mbadi delivers Budget Statement — KES 4.82 trillion expenditure, KES 1.15 trillion deficit", status: "completed", icon: "🎤", details: "Theme: 'Sustaining BETA for Resilient and Inclusive Growth amid Global Uncertainty'. Revenue KES 3.63T, ordinary KES 2.99T. Deficit at 5.5% of GDP, financed through KES 1.03T domestic + KES 116B external borrowing. Debt interest: KES 1.2T.", impact: "Key Milestone" },
  { id: 8, date: "Jul 1, 2026", title: "FY 2026/27 Begins", description: "New financial year starts under approved budget estimates", status: "running", icon: "🚀", details: "Government transitions to FY2026/27 spending under Parliament-approved estimates from the June budget cycle" },
];

function isTimelineReached(status: TimelineItem["status"]) { return status === "completed" || status === "running"; }

const budgetHighlights = [
  { label: "Total Budget FY2026/27", value: "KES 4.82T", trend: "up", trendIcon: TrendingUp, trendColor: "text-primary" },
  { label: "Total Revenue", value: "KES 3.63T", trend: "stable", trendIcon: Minus, trendColor: "text-muted-foreground" },
  { label: "Fiscal Deficit", value: "KES 1.15T", trend: "down", trendIcon: TrendingDown, trendColor: "text-amber-500" },
  { label: "Domestic Borrowing", value: "KES 1.03T", trend: "up", trendIcon: TrendingUp, trendColor: "text-orange-500" },
];

const economicIndicators = [
  { label: "GDP Growth 2025", value: "4.6%", trend: "stable", trendIcon: Minus, trendColor: "text-muted-foreground" },
  { label: "GDP Forecast 2026", value: "4.9-5.3%", trend: "up", trendIcon: TrendingUp, trendColor: "text-green-500" },
  { label: "Inflation Rate", value: "4.6%", trend: "down", trendIcon: TrendingDown, trendColor: "text-green-500" },
  { label: "Central Bank Rate", value: "9.5%", trend: "stable", trendIcon: Minus, trendColor: "text-muted-foreground" },
];

function TimelineCard({ item, isReached, isCompleted, isRunning }: { item: TimelineItem; isReached: boolean; isCompleted: boolean; isRunning: boolean }) {
  return (
    <div className={`rounded-2xl border bg-card p-5 transition-all duration-300 md:rounded-3xl md:p-7 ${isRunning ? "border-primary/30 hover:border-primary/40" : isReached ? "border-border hover:border-primary/20" : "border-muted bg-card/60 opacity-60 hover:border-muted"}`}>
      <div className="mb-3 flex items-start justify-between gap-4">
        <span className={`flex items-center gap-1.5 text-xs font-semibold ${isReached ? "text-primary" : "text-muted-foreground"}`}>
          <CalendarDays className="h-3.5 w-3.5" />{item.date}
        </span>
        {item.impact && isReached ? <Badge variant="outline" className="border-primary/30 text-xs font-semibold text-primary">{item.impact}</Badge> : null}
      </div>
      <h3 className={`mb-3 flex items-center gap-2 text-xl font-bold tracking-tight md:text-2xl ${isReached ? "text-foreground" : "text-muted-foreground"}`}>
        <span className={`text-xl ${isReached ? "" : "opacity-50"}`}>{item.icon}</span>{item.title}
      </h3>
      <p className={`mb-4 text-sm leading-relaxed md:text-base ${isReached ? "text-muted-foreground" : "text-muted-foreground/80"}`}>{item.description}</p>
      <div className={`border-t pt-4 text-xs ${isReached ? "border-border/60 text-muted-foreground" : "border-muted text-muted-foreground/70"}`}>{item.details}</div>
    </div>
  );
}

export default function KenyaFinanceTimeline() {
  return (
    <>
      <SectionShell className="relative overflow-x-clip border-t border-border/40 bg-background text-foreground">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-1/2 w-4/5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mx-auto mb-8 max-w-5xl overflow-hidden rounded-3xl border border-primary/30 bg-primary/5 p-6 text-center md:p-10">
          <div className="mb-2 inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold text-primary">Budget Reading — June 11, 2026</div>
          <h2 className="mb-3 text-2xl font-black tracking-tight md:text-4xl">CS John Mbadi Presents KES 4.82 Trillion Budget</h2>
          <p className="mx-auto mb-5 max-w-2xl text-sm text-muted-foreground md:text-base">Revenue KES 3.63 trillion · Deficit KES 1.15 trillion · Debt interest KES 1.2 trillion</p>
          <div className="mx-auto flex max-w-md flex-wrap items-center justify-center gap-3">
            <span className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">KES 4.82T Total Budget</span>
            <span className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm font-bold text-amber-500">KES 1.15T Deficit</span>
            <span className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-500">KES 1.2T Debt Interest</span>
          </div>
        </motion.div>
        <SectionHeader eyebrow="FY 2026/27 Budget Cycle" title={<>Budget Tracker & <span className="font-heading italic text-primary">Allocations</span>.</>} description="Complete tracking of Kenya's FY2026/27 budget cycle from formulation through implementation." />
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mx-auto mb-4 grid max-w-6xl grid-cols-2 gap-3 md:mb-8 md:grid-cols-4 md:gap-4">
          {budgetHighlights.map((indicator) => { const Icon = indicator.trendIcon; return (
            <motion.div key={indicator.label} variants={fadeInUp} className="flex min-w-0 flex-col justify-between rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/30 md:p-5">
              <div><span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{indicator.label}</span><span className="text-lg font-black tracking-tight md:text-2xl">{indicator.value}</span></div>
              <div className="mt-3 flex items-center gap-1.5"><Icon className={`h-3.5 w-3.5 ${indicator.trendColor}`} /><span className={`text-xs font-semibold ${indicator.trendColor}`}>{indicator.trend}</span></div>
            </motion.div>
          );})}
        </motion.div>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mx-auto mb-8 grid max-w-6xl grid-cols-2 gap-3 md:mb-12 md:grid-cols-4 md:gap-4">
          {economicIndicators.map((indicator) => { const Icon = indicator.trendIcon; return (
            <motion.div key={indicator.label} variants={fadeInUp} className="flex min-w-0 flex-col justify-between rounded-2xl border border-border bg-card/80 p-4 transition-all hover:border-primary/30 md:p-5">
              <div><span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{indicator.label}</span><span className="text-lg font-black tracking-tight md:text-2xl">{indicator.value}</span></div>
              <div className="mt-3 flex items-center gap-1.5"><Icon className={`h-3.5 w-3.5 ${indicator.trendColor}`} /><span className={`text-xs font-semibold ${indicator.trendColor}`}>{indicator.trend}</span></div>
            </motion.div>
          );})}
        </motion.div>
        <div className="relative mx-auto mb-12 w-full min-w-0 max-w-5xl px-1 md:mb-16">
          <div className="absolute bottom-2 left-4 top-2 hidden w-0.5 bg-primary/20 md:left-1/2 md:block md:-translate-x-1/2" />
          <div className="absolute bottom-2 left-4 top-2 w-0.5 bg-primary/20 md:hidden" />
          <div className="space-y-8 md:space-y-12">
            {budgetCycleTimeline.map((item, index) => {
              const isCompleted = item.status === "completed";
              const isRunning = item.status === "running";
              const isReached = isTimelineReached(item.status);
              const isLeft = index % 2 === 0;
              return (
                <motion.div key={item.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6, delay: index * 0.05 }} className="relative grid min-w-0 w-full gap-6 md:grid-cols-2 md:gap-x-12">
                  <div className="absolute left-4 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-background md:left-1/2 md:-translate-x-4">
                    {isCompleted ? <span className="flex size-6 items-center justify-center rounded-full border border-green-500 bg-green-500/20 text-green-500"><Check className="h-3.5 w-3.5" /></span>
                    : isRunning ? <span className="flex size-6 animate-pulse items-center justify-center rounded-full border border-primary bg-primary/20 text-primary"><Loader2 className="h-3.5 w-3.5 animate-spin" /></span>
                    : <span className="flex size-6 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground"><Circle className="h-2.5 w-2.5 fill-current" /></span>}
                  </div>
                  {isLeft ? (
                    <><div className="min-w-0 max-w-full pl-12 md:col-start-1 md:pr-6 md:pl-0"><TimelineCard item={item} isReached={isReached} isCompleted={isCompleted} isRunning={isRunning} /></div><div className="hidden md:block" aria-hidden /></>
                  ) : (
                    <><div className="hidden md:block" aria-hidden /><div className="min-w-0 max-w-full pl-12 md:col-start-2 md:pl-6"><TimelineCard item={item} isReached={isReached} isCompleted={isCompleted} isRunning={isRunning} /></div></>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </SectionShell>
      <section className="border-t border-border/20 bg-gradient-to-b from-background to-primary/[0.02] py-20">
        <div className={SECTION_SHELL_INNER}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mx-auto max-w-2xl text-center">
            <h2 className="gusto-heading mb-4 text-3xl leading-tight md:text-4xl">Dive deeper into the <span className="font-heading italic text-primary">data</span></h2>
            <p className="mb-8 text-base leading-relaxed text-foreground/60">Explore interactive reports, historical trends, and detailed breakdowns of Kenya&apos;s budget across every sector.</p>
            <Link href="/reports"><Button size="lg" variant="white" className="gap-2 rounded-full px-10 py-6 text-base font-bold">View Full Reports <ArrowRight className="size-5" /></Button></Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
