import Link from "next/link";
import { ChevronRight, FolderOpen } from "lucide-react";
import { Routes } from "@/constants/routes";
import type { LearningUnitSummary } from "@/lib/learning-units";

export function UnitFolderGrid({ units }: { units: LearningUnitSummary[] }) {
  if (units.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-muted/20 py-12 text-center text-sm text-muted-foreground">
        No learning units published yet. Seed content on the API (e.g. BPS 2026).
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {units.map((unit) => {
        const editionCount = unit.editions.length;
        const latest = unit.editions[0];
        const href = latest
          ? Routes.LearnUnitEdition(unit.slug, latest.fiscal_year ?? latest.slug)
          : Routes.LearnUnits;

        return (
          <Link
            key={unit.slug}
            href={href}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-xs ring-1 ring-border/40 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="flex items-start justify-between gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 transition-colors group-hover:bg-primary/15">
                <FolderOpen className="size-5 text-primary" />
              </div>
              {editionCount > 0 ? (
                <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                  {editionCount} edition{editionCount === 1 ? "" : "s"}
                </span>
              ) : (
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-300">
                  Coming soon
                </span>
              )}
            </div>

            <p className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {unit.jurisdiction ?? "national"}
              {unit.abbreviation ? ` · ${unit.abbreviation}` : ""}
            </p>
            <h2 className="mt-1 text-lg font-bold uppercase tracking-tight text-foreground transition-colors group-hover:text-primary">
              {unit.title}
            </h2>
            {unit.description ? (
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{unit.description}</p>
            ) : null}

            <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-xs font-semibold text-primary">
              <span>Open module</span>
              <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
