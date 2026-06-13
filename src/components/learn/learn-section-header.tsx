"use client";

import { type LucideIcon } from "lucide-react";
import { cn } from "@/utils";

interface LearnSectionHeaderProps {
  label: string;
  icon?: LucideIcon;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function LearnSectionHeader({ label, icon: Icon, action, className }: LearnSectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
        {Icon && <Icon className="size-3 text-primary" aria-hidden />}
        {label}
      </h2>
      {action && (
        <button
          onClick={action.onClick}
          className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors focus-visible:ring-2 focus-visible:ring-ring rounded uppercase tracking-wide"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
