"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LandingContent,
  LandingSection,
} from "@/layouts/landing-section";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { aboutContent } from "@/content";
import TeamSection from "@/components/marketing/team-section";
import ConsortiumFoundersSection from "@/components/marketing/consortium-founders-section";
import { cn } from "@/utils";

const About = () => {
  const { hero, mission, photoStrip } = aboutContent;

  return (
    <div className="w-full bg-background min-h-screen">
      {/* Hero Section — SSR-visible immediately, no flash of blank screen */}
      <section className="relative min-h-[70svh] overflow-hidden border-b border-border/40 md:min-h-[80svh] flex items-end">
        <div className="absolute inset-0 z-0">
          <Image
            src={hero.image}
            alt={hero.imageAlt}
            fill
            priority
            className="object-cover transition-transform duration-1000 ease-out scale-100"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-background/85" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-14 pt-28 md:px-16 md:pb-20">
          <div className="flex max-w-3xl flex-col gap-4 animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary w-fit backdrop-blur-md">
              <Compass className="size-3.5" />
              <span>{hero.eyebrow}</span>
            </div>
            <h1 className={cn(T.heroTitle, "max-w-3xl text-foreground font-heading tracking-tight")}>
              {hero.title}
            </h1>
            <p className={cn(T.lead, "max-w-2xl text-base text-foreground/85 md:text-lg leading-relaxed")}>
              {hero.body}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <LandingSection spacing="default">
        <LandingContent className="grid gap-8 md:grid-cols-12 md:gap-12 items-center">
          <div className="md:col-span-5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Our Purpose &amp; Impact
            </span>
            <h2 className={T.sectionTitle}>{mission.title}</h2>
          </div>
          <div className="md:col-span-7">
            <p className="text-base leading-relaxed text-foreground/80 md:text-lg border-l-2 border-primary/30 pl-5">
              {mission.body}
            </p>
          </div>
        </LandingContent>
      </LandingSection>

      {/* Photo Strip Showcase */}
      <section className="mx-auto max-w-[1400px] px-6 pb-8 md:px-16">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {photoStrip.images.map((src, index) => (
            <div
              key={src + index}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border/40 bg-muted/20 md:rounded-2xl transition-all duration-300 hover:border-primary/40 hover:shadow-md"
            >
              <Image
                src={src}
                alt={photoStrip.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Consortium Founding Partners */}
      <ConsortiumFoundersSection />

      {/* Team Roster Showcase */}
      <TeamSection />

      {/* Careers & Creative Network Invitation Banner */}
      <LandingSection spacing="default" className="bg-muted/30 border-t border-border/40">
        <LandingContent className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-8 md:p-12 rounded-3xl border border-border/60 bg-card shadow-sm">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-600 dark:text-purple-400">
              <Briefcase className="size-3.5" />
              <span>Careers &amp; Opportunities</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground">
              Work With Budget Ndio Story
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              We are constantly seeking passionate podcast hosts, scriptwriters, videographers, animators, and civic technologists to join our youth-led creative network.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button asChild size="lg" className="gap-2 font-bold shadow-xs">
              <Link href="/careers">
                <span>Explore Careers</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact?intent=partner">
                <span>Partner With Us</span>
              </Link>
            </Button>
          </div>
        </LandingContent>
      </LandingSection>
    </div>
  );
};

export default About;
