"use client";

import { Progress } from "@/ui/progress";
import { cn } from "@/utils";

interface LearnProgressBarProps {
  value: number;
  max?: number;
  label: string;
  /** Show percentage text above the bar */
  showLabel?: boolean;
  className?: string;
}

/**
 * Accessible progress bar — wraps shadcn <Progress> with correct ARIA attributes.
 * Never uses inline styles.
 */
export function LearnProgressBar({
  value,
  max = 100,
  label,
  showLabel = false,
  className,
}: LearnProgressBarProps) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div className={cn("space-y-1", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs font-semibold text-muted-foreground">
          <span>{label}</span>
          <span>{pct}%</span>
        </div>
      )}
      <Progress
        value={pct}
        className="h-1.5"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      />
    </div>
  );
}
