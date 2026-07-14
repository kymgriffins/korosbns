"use client";

import { Loader2, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AnalyticsPeriod = "today" | "7d" | "30d" | "all";

const PERIODS: { key: AnalyticsPeriod; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7 Days" },
  { key: "30d", label: "30 Days" },
  { key: "all", label: "All Time" },
];

export function AnalyticsToolbar({
  period,
  onPeriodChange,
  onRefresh,
  loading,
}: {
  period: AnalyticsPeriod;
  onPeriodChange: (period: AnalyticsPeriod) => void;
  onRefresh: () => void;
  loading?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex rounded-lg border bg-muted/30 p-0.5">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => onPeriodChange(p.key)}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium transition-all",
              period === p.key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
      <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
        {loading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
        Refresh
      </Button>
    </div>
  );
}
