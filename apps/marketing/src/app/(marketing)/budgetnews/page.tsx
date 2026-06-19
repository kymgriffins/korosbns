import type { Metadata } from "next";
import { Suspense } from "react";
import { metaDescription, canonicalUrl } from "@/utils/metadata";
import { BudgetNewsHomeClient } from "./client";

export const revalidate = 3600;

const description = metaDescription(
  "Budget News — Kenya financial year budget analysis, sector allocations, revenue breakdown, and fiscal outlook across all fiscal years. Explained for every citizen."
);

export const metadata: Metadata = {
  title: "Budget News — Financial Year Analysis | Budget Ndio Story",
  description,
  keywords: [
    "Kenya budget news", "financial year analysis",
    "budget sector breakdown", "Kenya fiscal policy",
    "budget allocation by sector", "Kenya revenue and expenditure",
    "budget deficit Kenya", "County allocation Kenya",
  ],
  alternates: { canonical: canonicalUrl("/budgetnews") },
  openGraph: {
    title: "Budget News — Financial Year Analysis | Budget Ndio Story",
    description: "Comprehensive sector-by-sector breakdown across all fiscal years. Learn allocations for Education, Health, Infrastructure, and more.",
    url: canonicalUrl("/budgetnews"),
    type: "website",
    images: ["/logo.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Budget News — Financial Year Analysis | Budget Ndio Story",
    description: "Kenya's budget across all fiscal years, broken down by sector.",
    images: ["/logo.svg"],
  },
};

export default function BudgetNewsPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] animate-pulse bg-muted/20" />}>
      <BudgetNewsHomeClient />
    </Suspense>
  );
}
