"use client";

import Image from "next/image";
import { Sparkles, ShieldCheck, HeartHandshake } from "lucide-react";
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
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent" />
      </div>

      <div
        data-gsap-hero-content
        className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col gap-5 px-6 pb-14 pt-28 md:px-16 md:pb-20"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-md">
            <Sparkles className="size-3" />
            BNS Studios • Impact Media & Civic Dialogue
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-md">
            <HeartHandshake className="size-3 text-primary" />
            Double-Impact Model
          </span>
        </div>

        <h1 className={cn(T.heroTitle, "max-w-3xl")}>{studios.headline}</h1>
        <p className={cn(T.lead, "max-w-2xl text-base text-foreground/80 md:text-lg")}>
          {studios.body}
        </p>

        {/* 8 Formats Quick Strip */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">8 Core Formats:</span>
          <span>Podcasts</span> •
          <span>Animations</span> •
          <span>Explainers</span> •
          <span>Research Spotlights</span> •
          <span>Documentaries</span> •
          <span>Social Series</span> •
          <span>Town Halls</span> •
          <span>Listening Circles</span>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            size="lg"
            className={cn(T.btnPrimary, "px-8")}
            onClick={() =>
              document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Explore Evidence
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 rounded-full"
            onClick={() =>
              document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            {studios.cta.label}
          </Button>
          <EmailObfuscator
            email="info@budgetndiostory.org"
            className={cn("px-6 inline-flex items-center justify-center rounded-full border border-input bg-background/80 text-sm font-medium hover:bg-accent hover:text-accent-foreground h-11 backdrop-blur-sm")}
          />
        </div>
      </div>
    </GsapHeroChoreography>
  );
}

