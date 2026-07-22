"use client";

import { cn } from "@/utils";

type LearnPageFrameProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Page padding only — width comes from LearnAppShell so every tab
 * fills the same centered column.
 */
export function LearnPageFrame({ children, className }: LearnPageFrameProps) {
  return (
    <div className={cn("w-full py-10 sm:py-14", className)}>
      {children}
    </div>
  );
}

type LearnPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
};

export function LearnPageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: LearnPageHeaderProps) {
  return (
    <header className={cn("space-y-4", className)}>
      {eyebrow ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}
      <div className="space-y-3">
        <h1 className="font-heading text-[2rem] font-bold leading-[1.15] tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2.5 pt-1">{actions}</div> : null}
    </header>
  );
}

type LearnSectionProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
};

export function LearnSection({ title, children, className, action }: LearnSectionProps) {
  return (
    <section className={cn("space-y-4", className)} aria-label={title}>
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-[15px] font-semibold tracking-tight text-foreground">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
