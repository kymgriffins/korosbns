"use client";

import Image from "next/image";
import Link from "next/link";
import {
  PARTNER_PROGRAMME_EXPLAINS,
  resolvePartnerProgrammeExplains,
  stillsForIds,
  type PartnerProgrammeExplain,
} from "@/content/partner-landing";
import {
  LandingContent,
  LandingSection,
} from "@/layouts/landing-section";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { cn } from "@/utils";

export interface PartnerProgrammeExplainSectionsProps {
  explains?: PartnerProgrammeExplain[];
}

/**
 * Three numbered big bets - stakes + what success looks like + Read more.
 * Surface matches marketing nav: background, hairline, muted type.
 */
export function PartnerProgrammeExplainSections({
  explains,
}: PartnerProgrammeExplainSectionsProps = {}) {
  const items = resolvePartnerProgrammeExplains(explains);

  return (
    <>
      {items.map((item, index) => {
        const validCustomImages = (item.images || []).filter(
          (img: any) => Boolean(img?.src && img.src.trim() !== "")
        );
        const stills =
          validCustomImages.length > 0
            ? validCustomImages.map((img: any, i: number) => ({
                id: `${item.slug}-custom-${i}`,
                src: img.src,
                alt: img.alt || item.title || "Programme evidence",
                caption: img.caption || item.eyebrow,
                programme: item.slug as any,
                storyTitle: img.caption || item.name,
                storyLine: item.lede,
              }))
            : stillsForIds(item.stillIds);
        const reverse = index % 2 === 1;

        return (
          <LandingSection
            key={item.slug}
            id={`explain-${item.slug}`}
            aria-labelledby={`explain-${item.slug}-heading`}
            className="border-t border-border/50"
          >
            <div
              className={cn(
                "grid items-start gap-12 lg:grid-cols-12 lg:gap-16",
                reverse && "lg:[&>*:first-child]:order-2",
              )}
            >
              <div className="space-y-5 lg:col-span-5">
                <p
                  className={cn(
                    T.eyebrow,
                    "text-muted-foreground",
                  )}
                >
                  {item.eyebrow}
                </p>
                <h2
                  id={`explain-${item.slug}-heading`}
                  className={cn(T.sectionTitle, "text-balance text-foreground")}
                >
                  {item.title}
                </h2>
                <p className={cn(T.lead, "max-w-md text-foreground/75")}>
                  {item.lede}
                </p>
                <p className={cn(T.body, "max-w-md text-foreground/70")}>
                  {item.success}
                </p>
                <p className="text-xs font-medium tracking-wide text-muted-foreground md:text-sm">
                  {item.cycle}
                </p>
                {!item.hideCta && (
                  <LandingContent className="pt-2">
                    <Link
                      href={item.href}
                      className="inline-flex items-center text-sm font-medium text-foreground outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {item.ctaLabel}
                      <span aria-hidden className="ml-1">
                        →
                      </span>
                    </Link>
                  </LandingContent>
                )}
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
                {stills.map((still) => (
                  <figure key={still.id} className="space-y-2.5">
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <Image
                        src={still.src}
                        alt={still.alt}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 1024px) 100vw, 30vw"
                      />
                    </div>
                    <figcaption className={cn(T.caption, "text-muted-foreground")}>
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
