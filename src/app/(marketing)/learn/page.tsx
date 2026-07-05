import type { Metadata } from "next";
import { Suspense } from "react";
import { LearnStudioApp } from "@/features/learn";
import { LearnStudioLoading } from "@/features/learn/views/learn-studio-states";
import { metaDescription, canonicalUrl } from "@/utils/metadata";

const learnDescription = metaDescription(
  "Learn Studio — understand Kenya's national budget through calm, structured modules. Education, health, infrastructure, and citizen participation.",
);

export const metadata: Metadata = {
  title: "Learn Studio | Budget Ndio Story",
  description: learnDescription,
  alternates: { canonical: canonicalUrl("/learn") },
  openGraph: {
    title: "Learn Studio | Budget Ndio Story",
    description: learnDescription,
    url: canonicalUrl("/learn"),
    images: [{ url: "/logo.svg", width: 1200, height: 630 }],
  },
};

export const revalidate = 3600;

export default function LearnPage() {
  return (
    <Suspense fallback={<LearnStudioLoading />}>
      <LearnStudioApp />
    </Suspense>
  );
}
