"use client";

import Image from "next/image";
import { CheckCircle } from "lucide-react";
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
        eyebrow="Services"
        title={
          <>
            What we <span className={T.highlight}>offer</span>
          </>
        }
        description="Professional media production services to bring civic and brand stories to life."
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
                    "flex flex-col justify-center p-4 sm:p-6 md:p-10 lg:p-12",
                    isEven ? "md:items-end md:text-right" : "md:order-2",
                  )}
                >
                  <div className="flex max-w-md flex-col gap-3 sm:gap-4">
                    <div className={cn(T.inlineTitle, isEven && T.inlineTitleEnd)}>
                      <div className={T.inlineIcon}>
                        <Icon className="size-4 sm:size-5" />
                      </div>
                      <div className="min-w-0">
                        <h3
                          className={cn(
                            T.itemTitle,
                            "text-xl sm:text-2xl md:text-3xl lg:text-4xl",
                          )}
                        >
                          {service.name}
                        </h3>
                        <p className={cn(T.role, "mt-0.5")}>{service.price}</p>
                      </div>
                    </div>
                    <p className={T.caption}>{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className={cn(
                            "flex items-start gap-2 text-sm text-foreground/70",
                            isEven ? "md:flex-row-reverse md:text-right" : "",
                          )}
                        >
                          <CheckCircle className="mt-0.5 size-4 shrink-0 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className={cn(isEven ? "md:flex md:justify-end" : "")}>
                      <Button
                        variant="outline"
                        className={T.btnPrimary}
                        onClick={() =>
                          document
                            .getElementById("booking")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                      >
                        Book {service.name}
                      </Button>
                    </div>
                  </div>
                </GsapReveal>

                <GsapReveal
                  y={24}
                  delay={0.08}
                  className={cn(
                    "flex items-center justify-center p-6 md:p-10 lg:p-12",
                    isEven ? "md:order-2" : "",
                  )}
                >
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-border/60">
                    <Image
                      src={service.image}
                      alt={`${service.name} — BNS Studios`}
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
        <div className="h-18 border-x border-t border-border md:h-28" />
      </LandingContent>
    </LandingSection>
  );
}
