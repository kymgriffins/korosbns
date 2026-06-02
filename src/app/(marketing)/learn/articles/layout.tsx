import type { Metadata } from "next";
import { canonicalUrl } from "@/utils/metadata";

export const metadata: Metadata = {
  title: "Budget Articles & Explainers | Budget Ndio Story",
  description:
    "In-depth articles explaining Kenya's budget process, Finance Bill 2026, Appropriation Bill, Division of Revenue, and fiscal policy in plain language.",
  keywords: [
    "Kenya budget articles",
    "Finance Bill explainer Kenya",
    "Appropriation Bill explained",
    "budget literacy Kenya",
    "fiscal policy articles",
    "public finance education",
  ],
  alternates: { canonical: canonicalUrl("/learn/articles") },
  openGraph: {
    title: "Budget Articles & Explainers | Budget Ndio Story",
    description:
      "Clear, in-depth articles on Kenya's Finance Bill, Appropriation Bill, budget process, and parliamentary fiscal debates.",
    url: "/learn/articles",
  },
};

export default function LearnArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
