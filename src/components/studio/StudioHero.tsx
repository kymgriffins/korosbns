"use client";

import Image from "next/image";
import { HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BNS_STUDIO_HERO_IMAGE } from "@/constants/bns-studio-content";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { getProgramme } from "@/content";
import { GsapHeroChoreography } from "@/motion/gsap";
import { cn } from "@/utils";
import { EmailObfuscator } from "@/components/global/email-obfuscator";

const studios = getProgramme("studios")!;

const FORMAT_LABELS = [
  "Podcast & Audio",
  "Animations",
  "Explainer Videos",
  "Research Spotlights",
  "Documentaries",
  "Social Media Series",
  "Town Hall Design & Facilitation",
  "Community Listening Sessions",
] as const;

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
        className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col gap-5 px-6 pt-28 pb-14 md:px-16 md:pb-20"
      >
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border/80 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-md">
          <HeartHandshake className="size-3 text-primary" />
          Impact production and evidence library
        </span>

        <h1 className={cn(T.heroTitle, "max-w-3xl")}>{studios.headline}</h1>
        <p
          className={cn(
            T.lead,
            "max-w-2xl text-base text-foreground/80 md:text-lg",
          )}
        >
          {studios.body}
        </p>

        <ul className="grid max-w-3xl gap-1 pt-1 text-xs text-muted-foreground sm:grid-cols-2">
          {FORMAT_LABELS.map((label) => (
            <li key={label} className="flex items-center gap-2">
              <span className="size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{label}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            size="lg"
            className={cn(T.btnPrimary, "px-8")}
            onClick={() =>
              document
                .getElementById("evidence-by-type")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Browse by content type
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-8"
            onClick={() =>
              document
                .getElementById("evidence-by-organisation")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Browse by organisation
          </Button>
          <EmailObfuscator
            email="info@budgetndiostory.org"
            className="inline-flex h-11 items-center justify-center rounded-full border border-input bg-background/80 px-6 text-sm font-medium backdrop-blur-sm hover:bg-accent hover:text-accent-foreground"
          />
        </div>
      </div>
    </GsapHeroChoreography>
  );
}
