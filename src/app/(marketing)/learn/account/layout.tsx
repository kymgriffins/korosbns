import type { Metadata } from "next";
import { canonicalUrl } from "@/utils/metadata";

export const metadata: Metadata = {
  title: "Account Settings — Budget Ndio Story",
  description: "Manage your account settings, password, and notification preferences on Budget Ndio Story.",
  robots: { index: false, follow: false },
  alternates: { canonical: canonicalUrl("/learn/account") },
};

export default function LearnAccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
