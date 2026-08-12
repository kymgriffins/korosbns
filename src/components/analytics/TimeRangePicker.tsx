"use client";

import React from "react";
import { type TimeRangePeriod } from "./analytics-data";
import { Calendar, Clock, Globe } from "lucide-react";

type Props = {
  selected: TimeRangePeriod;
  onChange: (period: TimeRangePeriod) => void;
};

const OPTIONS: { id: TimeRangePeriod; label: string; icon?: React.ReactNode }[] = [
  { id: "7d", label: "7 Days" },
  { id: "30d", label: "30 Days" },
  { id: "90d", label: "90 Days" },
  { id: "all_time", label: "All Time Data", icon: <Globe className="size-3.5 text-emerald-500" /> },
];

export function TimeRangePicker({ selected, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 rounded-2xl border border-border/60 bg-card/80 backdrop-blur shadow-sm">
      <div className="flex items-center gap-2 px-3 py-1 text-xs text-muted-foreground font-medium">
        <Clock className="size-3.5 text-primary shrink-0" />
        <span>Time Period:</span>
      </div>
      <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl">
        {OPTIONS.map((opt) => {
          const active = selected === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                active
                  ? "bg-background text-foreground shadow-xs border border-border/80"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
