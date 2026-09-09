import { Metadata } from "next";
import HelpCenterClient from "@/components/marketing/help-center-client";
import { HELP_FAQS } from "@/data/help-faq-data";
import { canonicalUrl } from "@/utils/metadata";

export const metadata: Metadata = {
  title: "Help Center & FAQ: Programmes, Budget Process & Civic Learning | Budget Ndio Story",
  description:
    "Official help center and FAQ for Budget Ndio Story. Find answers about BNS Mashinani, Connect, Wanahabari Lab, BNS Studios, Kenya's budget cycle, and Learn Hub.",
  keywords: [
    "Budget Ndio Story help",
    "BNS FAQ",
    "BNS Mashinani questions",
    "Wanahabari Lab application",
    "BNS Studios commissions",
    "Kenya budget process FAQ",
    "Learn Hub certification",
    "public finance help Kenya",
  ],
  alternates: { canonical: canonicalUrl("/help") },
  openGraph: {
    title: "Help Center & FAQ | Budget Ndio Story",
    description:
      "Frequently asked questions and verified answers on BNS Programmes, Kenya's budget cycle, county devolution, Learn Hub, and media productions.",
    url: "/help",
  },
};

export default function HelpPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HELP_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HelpCenterClient />
    </>
  );
}
