"use client";

import { Suspense } from "react";
import { LearnContentLibraryView, useLearnSummary } from "@/features/learn/views/learn-content-library-view";
import { LearnStudioLoading } from "@/features/learn/views/learn-studio-states";

function QuestsContent() {
  const summary = useLearnSummary();
  return (
    <LearnContentLibraryView
      listKey="quests"
      title="Quests"
      description="Short challenges to test your budget literacy."
      summary={summary}
    />
  );
}

export default function LearnQuestsPage() {
  return (
    <Suspense fallback={<LearnStudioLoading />}>
      <QuestsContent />
    </Suspense>
  );
}
