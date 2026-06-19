import type { Metadata } from "next";
import { canonicalUrl } from "@/utils/metadata";
import { QuestsProtectedGate } from "./quests-protected-gate";

export const metadata: Metadata = {
  title: "Budget Trivia & Learning Quests | Budget Ndio Story",
  description:
    "Test your knowledge of Kenya's budget, Finance Bill, and fiscal policy through interactive trivia and quests. Earn XP while learning civic education.",
  keywords: [
    "Kenya budget trivia",
    "Finance Bill quiz",
    "civic education games",
    "budget learning quests",
    "interactive budget literacy",
  ],
  alternates: { canonical: canonicalUrl("/quests") },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Budget Trivia & Learning Quests | Budget Ndio Story",
    description:
      "Interactive trivia and quests to test your knowledge of Kenya's budget process, Finance Bill, and public finance.",
    url: canonicalUrl("/quests"),
    images: [{ url: "/logo.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Budget Trivia & Learning Quests | Budget Ndio Story",
    description:
      "Interactive trivia and quests to test your knowledge of Kenya's budget process, Finance Bill, and public finance.",
    images: ["/logo.svg"],
  },
};

export default function LearnQuestsLayout({ children }: { children: React.ReactNode }) {
  return <QuestsProtectedGate>{children}</QuestsProtectedGate>;
}
