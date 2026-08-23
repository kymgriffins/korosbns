"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { GsapReveal, GsapStaggerReveal } from "@/motion/gsap";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Compass, Megaphone } from "lucide-react";
import { BNS_COMMUNITY_IMAGES, BNS_MEDIA_IMAGES } from "@/constants/bns-media-images";

const PILLARS = [
  {
    tag: "Pillar 01",
    title: "STORY",
    subtitle: "We turn complex budget documents into stories Kenyans understand.",
    body: "Through Wanahabari Lab, viral TikTok explainers, and studio documentaries, we break down dense parliamentary bills and tax policy into gripping visual media.",
    image: BNS_MEDIA_IMAGES.main,
    ctaText: "Discover the Stories",
    href: "/budgetnews",
    icon: BookOpen,
    accent: "from-amber-500/20 via-transparent to-transparent",
  },
  {
    tag: "Pillar 02",
    title: "TRACK",
    subtitle: "We follow where public money is allocated, borrowed, and spent.",
    body: "We monitor national debt servicing, county revenue share, and ministry disbursements so citizens can see the gap between what was promised and what reached the ground.",
    image: BNS_COMMUNITY_IMAGES.forumA,
    ctaText: "Explore the Tracker",
    href: "/reports",
    icon: Compass,
    accent: "from-emerald-500/20 via-transparent to-transparent",
  },
  {
    tag: "Pillar 03",
    title: "PARTICIPATE",
    subtitle: "We help citizens show up and speak in public budget hearings.",
    body: "Through BNS Connect and Mashinani campus chapters, we train young people to interrogate County Fiscal Strategy Papers and demand accountability from local leaders.",
    image: BNS_COMMUNITY_IMAGES.cohortA,
    ctaText: "Join BNS Connect",
    href: "/programmes/connect",
    icon: Megaphone,
    accent: "from-blue-500/20 via-transparent to-transparent",
  },
];

export function DocumentaryMethodPillars() {
  return (
    <section className="relative w-full py-16 md:py-24 bg-background" id="method">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <GsapReveal className="mb-12 md:mb-16 max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Our Method
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            We Turn Public Money Into Public Knowledge
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Fiscal transparency is not just publishing 800-page PDF reports. It requires storytelling, forensic tracking, and community mobilization.
          </p>
        </GsapReveal>

        <GsapStaggerReveal className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                data-gsap-item
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/70 bg-card p-6 sm:p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-foreground/30 hover:shadow-xl"
              >
                {/* Background visual banner */}
                <div className="relative mb-6 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border/40 bg-muted">
                  <Image
                    src={pillar.image}
                    alt={pillar.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                  <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-background/80 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                    <Icon className="size-3.5 text-primary" />
                    <span>{pillar.tag}</span>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <h3 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-sm font-semibold text-foreground/90 leading-snug">
                    {pillar.subtitle}
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {pillar.body}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-border/50">
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-between px-2 font-semibold text-sm hover:bg-transparent hover:text-primary group-hover:translate-x-1 transition-all"
                  >
                    <Link href={pillar.href}>
                      <span>{pillar.ctaText}</span>
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </GsapStaggerReveal>
      </div>
    </section>
  );
}

export default DocumentaryMethodPillars;
