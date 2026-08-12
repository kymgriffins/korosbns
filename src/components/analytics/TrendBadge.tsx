"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { type TrendDirection } from "./analytics-data";

type Props = {
  changePct: number;
  direction?: TrendDirection;
  periodLabel?: string;
  size?: "sm" | "md" | "lg";
};

export function TrendBadge({ changePct, direction, periodLabel, size = "md" }: Props) {
  const dir = direction || (changePct > 0 ? "up" : changePct < 0 ? "down" : "neutral");
  const isUp = dir === "up";
  const isDown = dir === "down";

  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-xs gap-0.5",
    md: "px-2 py-1 text-xs gap-1",
    lg: "px-2.5 py-1 text-sm gap-1",
  }[size];

  const iconSize = size === "sm" ? "size-3" : size === "md" ? "size-3.5" : "size-4";

  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`inline-flex items-center font-medium rounded-full border transition-colors ${sizeClasses} ${
          isUp
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
            : isDown
            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
            : "bg-muted text-muted-foreground border-border/50"
        }`}
      >
        {isUp ? (
          <ArrowUpRight className={`${iconSize} shrink-0`} />
        ) : isDown ? (
          <ArrowDownRight className={`${iconSize} shrink-0`} />
        ) : (
          <Minus className={`${iconSize} shrink-0`} />
        )}
        <span>
          {isUp ? "+" : ""}
          {Math.abs(changePct).toFixed(1)}%
        </span>
      </span>
      {periodLabel && (
        <span className="text-[11px] text-muted-foreground font-normal">
          {periodLabel}
        </span>
      )}
    </div>
  );
}
