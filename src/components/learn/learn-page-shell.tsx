"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/utils";
import {
  getLearnNavItem,
  type LearnShellNavItem,
} from "@/lib/learn-shell-nav";

type LearnPageShellProps = {
  navId?: string;
  meta?: Partial<Pick<LearnShellNavItem, "title" | "description" | "dataHint" | "principle">>;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
  contentClassName?: string;
  compact?: boolean;
};

export function LearnPageShell({
  navId,
  meta,
  children,
  actions,
  className,
  contentClassName,
  compact = false,
}: LearnPageShellProps) {
  const config = navId ? getLearnNavItem(navId) : undefined;
  const title = meta?.title ?? config?.title ?? "Learn hub";
  const description = meta?.description ?? config?.description ?? "";
  const dataHint = meta?.dataHint ?? config?.dataHint ?? "";
  const principle = meta?.principle ?? config?.principle ?? "";
  const Icon = config?.icon;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn("flex flex-col", className)}
    >
      <header
        className={cn(
          "border-b border-border/60 bg-gradient-to-b from-muted/30 to-transparent",
          compact ? "px-0 pb-4" : "mb-6 rounded-2xl border px-4 py-5 md:px-6 md:py-6",
        )}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {principle ? (
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                  {principle}
                </span>
              ) : null}
              {dataHint ? (
                <span className="text-[11px] font-medium text-muted-foreground">
                  {dataHint}
                </span>
              ) : null}
            </div>
            <div className="flex items-start gap-3">
              {Icon ? (
                <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                  <Icon className="size-5" aria-hidden />
                </div>
              ) : null}
              <div className="min-w-0 space-y-1">
                <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                  {title}
                </h1>
                {description ? (
                  <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
          {actions ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
          ) : null}
        </div>
      </header>
      <div className={cn("min-w-0", contentClassName)}>{children}</div>
    </motion.section>
  );
}
