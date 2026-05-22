import type { Metadata } from "next";
import { Suspense } from "react";
import { LearnStatsHeader } from "@/components/learn/learn-stats-header";
import { StandaloneArticlesStrip } from "@/components/learn/standalone-articles-strip";
import { UnitFolderGrid } from "@/components/learn/unit-folder-grid";
import { fetchLearningUnitsServer } from "@/lib/learning-units";
import { fetchPublicOrgConfig } from "@/lib/org-config";
import { metaDescription } from "@/utils/metadata";

const learnDescription = metaDescription(
  "Explore Kenya's statutory budget documents as learning modules — units, fiscal-year editions, chapters, videos, and official files.",
);

export const metadata: Metadata = {
  title: "Learn Hub | Budget Ndio Story",
  description: learnDescription,
  keywords: [
    "Budget Ndio Story learn hub",
    "Kenya budget explainer videos",
    "youth budget literacy",
    "public budget accountability Kenya",
  ],
  alternates: {
    canonical: "/learn",
  },
  openGraph: {
    title: "Learn Hub | Budget Ndio Story",
    description:
      "Articles, trivia, and explainers that make Kenya's budget understandable, actionable, and relevant for young people.",
    url: "/learn",
    type: "website",
    images: ["/logo.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn Hub | Budget Ndio Story",
    description:
      "Learn Kenya's budget through articles, trivia, and explainers designed for youth action.",
    images: ["/logo.svg"],
  },
};

async function LearnHubContent() {
  const [units, org] = await Promise.all([
    fetchLearningUnitsServer().catch(() => []),
    fetchPublicOrgConfig().catch(() => null),
  ]);

  return (
    <section className="relative min-h-screen w-full overflow-x-hidden bg-background pt-16 sm:pt-20 pb-16">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 -top-20 size-72 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -bottom-20 -right-20 size-72 rounded-full bg-orange-500/15 blur-[120px]" />
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 space-y-8">
        <LearnStatsHeader tagline={org?.tagline} />

        <div>
          <h2 className="mb-1 text-lg font-bold sm:text-xl">Learning modules</h2>
          <p className="mb-4 text-sm text-foreground/65">
            Each unit is a statutory document family. Open a folder to pick a fiscal year, then read
            chapters, watch videos, browse official PDFs, and take the quiz.
          </p>
          <UnitFolderGrid units={units} />
        </div>

        <StandaloneArticlesStrip />
      </div>
    </section>
  );
}

export default function LearnPage() {
  return (
    <Suspense
      fallback={<section className="min-h-screen w-full bg-background pt-20 animate-pulse" />}
    >
      <LearnHubContent />
    </Suspense>
  );
}
