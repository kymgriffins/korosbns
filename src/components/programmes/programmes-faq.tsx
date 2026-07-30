"use client";

import { HelpCircle } from "lucide-react";
import { LandingContent, LandingSection, LandingSectionHeader } from "@/layouts/landing-section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    id: "item-1",
    question: "What is Budget Ndio Story (BNS)?",
    answer:
      "Budget Ndio Story is Kenya's leading youth-led civic initiative making national and county budgets transparent, understandable, and actionable. We track public finance, train journalists, embed in counties, and produce high-impact civic media.",
  },
  {
    id: "item-2",
    question: "How does BNS Mashinani differ from BNS Connect?",
    answer:
      "BNS Connect focuses on national-level Treasury allocations, macro budget tracking, and national youth surveys across Kenya. BNS Mashinani provides deep-dive, embedded oversight across four select counties (Kakamega, Kilifi, Nakuru, and Wajir), producing localized scorecards and community town halls.",
  },
  {
    id: "item-3",
    question: "Who is eligible to apply for Wanahabari Lab?",
    answer:
      "Wanahabari Lab is open to mainstream journalists, reporters, newsroom editors, and digital creators across Kenya who report on governance, public finance, policy, or community affairs. Applications open quarterly.",
  },
  {
    id: "item-4",
    question: "How can organizations or governments commission BNS Studios?",
    answer:
      "Governments, CSOs, international development partners, and commercial entities can commission BNS Studios for podcasts, documentaries, animated explainers, or public participation campaigns. Commissions support BNS Foundation's civic mission.",
  },
  {
    id: "item-5",
    question: "Is Budget Ndio Story non-partisan and independent?",
    answer:
      "Yes. BNS is strictly non-partisan and editorially independent. All budget trackers, scorecards, and reports rely on verified public data from the National Treasury, Controller of Budget, and Auditor-General records.",
  },
];

export function ProgrammesFaq() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <LandingSection id="faq" aria-labelledby="faq-heading">
      {/* FAQPage JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <LandingSectionHeader
        title={
          <>
            <span className="text-primary">Frequently Asked Questions.</span> Clear answers.
          </>
        }
        description="Everything you need to know about Budget Ndio Story programmes, eligibility, county coverage, and partnerships."
        className="mb-10 md:mb-14"
      />
      <LandingContent>
        <div className="mx-auto max-w-3xl rounded-3xl border border-border/60 bg-card p-6 shadow-sm md:p-10">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {FAQS.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="rounded-xl border border-border/40 px-4 transition-colors data-[state=open]:bg-primary/5 data-[state=open]:border-primary/30"
              >
                <AccordionTrigger className="text-left text-sm font-bold text-foreground hover:no-underline md:text-base">
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="size-4 shrink-0 text-primary" />
                    <span>{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-xs leading-relaxed text-muted-foreground md:text-sm pl-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </LandingContent>
    </LandingSection>
  );
}
