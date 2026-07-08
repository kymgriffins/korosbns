"use client";

import { cn } from "@/utils";
import type { BudgetHubCategoryId } from "@/constants/budget-hub-tokens";

export function CategoryPills({
  items,
  value,
  onChange,
  className,
}: {
  items: readonly { id: BudgetHubCategoryId | string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
      role="tablist"
      aria-label="Categories"
    >
      {items.map((item) => {
        const active = value === item.id;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-200",
              active
                ? "bg-foreground text-background"
                : "bg-[var(--bh-surface)] text-muted-foreground ring-1 ring-[var(--bh-border)] hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
