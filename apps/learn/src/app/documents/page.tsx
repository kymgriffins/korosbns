import type { Metadata } from "next";
import { metaDescription, canonicalUrl } from "@/utils/metadata";
import { LearnDocumentsPageClient } from "./client-page";

export const metadata: Metadata = {
  title: "Budget Documents | Learn Hub | Budget Ndio Story",
  description: metaDescription(
    "Browse Kenya budget documents, Finance Bills, and county fiscal reports in the Learn Hub document repository.",
  ),
  alternates: { canonical: canonicalUrl("/documents") },
};

export default function LearnDocumentsPage() {
  return <LearnDocumentsPageClient />;
}
