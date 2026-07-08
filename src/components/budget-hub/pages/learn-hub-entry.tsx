"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { BudgetHubLanding } from "@/components/budget-hub/pages/budget-hub-landing";
import { LearnPathsHome } from "@/components/learn/learn-paths-home";
import { HubSkeleton } from "@/components/budget-hub/states/hub-skeleton";

function LearnHubEntryInner() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  if (!tab) {
    return <BudgetHubLanding />;
  }

  return <LearnPathsHome />;
}

export function LearnHubEntry() {
  return (
    <Suspense fallback={<HubSkeleton className="p-8" />}>
      <LearnHubEntryInner />
    </Suspense>
  );
}
