"use client";

import { TrendingUp } from "lucide-react";
import { LearnAnalyticsView } from "@/components/learn/learn-analytics-view";
import { StudioPage } from "@/features/learn/components/studio-page";
import { StudioPageHeader } from "@/features/learn/components/studio-page-header";

export default function AnalyticsPage() {
  return (
    <StudioPage width="wide">
      <StudioPageHeader
        eyebrow="Insights"
        title="Analytics"
        description="Content metrics across modules, articles, videos, and documents."
        illustration={
          <div className="flex size-24 items-center justify-center rounded-2xl border border-border/50 bg-primary/5">
            <TrendingUp className="size-10 text-primary/60" />
          </div>
        }
      />
      <LearnAnalyticsView />
    </StudioPage>
  );
}
