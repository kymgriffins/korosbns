"use client";

import { BudgetHubTopNav } from "@/components/budget-hub/navigation/budget-hub-top-nav";

export function BudgetHubShell({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="budget-hub flex min-h-0 flex-1 flex-col bg-[var(--bh-canvas)]">
      <BudgetHubTopNav />
      <div className="flex-1 overflow-y-auto pb-[--mobile-nav-height] lg:pb-0">
        {children}
      </div>
      {footer}
    </div>
  );
}
