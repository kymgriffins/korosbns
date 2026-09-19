import type { Metadata } from "next";
import { MagazineContact } from "@/components/magazine/magazine-contact";
import { canonicalUrl } from "@/utils/metadata";

export const metadata: Metadata = {
  title: "Contact & Investigation Tip-Offs | Budget Ndio Story",
  description:
    "Get in touch with the Budget Ndio Story investigations desk. Submit county tips, whistleblowing evidence, or partnership inquiries.",
  keywords: [
    "contact Budget Ndio Story",
    "Kenya budget questions",
    "Finance Bill inquiry",
    "public participation budget",
    "civic engagement Kenya",
  ],
  alternates: { canonical: canonicalUrl("/contact") },
  openGraph: {
    title: "Contact & Investigation Tip-Offs | Budget Ndio Story",
    description:
      "Submit tips, stories, or institutional inquiries directly to the Budget Ndio Story newsroom bureau in Nairobi.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return <MagazineContact />;
}
