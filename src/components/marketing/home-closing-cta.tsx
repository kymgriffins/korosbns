"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LandingContent,
  LandingSection,
} from "@/layouts/landing-section";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { PROGRAMMES_CLOSING } from "@/constants/programmes-content";
import { cn } from "@/utils";

export function HomeClosingCta() {
  return (
    <LandingSection spacing="default" aria-labelledby="home-closing-heading">
      <LandingContent className="flex max-w-3xl flex-col gap-5">
        <h2 id="home-closing-heading" className={cn(T.sectionTitle, "text-balance")}>
          {PROGRAMMES_CLOSING.headline}
        </h2>
        <p className={cn(T.lead, "max-w-2xl text-base text-foreground/75")}>
          {PROGRAMMES_CLOSING.body}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" className={cn(T.btnPrimary, "gap-2")}>
            <Link href={PROGRAMMES_CLOSING.cta.href}>
              {PROGRAMMES_CLOSING.cta.label}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className={T.btnPrimary}>
            <Link href="/bns-studio">Commission Studios</Link>
          </Button>
        </div>
      </LandingContent>
    </LandingSection>
  );
}
