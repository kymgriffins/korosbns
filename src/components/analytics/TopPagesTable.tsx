"use client";

import React from "react";
import { Globe, FileText } from "lucide-react";
import { TrendBadge } from "./TrendBadge";
import { type TrendDirection } from "./analytics-data";

type TopPageItem = {
  path: string;
  title: string;
  views: number;
  percentage: number;
  changePct: number;
  direction: TrendDirection;
};

type Props = {
  data: TopPageItem[];
};

export function TopPagesTable({ data }: Props) {
  if (!data || !data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        <div className="text-center">
          <Globe className="size-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No page traffic data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-foreground">Top Visited Pages</h3>
          <p className="text-xs text-muted-foreground">Most popular civic routes & engagement share</p>
        </div>
        <span className="text-xs text-muted-foreground font-medium">Ranked by pageviews</span>
      </div>

      <div className="space-y-2">
        {data.map((page, index) => (
          <div
            key={page.path}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border border-border/50 bg-card/60 hover:bg-card transition-all gap-2"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex items-center justify-center size-6 rounded-md bg-muted text-xs font-extrabold text-muted-foreground shrink-0">
                #{index + 1}
              </span>
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate text-foreground flex items-center gap-1.5">
                  <FileText className="size-3.5 text-primary shrink-0" />
                  <span className="truncate">{page.title}</span>
                </div>
                <div className="text-xs text-muted-foreground font-mono truncate">{page.path}</div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-border/40">
              <div className="text-right">
                <div className="text-sm font-bold tabular-nums text-foreground">
                  {page.views.toLocaleString()} views
                </div>
                <div className="text-[11px] text-muted-foreground">{page.percentage.toFixed(1)}% of traffic</div>
              </div>
              <TrendBadge changePct={page.changePct} direction={page.direction} size="sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
