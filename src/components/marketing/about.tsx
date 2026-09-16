"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  HeartHandshake,
} from "lucide-react";
import { EditorialPill, PillButtonGroup } from "@/components/ui/editorial";
import {
  StickyStackedCycle,
  NarrativeScrollytellingCanvas,
  type NarrativeBeat,
  type StickyCycleItem,
} from "@/components/motion";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { HERO_SECTION_PADDING, SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { GsapHeroChoreography } from "@/motion/gsap";
import { aboutContent, landingSectionsContent } from "@/content";
import TeamSection from "@/components/marketing/team-section";
import { BNS_COMMUNITY_IMAGES } from "@/constants/bns-media-images";
import { isSectionVisible } from "@/lib/partner-page-cms";
import type {
  AboutContent,
  LandingSectionsContent,
  PartnerPageSectionsContent,
} from "@/lib/cms-live-data";
import { cn } from "@/utils";

const COMMUNITY_IMAGE_KEYS = BNS_COMMUNITY_IMAGES as Record<string, string>;

function mapTheoryItems(
  items: Array<{
    id: string;
    step: string;
    title: string;
    description: string;
    badge?: string;
    imageKey?: string;
    imageAlt?: string;
    stat?: StickyCycleItem["stat"];
    cta?: StickyCycleItem["cta"];
  }>,
): StickyCycleItem[] {
  return items.map((item) => {
    const image = item.imageKey ? COMMUNITY_IMAGE_KEYS[item.imageKey] : undefined;

    return {
      id: item.id,
      step: item.step,
      title: item.title,
      description: item.description,
      badge: item.badge,
      image,
      imageAlt: item.imageAlt,
      stat: item.stat,
      cta: item.cta,
    };
  });
}

export type AboutProps = {
  aboutData?: AboutContent;
  landingSections?: LandingSectionsContent;
  sectionsConfig?: PartnerPageSectionsContent;
};

export default function About({
  aboutData,
  landingSections,
  sectionsConfig,
}: AboutProps = {}) {
  const about = aboutData ?? aboutContent;
  const sections = landingSections ?? landingSectionsContent;
  const { hero } = about;

  const show = (sectionId: string) =>
    isSectionVisible("about", sectionId, sectionsConfig);

  const showOriginStory = show("originStory");
  const showTheoryOfChange = show("theoryOfChange");
  const showIntegrityCharter = show("integrityCharter");
  const showTeam = show("team");
  const showPartnerCta = show("partnerCta");

  const charterPrinciples = sections.aboutCharter.principles as Array<{
    title: string;
    description: string;
  }>;
  const narrativeBeats = sections.aboutNarrative as NarrativeBeat[];
  const theory = (sections as LandingSectionsContent & {
    aboutTheoryOfChange?: {
      eyebrow?: string;
      title?: string;
      description?: string;
      cta?: { label: string; href: string };
      items: Array<{
        id: string;
        step: string;
        title: string;
        description: string;
        badge?: string;
        imageKey?: string;
        imageAlt?: string;
        stat?: StickyCycleItem["stat"];
        cta?: StickyCycleItem["cta"];
      }>;
    };
  }).aboutTheoryOfChange ??
    (landingSectionsContent as typeof sections & {
      aboutTheoryOfChange?: {
        items: Array<{
          id: string;
          step: string;
          title: string;
          description: string;
          badge?: string;
          imageKey?: string;
          imageAlt?: string;
          stat?: StickyCycleItem["stat"];
          cta?: StickyCycleItem["cta"];
        }>;
        eyebrow?: string;
        title?: string;
        description?: string;
        cta?: { label: string; href: string };
      };
    }).aboutTheoryOfChange;
  const theoryItems = mapTheoryItems(theory?.items ?? []);

  return (
    <div className="w-full bg-background min-h-screen text-foreground">
      {/* 01 - Hero & Institutional Credo */}
      <section className={cn(HERO_SECTION_PADDING, "border-b border-border/30 bg-background")}>
        <div className={SECTION_SHELL_INNER}>
          <GsapHeroChoreography className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
            <div data-gsap-hero-content className="flex flex-col items-start gap-4 lg:col-span-7">
              <EditorialPill variant="default">
                {sections.aboutHero.pill}
              </EditorialPill>
              <h1 className={cn(T.heroTitle, "text-balance text-foreground")}>
                {sections.aboutHero.title}
              </h1>
              <p className={cn(T.lead, "max-w-2xl text-foreground/75")}>
                {sections.aboutHero.description}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 w-full sm:w-auto">
                <PillButtonGroup
                  href={sections.aboutHero.ctaHref ?? "/programmes"}
                  label={sections.aboutHero.ctaLabel ?? "Explore Programmes"}
                  variant="primary"
                  className="w-full sm:w-auto justify-center"
                />
                {showOriginStory ? (
                  <PillButtonGroup
                    href="#origin-story"
                    label={sections.aboutHero.originStoryLabel ?? "Our Origin Story"}
                    variant="outline"
                    className="w-full sm:w-auto justify-center"
                  />
                ) : (
                  <PillButtonGroup
                    href="#team"
                    label={sections.aboutHero.teamLabel ?? "Meet the team"}
                    variant="outline"
                    className="w-full sm:w-auto justify-center"
                  />
                )}
              </div>

              <div className="grid max-w-lg grid-cols-3 gap-4 border-t border-border/40 pt-6">
                {(sections.aboutHero.stats as Array<{ value: string; label: string }>).map((stat) => (
                  <div key={stat.label}>
                    <p className="font-heading text-2xl font-bold text-foreground md:text-3xl">{stat.value}</p>
                    <p className={cn(T.caption, "mt-1 text-muted-foreground")}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div data-gsap-hero-media className="lg:col-span-5">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border/40 bg-muted md:aspect-[16/11] lg:aspect-[4/3] shadow-xl">
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
                <span>{sections.aboutHero.imageCaption}</span>
                <span className="font-medium text-primary">{sections.aboutHero.imageLocation}</span>
              </div>
            </div>
          </GsapHeroChoreography>
        </div>
      </section>

      {/* 02 - The Origin Story: Narrative Scrollytelling Documentary (muted: TMI) */}
      {showOriginStory ? (
        <section id="origin-story" className="border-b border-border/40 bg-muted/10">
          <div className={SECTION_SHELL_INNER}>
            <NarrativeScrollytellingCanvas beats={narrativeBeats} mediaPosition="right" />
          </div>
        </section>
      ) : null}

      {/* 03 - Theory of Change: The 4-Stage Impact Engine (muted: TMI / scroll-heavy) */}
      {showTheoryOfChange && theory && theoryItems.length > 0 ? (
        <section id="theory-of-change" className="border-b border-border/40 py-20 md:py-28 lg:py-36 bg-muted/20">
          <div className={SECTION_SHELL_INNER}>
            <StickyStackedCycle
              eyebrow={theory.eyebrow}
              title={theory.title}
              description={theory.description}
              items={theoryItems}
              cta={theory.cta}
            />
          </div>
        </section>
      ) : null}

      {/* 04 - Data Integrity & Editorial Independence Charter (muted: TMI) */}
      {showIntegrityCharter ? (
        <section id="methodology" className="border-b border-border/40 py-20 md:py-28 bg-background">
          <div className={SECTION_SHELL_INNER}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 space-y-6">
                <span className={T.eyebrow}>{sections.aboutCharter.eyebrow}</span>
                <h2 className={T.sectionTitle}>
                  {sections.aboutCharter.title}
                </h2>
                <p className={cn(T.lead, "text-muted-foreground")}>
                  {sections.aboutCharter.description}
                </p>
                <div className="rounded-2xl border border-border/40 bg-card p-5 space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <ShieldCheck className="size-4" />
                    <span>{sections.aboutCharter.anchorLabel}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {sections.aboutCharter.anchorDescription}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {charterPrinciples.map((principle) => (
                  <div
                    key={principle.title}
                    className="rounded-2xl border border-border/50 bg-card p-6 space-y-2 shadow-sm"
                  >
                    <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                      <CheckCircle2 className="size-4 text-primary shrink-0" />
                      <span>{principle.title}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {principle.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* 05 - Team Roster Showcase */}
      {showTeam ? (
        <div id="team">
          <TeamSection />
        </div>
      ) : null}

      {/* 06 - Civic Action & Partnership Portal */}
      {showPartnerCta ? (
        <section className="border-t border-border/40 bg-muted/20 py-20 md:py-28">
          <div className={SECTION_SHELL_INNER}>
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl space-y-4">
                <span className={cn(T.eyebrow, "inline-flex items-center gap-2")}>
                  <HeartHandshake className="size-3.5 text-primary" />
                  {sections.aboutPartnerCta.pill}
                </span>
                <h2 className={cn(T.sectionTitle, "text-foreground")}>
                  {sections.aboutPartnerCta.heading}
                </h2>
                <p className={cn(T.lead, "text-muted-foreground")}>
                  {sections.aboutPartnerCta.description}
                </p>
              </div>

              <div className="flex shrink-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <Link
                  href={sections.aboutPartnerCta.primaryCta.href}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {sections.aboutPartnerCta.primaryCta.label}
                </Link>
                <Link
                  href={sections.aboutPartnerCta.secondaryCta.href}
                  className="inline-flex items-center justify-center rounded-full border border-border/60 bg-background px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {sections.aboutPartnerCta.secondaryCta.label}
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
