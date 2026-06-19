import type { Metadata } from "next";
import { canonicalUrl } from "@/utils/metadata";

export const metadata: Metadata = {
  title: "Budget Forum & Community Discussions | Budget Ndio Story",
  description:
    "Join budget discussions, ask questions about Kenya's Finance Bill, Appropriation Bill, and fiscal policy. Community forum for civic engagement.",
  alternates: { canonical: canonicalUrl("/forum") },
  openGraph: {
    title: "Budget Forum & Community Discussions | Budget Ndio Story",
    description:
      "Discuss Kenya's budget, Finance Bill, and fiscal policy with the community.",
    url: canonicalUrl("/forum"),
    images: [{ url: "/logo.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Budget Forum & Community Discussions | Budget Ndio Story",
    description:
      "Discuss Kenya's budget, Finance Bill, and fiscal policy with the community.",
    images: ["/logo.svg"],
  },
};

export default function LearnForumLayout({ children }: { children: React.ReactNode }) {
  return children;
}
