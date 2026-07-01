import React from "react";
import type { Metadata } from "next";
import { canonicalUrl } from "@/utils/metadata";
import { ReportsClientPage } from "./reports-client";

export const metadata: Metadata = {
  title: "Budget Reports | Budget Ndio Story",
  description:
    "Explore Kenya's national and county budget data with interactive sector breakdowns, county allocations, and project tracking across multiple fiscal years.",
  alternates: { canonical: canonicalUrl("/reports") },
  openGraph: {
    title: "Budget Reports | Budget Ndio Story",
    description:
      "Interactive budget reports with sector breakdowns, county allocations, and project tracking.",
    url: "/reports",
  },
};

export default function ReportsPage() {
  return <ReportsClientPage />;
}
