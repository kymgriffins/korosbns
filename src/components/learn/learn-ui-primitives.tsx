"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Loader2, RefreshCw, Search } from "lucide-react";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";

/** Consistent page body width for all learn child routes. */
export function LearnPageBody({
  children,
  className,
  narrow,
}: {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-1 pb-6 md:px-0",
        narrow ? "max-w-3xl" : "max-w-6xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Principle-aligned content section inside a child page. */
export function LearnSection({
  title,
  hint,
  children,
  className,
  action,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <section className={cn("space-y-3", className)}>
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
            {title}
          </h2>
          {hint ? (
            <p className="mt-0.5 text-xs text-muted-foreground/80">{hint}</p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/** Bordered panel — the default surface for learn content blocks. */
export function LearnPanel({
  children,
  className,
  padding = "default",
}: {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "default";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card shadow-xs ring-1 ring-border/30",
        padding === "none" && "p-0",
        padding === "sm" && "p-3",
        padding === "default" && "p-4 md:p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Horizontal pill filter tabs used across modules, documents, alerts. */
export function LearnFilterTabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: Array<{ key: T; label: string; count?: number }>;
  value: T;
  onChange: (key: T) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 overflow-x-auto rounded-xl bg-muted/40 p-1 scrollbar-hide",
        className,
      )}
      role="tablist"
    >
      {tabs.map((tab) => {
        const active = value === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.key)}
            className={cn(
              "shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "bg-card text-foreground shadow-xs ring-1 ring-border/40"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
            {tab.count != null && tab.count > 0 ? ` (${tab.count})` : ""}
          </button>
        );
      })}
    </div>
  );
}

/** Unified search field for learn child pages. */
export function LearnSearchField({
  value,
  onChange,
  placeholder = "Search…",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 rounded-xl border-border/60 bg-muted/20 pl-9 text-sm"
      />
    </div>
  );
}

/** Toolbar row: search + actions. */
export function LearnToolbar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Consistent empty state across all learn surfaces. */
export function LearnEmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/70 bg-muted/10 px-6 py-14 text-center",
        className,
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/15">
        <Icon className="size-6 text-primary/70" aria-hidden />
      </div>
      <div className="max-w-sm space-y-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {description ? (
          <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

/** Stat tile for overview dashboards. */
export function LearnStatTile({
  label,
  value,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "default" | "warm" | "success" | "accent";
}) {
  const tones = {
    default: "text-primary bg-primary/10",
    warm: "text-amber-600 bg-amber-500/10",
    success: "text-emerald-600 bg-emerald-500/10",
    accent: "text-blue-600 bg-blue-500/10",
  };

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3.5 ring-1 ring-border/30">
      <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", tones[tone])}>
        <Icon className="size-4" aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
        <p className="text-lg font-bold tabular-nums leading-tight">{value}</p>
      </div>
    </div>
  );
}

/** Refresh control used in shell action slots. */
export function LearnRefreshButton({
  onClick,
  refreshing,
  label = "Refresh",
}: {
  onClick: () => void | Promise<void>;
  refreshing?: boolean;
  label?: string;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="rounded-full"
      disabled={refreshing}
      onClick={() => void onClick()}
    >
      <RefreshCw className={cn("size-3.5", refreshing && "animate-spin")} />
      {label}
    </Button>
  );
}

/** Centered loading state. */
export function LearnLoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden />
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
    </div>
  );
}

/** Staggered grid wrapper for card lists. */
export function LearnCardGrid({
  children,
  columns = 3,
  className,
}: {
  children: ReactNode;
  columns?: 2 | 3;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "grid grid-cols-1 gap-3",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 xl:grid-cols-3",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

/** Two-column explore layout: main + sidebar rail. */
export function LearnExploreLayout({
  main,
  aside,
}: {
  main: ReactNode;
  aside: ReactNode;
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
      <div className="min-w-0">{main}</div>
      <aside className="space-y-4 lg:sticky lg:top-48 lg:self-start">{aside}</aside>
    </div>
  );
}
