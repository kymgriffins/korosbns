"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EditorialPill, PillButtonGroup } from "@/components/ui/editorial";
import { GsapReveal } from "@/motion/gsap";
import { ProgrammeOtherProgrammes } from "@/components/programmes/programme-other-programmes";
import type { ProgrammeBlock } from "@/content";
import { ConnectScrollytelling } from "@/components/programmes/scrollytelling/connect-scrollytelling";
import { MashinaniScrollytelling } from "@/components/programmes/scrollytelling/mashinani-scrollytelling";
import { WanahabariScrollytelling } from "@/components/programmes/scrollytelling/wanahabari-scrollytelling";

function DeskFaqSection({ programme }: { programme: ProgrammeBlock }) {
  if (!programme.faqs || programme.faqs.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 border-t border-border/50">
      <GsapReveal className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Left Column: Desk Context */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 self-start space-y-5">
          <EditorialPill dot pulse>
            Desk Intelligence & Advisory
          </EditorialPill>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
            Everything you need to know about {programme.name}.
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
            Verified answers directly from the desk leads covering operational protocols, cohort recruitment, research access, and institutional collaboration.
          </p>

          <div className="pt-2">
            <div className="rounded-2xl border border-border/60 bg-muted/30 p-5 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Have Further Questions?
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Our desk directors and public finance researchers are available for partner briefings and citizen inquiries.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <PillButtonGroup
                  href="/contact"
                  label="Contact Desk Lead"
                  variant="primary"
                  size="sm"
                />
                <PillButtonGroup
                  href="/programmes"
                  label="All Desks"
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
            {programme.faqs.map((faq, i) => (
              <AccordionItem
                key={faq.q}
                value={`item-${i}`}
                className="rounded-2xl border border-border/60 bg-card/60 px-5 transition-all data-[state=open]:bg-primary/5 data-[state=open]:border-primary/40 data-[state=open]:shadow-xs"
              >
                <AccordionTrigger className="text-left text-sm font-bold text-foreground hover:no-underline md:text-base py-5">
                  <span className="leading-snug">{faq.q}</span>
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-2 pb-5 pr-2">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </GsapReveal>
    </section>
  );
}

export function ProgrammeDetail({ programme }: { programme: ProgrammeBlock }) {
  if (programme.slug === "connect") {
    return (
      <div className="prog-page bg-background text-foreground selection:bg-primary/20">
        <ConnectScrollytelling />
        <DeskFaqSection programme={programme} />
        <ProgrammeOtherProgrammes currentSlug={programme.slug} />
      </div>
    );
  }

  if (programme.slug === "mashinani") {
    return (
      <div className="prog-page bg-background text-foreground selection:bg-amber-500/20">
        <MashinaniScrollytelling />
        <DeskFaqSection programme={programme} />
        <ProgrammeOtherProgrammes currentSlug={programme.slug} />
      </div>
    );
  }

  if (programme.slug === "wanahabari-lab") {
    return (
      <div className="prog-page bg-background text-foreground selection:bg-red-500/20">
        <WanahabariScrollytelling />
        <DeskFaqSection programme={programme} />
        <ProgrammeOtherProgrammes currentSlug={programme.slug} />
      </div>
    );
  }

  // Fallback if ever rendered directly
  return (
    <div className="prog-page bg-background text-foreground selection:bg-primary/20">
      <ConnectScrollytelling />
      <DeskFaqSection programme={programme} />
      <ProgrammeOtherProgrammes currentSlug={programme.slug} />
    </div>
  );
}
