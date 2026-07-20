import React from "react";
import type { Metadata } from "next";
import { canonicalUrl } from "@/utils/metadata";
import { ReportsClientPage } from "./reports-client";

export const metadata: Metadata = {
  title: "Budget Reports | Budget Ndio Story",
  description:
    "Mobile-first budget brief — FY summaries, sector takeaways, and citizen-readable breakdowns of Kenya's national budget.",
  alternates: { canonical: canonicalUrl("/reports") },
  openGraph: {
    title: "Budget Reports | Budget Ndio Story",
    description:
      "Mobile-first budget brief with sector summaries and citizen takeaways.",
    url: "/reports",
  },
};

export default function ReportsPage() {
  return <ReportsClientPage />;
}
