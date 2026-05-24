"use client";

import { Suspense } from "react";
import { LearnTabPage, useLearnSummary } from "@/components/learn/learn-tab-page";

function DocumentsContent() {
  const summary = useLearnSummary();
  return (
    <LearnTabPage
      listKey="documents"
      title="Documents"
      description="Official statutory publications and government source links."
      summary={summary}
    />
  );
}

export default function LearnDocumentsPage() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] animate-pulse bg-muted/20" />}>
      <DocumentsContent />
    </Suspense>
  );
}
