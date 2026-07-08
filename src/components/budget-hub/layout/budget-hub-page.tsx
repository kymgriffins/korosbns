"use client";

import { cn } from "@/utils";

export function BudgetHubPage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "budget-hub mx-auto w-full max-w-[var(--bh-content-max)] px-4 sm:px-6 lg:px-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
