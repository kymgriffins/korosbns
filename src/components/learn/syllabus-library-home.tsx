"use client";

import Link from "next/link";
import { ArrowRight, Landmark, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Routes } from "@/constants/routes";
import { learnTabToHref } from "@/lib/learn-nav";
import type { CivicModule } from "@/types/learn";
import { SignUpCta } from "@/components/ui/sign-up-cta";
import { readProgress } from "@/lib/module-progress";
import { useAuth } from "@/contexts/auth-context";
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

function orderForSyllabus(stages: CivicModule[]): CivicModule[] {
  const bps = stages.find((s) => s.slug === "budget-policy-statement");
  if (!bps) return stages;
  return [bps, ...stages.filter((s) => s.slug !== bps.slug)];
}

/**
 * Fluid Syllabus home: main column + adaptive aside.
 * Anonymous → soft signup / reports. Authenticated → progress + picks.
 */
export function SyllabusLibraryHome({
  stages,
  onSelectStage,
  recommended = [],
  greeting,
}: Props) {
  const { isLoggedIn } = useAuth();
  const ordered = orderForSyllabus(stages);
  const featured = ordered.slice(0, 8);
  const picks = recommended.length > 0 ? recommended.slice(0, 3) : [];
  const inProgress = ordered
    .map((mod) => ({ mod, pct: moduleProgressPct(mod) }))
    .filter((x) => x.pct > 0 && x.pct < 100)
    .slice(0, 3);

  return (
    <LearnPageFrame>
      <div data-testid="syllabus-library-home" className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_22rem]">
        {/* ── Main column ─────────────────────────────────────────── */}
        <div className="min-w-0 space-y-12">
          <LearnPageHeader
            eyebrow="Budget Ndio Story"
            title="Learn Kenya's budget"
            description={
              greeting ||
              "A free civic syllabus for the national and county budget cycle — read everything without an account."
            }
            actions={
              <>
                <Button asChild size="sm" className="h-9 rounded-lg px-4 text-xs font-bold">
                  <Link href={learnTabToHref("learn")}>
                    Browse modules
                    <ArrowRight className="ml-1.5 size-3.5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-lg px-4 text-xs font-bold"
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
                      <BookOpen className="mt-0.5 size-4 shrink-0 text-primary" />
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
              <ol className="w-full space-y-1">
                {featured.map((mod, i) => {
                  const pct = moduleProgressPct(mod);

                  return (
                    <li key={mod.slug}>
                      <button
                        type="button"
                        onClick={() => onSelectStage(mod)}
                        className="group flex w-full items-center gap-3.5 rounded-xl px-2 py-3 text-left transition-colors hover:bg-muted/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                            className="block h-1 w-full max-w-xs overflow-hidden rounded-full bg-muted"
                            aria-hidden
                          >
                            <span
                              className="block h-full rounded-full bg-primary transition-all"
                              style={{
                                width: `${Math.max(pct, pct > 0 ? pct : 8)}%`,
                                opacity: pct > 0 ? 1 : 0.35,
                              }}
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

          {/* Mobile / tablet CTA — desktop uses the aside */}
          <div className="lg:hidden">
            <SignUpCta dismissKey="bns-soft-login-syllabus-home" />
          </div>
        </div>

        {/* ── Aside: adapts to auth state ─────────────────────────── */}
        <aside className="hidden min-w-0 lg:block">
          <div className="sticky top-20 space-y-5">
            {isLoggedIn ? (
              <>
                <div className="rounded-2xl border border-border/50 bg-muted/20 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Your path
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    {inProgress.length > 0
                      ? "Pick up where you left off — progress syncs across devices."
                      : "Start any module. Your progress saves as you go."}
                  </p>
                  {inProgress.length > 0 ? (
                    <ul className="mt-4 space-y-2">
                      {inProgress.map(({ mod, pct }) => (
                        <li key={mod.slug}>
                          <button
                            type="button"
                            onClick={() => onSelectStage(mod)}
                            className="w-full rounded-xl border border-border/40 bg-background/60 px-3 py-2.5 text-left transition-colors hover:border-primary/30"
                          >
                            <span className="block truncate text-xs font-semibold">{mod.title}</span>
                            <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-muted">
                              <span
                                className="block h-full rounded-full bg-primary"
                                style={{ width: `${pct}%` }}
                              />
                            </span>
                            <span className="mt-1 block text-[10px] font-medium tabular-nums text-muted-foreground">
                              {pct}% complete
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Button asChild size="sm" className="mt-4 h-9 w-full rounded-lg text-xs font-bold">
                      <Link href={learnTabToHref("learn")}>Browse modules</Link>
                    </Button>
                  )}
                </div>
                <div className="rounded-2xl border border-border/50 px-5 py-4">
                  <p className="text-xs font-semibold text-foreground">Explore further</p>
                  <div className="mt-3 flex flex-col gap-2">
                    <Link
                      href={Routes.Reports}
                      className="text-xs font-medium text-muted-foreground hover:text-primary"
                    >
                      Open budget reports →
                    </Link>
                    <Link
                      href={learnTabToHref("forum")}
                      className="text-xs font-medium text-muted-foreground hover:text-primary"
                    >
                      Join the forum →
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <>
                <SignUpCta dismissKey="bns-soft-login-syllabus-home" />
                <div className="rounded-2xl border border-border/50 px-5 py-4">
                  <p className="text-xs font-semibold text-foreground">No account needed</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    Every module stays free to read. Create an account only when you want
                    progress synced across devices.
                  </p>
                  <Link
                    href={Routes.Reports}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    <Landmark className="size-3.5" />
                    Browse reports
                  </Link>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </LearnPageFrame>
  );
}
