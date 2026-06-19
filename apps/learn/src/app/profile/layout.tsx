import type { Metadata } from "next";
import { canonicalUrl } from "@/utils/metadata";

export const metadata: Metadata = {
  title: "My Profile — Budget Learning Progress | Budget Ndio Story",
  description:
    "Track your budget learning progress, sovereign points, badges, and completed modules on Budget Ndio Story.",
  robots: { index: false, follow: false },
  alternates: { canonical: canonicalUrl("/profile") },
};

export default function LearnProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
