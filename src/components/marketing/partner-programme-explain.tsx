"use client";

import Image from "next/image";
import Link from "next/link";
import {
  resolvePartnerProgrammeExplains,
  stillsForIds,
  type PartnerProgrammeExplain,
} from "@/content/partner-landing";
import { LandingSection } from "@/layouts/landing-section";
import { cn } from "@/utils";

export interface PartnerProgrammeExplainSectionsProps {
  explains?: PartnerProgrammeExplain[];
}

/**
 * Three Big Bets — Core Programme Offer (Section 2).
 * Quiet authority, Stripe-inspired 3-column editorial grid on desktop, stacked on mobile.
 * Frost dividers, Weight 300 typography, bold 32px key stats.
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
      aria-labelledby="three-big-bets-heading"
      className="border-t border-[#e5edf5] bg-white py-16 md:py-24"
    >
      {/* Section Header */}
      <div className="mb-12 max-w-2xl space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#64748d]">
          The Core Offer
        </p>
        <h2
          id="three-big-bets-heading"
          className="font-heading text-3xl font-light tracking-tight text-[#061b31] md:text-4xl"
        >
          Three Big Bets. Year-Round Accountability.
        </h2>
        <p className="text-base text-[#061b31]/75 leading-relaxed">
          From national budget allocations to grassroots county delivery and newsroom investigation.
        </p>
      </div>

      {/* 3-Column Editorial Grid */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 lg:gap-12 md:divide-x md:divide-[#e5edf5]">
        {items.map((item, idx) => {
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
                }))
              : stillsForIds(item.stillIds);

          const stat = getStatInfo(item.slug);

          return (
            <div
              key={item.slug}
              className={cn(
                "flex flex-col justify-between space-y-8",
                idx > 0 && "md:pl-8 lg:pl-12"
              )}
            >
              <div className="space-y-5">
                {/* Eyebrow & Headline */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#64748d]">
                    {item.eyebrow}
                  </span>
                  <h3 className="font-heading text-2xl font-light text-[#061b31] tracking-tight">
                    {item.title}
                  </h3>
                </div>

                {/* Key Stat Block */}
                <div className="rounded-[4px] border border-[#e5edf5] bg-[#f8fafd] p-4">
                  <div className="font-heading text-[32px] font-normal tracking-tight text-[#061b31]">
                    {stat.value}
                  </div>
                  <div className="text-xs font-medium text-[#64748d] uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>

                {/* The Intervention Body (Exactly 16px Weight 400) */}
                <p className="text-[16px] text-[#061b31]/80 leading-relaxed font-normal">
                  {item.lede}
                </p>

                {/* Success / Proof */}
                <p className="text-sm text-[#061b31]/70 leading-normal">
                  <span className="font-medium text-[#061b31]">Success looks like: </span>
                  {item.success}
                </p>

                {/* Cycle Whisper */}
                {!item.hideCycle && (
                  <p className="text-xs text-[#64748d] font-mono">
                    {item.cycle}
                  </p>
                )}

                {/* Field Photography Grid */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {stills.slice(0, 2).map((still) => (
                    <figure key={still.id} className="space-y-1">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] border border-[#e5edf5] bg-[#f8fafd]">
                        <Image
                          src={still.src}
                          alt={still.alt}
                          fill
                          className="object-cover object-center"
                          sizes="(max-width: 768px) 50vw, 16vw"
                        />
                      </div>
                      <figcaption className="text-[11px] text-[#64748d] line-clamp-1">
                        {still.caption}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-4 border-t border-[#e5edf5]/60">
                <Link
                  href={item.href}
                  className="group inline-flex items-center text-sm font-medium text-[#533afd] hover:text-[#7389ff] transition-colors"
                >
                  <span>{item.ctaLabel || "Explore programme →"}</span>
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
