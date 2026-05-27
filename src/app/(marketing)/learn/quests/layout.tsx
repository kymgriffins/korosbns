import type { Metadata } from "next";

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
  alternates: { canonical: "/learn/quests" },
  openGraph: {
    title: "Budget Trivia & Learning Quests | Budget Ndio Story",
    description:
      "Interactive trivia and quests to test your knowledge of Kenya's budget process, Finance Bill, and public finance.",
    url: "/learn/quests",
  },
};

export default function LearnQuestsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
