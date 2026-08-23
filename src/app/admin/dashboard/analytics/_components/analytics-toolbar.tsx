"use client";

import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type AnalyticsPeriod = "today" | "7d" | "30d" | "90d" | "month" | "all";

export type MonthOption = {
  value: string;
  label: string;
  year?: number;
  month?: number;
};

const PRESET_PERIODS: { key: AnalyticsPeriod; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7 Days" },
  { key: "30d", label: "30 Days" },
  { key: "90d", label: "90 Days" },
  { key: "all", label: "All Time" },
];

export function AnalyticsToolbar({
  period,
  onPeriodChange,
  availableMonths = [],
  selectedMonth,
  onMonthChange,
  onRefresh,
  onExportCsv,
  onExportJson,
  loading,
}: {
  period: AnalyticsPeriod;
  onPeriodChange: (period: AnalyticsPeriod) => void;
  availableMonths?: MonthOption[];
  selectedMonth?: string;
  onMonthChange?: (month: string) => void;
  onRefresh: () => void;
  onExportCsv?: () => void;
  onExportJson?: () => void;
  loading?: boolean;
}) {
  // Find currently active month label
  const currentMonthObj =
    availableMonths.find((m) => m.value === selectedMonth) ||
    availableMonths[0] || {
      value: new Date().toISOString().slice(0, 7),
      label: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    };

  const currentMonthIndex = availableMonths.findIndex(
    (m) => m.value === (selectedMonth || currentMonthObj.value),
  );
  const hasPrevMonth =
    currentMonthIndex < availableMonths.length - 1 && currentMonthIndex !== -1;
  const hasNextMonth = currentMonthIndex > 0;

  const handlePrevMonth = () => {
    if (hasPrevMonth && onMonthChange) {
      const prev = availableMonths[currentMonthIndex + 1];
      if (prev) {
        onPeriodChange("month");
        onMonthChange(prev.value);
      }
    }
  };

  const handleNextMonth = () => {
    if (hasNextMonth && onMonthChange) {
      const next = availableMonths[currentMonthIndex - 1];
      if (next) {
        onPeriodChange("month");
        onMonthChange(next.value);
      }
    }
  };

  const handleSelectMonth = (monthValue: string) => {
    if (onMonthChange) {
      onMonthChange(monthValue);
    }
    onPeriodChange("month");
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* Preset Period Buttons */}
        <div className="flex rounded-lg border bg-muted/30 p-0.5 shadow-xs">
          {PRESET_PERIODS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => onPeriodChange(p.key)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                period === p.key
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Month Selector Dropdown & Stepper */}
        <div className="flex items-center rounded-lg border bg-muted/30 p-0.5 shadow-xs">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={handlePrevMonth}
            disabled={!hasPrevMonth || loading}
            title="Previous Month"
          >
            <ChevronLeft className="size-3.5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={period === "month" ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "h-7 px-2.5 text-xs font-medium gap-1.5",
                  period === "month"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Calendar className="size-3.5 text-primary" />
                <span>
                  {period === "month" ? currentMonthObj.label : "Pick Month"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="max-h-64 overflow-y-auto w-48">
              {availableMonths.map((m) => (
                <DropdownMenuItem
                  key={m.value}
                  onClick={() => handleSelectMonth(m.value)}
                  className={cn(
                    "cursor-pointer text-xs justify-between",
                    period === "month" &&
                      (selectedMonth === m.value ||
                        (!selectedMonth && m.value === currentMonthObj.value))
                      ? "font-bold text-primary bg-primary/10"
                      : "",
                  )}
                >
                  <span>{m.label}</span>
                  {period === "month" &&
                    (selectedMonth === m.value ||
                      (!selectedMonth && m.value === currentMonthObj.value)) && (
                      <span className="size-1.5 rounded-full bg-primary" />
                    )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={handleNextMonth}
            disabled={!hasNextMonth || loading}
            title="Next Month"
          >
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Action Controls: Refresh & Export */}
      <div className="flex items-center gap-2">
        {(onExportCsv || onExportJson) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs"
                disabled={loading}
              >
                <Download className="size-3.5" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onExportCsv && (
                <DropdownMenuItem onClick={onExportCsv} className="cursor-pointer text-xs">
                  Export as CSV (.csv)
                </DropdownMenuItem>
              )}
              {onExportJson && (
                <DropdownMenuItem onClick={onExportJson} className="cursor-pointer text-xs">
                  Export as JSON (.json)
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
          className="h-8 gap-1.5 text-xs"
        >
          {loading ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
          Refresh
        </Button>
      </div>
    </div>
  );
}
