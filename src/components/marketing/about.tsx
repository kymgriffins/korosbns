"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LandingContent,
  LandingSection,
} from "@/layouts/landing-section";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { aboutContent } from "@/content";
import TeamSection from "@/components/marketing/team-section";
import ConsortiumFoundersSection from "@/components/marketing/consortium-founders-section";
import { GsapHeroChoreography, GsapReveal, GsapStaggerReveal } from "@/motion/gsap";
import { cn } from "@/utils";

const About = () => {
  const { hero, mission, photoStrip, openCall } = aboutContent;

  return (
    <div className="w-full bg-background">
      <GsapHeroChoreography className="relative min-h-[70svh] overflow-hidden border-b border-border/40 md:min-h-[85svh]">
        <div data-gsap-hero-media className="absolute inset-0">
          <Image
            src={hero.image}
            alt={hero.imageAlt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/45 to-transparent" />
        </div>

        <div
          data-gsap-hero-content
          className="relative z-10 mx-auto flex min-h-[70svh] max-w-[1400px] flex-col justify-end px-6 pb-14 pt-28 md:min-h-[85svh] md:px-16 md:pb-20"
        >
          <div className="flex max-w-3xl flex-col gap-5">
            <p className="font-heading text-sm font-semibold text-foreground">{hero.eyebrow}</p>
            <h1 className={cn(T.heroTitle, "max-w-3xl")}>{hero.title}</h1>
            <p className={cn(T.lead, "max-w-2xl text-base text-foreground/80 md:text-lg")}>
              {hero.body}
            </p>
          </div>
        </div>
      </GsapHeroChoreography>

      <LandingSection spacing="default">
        <GsapReveal>
          <LandingContent className="grid gap-10 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-5">
              <h2 className={T.sectionTitle}>{mission.title}</h2>
            </div>
            <div className="md:col-span-7">
              <p className="text-base leading-relaxed text-foreground/80 md:text-lg">{mission.body}</p>
            </div>
          </LandingContent>
        </GsapReveal>
      </LandingSection>

      <GsapStaggerReveal className="mx-auto grid max-w-[1400px] grid-cols-2 gap-2 px-6 pb-6 md:grid-cols-4 md:gap-3 md:px-16">
        {photoStrip.images.map((src) => (
          <div
            key={src}
            data-gsap-item
            className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border/40 md:rounded-2xl"
          >
            <Image
              src={src}
              alt={photoStrip.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        ))}
      </GsapStaggerReveal>

      <ConsortiumFoundersSection />
      <TeamSection />

      <LandingSection spacing="default" className="bg-muted/30" id={openCall.id}>
        <GsapReveal>
          <LandingContent className="flex max-w-3xl flex-col gap-5">
            <h2 className={T.sectionTitle}>{openCall.title}</h2>
            <p className={cn(T.lead, "max-w-2xl text-base text-foreground/75")}>{openCall.body}</p>
            <ul className="flex flex-wrap gap-2">
              {openCall.roles.map((role) => (
                <li
                  key={role}
                  className="rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground"
                >
                  {role}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className={cn(T.btnPrimary, "gap-2")}>
                <Link href={openCall.primaryCta.href}>
                  {openCall.primaryCta.label}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={openCall.secondaryCta.href}>{openCall.secondaryCta.label}</Link>
              </Button>
            </div>
          </LandingContent>
        </GsapReveal>
      </LandingSection>
    </div>
  );
};

export default About;
