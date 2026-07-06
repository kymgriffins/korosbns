"use client";

import { Suspense } from "react";
import { LearnTabPage, useLearnSummary } from "@/components/learn/learn-tab-page";

function QuestsContent() {
  const summary = useLearnSummary();
  return <LearnTabPage listKey="quests" summary={summary} />;
}

export default function LearnQuestsPage() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] animate-pulse bg-muted/20" />}>
      <QuestsContent />
    </Suspense>
  );
}
