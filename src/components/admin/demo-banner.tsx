"use client";

import { AlertTriangle } from "lucide-react";

export function DemoBanner() {
  return (
    <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800/40 dark:bg-amber-950/30 dark:text-amber-300">
      <AlertTriangle className="mt-0.5 size-4 shrink-0" />
      <span>
        <strong>Demo template page.</strong> No real data is displayed. Remove or replace with real API integration.
      </span>
    </div>
  );
}
