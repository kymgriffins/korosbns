"use client";

import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { useEffect, useState } from "react";
import { Users, BookOpen, ClipboardCheck, Brain, HardDrive, Eye, ShieldCheck, MapPin } from "lucide-react";
import { TrendBadge } from "./TrendBadge";
import { type MetricWithTrend } from "./analytics-data";

type Props = {
  citizensReached: MetricWithTrend;
  dataConsumedGb: MetricWithTrend;
  totalPageviews: MetricWithTrend;
  modulesCompleted: MetricWithTrend;
  surveyResponses: MetricWithTrend;
  quizAttempts: MetricWithTrend;
  quizPassRate: MetricWithTrend;
  uptimePercentage: MetricWithTrend;
  activeCounties: MetricWithTrend;
};

function CounterCard({
  metric,
  label,
  icon,
}: {
  metric: MetricWithTrend;
  label: string;
  icon: React.ReactNode;
}) {
  const [count, setCount] = useState(0);
  const target = metric.value;
  const isPercentage = metric.formatted.includes("%");

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const step = Math.max(1, Math.ceil(target / (duration / 16)));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <motion.div
      variants={fadeInUp}
      className="flex flex-col justify-between p-5 rounded-xl border border-border/60 bg-card hover:border-border transition-all shadow-xs"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="p-2.5 rounded-lg bg-primary/10 text-primary">{icon}</div>
        <TrendBadge changePct={metric.changePct} direction={metric.direction} />
      </div>
      <div>
        <div className="text-2xl md:text-3xl font-extrabold font-heading tabular-nums text-foreground">
          {metric.formatted}
        </div>
        <div className="text-xs font-semibold text-foreground mt-1">{label}</div>
        {metric.subtext && (
          <div className="text-[11px] text-muted-foreground mt-0.5">{metric.subtext}</div>
        )}
      </div>
    </motion.div>
  );
}

export function ImpactCounters({
  citizensReached,
  dataConsumedGb,
  totalPageviews,
  modulesCompleted,
  surveyResponses,
  quizAttempts,
  quizPassRate,
  uptimePercentage,
  activeCounties,
}: Props) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold font-heading tracking-tight">Key Civic Impact Metrics</h3>
        <span className="text-xs text-muted-foreground">All metrics update based on selected time range</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CounterCard
          metric={citizensReached}
          label="Citizens Reached"
          icon={<Users className="size-5" />}
        />
        <CounterCard
          metric={dataConsumedGb}
          label="Data Consumed"
          icon={<HardDrive className="size-5" />}
        />
        <CounterCard
          metric={totalPageviews}
          label="Total Pageviews"
          icon={<Eye className="size-5" />}
        />
        <CounterCard
          metric={modulesCompleted}
          label="Modules Completed"
          icon={<BookOpen className="size-5" />}
        />
        <CounterCard
          metric={surveyResponses}
          label="Survey Responses"
          icon={<ClipboardCheck className="size-5" />}
        />
        <CounterCard
          metric={quizAttempts}
          label="Quiz Attempts"
          icon={<Brain className="size-5" />}
        />
        <CounterCard
          metric={quizPassRate}
          label="Quiz Accuracy Rate"
          icon={<ShieldCheck className="size-5" />}
        />
        <CounterCard
          metric={activeCounties}
          label="County Coverage"
          icon={<MapPin className="size-5" />}
        />
      </div>
    </motion.div>
  );
}
