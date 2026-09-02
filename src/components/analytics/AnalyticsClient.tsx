"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { BarChart3, RefreshCw, ShieldCheck } from "lucide-react";
import { usePageView } from "@/hooks/use-page-view";
import { TimeRangePicker } from "./TimeRangePicker";
import { ImpactCounters } from "./ImpactCounters";
import { DataConsumedSection } from "./DataConsumedSection";
import { TrafficChart } from "./TrafficChart";
import { DeviceBreakdown } from "./DeviceBreakdown";
import { TopPagesTable } from "./TopPagesTable";
import { TrafficSourcesWidget } from "./TrafficSourcesWidget";
import { UptimeWidget } from "./UptimeWidget";
import { ExecutiveRoleSuite, type RoleType } from "./ExecutiveRoleSuite";
import { getComprehensiveAnalytics, type TimeRangePeriod } from "./analytics-data";
import { HERO_SECTION_PADDING } from "@/layouts/section-shell";
import { cn } from "@/utils";

export function AnalyticsClient() {
  usePageView();
  const [period, setPeriod] = useState<TimeRangePeriod>("all_time");
  const [activeRole, setActiveRole] = useState<RoleType>("ceo");

  const analytics = getComprehensiveAnalytics(period);

  return (
    <section className="relative w-full min-h-screen bg-background overflow-hidden">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] bg-primary/10 blur-[140px] rounded-full opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] bg-teal-500/10 blur-[140px] rounded-full opacity-60" />
      </div>

      <div className={cn(HERO_SECTION_PADDING, "mx-auto max-w-7xl space-y-10 px-4 sm:px-6")}>
        {/* Header Section */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-border/60"
        >
          <motion.div variants={fadeInUp} className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
              <BarChart3 className="size-3.5" />
              <span>Public Civic Transparency & CEO Executive Analytics</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight text-foreground">
              Web Analytics & Data Insights
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-3xl leading-relaxed">
              Transparent, public metrics for Budget Ndio Story — tracking citizen reach, device usage, overall bandwidth payload consumed, uptime, and civic engagement across Kenya.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="space-y-2 shrink-0">
            <TimeRangePicker selected={period} onChange={setPeriod} />
            <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
              <RefreshCw className="size-3 text-emerald-500 animate-spin-slow" />
              <span>Updated: {analytics.asOfDate}</span>
              <span className="text-border">•</span>
              <span className="font-medium text-foreground">{analytics.periodLabel}</span>
            </div>
          </motion.div>
        </motion.div>

        {/* CEO Executive Access & QA User Story Control Suite */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <ExecutiveRoleSuite activeRole={activeRole} onRoleChange={setActiveRole} />
        </motion.div>

        {/* 1. All-Time & High Impact KPI Counters */}
        <ImpactCounters
          citizensReached={analytics.allTimeOverview.citizensReached}
          dataConsumedGb={analytics.allTimeOverview.dataConsumedGb}
          totalPageviews={analytics.allTimeOverview.totalPageviews}
          modulesCompleted={analytics.allTimeOverview.modulesCompleted}
          surveyResponses={analytics.allTimeOverview.surveyResponses}
          quizAttempts={analytics.allTimeOverview.quizAttempts}
          quizPassRate={analytics.allTimeOverview.quizPassRate}
          uptimePercentage={analytics.allTimeOverview.uptimePercentage}
          activeCounties={analytics.allTimeOverview.activeCounties}
        />

        {/* 2. Data Consumed & Interpreted Section */}
        <DataConsumedSection data={analytics.dataConsumedInterpreted} period={period} />

        {/* 3. Traffic Chart & Uptime Reliability Widget */}
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2 p-6 rounded-2xl border border-border/60 bg-card shadow-xs"
          >
            <TrafficChart data={analytics.trafficTimeline} />
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="p-6 rounded-2xl border border-border/60 bg-card shadow-xs"
          >
            <UptimeWidget
              metric={analytics.allTimeOverview.uptimePercentage}
              data={analytics.uptimeData}
            />
          </motion.div>
        </div>

        {/* 4. Top Visited Pages, Device Breakdown, and Traffic Channels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="p-6 rounded-2xl border border-border/60 bg-card shadow-xs lg:col-span-1"
          >
            <TopPagesTable data={analytics.topPages} />
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="p-6 rounded-2xl border border-border/60 bg-card shadow-xs lg:col-span-1"
          >
            <DeviceBreakdown data={analytics.deviceBreakdown} />
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="p-6 rounded-2xl border border-border/60 bg-card shadow-xs lg:col-span-1"
          >
            <TrafficSourcesWidget data={analytics.trafficSources} />
          </motion.div>
        </div>

        {/* Bottom Transparency & Open Data Footer Note */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Open Data & Privacy Guarantee</h4>
              <p className="text-xs text-muted-foreground">
                All analytics data is anonymized and collected without cookies or personal tracking. Our metrics are open for public audit.
              </p>
            </div>
          </div>
          <a
            href="/bns-project"
            className="px-4 py-2 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
          >
            Learn About Our Platform
          </a>
        </motion.div>
      </div>
    </section>
  );
}
