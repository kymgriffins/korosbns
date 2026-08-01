"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BNS_STUDIO_HERO_IMAGE } from "@/constants/bns-studio-content";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { getProgramme } from "@/content";
import { GsapHeroChoreography } from "@/motion/gsap";
import { cn } from "@/utils";
import { EmailObfuscator } from "@/components/global/email-obfuscator";

const studios = getProgramme("studios")!;

export function StudioHero() {
  return (
    <GsapHeroChoreography className="relative flex min-h-[85svh] w-full items-end overflow-hidden border-b border-border/40 md:min-h-[92svh]">
      <div data-gsap-hero-media className="absolute inset-0">
        <Image
          src={BNS_STUDIO_HERO_IMAGE}
          alt={studios.visual.heroAlt}
          fill
          className="object-cover object-top"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
      </div>

      <div
        data-gsap-hero-content
        className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col gap-5 px-6 pb-14 pt-28 md:px-16 md:pb-20"
      >
        <p className="font-heading text-sm font-semibold text-foreground">{studios.name}</p>
        <h1 className={cn(T.heroTitle, "max-w-3xl")}>{studios.headline}</h1>
        <p className={cn(T.lead, "max-w-2xl text-base text-foreground/80 md:text-lg")}>
          {studios.body.slice(0, 260)}…
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            size="lg"
            className={cn(T.btnPrimary, "px-8")}
            onClick={() =>
              document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            {studios.cta.label}
          </Button>
          <EmailObfuscator
            email="info@budgetndiostory.org"
            className={cn(T.btnPrimary, "px-8 inline-flex items-center justify-center rounded-lg border border-input bg-background text-sm font-medium hover:bg-accent hover:text-accent-foreground h-11")}
          />
        </div>
      </div>
    </GsapHeroChoreography>
  );
}
