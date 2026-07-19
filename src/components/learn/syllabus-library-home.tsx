"use client";

import Link from "next/link";
import { BookOpen, ArrowRight, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Routes } from "@/constants/routes";
import { learnTabToHref } from "@/lib/learn-nav";
import type { CivicModule } from "@/types/learn";
import { SignUpCta } from "@/components/ui/sign-up-cta";

type Props = {
  stages: CivicModule[];
  onSelectStage: (stage: CivicModule) => void;
  /** Optional personalized picks for logged-in users */
  recommended?: CivicModule[];
  greeting?: string;
};

/**
 * Civic syllabus library — brand + one CTA + module list.
 * Used for anonymous /learn home (and recommended strip when logged in).
 */
export function SyllabusLibraryHome({
  stages,
  onSelectStage,
  recommended = [],
  greeting,
}: Props) {
  const featured = stages.slice(0, 8);
  const picks = recommended.length > 0 ? recommended.slice(0, 3) : [];

  return (
    <div data-testid="syllabus-library-home" className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Budget Ndio Story
        </p>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Learn Kenya&apos;s budget
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {greeting ||
            "A free civic syllabus for the national and county budget cycle — read everything without an account."}
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Button asChild size="sm" className="rounded-lg text-xs font-bold">
            <Link href={learnTabToHref("learn")}>
              Browse modules
              <ArrowRight className="ml-1.5 size-3.5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-lg text-xs font-bold">
            <Link href={Routes.Reports}>
              <Landmark className="mr-1.5 size-3.5" />
              Open reports
            </Link>
          </Button>
        </div>
      </header>

      {picks.length > 0 && (
        <section className="mt-10 space-y-3" aria-label="Recommended for you">
          <h2 className="text-sm font-bold tracking-tight">Recommended for you</h2>
          <ul className="space-y-2">
            {picks.map((mod) => (
              <li key={mod.slug}>
                <button
                  type="button"
                  onClick={() => onSelectStage(mod)}
                  className="flex w-full items-start gap-3 rounded-lg border border-border/60 bg-muted/20 px-4 py-3 text-left transition hover:bg-muted/40"
                >
                  <BookOpen className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>
                    <span className="block text-sm font-semibold">{mod.title}</span>
                    {mod.description ? (
                      <span className="mt-0.5 block text-xs text-muted-foreground line-clamp-2">
                        {mod.description}
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10 space-y-3" aria-label="Syllabus">
        <h2 className="text-sm font-bold tracking-tight">Syllabus</h2>
        {featured.length === 0 ? (
          <p className="text-sm text-muted-foreground">No published modules yet.</p>
        ) : (
          <ol className="space-y-2">
            {featured.map((mod, i) => (
              <li key={mod.slug}>
                <button
                  type="button"
                  onClick={() => onSelectStage(mod)}
                  className="flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left transition hover:border-border/60 hover:bg-muted/30"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-bold tabular-nums text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{mod.title}</span>
                    {mod.badge ? (
                      <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                        {mod.badge}
                      </span>
                    ) : null}
                  </span>
                  <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ol>
        )}
        {stages.length > featured.length && (
          <Button asChild variant="ghost" size="sm" className="mt-2 text-xs font-bold">
            <Link href={learnTabToHref("learn")}>See all {stages.length} modules</Link>
          </Button>
        )}
      </section>

      <div className="mt-10">
        <SignUpCta dismissKey="bns-soft-login-syllabus-home" />
      </div>
    </div>
  );
}
