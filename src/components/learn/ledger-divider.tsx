import { cn } from "@/utils";

type LedgerDividerProps = {
  /** Optional inline label rendered on the rule, e.g. a section name. */
  label?: string;
  className?: string;
};

/**
 * Brand signature — a thin ledger rule with tick marks, used between major
 * Learn sections instead of a plain <hr>. Cheap (CSS background), reinforces
 * "this is an accounting/audit product" without competing with real data.
 */
export function LedgerDivider({ label, className }: LedgerDividerProps) {
  if (!label) {
    return <div role="separator" aria-hidden className={cn("ledger-tick-rule", className)} />;
  }

  return (
    <div
      role="separator"
      className={cn("flex items-center gap-3", className)}
      aria-label={label}
    >
      <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      <div className="ledger-tick-rule flex-1" aria-hidden />
    </div>
  );
}
