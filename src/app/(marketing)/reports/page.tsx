import React from "react";
import type { Metadata } from "next";
import { canonicalUrl } from "@/utils/metadata";
import { ReportsClientPage } from "./reports-client";

export const metadata: Metadata = {
  title: "Budget Reports | Budget Ndio Story",
  description:
    "Budget Data World — FY episode workshop with honest year status, provenance, and citizen-readable Kenya budget metrics.",
  alternates: { canonical: canonicalUrl("/reports") },
  openGraph: {
    title: "Budget Reports | Budget Ndio Story",
    description:
      "Select a fiscal year episode: IN_APP years with provenanced metrics, honest empty states for GAP and SOURCE_LISTED years.",
    url: "/reports",
  },
};

export default function ReportsPage() {
  return <ReportsClientPage />;
}
