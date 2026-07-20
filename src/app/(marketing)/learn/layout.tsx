import type { Metadata } from "next";
import { LearnProvider } from "@/contexts/learn-context";
import { Suspense } from "react";
import { LearnTabSync } from "@/components/learn/learn-tab-sync";
import { CitizenSyllabusShell } from "@/layouts/CitizenSyllabusShell";
import { SidebarProvider } from "@/components/ui/sidebar";
import { canonicalUrl, metaDescription } from "@/utils/metadata";

export const metadata: Metadata = {
  title: {
    default: "Learn Kenya's Budget | Budget Ndio Story",
    template: "%s | Budget Ndio Story",
  },
  description: metaDescription(
    "Free civic learning on Kenya's national budget, Finance Bill, public finance, and citizen participation — modules, stories, and quizzes from Budget Ndio Story.",
  ),
  keywords: [
    "Kenya budget learning",
    "civic education Kenya",
    "public finance Kenya",
    "Finance Bill explained",
    "budget literacy",
    "citizen participation Kenya",
    "Budget Ndio Story",
  ],
  alternates: { canonical: canonicalUrl("/learn") },
  openGraph: {
    title: "Learn Kenya's Budget | Budget Ndio Story",
    description:
      "Free civic modules on Kenya's budget cycle, public finance, and how citizens can engage.",
    url: canonicalUrl("/learn"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn Kenya's Budget | Budget Ndio Story",
    description:
      "Free civic modules on Kenya's budget cycle, public finance, and how citizens can engage.",
  },
};

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <LearnProvider>
      <SidebarProvider defaultOpen={false}>
        {/* LearnTabSync uses useSearchParams — give it its own boundary so it
            never blocks the page render with the full-screen spinner. */}
        <Suspense fallback={null}>
          <LearnTabSync />
        </Suspense>
        <CitizenSyllabusShell>{children}</CitizenSyllabusShell>
      </SidebarProvider>
    </LearnProvider>
  );
}
