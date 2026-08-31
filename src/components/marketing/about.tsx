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
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-muted/30 via-background to-background pt-24 pb-16 md:pt-32 md:pb-24">
        {/* Subtle ambient accent glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/4 -z-10 h-72 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />

        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 flex flex-col gap-5 animate-fade-in">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary w-fit backdrop-blur-md">
                <Compass className="size-3.5" />
                <span>{hero.eyebrow}</span>
              </div>
              <h1 className={cn(T.heroTitle, "text-foreground font-heading tracking-tight leading-[1.08]")}>
                {hero.title}
              </h1>
              <p className={cn(T.lead, "max-w-2xl text-base text-muted-foreground md:text-lg leading-relaxed")}>
                {hero.body}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button asChild size="lg" className="gap-2 font-bold shadow-xs">
                  <Link href="/programmes">
                    <span>Explore Programmes</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#consortium-founders">
                    <span>Meet Our Founders</span>
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/40 max-w-lg">
                <div>
                  <p className="font-heading text-2xl md:text-3xl font-extrabold text-foreground">100%</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">Youth-Led</p>
                </div>
                <div>
                  <p className="font-heading text-2xl md:text-3xl font-extrabold text-primary">47</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">Counties Tracked</p>
                </div>
                <div>
                  <p className="font-heading text-2xl md:text-3xl font-extrabold text-foreground">20k+</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">Civic Reach</p>
                </div>
              </div>
            </div>

            {/* Right Column: Sharp, framed hero visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border/70 bg-muted shadow-xl">
                <Image
                  src={hero.image}
                  alt={hero.imageAlt}
                  fill
                  priority
                  className="object-cover object-top hover:scale-102 transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground px-1">
                <span>Youth Civic Engagement Session</span>
                <span className="font-medium text-primary">Nairobi, Kenya</span>
              </div>
            </div>
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
