"use client";

import { ArrowDownRight, ArrowUpRight, Building2, ChevronDown, FileText, Landmark, Minus, Shield, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function formatValue(value: number): string {
  if (value >= 1000) return `KES ${(value / 1000).toFixed(2)}T`;
  return `KES ${value.toFixed(1)}B`;
}

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

export interface SectionDef {
  id: string;
  label: string;
  icon: React.ElementType;
}

export function TocNav({ sections, activeSection, onNavigate }: { sections: SectionDef[]; activeSection: string; onNavigate: (id: string) => void }) {
  return (
    <nav className="space-y-0.5 sticky top-24">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 px-3">Contents</p>
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => onNavigate(s.id)}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all text-left",
            activeSection === s.id
              ? "bg-primary/10 text-primary shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <s.icon className="size-3.5 shrink-0" />
          {s.label}
        </button>
      ))}
    </nav>
  );
}

export function MobileToc({ sections, activeSection, onNavigate }: { sections: SectionDef[]; activeSection: string; onNavigate: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const active = sections.find((s) => s.id === activeSection);
  return (
    <div className="relative lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm font-medium shadow-xs"
      >
        <ListTree className="size-4 text-muted-foreground" />
        <span className="flex-1 text-left">{active?.label ?? "Table of Contents"}</span>
        <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border bg-card p-1 shadow-lg">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => { onNavigate(s.id); setOpen(false); }}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors",
                activeSection === s.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
              )}
            >
              <s.icon className="size-3.5" />
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ListTree({ className }: { className?: string }) {
  return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h13"/><path d="M8 12h10"/><path d="M8 18h7"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/></svg>;
}

export function ReportHeader({ title, description, icon: Icon, selectedYearLabel }: { title: string; description: string; icon: React.ElementType; selectedYearLabel: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
        <Icon className="size-5 text-primary" />
        {title}
      </h2>
      <p className="text-sm text-muted-foreground mt-1">
        {description} — {selectedYearLabel}
      </p>
    </div>
  );
}
