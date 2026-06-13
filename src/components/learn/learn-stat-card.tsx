"use client";

import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/ui/card";
import { cn } from "@/utils";
import { cva, type VariantProps } from "class-variance-authority";

const iconContainerVariants = cva(
  "flex items-center justify-center rounded-md shrink-0 ring-1 ring-black/[0.02]",
  {
    variants: {
      size: {
        sm: "size-6",
        md: "size-7",
      },
      accent: {
        blue:    "bg-blue-500/10    [&>svg]:text-blue-600",
        emerald: "bg-emerald-500/10 [&>svg]:text-emerald-600",
        amber:   "bg-amber-500/10   [&>svg]:text-amber-600",
        orange:  "bg-orange-500/10  [&>svg]:text-orange-600",
        purple:  "bg-purple-500/10  [&>svg]:text-purple-600",
        rose:    "bg-rose-500/10    [&>svg]:text-rose-600",
        sky:     "bg-sky-500/10     [&>svg]:text-sky-600",
        primary: "bg-primary/10     [&>svg]:text-primary",
      },
    },
    defaultVariants: { size: "md", accent: "primary" },
  },
);

const iconVariants = cva("shrink-0", {
  variants: {
    size: {
      sm: "size-3",
      md: "size-3.5",
    },
  },
  defaultVariants: { size: "md" },
});

export interface LearnStatCardProps extends VariantProps<typeof iconContainerVariants> {
  label: string;
  value: string | number;
  icon: LucideIcon;
  className?: string;
}

export function LearnStatCard({ label, value, icon: Icon, accent, size, className }: LearnStatCardProps) {
  return (
    <Card className={cn("shadow-xs", className)}>
      <CardContent className="flex items-center gap-2 p-2.5">
        <div className={iconContainerVariants({ size, accent })}>
          <Icon className={iconVariants({ size })} aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-muted-foreground leading-tight">{label}</p>
          <p className="text-sm font-black tabular-nums leading-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
