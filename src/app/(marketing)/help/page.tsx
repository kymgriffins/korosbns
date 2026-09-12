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

export default async function HelpPage() {
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
