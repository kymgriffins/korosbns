import type { Metadata } from "next";
import { canonicalUrl } from "@/utils/metadata";

export const metadata: Metadata = {
  title: "Budget Surveys & Public Opinion | Budget Ndio Story",
  description:
    "Participate in surveys on Kenya's budget priorities, Finance Bill impact, and public finance preferences. Your voice shapes budget accountability.",
  keywords: [
    "Kenya budget surveys",
    "Finance Bill public opinion",
    "budget priorities survey Kenya",
    "public finance feedback",
    "civic engagement survey",
  ],
  alternates: { canonical: canonicalUrl("/surveys") },
  openGraph: {
    title: "Budget Surveys & Public Opinion | Budget Ndio Story",
    description:
      "Share your views on Kenya's budget priorities, Finance Bill proposals, and county allocations through our surveys.",
    url: "/surveys",
  },
};

export default function SurveysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
