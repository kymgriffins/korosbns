import type { Metadata } from "next";
import { Suspense } from "react";
import { metaDescription, canonicalUrl } from "@/utils/metadata";
import { BudgetNewsHomeClient } from "./client";

export const revalidate = 3600;

const description = metaDescription(
  "Budget News — Kenya FY2026/27 budget analysis, sector allocations, revenue breakdown, and fiscal outlook. Yearly financial analysis explained for every citizen."
);

export const metadata: Metadata = {
  title: "Budget News — FY2026/27 Financial Year Analysis | Budget Ndio Story",
  description,
  keywords: [
    "Kenya budget news", "FY2026/27 budget", "Kenya financial year analysis",
    "budget sector breakdown", "KES 4.82 trillion", "Kenya fiscal policy",
    "budget allocation by sector", "Kenya revenue and expenditure",
    "budget deficit Kenya", "County allocation Kenya", "education budget Kenya",
    "health budget Kenya", "infrastructure budget Kenya",
  ],
  alternates: { canonical: canonicalUrl("/budgetnews") },
  openGraph: {
    title: "Budget News — Kenya FY2026/27 Financial Year Analysis",
    description: "Comprehensive sector-by-sector breakdown of Kenya's KES 4.82 trillion budget. Learn allocations for Education, Health, Infrastructure, and more.",
    url: canonicalUrl("/budgetnews"),
    type: "website",
    images: ["/logo.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Budget News — FY2026/27 Financial Year Analysis | Budget Ndio Story",
    description: "Kenya's KES 4.82 trillion budget broken down by sector. Education KES 781.4B, Health KES 175.5B, Infrastructure KES 230B, and more.",
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
