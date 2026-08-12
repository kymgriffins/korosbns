"use client";

import React from "react";
import { Share2, Compass, Search, Landmark } from "lucide-react";
import { TrendBadge } from "./TrendBadge";
import { type TrendDirection } from "./analytics-data";

const SOURCE_ICONS: Record<string, React.ReactNode> = {
  "Direct Traffic": <Compass className="size-4 text-emerald-500" />,
  "Social Media (TikTok/X)": <Share2 className="size-4 text-blue-500" />,
  "Organic Search": <Search className="size-4 text-amber-500" />,
  "Partner & Gov Portals": <Landmark className="size-4 text-purple-500" />,
};

type TrafficSourceItem = {
  source: string;
  count: number;
  percentage: number;
  changePct: number;
  direction: TrendDirection;
};

type Props = {
  data: TrafficSourceItem[];
};

export function TrafficSourcesWidget({ data }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-foreground">Traffic Channels & Acquisition</h3>
          <p className="text-xs text-muted-foreground">Origins of citizen visits & growth trends</p>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">
          Viral Social Acquisition
        </span>
      </div>

      <div className="space-y-2.5">
        {data.map((item) => {
          const icon = SOURCE_ICONS[item.source] || <Compass className="size-4 text-primary" />;
          return (
            <div
              key={item.source}
              className="p-3 rounded-xl border border-border/50 bg-card/60 hover:bg-card transition-colors space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-lg bg-muted shrink-0">{icon}</div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate text-foreground">{item.source}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.count.toLocaleString()} sessions
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-extrabold tabular-nums text-foreground">
                    {item.percentage.toFixed(1)}%
                  </span>
                  <TrendBadge changePct={item.changePct} direction={item.direction} size="sm" />
                </div>
              </div>

              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  style={{ width: `${item.percentage}%` }}
                  className="h-full rounded-full bg-primary transition-all duration-500"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
