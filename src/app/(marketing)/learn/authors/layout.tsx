import type { Metadata } from "next";
import { canonicalUrl } from "@/utils/metadata";

export const metadata: Metadata = {
  title: "Budget Authors & Contributors | Budget Ndio Story",
  description:
    "Meet the authors and contributors behind Budget Ndio Story's budget literacy content, articles, and civic education material.",
  alternates: { canonical: canonicalUrl("/learn/authors") },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Budget Authors & Contributors | Budget Ndio Story",
    description:
      "Meet the authors behind budget literacy content on Budget Ndio Story.",
    url: canonicalUrl("/learn/authors"),
    images: [{ url: "/logo.svg", width: 1200, height: 630 }],
  },
};

export default function LearnAuthorsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
