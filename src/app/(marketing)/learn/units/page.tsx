import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { Routes } from "@/constants/routes";
import { fetchLearningUnitsServer } from "@/lib/learning-units";

export const metadata: Metadata = {
  title: "Budget Documents Explained | Budget Ndio Story",
  description:
    "Explore Kenya's statutory budget documents by unit and fiscal year — BPS, CFSP, county estimates, and more.",
};

export default async function LearnUnitsPage() {
  let units: Awaited<ReturnType<typeof fetchLearningUnitsServer>> = [];
  let error: string | null = null;
  try {
    units = await fetchLearningUnitsServer();
  } catch (e) {
    error = e instanceof Error ? e.message : "Could not load units.";
  }

  return (
    <section className="relative min-h-screen w-full overflow-x-hidden bg-background pt-16 sm:pt-20 pb-16">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 -top-20 size-72 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -bottom-20 -right-20 size-72 rounded-full bg-orange-500/15 blur-[120px]" />
      </div>
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Link
          href={Routes.Learn}
          className="mb-6 inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-primary"
        >
          ← Back to Learn
        </Link>

        <div className="mb-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            <BookOpen className="size-3.5" />
            Budget literacy
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Budget documents explained</h1>
          <p className="mt-3 max-w-2xl text-sm text-foreground/70 sm:text-base">
            Each unit is a permanent document family (e.g. Budget Policy Statement). Pick a fiscal year
            edition to read chapters, watch media, and take the learning challenge.
          </p>
        </div>

        {error && (
          <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-4">
          {units.map((unit) => (
            <article
              key={unit.slug}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-foreground/50">
                    {unit.jurisdiction ?? "national"}
                    {unit.abbreviation ? ` · ${unit.abbreviation}` : ""}
                  </p>
                  <h2 className="mt-1 text-xl font-bold">{unit.title}</h2>
                  {unit.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-foreground/65">{unit.description}</p>
                  )}
                </div>
                {unit.external_source_url && (
                  <a
                    href={unit.external_source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    Official source
                  </a>
                )}
              </div>

              <ul className="mt-4 space-y-2">
                {unit.editions.length === 0 ? (
                  <li className="text-sm text-foreground/50">No published editions yet.</li>
                ) : (
                  unit.editions.map((edition) => (
                    <li key={edition.slug}>
                      <Link
                        href={Routes.LearnUnitEdition(
                          unit.slug,
                          edition.fiscal_year ?? edition.slug
                        )}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
                      >
                        <span>
                          <span className="font-semibold">
                            FY {edition.fiscal_year ?? "—"} — {edition.title}
                          </span>
                          {edition.module_code && (
                            <span className="ml-2 text-foreground/50">{edition.module_code}</span>
                          )}
                        </span>
                        <ChevronRight className="size-4 shrink-0 text-foreground/40" />
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </article>
          ))}

          {!error && units.length === 0 && (
            <p className="text-center text-sm text-foreground/50 py-12">
              No learning units published yet. Run the BPS seed on the API.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
