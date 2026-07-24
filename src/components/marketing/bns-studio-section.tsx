"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BNS_STUDIO_LANDING_SHOWCASE } from "@/constants/bns-studio-content";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  LandingContent,
  LandingSection,
  LandingSectionHeader,
} from "@/layouts/landing-section";
import { cn } from "@/utils";
import { motion } from "motion/react";

export function BNSStudioSection() {
  return (
    <LandingSection className="overflow-hidden">
      <LandingSectionHeader
        eyebrow="BNS Studios"
        title={
          <>
            The stories behind the{" "}
            <span className={T.highlight}>numbers</span>
          </>
        }
        description="Commissioned podcasts, documentaries, animations, and campaigns for governments, funders, and CSOs — every project helps fund Kenya's leading youth budget platform."
      />

      <LandingContent>
        <div className="border-x border-b border-border">
          {BNS_STUDIO_LANDING_SHOWCASE.map((service, index) => {
            const isEven = index % 2 === 0;
            const Icon = service.icon;

            return (
              <div
                key={service.name}
                className="grid grid-cols-1 items-center gap-6 border-t border-border md:grid-cols-2 md:gap-0"
              >
                <div
                  className={cn(
                    "flex flex-col justify-center p-4 sm:p-6 md:p-10 lg:p-12",
                    isEven ? "md:items-end md:text-right" : "md:order-2",
                  )}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="max-w-md space-y-3 sm:space-y-4"
                  >
                    <div className={cn(T.inlineTitle, isEven && T.inlineTitleEnd)}>
                      <div className={T.inlineIcon}>
                        <Icon className="size-4 sm:size-5" />
                      </div>
                      <h3 className={cn(T.itemTitle, "min-w-0 text-xl sm:text-2xl md:text-3xl lg:text-4xl")}>
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
                  </motion.div>
                </div>

                <div
                  className={cn(
                    "flex items-center justify-center p-4 sm:p-6 md:p-10 lg:p-12",
                    isEven ? "md:order-2" : "",
                  )}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                    className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-border/60"
                  >
                    <Image
                      src={service.image}
                      alt={`${service.name} — BNS Studios production`}
                      fill
                      className="object-cover"
                      style={{ objectPosition: service.imagePosition ?? "center" }}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-x border-border px-6 py-10 md:px-10 md:py-14 lg:px-16 lg:py-16">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <p className={T.body}>
              Every BNS Studios commission is double impact: content built for your
              audience, and a proportion of our profit funding BNS Foundation&apos;s
              civic mission permanently.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/bns-studio#booking">
                <Button size="lg" className={cn(T.btnPrimary, "gap-2")}>
                  Commission BNS Studios <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/bns-studio#portfolio">
                <Button size="lg" variant="outline" className={T.btnPrimary}>
                  View Portfolio
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="h-18 border-x border-t border-border md:h-28" />
      </LandingContent>
    </LandingSection>
  );
}
