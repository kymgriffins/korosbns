import { Metadata } from "next";
import HelpCenterClient from "@/components/marketing/help-center-client";
import { HELP_FAQS, HELP_TOPICS, type HelpFaqItem, type HelpTopic } from "@/data/help-faq-data";
import { canonicalUrl } from "@/utils/metadata";
import {
  getLiveFaqContent,
  getLiveLandingSections,
  type FaqContent,
} from "@/lib/cms-live-data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "FAQ & Help Center: Programmes, Budget & Devolution | Budget Ndio Story",
  description:
    "Frequently asked questions about Kenya's budget, BNS Programmes (Mashinani, Connect, Wanahabari Lab, Studios), Finance Bill, and public finance oversight.",
  keywords: [
    "Kenya budget FAQ",
    "BNS Programmes FAQ",
    "Finance Bill questions",
    "Appropriation Bill explained",
    "Budget Policy Statement",
    "BNS Mashinani FAQ",
    "public finance Kenya",
  ],
  alternates: { canonical: canonicalUrl("/help") },
  openGraph: {
    title: "FAQ & Help Center: Programmes, Budget & Devolution | Budget Ndio Story",
    description:
      "Answers to common questions about Kenya's budget process, BNS programmes, Finance Bill, and civic participation.",
    url: "/help",
  },
};

type FaqWithHelp = FaqContent & {
  helpFaqs?: HelpFaqItem[];
  helpTopics?: HelpTopic[];
};

function resolveHelpFaqs(faq: FaqWithHelp): HelpFaqItem[] {
  return Array.isArray(faq.helpFaqs) && faq.helpFaqs.length > 0
    ? faq.helpFaqs
    : HELP_FAQS;
}

function resolveHelpTopics(faq: FaqWithHelp): HelpTopic[] {
  return Array.isArray(faq.helpTopics) && faq.helpTopics.length > 0
    ? faq.helpTopics
    : HELP_TOPICS;
}

export default async function FAQPage() {
  const [faqContent, landingSections] = await Promise.all([
    getLiveFaqContent(),
    getLiveLandingSections(),
  ]);

  const faqs = resolveHelpFaqs(faqContent as FaqWithHelp);
  const topics = resolveHelpTopics(faqContent as FaqWithHelp);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
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
      <HelpCenterClient
        faqs={faqs}
        topics={topics}
        landingSections={landingSections}
      />
    </>
  );
}
