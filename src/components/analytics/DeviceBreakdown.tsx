"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Smartphone, Monitor, Tablet } from "lucide-react";
import { TrendBadge } from "./TrendBadge";
import { type TrendDirection } from "./analytics-data";

const DEVICE_ICONS: Record<string, React.ReactNode> = {
  Mobile: <Smartphone className="size-4 text-emerald-500" />,
  Desktop: <Monitor className="size-4 text-blue-500" />,
  Tablet: <Tablet className="size-4 text-amber-500" />,
};

const COLORS = [
  "#10b981", // Emerald for mobile
  "#3b82f6", // Blue for desktop
  "#f59e0b", // Amber for tablet
];

type DeviceItem = {
  device_type: string;
  percentage: number;
  changePct: number;
  direction: TrendDirection;
  count: number;
};

type Props = {
  data: DeviceItem[];
};

export function DeviceBreakdown({ data }: Props) {
  if (!data || !data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        No device data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-foreground">Device Breakdown</h3>
          <p className="text-xs text-muted-foreground">Citizen device distribution & trends</p>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
          78.4% Mobile Majority
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Donut Chart */}
        <div className="h-52 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="percentage"
                nameKey="device_type"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "10px",
                  fontSize: "12px",
                }}
                formatter={(value) => [`${Number(value).toFixed(1)}%`, "Traffic Share"]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-muted-foreground font-medium uppercase">Primary</span>
            <span className="text-lg font-extrabold text-foreground">Mobile</span>
          </div>
        </div>

        {/* Device List with Percentage + Arrows */}
        <div className="space-y-3">
          {data.map((item, idx) => (
            <div
              key={item.device_type}
              className="p-3 rounded-xl border border-border/50 bg-card/60 hover:bg-card transition-colors space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-muted">
                    {DEVICE_ICONS[item.device_type] || DEVICE_ICONS.Mobile}
                  </div>
                  <span className="text-sm font-semibold">{item.device_type}</span>
                </div>
                <TrendBadge changePct={item.changePct} direction={item.direction} size="sm" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{item.count.toLocaleString()} sessions</span>
                  <span className="font-bold text-foreground tabular-nums">{item.percentage.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    style={{ width: `${item.percentage}%`, backgroundColor: COLORS[idx % COLORS.length] }}
                    className="h-full rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
