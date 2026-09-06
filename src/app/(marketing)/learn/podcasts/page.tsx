import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Radio } from "lucide-react";
import { PodcastPlayer } from "@/components/learn/podcast-player";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { canonicalUrl, metaDescription } from "@/utils/metadata";

export const metadata: Metadata = {
  title: "Audio Journalism & Podcasts | Budget Ndio Story",
  description: metaDescription(
    "Field soundscapes, citizen barazas, and forensic budget deep-dives in Sheng and Swahili.",
  ),
  alternates: { canonical: canonicalUrl("/learn/podcasts") },
};

export default function LearnPodcastsPage() {
  return (
    <div className="w-full bg-background text-foreground py-6 md:py-10">
      <div className={SECTION_SHELL_INNER}>
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Learning Hub</span>
          </Link>
        </nav>

        <div className="mb-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold tracking-wider">
            <Radio className="size-3.5 animate-pulse" />
            <span>FORMAT 03 · AUDIO JOURNALISM &amp; PODCASTS</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
            Field Soundscapes &amp; Forensic Audio Debates
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Studio-grade multi-mic production, community baraza field recordings, and bilingual fiscal deep-dives engineered for streaming and community radio syndication.
          </p>
        </div>

        <Suspense fallback={<div className="min-h-[50vh] animate-pulse bg-muted/20 rounded-3xl" />}>
          <PodcastPlayer />
        </Suspense>
      </div>
    </div>
  );
}
