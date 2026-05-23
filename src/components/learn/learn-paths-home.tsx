"use client";

import { useEffect, useState } from "react";
import { LearnStatsHeader } from "@/components/learn/learn-stats-header";
import { LearnSidebar } from "@/components/learn/learn-sidebar";
import { UnitFolderGrid } from "@/components/learn/unit-folder-grid";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LearningUnitSummary } from "@/lib/learning-units";
import { learnHubApi, type LearnHubSummary } from "@/lib/learn-hub";
import { Routes } from "@/constants/routes";

export function LearnPathsHome() {
  const [units, setUnits] = useState<LearningUnitSummary[]>([]);
  const [summary, setSummary] = useState<LearnHubSummary | null>(null);

  useEffect(() => {
    void learnHubApi
      .units()
      .then((data) => setUnits(data.results ?? []))
      .catch(() => setUnits([]));
    void learnHubApi.summary().then(setSummary).catch(() => setSummary(null));
  }, []);

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_280px]">
      <div className="space-y-8">
        <LearnStatsHeader />
        <section>
          <h2 className="mb-1 text-lg font-bold sm:text-xl">Learning paths</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Statutory document families by fiscal year — chapters, videos, official PDFs, and quizzes.
          </p>
          <UnitFolderGrid units={units} />
        </section>
        <section className="rounded-2xl border border-border bg-card p-4">
          <h2 className="text-lg font-bold">Standalone explainers</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Articles outside structured paths — browse the full library.
          </p>
          <Link
            href={Routes.LearnArticles}
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            View articles <ArrowRight className="size-4" aria-hidden />
          </Link>
        </section>
      </div>
      <LearnSidebar
        trending={summary?.trending ?? []}
        dailyQuest={summary?.trending?.find((t) => t.content_type === "quest") ?? null}
      />
    </div>
  );
}
