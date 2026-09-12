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

const INVESTOR_FAQS = [
  {
    id: "item-1",
    question: "How does Budget Ndio Story ensure editorial independence and non-partisanship?",
    answer:
      "BNS is strictly non-partisan. We do not accept funding contingent on editorial outcomes. Every claim, score, and investigation is grounded in public statutory records: National Treasury publications, Controller of Budget exchequer releases, and Auditor-General reports, backed by Article 201 of the Constitution.",
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
    question: "How does the BNS Studio commercial surplus mechanism work?",
    answer:
      "BNS Studios operates as a commercial-grade impact production house. International NGOs, corporations, and governments commission broadcast documentaries, animations, and town hall productions. The commercial surplus generated directly cross-subsidizes BNS civic watchdogging, ensuring long-term financial resilience.",
  },
  {
    id: "item-5",
    question: "How can institutional donors and development partners co-invest?",
    answer:
      "Partners can support through core programme grants, co-design thematic tracking sprints (e.g. Health, Climate, Sovereign Debt), or commission BNS Studios for high-craft public participation storytelling. All partnerships include formal briefing rights and verification data access.",
  },
];

export function ProgrammesFaq() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: INVESTOR_FAQS.map((faq) => ({
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
      {/* FAQPage JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <LandingContent>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Desk Briefing */}
          <div className="space-y-5 self-start lg:sticky lg:top-28 lg:col-span-5">
            <EditorialPill variant="default">
              Due Diligence & Governance
            </EditorialPill>
            <h2 id="faq-heading" className={T.sectionTitle}>
              Investor & Partner FAQs
            </h2>
            <p className={T.lead}>
              Direct answers on fiduciary standards, non-partisanship, county government collaboration, and our dual-impact production model.
            </p>

            <div className="pt-2">
              <div className="border border-border/60 bg-muted/20 p-5 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Partner Enquiry Desk
                </p>
                <p className="text-xs leading-relaxed text-foreground/75">
                  Need custom research data, county scorecard access, or want to explore an institutional co-funding arrangement?
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <PillButtonGroup
                    href="/contact?intent=partner"
                    label="Discuss Partnership"
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
              {INVESTOR_FAQS.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border border-border/60 bg-background px-5 transition-all data-[state=open]:border-primary/40 data-[state=open]:bg-muted/10"
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
