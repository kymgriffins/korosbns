"use client";

import { FileText, Building2, Calendar } from "lucide-react";

type DocumentStatsBarProps = {
  totalFiles: number;
  countyCount: number;
  yearCount: number;
};

export function DocumentStatsBar({
  totalFiles,
  countyCount,
  yearCount,
}: DocumentStatsBarProps) {
  if (totalFiles === 0) return null;

  const stats = [
    {
      icon: <FileText className="size-3.5 text-primary" />,
      label: `${totalFiles} file${totalFiles !== 1 ? "s" : ""}`,
    },
    {
      icon: <Building2 className="size-3.5 text-blue-500" />,
      label: `${countyCount} count${countyCount !== 1 ? "ies" : "y"}`,
    },
    {
      icon: <Calendar className="size-3.5 text-muted-foreground" />,
      label: `${yearCount} fiscal year${yearCount !== 1 ? "s" : ""}`,
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 ring-1 ring-border/30"
        >
          {stat.icon}
          <span className="text-xs font-semibold">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
