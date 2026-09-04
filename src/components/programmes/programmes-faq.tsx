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
    <LandingSection id="faq" aria-labelledby="faq-heading" className="border-t border-border/40">
      {/* FAQPage JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <LandingContent>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Asymmetric Sticky Desk Briefing */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 self-start space-y-5">
            <EditorialPill dot pulse>
              Desk Operations & Advisory
            </EditorialPill>
            <h2 id="faq-heading" className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
              Frequently Asked Questions. <span className="text-primary">Clear, verified answers.</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
              Everything you need to know about Budget Ndio Story programmes, eligibility, county devolution coverage, and civic media commissions.
            </p>

            <div className="pt-2">
              <div className="rounded-2xl border border-border/60 bg-muted/30 p-5 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Direct Enquiry Desk
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Need custom research data, county scorecard access, or want to explore an institutional partnership?
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <PillButtonGroup
                    href="/contact"
                    label="Reach Programmes Lead"
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
          </div>

          {/* Right Column: Full-Width Accordion */}
          <div className="lg:col-span-7">
            <Accordion type="single" collapsible className="w-full space-y-3">
              {FAQS.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="rounded-2xl border border-border/60 bg-card/60 px-5 transition-all data-[state=open]:bg-primary/5 data-[state=open]:border-primary/40 data-[state=open]:shadow-xs"
                >
                  <AccordionTrigger className="text-left text-sm font-bold text-foreground hover:no-underline md:text-base py-5">
                    <div className="flex items-start gap-3 text-left">
                      <HelpCircle className="size-4 shrink-0 text-primary mt-1" />
                      <span className="leading-snug">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs leading-relaxed text-muted-foreground md:text-sm pl-7 pb-5 pr-2">
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
