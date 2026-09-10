"use client";

import Image from "next/image";
import {
  PARTNER_PROGRAMME_EXPLAINS,
  stillsForIds,
} from "@/content/partner-landing";
import { PillButtonGroup } from "@/components/ui/editorial";
import {
  LandingContent,
  LandingSection,
} from "@/layouts/landing-section";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { cn } from "@/utils";

/**
 * Three programme “pages” on the partner homepage —
 * Problem → How → Why → Lifecycle, with project evidence stills (not team photos).
 */
export function PartnerProgrammeExplainSections() {
  return (
    <>
      {PARTNER_PROGRAMME_EXPLAINS.map((item, index) => {
        const stills = stillsForIds(item.stillIds);
        const reverse = index % 2 === 1;

        return (
          <LandingSection
            key={item.slug}
            id={`explain-${item.slug}`}
            aria-labelledby={`explain-${item.slug}-heading`}
            className={cn(index % 2 === 1 && "bg-muted/20")}
          >
            <div
              className={cn(
                "grid items-start gap-10 lg:grid-cols-12 lg:gap-14",
                reverse && "lg:[&>*:first-child]:order-2",
              )}
            >
              <div className="space-y-6 lg:col-span-6">
                <p className={cn(T.eyebrow, "text-primary")}>{item.eyebrow}</p>
                <h2
                  id={`explain-${item.slug}-heading`}
                  className={cn(T.sectionTitle, "text-balance")}
                >
                  {item.title}
                </h2>

                <dl className="space-y-5">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Problem
                    </dt>
                    <dd className={cn(T.lead, "mt-1.5 text-base text-foreground/80")}>
                      {item.problem}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      How
                    </dt>
                    <dd className={cn(T.lead, "mt-1.5 text-base text-foreground/80")}>
                      {item.how}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Why
                    </dt>
                    <dd className={cn(T.lead, "mt-1.5 text-base text-foreground/80")}>
                      {item.why}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Lifecycle
                    </dt>
                    <dd className="mt-1.5 text-sm font-semibold text-foreground md:text-base">
                      {item.lifecycle}
                    </dd>
                  </div>
                </dl>

                <LandingContent>
                  <PillButtonGroup href={item.href} label={item.ctaLabel} />
                </LandingContent>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:col-span-6">
                {stills.map((still, stillIndex) => (
                  <figure
                    key={still.id}
                    className={cn(
                      "relative overflow-hidden rounded-3xl border border-border/40 bg-muted",
                      stillIndex === 0
                        ? "aspect-[4/5] sm:col-span-2 sm:aspect-[16/10]"
                        : "aspect-[4/3]",
                    )}
                  >
                    <Image
                      src={still.src}
                      alt={still.alt}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      priority={index === 0 && stillIndex === 0}
                    />
                    <figcaption className="absolute inset-x-0 bottom-0 bg-background/85 px-4 py-3 text-xs font-medium text-foreground backdrop-blur-sm">
                      {still.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </LandingSection>
        );
      })}
    </>
  );
}
