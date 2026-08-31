"use client";

import Image from "next/image";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BNS_STUDIO_PAGE_SERVICES } from "@/constants/bns-studio-content";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
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
  "center top": "object-[center_top]",
  "center 20%": "object-[center_20%]",
  "center 15%": "object-[center_15%]",
};

export function StudioServices() {
  return (
    <LandingSection id="services" className="border-t-0">
      <LandingSectionHeader
        eyebrow="8 Core Production Formats"
        title={
          <>
            Specialized formats built for <span className={T.highlight}>high-trust impact</span>
          </>
        }
        description="From institutional research synthesis to viral vertical video and grassroots listening circles, we produce evidence across 8 dedicated mediums."
      />

      <LandingContent>
        <div className="border-x border-b border-border">
          {BNS_STUDIO_PAGE_SERVICES.map((service, index) => {
            const isEven = index % 2 === 0;
            const Icon = service.icon;
            const objectPos =
              OBJECT_POSITION[service.imagePosition ?? "center"] ?? "object-center";

            return (
              <div
                key={service.name}
                className="grid grid-cols-1 items-stretch border-t border-border md:grid-cols-2"
              >
                <GsapReveal
                  className={cn(
                    "flex flex-col justify-center p-6 sm:p-8 md:p-10 lg:p-12",
                    isEven ? "md:items-end md:text-right" : "md:order-2",
                  )}
                >
                  <div className="flex max-w-lg flex-col gap-4 sm:gap-5">
                    {/* Header */}
                    <div className={cn(T.inlineTitle, isEven && T.inlineTitleEnd)}>
                      <div className={T.inlineIcon}>
                        <Icon className="size-4 sm:size-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                            Format {index + 1} of 8
                          </span>
                        </div>
                        <h3
                          className={cn(
                            T.itemTitle,
                            "text-xl sm:text-2xl md:text-3xl font-bold",
                          )}
                        >
                          {service.name}
                        </h3>
                      </div>
                    </div>

                    <p className={T.caption}>{service.description}</p>

                    {/* Best For Tag */}
                    {service.bestFor && (
                      <div className={cn("rounded-xl border border-border/80 bg-muted/30 p-3 text-xs", isEven ? "md:text-right" : "")}>
                        <span className="font-semibold text-foreground">Ideal for: </span>
                        <span className="text-muted-foreground">{service.bestFor}</span>
                      </div>
                    )}

                    {/* Features list */}
                    <ul className="space-y-2.5">
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className={cn(
                            "flex items-start gap-2.5 text-xs sm:text-sm text-foreground/80",
                            isEven ? "md:flex-row-reverse md:text-right" : "",
                          )}
                        >
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Action Button */}
                    <div className={cn("pt-2", isEven ? "md:flex md:justify-end" : "")}>
                      <Button
                        variant="outline"
                        className={cn(T.btnPrimary, "rounded-full px-6 text-xs")}
                        onClick={() =>
                          document
                            .getElementById("booking")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                      >
                        Commission {service.contentType}
                      </Button>
                    </div>
                  </div>
                </GsapReveal>

                <GsapReveal
                  y={24}
                  delay={0.08}
                  className={cn(
                    "flex items-center justify-center p-6 md:p-10 lg:p-12 bg-muted/10",
                    isEven ? "md:order-2" : "",
                  )}
                >
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-border/70 shadow-sm">
                    <Image
                      src={service.image}
                      alt={`${service.name} — BNS Studios`}
                      fill
                      className={cn("object-cover", objectPos)}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold backdrop-blur-md bg-black/60 px-3 py-1 rounded-full">
                        <Sparkles className="size-3 text-primary" />
                        {service.contentType}
                      </span>
                    </div>
                  </div>
                </GsapReveal>
              </div>
            );
          })}
        </div>
        <div className="h-14 border-x border-t border-border md:h-20" />
      </LandingContent>
    </LandingSection>
  );
}

