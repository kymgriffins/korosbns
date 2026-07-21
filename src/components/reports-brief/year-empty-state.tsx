"use client";

import { ExternalLink, FileText, HelpCircle, Library } from "lucide-react";
import type { BudgetYearEntry } from "@/data/budget-years-catalogue";
import { verificationBadgeText } from "@/data/budget-years-catalogue";
import { Button } from "@/components/ui/button";
import { ChapterIntro } from "./brief-primitives";

export function YearEmptyState({ year }: { year: BudgetYearEntry }) {
  const isGap = year.status === "GAP";
  const badge = verificationBadgeText(year.status);

  return (
    <div className="space-y-5 py-2">
      <ChapterIntro
        eyebrow={`FY ${year.id}`}
        title={isGap ? "Not digitized yet" : "Sources listed — not in app"}
        description={
          isGap
            ? "This fiscal year is marked GAP in our year matrix. We do not invent expenditure, revenue, or deficit figures."
            : "Official Level-1 documents exist online, but we have not extracted critical metrics into the app yet. No numbers are shown until ingest lands."
        }
      />

      <div className="rounded-3xl border border-border/50 bg-muted/30 p-5 sm:p-6">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-background/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
          <HelpCircle className="size-3" aria-hidden />
          {badge}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Era: <span className="font-semibold text-foreground">{year.era}</span>
        </p>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <Library className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            {isGap
              ? "Help digitize Economic Surveys, CBK archives, or Treasury books for this FY."
              : "Next step: extract CBK GFS / Treasury Budget Books into the seed + runner path."}
          </li>
          <li className="flex gap-2">
            <FileText className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            Start from the official sources loop (Treasury, Parliament, CBK, KNBS, COB).
          </li>
        </ul>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <a
              href="https://www.treasury.go.ke/budget-books"
              target="_blank"
              rel="noopener noreferrer"
            >
              Treasury budget books
              <ExternalLink className="ml-1.5 size-3.5" aria-hidden />
            </a>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <a
              href="https://www.centralbank.go.ke/statistics/government-finance-statistics/"
              target="_blank"
              rel="noopener noreferrer"
            >
              CBK GFS
              <ExternalLink className="ml-1.5 size-3.5" aria-hidden />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
