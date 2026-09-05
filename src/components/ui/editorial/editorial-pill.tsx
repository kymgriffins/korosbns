import React from "react";
import { cn } from "@/utils";

export type EditorialPillVariant =
  | "default"
  | "muted"
  | "invert"
  | "primary"
  | "outline"
  | "success";

export type EditorialPillSize = "default" | "sm" | "xs";

export type EditorialPillProps = {
  children: React.ReactNode;
  className?: string;
  variant?: EditorialPillVariant;
  size?: EditorialPillSize;
  dot?: boolean;
  pulse?: boolean;
  dotColor?: string;
  icon?: React.ReactNode;
};

export function EditorialPill({
  children,
  className,
  variant = "default",
  size = "default",
  dot = false,
  pulse = false,
  dotColor,
  icon,
}: EditorialPillProps) {
  const dotColorClass =
    dotColor ??
    (variant === "primary"
      ? "bg-primary"
      : variant === "success"
        ? "bg-emerald-500"
        : variant === "invert"
          ? "bg-white"
          : "bg-primary");

  return (
    <span
      className={cn(
        "inline-flex items-center w-fit self-start shrink-0 rounded-full font-semibold transition-colors duration-150",
        // Sizes
        size === "xs" && "gap-1.5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        size === "sm" && "gap-1.5 px-3 py-0.5 text-xs",
        size === "default" && "gap-2 px-3.5 py-1 text-xs",
        // Variants
        variant === "default" && "bg-muted text-foreground/80 border border-border/40",
        variant === "muted" &&
          "bg-muted/60 text-muted-foreground uppercase tracking-wider border border-border/30",
        variant === "primary" &&
          "bg-primary/10 text-primary border border-primary/25",
        variant === "outline" &&
          "border border-border/80 bg-background/80 text-foreground",
        variant === "invert" &&
          "border border-white/20 bg-white/10 text-white backdrop-blur-md",
        variant === "success" &&
          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25",
        className,
      )}
    >
      {dot ? (
        <span
          className={cn(
            "size-1.5 shrink-0 rounded-full",
            dotColorClass,
            pulse && "animate-pulse",
          )}
          aria-hidden
        />
      ) : null}
      {icon ? <span className="shrink-0" aria-hidden>{icon}</span> : null}
      <span>{children}</span>
    </span>
  );
}
