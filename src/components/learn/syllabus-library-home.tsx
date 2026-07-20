"use client";

import Link from "next/link";
import { ArrowRight, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Routes } from "@/constants/routes";
import { learnTabToHref } from "@/lib/learn-nav";
import type { CivicModule } from "@/types/learn";
import { SignUpCta } from "@/components/ui/sign-up-cta";
import { readProgress } from "@/lib/module-progress";
import {
  LearnPageFrame,
  LearnPageHeader,
  LearnSection,
} from "@/components/learn/learn-page-frame";
import { cn } from "@/utils";

type Props = {
  stages: CivicModule[];
  onSelectStage: (stage: CivicModule) => void;
  recommended?: CivicModule[];
  greeting?: string;
};

function moduleProgressPct(mod: CivicModule): number {
  const total = mod.steps?.length ?? 0;
  if (!total) return 0;
  const p = readProgress(mod.slug, mod.order);
  if (p.masteryAwarded) return 100;
  const done = Object.keys(p.stepsCompleted).length;
  return Math.round((done / total) * 100);
}

/**
 * Prefer Budget Policy Statement first — it is the flagship civic module.
 * Remaining modules keep their natural order.
 */
function orderForSyllabus(stages: CivicModule[]): CivicModule[] {
  const bps = stages.find((s) => s.slug === "budget-policy-statement");
  if (!bps) return stages;
  return [bps, ...stages.filter((s) => s.slug !== bps.slug)];
}

/**
 * Civic syllabus home — brand, one CTA group, calm numbered list.
 * Matches the accepted /learn composition.
 */
export function SyllabusLibraryHome({
  stages,
  onSelectStage,
  recommended = [],
  greeting,
}: Props) {
  const ordered = orderForSyllabus(stages);
  const featured = ordered.slice(0, 8);
  const picks = recommended.length > 0 ? recommended.slice(0, 3) : [];

  return (
    <LearnPageFrame>
      <div data-testid="syllabus-library-home">
        <LearnPageHeader
          eyebrow="Budget Ndio Story"
          title="Learn Kenya's budget"
          description={
            greeting ||
            "A free civic syllabus for the national and county budget cycle — read everything without an account."
          }
          actions={
            <>
              <Button asChild size="sm" className="h-9 rounded-full px-4 text-xs font-semibold">
                <Link href={learnTabToHref("learn")}>
                  Browse modules
                  <ArrowRight className="ml-1.5 size-3.5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-9 rounded-full px-4 text-xs font-semibold"
              >
                <Link href={Routes.Reports}>
                  <Landmark className="mr-1.5 size-3.5" />
                  Open reports
                </Link>
              </Button>
            </>
          }
        />

        {picks.length > 0 ? (
          <LearnSection title="Recommended for you">
            <ul className="divide-y divide-border/50 overflow-hidden rounded-2xl border border-border/50">
              {picks.map((mod) => (
                <li key={mod.slug}>
                  <button
                    type="button"
                    onClick={() => onSelectStage(mod)}
                    className="flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/40"
                  >
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      →
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[15px] font-semibold leading-snug">
                        {mod.title}
                      </span>
                      {mod.description ? (
                        <span className="mt-1 block text-sm leading-relaxed text-muted-foreground line-clamp-2">
                          {mod.description}
                        </span>
                      ) : null}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </LearnSection>
        ) : null}

        <LearnSection
          title="Syllabus"
          action={
            stages.length > featured.length ? (
              <Link
                href={learnTabToHref("learn")}
                className="text-xs font-semibold text-primary hover:underline"
              >
                See all {stages.length}
              </Link>
            ) : null
          }
        >
          {featured.length === 0 ? (
            <p className="text-sm text-muted-foreground">No published modules yet.</p>
          ) : (
            <ol className="space-y-1">
              {featured.map((mod, i) => {
                const pct = moduleProgressPct(mod);

                return (
                  <li key={mod.slug}>
                    <button
                      type="button"
                      onClick={() => onSelectStage(mod)}
                      className="group flex w-full items-center gap-3.5 rounded-2xl px-2 py-3 text-left transition-colors hover:bg-muted/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums",
                          pct >= 100
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1 space-y-1.5">
                        <span className="block truncate text-[15px] font-semibold leading-snug text-foreground group-hover:text-primary">
                          {mod.title}
                        </span>
                        <span
                          className="block h-1 max-w-[7.5rem] overflow-hidden rounded-full bg-muted"
                          aria-hidden
                        >
                          <span
                            className="block h-full rounded-full bg-primary transition-all"
                            style={{ width: `${Math.max(pct, pct > 0 ? pct : 6)}%`, opacity: pct > 0 ? 1 : 0.35 }}
                          />
                        </span>
                      </span>
                      <ArrowRight className="size-3.5 shrink-0 text-muted-foreground/70 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </button>
                  </li>
                );
              })}
            </ol>
          )}
        </LearnSection>

        <div className="mt-14">
          <SignUpCta dismissKey="bns-soft-login-syllabus-home" />
        </div>
      </div>
    </LearnPageFrame>
  );
}
