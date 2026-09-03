import type { Metadata } from "next";
import { Suspense } from "react";
import { LearnHubDocuments } from "@/components/learn-hub/LearnHubDocuments";
import { canonicalUrl, metaDescription } from "@/utils/metadata";

export const metadata: Metadata = {
  title: "Budget Documents",
  description: metaDescription(
    "Browse and track Kenya budget documents, commentaries, and public finance files.",
  ),
  alternates: { canonical: canonicalUrl("/learn/documents") },
};

export default function LearnDocumentsPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] animate-pulse bg-muted/20" />}>
      <LearnHubDocuments />
    </Suspense>
  );
}
