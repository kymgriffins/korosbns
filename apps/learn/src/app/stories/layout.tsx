import type { Metadata } from "next";
import { canonicalUrl } from "@/utils/metadata";

export const metadata: Metadata = {
  title: "Civic Stories & Budget Narratives | Budget Ndio Story",
  description:
    "Visual stories that bring Kenya's budget to life. Understand the Finance Bill, Appropriation Bill, and county allocations through engaging civic narratives.",
  keywords: [
    "Kenya budget stories",
    "civic narratives Kenya",
    "Finance Bill visual story",
    "budget explained simply",
    "public finance stories",
  ],
  alternates: { canonical: canonicalUrl("/stories") },
  openGraph: {
    title: "Civic Stories & Budget Narratives | Budget Ndio Story",
    description:
      "Swipeable civic explainers making Kenya's budget, Finance Bill, and parliamentary decisions understandable at a glance.",
    url: canonicalUrl("/stories"),
    images: [{ url: "/logo.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Civic Stories & Budget Narratives | Budget Ndio Story",
    description:
      "Swipeable civic explainers making Kenya's budget, Finance Bill, and parliamentary decisions understandable at a glance.",
    images: ["/logo.svg"],
  },
};

export default function LearnStoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
