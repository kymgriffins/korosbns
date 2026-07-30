"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { PROGRAMMES_CLOSING } from "@/content";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { cn } from "@/utils";

/**
 * Shared Partner CTA for /programmes and programme detail.
 * Mobile-first responsive section with clean dark theme styling.
 */
export function ProgrammePartnerCta({ className }: { className?: string }) {
  return (
    <section
      aria-labelledby="partner-cta-heading"
      className={cn(
        "relative isolate overflow-hidden border-y border-border/40 bg-gradient-to-b from-background via-muted/10 to-background py-16 md:py-24",
        className,
      )}
    >
      <div
        className={cn(
          SECTION_SHELL_INNER,
          "relative z-10 flex w-full flex-col justify-center",
        )}
      >
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/60 p-8 shadow-xl backdrop-blur-sm md:p-12 lg:p-16">
          {/* Subtle accent blur */}
          <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-primary/10 blur-[90px]" />
          
          <div className="relative z-10 flex max-w-2xl flex-col gap-5 md:gap-6">
            <span className="inline-flex w-fit items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Next step
            </span>
            <h2
              id="partner-cta-heading"
              className={cn(T.sectionTitle, "text-balance text-foreground")}
            >
              {PROGRAMMES_CLOSING.headline}
            </h2>
            <p className={cn(T.lead, "max-w-xl text-base text-muted-foreground md:text-lg")}>
              {PROGRAMMES_CLOSING.body}
            </p>
            <div>
              <Link
                href={PROGRAMMES_CLOSING.cta.href}
                className={cn(
                  T.btnPrimary,
                  "inline-flex h-11 items-center gap-2 rounded-[10px] bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                {PROGRAMMES_CLOSING.cta.label}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
