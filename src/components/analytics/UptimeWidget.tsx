"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, Zap, Server, ShieldCheck } from "lucide-react";
import { TrendBadge } from "./TrendBadge";
import { type MetricWithTrend } from "./analytics-data";

type Props = {
  metric: MetricWithTrend;
  data: Array<{
    date: string;
    status: "up" | "down";
    latencyMs: number;
  }>;
};

export function UptimeWidget({ metric, data }: Props) {
  const isGood = metric.value >= 99.5;
  const days = data || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-foreground">Platform Reliability & System Health</h3>
          <p className="text-xs text-muted-foreground">Continuous monitoring & SLA uptime compliance</p>
        </div>
        <TrendBadge changePct={metric.changePct} direction={metric.direction} size="sm" />
      </div>

      <div className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-muted/30">
        {isGood ? (
          <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-500 shrink-0">
            <CheckCircle2 className="size-8" />
          </div>
        ) : (
          <div className="p-3 rounded-full bg-rose-500/10 text-rose-500 shrink-0">
            <AlertTriangle className="size-8" />
          </div>
        )}
        <div className="space-y-0.5">
          <div className="text-3xl font-extrabold font-heading tabular-nums text-foreground">
            {metric.formatted}
          </div>
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="size-3.5" />
            <span>Systems Operational — 99.94% Target Met</span>
          </div>
        </div>
      </div>

      {/* Latency & Compression Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg border border-border/40 bg-card/60 space-y-1">
          <div className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
            <Zap className="size-3 text-amber-500" />
            <span>Avg Response Latency</span>
          </div>
          <div className="text-lg font-bold tabular-nums text-foreground">142 ms</div>
        </div>
        <div className="p-3 rounded-lg border border-border/40 bg-card/60 space-y-1">
          <div className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
            <Server className="size-3 text-purple-500" />
            <span>Cache & Payload Efficiency</span>
          </div>
          <div className="text-lg font-bold tabular-nums text-foreground">99.9%</div>
        </div>
      </div>

      {/* Daily Monitoring Nodes */}
      {days.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Uptime History Bar</span>
            <span>Past 30 Check Nodes</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {days.slice(-30).map((day, i) => (
              <div
                key={i}
                className={`h-6 flex-1 min-w-[6px] rounded-xs transition-opacity hover:opacity-100 ${
                  day.status === "up" ? "bg-emerald-500/80 hover:bg-emerald-500" : "bg-rose-500 hover:bg-rose-600"
                }`}
                title={`${day.date}: ${day.status.toUpperCase()} (${day.latencyMs}ms)`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
