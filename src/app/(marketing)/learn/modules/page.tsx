import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { canonicalUrl, metaDescription } from "@/utils/metadata";

export const metadata: Metadata = {
  title: "Learning Modules — Kenya Budget Literacy",
  description: metaDescription(
    "Browse civic learning modules on Kenya's public finance, budget cycle, and citizen participation.",
  ),
  alternates: { canonical: canonicalUrl("/learn") },
};

/** Modules catalogue lives at /learn — keep this route as a stable alias. */
export default function LearnModulesListPage() {
  redirect("/learn");
}
