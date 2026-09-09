import { Metadata } from "next";
import BudgetGlossaryClient from "@/components/marketing/budget-glossary-client";
import { canonicalUrl } from "@/utils/metadata";

export const metadata: Metadata = {
  title: "Kenya Budget Glossary: Public Finance & Devolution Terms | Budget Ndio Story",
  description:
    "A clear, jargon-free glossary of Kenyan budget and public finance terms. Understand BPS, Equitable Share, Fiscal Deficit, CARA, DORA, and constitutional Article 201 principles.",
  keywords: [
    "Kenya budget glossary",
    "public finance terms Kenya",
    "Budget Policy Statement meaning",
    "Equitable Share definition",
    "Division of Revenue Act",
    "County Allocation of Revenue Act",
    "Fiscal Deficit Kenya",
    "Article 201 Constitution of Kenya",
    "PFM Act 2012 Kenya",
  ],
  alternates: { canonical: canonicalUrl("/glossary") },
  openGraph: {
    title: "Kenya Budget Glossary: Public Finance & Devolution Terms | Budget Ndio Story",
    description:
      "Authoritative, citizen-friendly explanations of Kenya's budget cycle, county revenue allocation, and parliamentary public finance processes.",
    url: "/glossary",
  },
};

export default function GlossaryPage() {
  return <BudgetGlossaryClient />;
}
