"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Eye, Users, HardDrive } from "lucide-react";

type Props = {
  data: Array<{
    date: string;
    visitors: number;
    pageviews: number;
    bandwidthGb: number;
  }>;
};

export function TrafficChart({ data }: Props) {
  const [metricKey, setMetricKey] = useState<"visitors" | "pageviews" | "bandwidthGb">("pageviews");

  const metricMeta = {
    visitors: {
      label: "Visitors",
      color: "hsl(var(--primary))",
      icon: Users,
      unit: "",
    },
    pageviews: {
      label: "Pageviews",
      color: "#3b82f6",
      icon: Eye,
      unit: "",
    },
    bandwidthGb: {
      label: "Bandwidth (GB)",
      color: "#10b981",
      icon: HardDrive,
      unit: " GB",
    },
  }[metricKey];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-base text-foreground">Traffic & Data Volume Over Time</h3>
          <p className="text-xs text-muted-foreground">Historical trend analysis by selected time window</p>
        </div>

        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl">
          <button
            onClick={() => setMetricKey("pageviews")}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
              metricKey === "pageviews"
                ? "bg-background text-foreground shadow-xs border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="size-3.5 text-blue-500" />
            <span>Pageviews</span>
          </button>
          <button
            onClick={() => setMetricKey("visitors")}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
              metricKey === "visitors"
                ? "bg-background text-foreground shadow-xs border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="size-3.5 text-primary" />
            <span>Visitors</span>
          </button>
          <button
            onClick={() => setMetricKey("bandwidthGb")}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
              metricKey === "bandwidthGb"
                ? "bg-background text-foreground shadow-xs border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <HardDrive className="size-3.5 text-emerald-500" />
            <span>Bandwidth</span>
          </button>
        </div>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={metricMeta.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={metricMeta.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              className="text-muted-foreground"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              className="text-muted-foreground"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                fontSize: "13px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(val: any) => [`${Number(val || 0).toLocaleString()}${metricMeta.unit}`, metricMeta.label]}
            />
            <Area
              type="monotone"
              dataKey={metricKey}
              stroke={metricMeta.color}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorMetric)"
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
