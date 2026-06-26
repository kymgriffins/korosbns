"use client";

import { ArrowDownRight, ArrowUpRight, Minus, TrendingDown, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function TrendIndicator({ value }: { value: number }) {
  if (value > 0)
    return (
      <span className="flex items-center gap-0.5 text-emerald-600 text-xs">
        <ArrowUpRight className="size-3" />
        {value.toFixed(1)}%
      </span>
    );
  if (value < 0)
    return (
      <span className="flex items-center gap-0.5 text-red-600 text-xs">
        <ArrowDownRight className="size-3" />
        {Math.abs(value).toFixed(1)}%
      </span>
    );
  return (
    <span className="flex items-center gap-0.5 text-muted-foreground text-xs">
      <Minus className="size-3" />
      0%
    </span>
  );
}

export function KpiCard({
  label,
  value,
  trend,
  subtitle,
}: {
  label: string;
  value: string;
  trend?: number;
  subtitle?: string;
}) {
  const isUp = trend && trend > 0;
  const isDown = trend && trend < 0;
  const TrendIcon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;
  const barPct = trend ? Math.min(Math.abs(trend) * 4, 100) : 0;

  return (
    <Card className="border-border/60 hover:border-primary/20 transition-all duration-300">
      <CardHeader className="pb-2 px-4 pt-4">
        <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-2.5">
        <p className="text-xl sm:text-2xl font-bold tabular-nums tracking-tight">{value}</p>
        <div className="h-1.5 w-full bg-muted-foreground/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${Math.max(barPct, 8)}%`,
              backgroundColor: isUp ? "hsl(142 76% 36%)" : isDown ? "hsl(24 95% 53%)" : "hsl(221 83% 53%)",
            }}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {trend !== undefined && (
            <span className="inline-flex items-center gap-1 bg-muted/60 rounded-md px-1.5 py-0.5">
              <TrendIcon className={cn("size-3.5", isUp && "text-emerald-600", isDown && "text-amber-600")} />
              <span className={cn("font-semibold", isUp && "text-emerald-600", isDown && "text-amber-600")}>
                {trend > 0 ? "+" : ""}
                {trend.toFixed(1)}%
              </span>
            </span>
          )}
        </div>
        {subtitle && <p className="text-[10px] text-muted-foreground">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}

export function BarChartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}

export const SECTOR_COLORS = [
  "hsl(221 83% 53%)",
  "hsl(142 76% 36%)",
  "hsl(24 95% 53%)",
  "hsl(173 80% 40%)",
  "hsl(346 77% 50%)",
  "hsl(47 95% 48%)",
  "hsl(12 76% 61%)",
  "hsl(160 84% 39%)",
  "hsl(31 95% 50%)",
  "hsl(340 82% 52%)",
  "hsl(200 90% 50%)",
  "hsl(0 0% 40%)",
];
