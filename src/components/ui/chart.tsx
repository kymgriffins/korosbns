import React from "react";

export interface ChartConfig {
  [key: string]: { label: string; color?: string };
}

export function ChartContainer({ config, children, className }: any) {
  return <div className={className} data-chart-container="">{children}</div>;
}

export function ChartTooltip({ content, cursor, ...props }: any) {
  return null;
}

export function ChartTooltipContent({ className, hideLabel, indicator, labelFormatter, ...props }: any) {
  return null;
}
