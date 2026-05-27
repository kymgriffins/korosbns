import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Official Budget Documents & PDFs | Budget Ndio Story",
  description:
    "Access official Kenya budget documents including the Finance Bill, Appropriation Bill, Division of Revenue Bill, Budget Policy Statement, and County Allocation of Revenue Acts.",
  keywords: [
    "Kenya budget documents",
    "Finance Bill PDF",
    "Appropriation Bill Kenya",
    "Budget Policy Statement",
    "Division of Revenue Bill",
    "County Allocation of Revenue Act",
    "official budget documents Kenya",
  ],
  alternates: { canonical: "/learn/documents" },
  openGraph: {
    title: "Official Budget Documents & PDFs | Budget Ndio Story",
    description:
      "Official Kenya budget documents: Finance Bill, Appropriation Bill, Budget Policy Statement, and Division of Revenue Act in one place.",
    url: "/learn/documents",
  },
};

export default function LearnDocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
