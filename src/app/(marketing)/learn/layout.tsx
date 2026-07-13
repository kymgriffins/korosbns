import type { Metadata } from "next";
import { LearnProvider } from "@/contexts/learn-context";
import { Suspense } from "react";
import { LearnTabSync } from "@/components/learn/learn-tab-sync";
import { LearnMobileNav } from "@/layouts/LearnMobileNav";
import AppSidebar from "@/components/shadcn-space/blocks/dashboard-shell-01/app-sidebar";
import { LearnTeachingProviderShell } from "@/components/admin/teaching";
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
      <LearnTeachingProviderShell>
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center bg-background">
              <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          }
        >
          <LearnTabSync />
          <AppSidebar bottom={<LearnMobileNav />}>{children}</AppSidebar>
        </Suspense>
      </LearnTeachingProviderShell>
    </LearnProvider>
  );
}
