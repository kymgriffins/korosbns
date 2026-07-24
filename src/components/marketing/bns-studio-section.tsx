"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BNS_STUDIO_LANDING_SHOWCASE } from "@/constants/bns-studio-content";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { landingContent } from "@/content";
import {
  LandingContent,
  LandingSection,
  LandingSectionHeader,
} from "@/layouts/landing-section";
import { GsapReveal } from "@/motion/gsap";
import { cn } from "@/utils";

const OBJECT_POSITION: Record<string, string> = {
  center: "object-center",
  top: "object-top",
  bottom: "object-bottom",
  left: "object-left",
  right: "object-right",
  "center top": "object-[center_top]",
  "center 20%": "object-[center_20%]",
  "center 15%": "object-[center_15%]",
};

export function BNSStudioSection() {
  const strip = landingContent.studioStrip;

  return (
    <LandingSection className="overflow-hidden">
      <LandingSectionHeader
        eyebrow={strip.eyebrow}
        title={
          <>
            {strip.titleBefore}{" "}
            <span className={T.highlight}>{strip.titleHighlight}</span>
          </>
        }
        description={strip.description}
      />

      <LandingContent>
        <div className="border-x border-b border-border">
          {BNS_STUDIO_LANDING_SHOWCASE.map((service, index) => {
            const isEven = index % 2 === 0;
            const Icon = service.icon;
            const objectPos =
              OBJECT_POSITION[service.imagePosition ?? "center"] ?? "object-center";

            return (
              <div
                key={service.name}
                className="grid grid-cols-1 items-center gap-6 border-t border-border md:grid-cols-2 md:gap-0"
              >
                <GsapReveal
                  className={cn(
                    "flex flex-col justify-center p-4 sm:p-6 md:p-10 lg:p-12",
                    isEven ? "md:items-end md:text-right" : "md:order-2",
                  )}
                >
                  <div className="max-w-md space-y-3 sm:space-y-4">
                    <div className={cn(T.inlineTitle, isEven && T.inlineTitleEnd)}>
                      <div className={T.inlineIcon}>
                        <Icon className="size-4 sm:size-5" />
                      </div>
                      <h3
                        className={cn(
                          T.itemTitle,
                          "min-w-0 text-xl sm:text-2xl md:text-3xl lg:text-4xl",
                        )}
                      >
                        {service.name}
                      </h3>
                    </div>
                    <p className={T.caption}>{service.description}</p>
                    <ul
                      className={cn(
                        "flex flex-wrap gap-2",
                        isEven ? "md:justify-end" : "justify-start",
                      )}
                    >
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground/70"
                        >
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </GsapReveal>

                <GsapReveal
                  y={24}
                  delay={0.08}
                  className={cn(
                    "flex items-center justify-center p-4 sm:p-6 md:p-10 lg:p-12",
                    isEven ? "md:order-2" : "",
                  )}
                >
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-border/60">
                    <Image
                      src={service.image}
                      alt={`${service.name} — BNS Studios production`}
                      fill
                      className={cn("object-cover", objectPos)}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </GsapReveal>
              </div>
            );
          })}
        </div>

        <GsapReveal className="border-x border-border px-6 py-10 md:px-10 md:py-14 lg:px-16 lg:py-16">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <p className={T.body}>{strip.highlight}</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href={strip.primaryCta.href}>
                <Button size="lg" className={cn(T.btnPrimary, "gap-2")}>
                  {strip.primaryCta.label} <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href={strip.secondaryCta.href}>
                <Button size="lg" variant="outline" className={T.btnPrimary}>
                  {strip.secondaryCta.label}
                </Button>
              </Link>
            </div>
          </div>
        </GsapReveal>

        <div className="h-18 border-x border-t border-border md:h-28" />
      </LandingContent>
    </LandingSection>
  );
}
