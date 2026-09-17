"use client";

import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  resolvePartnerProgrammeExplains,
  stillsForIds,
  type PartnerProgrammeExplain,
} from "@/content/partner-landing";
import { LandingSection } from "@/layouts/landing-section";
import { cn } from "@/utils";
import Image from "next/image";
import Link from "next/link";

export interface PartnerProgrammeExplainSectionsProps {
  explains?: PartnerProgrammeExplain[];
}

/**
 * Three programmes — Core programme offer (Section 2).
 * Editorial 3-column grid on desktop, stacked on mobile.
 * Typographic stats (no bordered scorecards); media frames only for images.
 */
export function PartnerProgrammeExplainSections({
  explains,
}: PartnerProgrammeExplainSectionsProps = {}) {
  const items = resolvePartnerProgrammeExplains(explains);

  const getStatInfo = (slug: string) => {
    switch (slug) {
      case "connect":
        return { value: "KSh 4.8T", label: "Monitored Nationally" };
      case "mashinani":
        return { value: "4 Counties", label: "Embedded Verification" };
      case "wanahabari-lab":
        return { value: "4 Newsrooms", label: "Labs Anchored Year-Round" };
      default:
        return { value: "100%", label: "Verified Scrutiny" };
    }
  };

  return (
    <LandingSection
      id="three-big-bets"
      aria-labelledby="three-programmes-heading"
      className="border-t border-border/50 bg-background py-16 md:py-24"
    >
      <div className="mb-12 max-w-2xl space-y-3">
        <p className={cn(T.eyebrow, "text-muted-foreground")}>Our programmes</p>
        <h2
          id="three-programmes-heading"
          className={cn(T.sectionTitle, "text-balance text-foreground")}
        >
          Three programmes. Year-round accountability.
        </h2>
        <p className={cn(T.lead, "text-foreground/75")}>
          From national budget allocations to grassroots county delivery and
          newsroom investigation.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8 lg:gap-12 md:divide-x md:divide-border/50">
        {items.map((item) => {
          const validCustomImages = (item.images || []).filter(
            (img: { src?: string }) =>
              Boolean(img?.src && img.src.trim() !== ""),
          );
          const stills =
            validCustomImages.length > 0
              ? validCustomImages.map(
                  (
                    img: { src: string; alt?: string; caption?: string },
                    i: number,
                  ) => ({
                    id: `${item.slug}-custom-${i}`,
                    src: img.src,
                    alt: img.alt || item.title || "Programme evidence",
                    caption: img.caption || item.eyebrow,
                  }),
                )
              : stillsForIds(item.stillIds);

          const stat = getStatInfo(item.slug);

          const cleanSuccess = item.success
            ? item.success.replace(/^success\s+looks\s+like:?\s*/i, "").trim()
            : "";

          const cleanCtaLabel = (item.ctaLabel || "Explore programme")
            .replace(/[→\->\s]+$/g, "")
            .trim();

          return (
            <div
              key={item.slug}
              className="flex h-full flex-col md:px-6 first:md:pl-0 last:md:pr-0"
            >
              <div className="flex flex-1 flex-col">
                <div className="space-y-1.5 md:min-h-[4.25rem]">
                  <span className={cn(T.eyebrow, "text-muted-foreground")}>
                    {item.eyebrow}
                  </span>
                  <h3 className={cn(T.cardTitle, "font-light text-foreground")}>
                    {item.title}
                  </h3>
                </div>

                <div className="mt-4 min-h-[72px] border-b border-border/40 pb-4">
                  <div className="font-heading text-[32px] font-normal leading-none tracking-tight text-foreground">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {stat.label}
                  </div>
                </div>

                <p className="mt-5 text-base font-normal leading-relaxed text-foreground/80 md:min-h-[4.75rem]">
                  {item.lede}
                </p>

                <div className="mt-4 rounded-md border border-border/40 bg-muted/25 p-3 transition-colors duration-200 group-hover:border-primary/30 group-hover:bg-primary/5">
                  <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Success looks like
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                    {cleanSuccess}
                  </p>
                </div>

                <div className="mt-3 flex items-center md:min-h-[1.5rem]">
                  {!item.hideCycle && (
                    <p className="truncate font-mono text-xs text-muted-foreground">
                      {item.cycle}
                    </p>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {stills.slice(0, 2).map((still) => (
                    <figure key={still.id} className="space-y-1.5">
                      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                        <Image
                          src={still.src}
                          alt={still.alt}
                          fill
                          className="object-cover object-center"
                          sizes="(max-width: 768px) 50vw, 16vw"
                        />
                      </div>
                      <figcaption className="min-h-[16px] truncate text-[11px] text-muted-foreground">
                        {still.caption}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-6">
                <Link
                  href={item.href}
                  className="group inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span>{cleanCtaLabel}</span>
                  <span
                    aria-hidden
                    className="ml-1.5 transition-transform duration-150 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </LandingSection>
  );
}
