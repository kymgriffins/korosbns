"use client";

import { HelpCircle } from "lucide-react";
import { LandingContent, LandingSection } from "@/layouts/landing-section";
import { EditorialPill, PillButtonGroup } from "@/components/ui/editorial";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";

const PROGRAMME_FAQS = [
  {
    id: "item-1",
    question: "How does Budget Ndio Story ensure editorial independence and non-partisanship?",
    answer:
      "BNS is strictly non-partisan. We do not accept editorial conditions tied to any grant or commission. Every claim, score, and investigation is grounded in public statutory records: National Treasury publications, Controller of Budget exchequer releases, and Auditor-General reports, backed by Article 201 of the Constitution.",
  },
  {
    id: "item-2",
    question: "Why embed deeply in four counties instead of surveying all forty-seven?",
    answer:
      "Covering 47 counties remotely produces superficial, fly-over data that changes nothing on the ground. BNS Mashinani chose Kakamega, Kilifi, Nakuru, and Wajir to build a full-cycle, replicable model. Embedded presence builds institutional trust with county assemblies while holding capital expenditure accountable.",
  },
  {
    id: "item-3",
    question: "What makes Wanahabari Lab different from standard newsroom training?",
    answer:
      "Most media training is theoretical and spikes around Budget Day. Wanahabari Lab anchors one-day intensives to live fiscal triggers across the other eleven months. Mainstream reporters and digital creators work side-by-side on real evidence and leave with filed draft investigations and data toolkits ready for immediate broadcast.",
  },
  {
    id: "item-4",
    question: "How does BNS Studios relate to the civic programmes?",
    answer:
      "BNS Studios produces documentaries, animations, and town hall media for civil society and public agencies. That craft keeps civic storytelling sharp while Connect, Mashinani, and Wanahabari Lab stay focused on budget accountability and learning.",
  },
  {
    id: "item-5",
    question: "How can newsrooms, civic groups, or institutions work with BNS?",
    answer:
      "Explore programme pages, co-publish investigations, join a Lab cohort, or commission BNS Studios for public-facing storytelling. All learning modules and reading content remain free.",
  },
];

export function ProgrammesFaq() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PROGRAMME_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <LandingSection id="faq" aria-labelledby="faq-heading" className="border-t border-border/50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <LandingContent>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="space-y-5 self-start lg:sticky lg:top-28 lg:col-span-5">
            <EditorialPill variant="default">Governance & independence</EditorialPill>
            <h2 id="faq-heading" className={T.sectionTitle}>
              Programme FAQs
            </h2>
            <p className={T.lead}>
              Direct answers on non-partisanship, county embeds, newsroom labs, and how communities engage with our work.
            </p>

            <div className="space-y-3 border-t border-border/50 pt-5">
              <p className={T.eyebrow}>Have a question?</p>
              <p className="text-xs leading-relaxed text-foreground/75">
                Need county scorecard access, a Lab application, or want to explore a collaboration?
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <PillButtonGroup
                  href="/contact"
                  label="Contact us"
                  variant="primary"
                  size="sm"
                />
                <PillButtonGroup
                  href="/about"
                  label="About BNS"
                  variant="outline"
                  size="sm"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <Accordion type="single" collapsible className="w-full divide-y divide-border/50 border-y border-border/50">
              {PROGRAMME_FAQS.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border-0 bg-transparent px-0"
                >
                  <AccordionTrigger className="py-5 text-left text-sm font-bold text-foreground hover:no-underline md:text-base">
                    <div className="flex items-start gap-3 text-left">
                      <HelpCircle className="mt-1 size-4 shrink-0 text-primary" />
                      <span className="leading-snug">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 pl-7 pr-2 text-xs leading-relaxed text-foreground/75 md:text-sm">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </LandingContent>
    </LandingSection>
  );
}
