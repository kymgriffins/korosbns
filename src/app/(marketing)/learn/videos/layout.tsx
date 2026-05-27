import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Budget Explainers & Video Series | Budget Ndio Story",
  description:
    "Watch video explainers on Kenya's budget, Finance Bill, Appropriation Bill, and fiscal policy. Learn how parliamentary budget decisions affect you.",
  keywords: [
    "Kenya budget videos",
    "Finance Bill video explainer",
    "budget education videos",
    "fiscal policy video series",
    "YouTube civic education Kenya",
  ],
  alternates: { canonical: "/learn/videos" },
  openGraph: {
    title: "Budget Explainers & Video Series | Budget Ndio Story",
    description:
      "Video explainers on Kenya's Finance Bill, budget process, parliamentary debates, and how public funds are allocated.",
    url: "/learn/videos",
  },
};

export default function LearnVideosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
