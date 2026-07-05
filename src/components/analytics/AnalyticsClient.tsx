"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { TrafficChart } from "./TrafficChart";
import { TopPagesTable } from "./TopPagesTable";
import { DeviceBreakdown } from "./DeviceBreakdown";
import { UptimeWidget } from "./UptimeWidget";
import { ImpactCounters } from "./ImpactCounters";
import { type AnalyticsSummaryApi } from "@/lib/api-client";
import { analyticsData } from "@/data/analytics";
import { usePageView } from "@/hooks/use-page-view";
import { Loader2, BarChart3 } from "lucide-react";

export function AnalyticsClient() {
  usePageView();
  const [data, setData] = useState<AnalyticsSummaryApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await analyticsData.fetch();
        setData(res as AnalyticsSummaryApi);
      } catch (err) {
        setError("Unable to load analytics data. Please try again later.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center px-4">
        <div>
          <p className="text-lg font-semibold">Analytics data unavailable</p>
          <p className="text-sm text-muted-foreground mt-2">{error ?? "No analytics data could be loaded."}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative w-full min-h-screen bg-background overflow-hidden">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-500/10 blur-[120px] rounded-full opacity-50" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <motion.div variants={fadeInUp}>
            <BarChart3 className="size-8 mb-4 text-primary" />
            <h1 className="text-3xl md:text-5xl font-bold font-heading tracking-tight mb-4">
              Web Analytics
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
              Public transparency metrics for Budget Ndio Story — traffic,
              engagement, and platform performance.
            </p>
          </motion.div>
        </motion.div>

        {/* Impact Counters */}
        <div className="mb-12">
          <ImpactCounters
            citizensReached={data.citizens_reached}
            modulesCompleted={data.modules_completed}
            surveysResponded={data.surveys_responded}
            quizAttempts={data.quiz_attempts}
          />
        </div>

        {/* Traffic Chart + Uptime */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2 p-6 rounded-xl border border-border/60 bg-card"
          >
            <h2 className="font-semibold mb-4">Traffic Over Time</h2>
            <TrafficChart data={data.daily_visitors} />
          </motion.div>
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="p-6 rounded-xl border border-border/60 bg-card"
          >
            <h2 className="font-semibold mb-4">Uptime</h2>
            <UptimeWidget
              uptimePercentage={data.uptime_percentage}
              data={data.uptime_data}
            />
          </motion.div>
        </div>

        {/* Top Pages + Device Breakdown */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="p-6 rounded-xl border border-border/60 bg-card"
          >
            <h2 className="font-semibold mb-4">Top Pages</h2>
            <TopPagesTable data={data.top_pages} />
          </motion.div>
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="p-6 rounded-xl border border-border/60 bg-card"
          >
            <h2 className="font-semibold mb-4">Device Breakdown</h2>
            <DeviceBreakdown data={data.device_breakdown} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
