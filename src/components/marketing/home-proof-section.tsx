"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LandingContent,
  LandingSection,
} from "@/layouts/landing-section";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { cn } from "@/utils";

/**
 * Editorial proof fold — points to reports for live figures.
 * Does not invent budget numbers; frames why BNS exists.
 */
export function HomeProofSection() {
  return (
    <LandingSection
      spacing="default"
      className="bg-foreground text-background"
      aria-labelledby="home-proof-heading"
    >
      <LandingContent className="grid gap-10 md:grid-cols-12 md:items-end md:gap-12">
        <div className="md:col-span-7">
          <h2
            id="home-proof-heading"
            className="font-heading text-[clamp(2rem,4.5vw,3.5rem)] font-bold tracking-[-0.03em] leading-[1.08] text-balance text-background"
          >
            Public money moves out of sight. We bring it back into view.
          </h2>
        </div>
        <div className="flex flex-col gap-5 md:col-span-5">
          <p className="text-sm leading-relaxed text-background/75 md:text-base">
            Follow national and county spending with provenance-true reporting —
            when a figure is unavailable, we say so. Start with live reports, then
            follow the story through our programmes.
          </p>
          <div>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className={cn(T.btnPrimary, "gap-2 bg-background text-foreground hover:bg-background/90")}
            >
              <Link href="/reports">
                Explore reports
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </LandingContent>
    </LandingSection>
  );
}
