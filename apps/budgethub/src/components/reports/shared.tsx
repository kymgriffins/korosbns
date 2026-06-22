"use client";

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TrendIndicator({ value }: { value: number }) {
  if (value > 0) return <span className="flex items-center gap-0.5 text-emerald-600 text-xs"><ArrowUpRight className="size-3" />{value.toFixed(1)}%</span>;
  if (value < 0) return <span className="flex items-center gap-0.5 text-red-600 text-xs"><ArrowDownRight className="size-3" />{Math.abs(value).toFixed(1)}%</span>;
  return <span className="flex items-center gap-0.5 text-muted-foreground text-xs"><Minus className="size-3" />0%</span>;
}

export function KpiCard({ label, value, trend, subtitle }: { label: string; value: string; trend?: number; subtitle?: string }) {
  return (
    <Card className="border-border/60 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
      <CardHeader className="pb-2 px-4 pt-4">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-1.5">
        <p className="text-2xl font-bold tabular-nums tracking-tight">{value}</p>
        {trend !== undefined && <TrendIndicator value={trend} />}
        {subtitle && <p className="text-[10px] text-muted-foreground">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}

export function BarChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>
    </svg>
  );
}

export const SECTOR_COLORS = [
  "hsl(221 83% 53%)", "hsl(262 83% 58%)", "hsl(199 89% 48%)",
  "hsl(142 76% 36%)", "hsl(24 95% 53%)", "hsl(346 77% 50%)",
  "hsl(47 95% 48%)", "hsl(173 80% 40%)", "hsl(271 81% 56%)",
  "hsl(12 76% 61%)", "hsl(160 84% 39%)", "hsl(31 95% 50%)",
];
