"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LandingContent,
  LandingSection,
} from "@/layouts/landing-section";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { SECTION_SHELL_INNER, SECTION_SHELL_PADDING } from "@/layouts/section-shell";
import { GsapHeroChoreography } from "@/motion/gsap";
import { aboutContent } from "@/content";
import TeamSection from "@/components/marketing/team-section";
import ConsortiumFoundersSection from "@/components/marketing/consortium-founders-section";
import { cn } from "@/utils";

const About = () => {
  const { hero, mission, photoStrip } = aboutContent;

  return (
    <div className="w-full bg-background min-h-screen">
      {/* Hero Section */}
      <section className={cn(SECTION_SHELL_PADDING, "border-b border-border/40 bg-background pt-24 md:pt-28")}>
        <div className={SECTION_SHELL_INNER}>
          <GsapHeroChoreography className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div data-gsap-hero-content className="flex flex-col gap-5 lg:col-span-7">
              <span className={T.eyebrow}>{hero.eyebrow}</span>
              <h1 className={cn(T.heroTitle, "text-balance text-foreground")}>
                {hero.title}
              </h1>
              <p className={cn(T.lead, "max-w-2xl text-foreground/75")}>
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

              <div className="grid max-w-lg grid-cols-3 gap-4 border-t border-border/40 pt-6">
                <div>
                  <p className="font-heading text-2xl font-bold text-foreground md:text-3xl">100%</p>
                  <p className={cn(T.caption, "mt-1 text-muted-foreground")}>Youth-led</p>
                </div>
                <div>
                  <p className="font-heading text-2xl font-bold text-primary md:text-3xl">47</p>
                  <p className={cn(T.caption, "mt-1 text-muted-foreground")}>Counties tracked</p>
                </div>
                <div>
                  <p className="font-heading text-2xl font-bold text-foreground md:text-3xl">20k+</p>
                  <p className={cn(T.caption, "mt-1 text-muted-foreground")}>Civic reach</p>
                </div>
              </div>
            </div>

            <div data-gsap-hero-media className="lg:col-span-5">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border/70 bg-muted shadow-xl sm:aspect-[16/11] lg:aspect-[4/3]">
                <Image
                  src={hero.image}
                  alt={hero.imageAlt}
                  fill
                  priority
                  className="object-cover object-top transition-transform duration-700 ease-out hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              </div>
              <div className="mt-3 flex items-center justify-between px-1 text-xs text-muted-foreground">
                <span>Youth Civic Engagement Session</span>
                <span className="font-medium text-primary">Nairobi, Kenya</span>
              </div>
            </div>
          </GsapHeroChoreography>
        </div>
      </section>

      {/* Mission Statement Section */}
      <LandingSection spacing="default">
        <LandingContent className="grid gap-8 md:grid-cols-12 md:gap-12 items-center">
          <div className="md:col-span-5 space-y-3">
            <span className={T.eyebrow}>Our purpose and impact</span>
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
      <section className={cn(SECTION_SHELL_PADDING, "border-b border-border/40")}>
        <div className={SECTION_SHELL_INNER}>
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
            <span className={cn(T.eyebrow, "inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1")}>
              <Briefcase className="size-3.5" />
              Careers and opportunities
            </span>
            <h2 className={T.sectionTitle}>Work with Budget Ndio Story</h2>
            <p className={cn(T.lead, "text-sm text-foreground/75")}>
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
