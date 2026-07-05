"use client";

import { cn } from "@/lib/utils";

export function StudioPageHeader({
  eyebrow,
  title,
  description,
  illustration,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  illustration?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-8 md:mb-10", className)}>
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          {eyebrow ? (
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {description}
            </p>
          ) : null}
          {actions ? <div className="mt-4 flex flex-wrap items-center gap-2">{actions}</div> : null}
        </div>
        {illustration ? (
          <div className="mx-auto shrink-0 md:mx-0" aria-hidden>
            {illustration}
          </div>
        ) : null}
      </div>
    </header>
  );
}
