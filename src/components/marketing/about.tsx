"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  Compass,
  MapPin,
  Newspaper,
  Clapperboard,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  TrendingUp,
  Landmark,
  Users,
  Target,
  FileBarChart,
  Volume2,
  HeartHandshake,
} from "lucide-react";
import { PillButtonGroup } from "@/components/ui/editorial";
import { LandingContent, LandingSection } from "@/layouts/landing-section";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { HERO_SECTION_PADDING, SECTION_SHELL_INNER, SECTION_SHELL_PADDING } from "@/layouts/section-shell";
import { GsapHeroChoreography } from "@/motion/gsap";
import { aboutContent } from "@/content";
import TeamSection from "@/components/marketing/team-section";
import ConsortiumFoundersSection from "@/components/marketing/consortium-founders-section";
import { BNS_COMMUNITY_IMAGES, BNS_MEDIA_IMAGES } from "@/constants/bns-media-images";
import { cn } from "@/utils";

const IMPACT_STAGES = [
  {
    step: "01",
    title: "Investigate & Mine",
    description:
      "Forensic scrutiny of Controller of Budget (OCOB) reports, National Treasury estimates, Auditor General findings, and county CBROPs before money disappears.",
    icon: Landmark,
    badge: "Primary Data",
  },
  {
    step: "02",
    title: "Translate & Package",
    description:
      "Transforming 800-page fiscal bills into bilingual podcasts, viral short-form TikToks, visual explainers, and one-page citizen briefs.",
    icon: Clapperboard,
    badge: "Creative Media",
  },
  {
    step: "03",
    title: "Mobilize on the Ground",
    description:
      "Hosting town halls, county civic forums, and youth assemblies across Kakamega, Kilifi, Nakuru, and Wajir to empower local taxpayers.",
    icon: Users,
    badge: "Grassroots Action",
  },
  {
    step: "04",
    title: "Enforce & Hold Accountable",
    description:
      "Filing formal public participation submissions to the National Assembly, petitioning county assemblies, and partnering with investigative newsrooms.",
    icon: ShieldCheck,
    badge: "Civic Power",
  },
];

const DESKS = [
  {
    id: "connect",
    name: "BNS Connect",
    desk: "National Accountability Desk",
    desc: "Decodes the National Budget, Finance Bill, and parliamentary appropriations. Mobilizes citizen submissions before bills become law.",
    icon: Compass,
    href: "/programmes/connect",
    stat: "KES 4.82T",
    statLabel: "National spending tracked",
  },
  {
    id: "mashinani",
    name: "BNS Mashinani",
    desk: "County Scrutiny Desk",
    desc: "Deep-dive budget tracking in Kakamega, Kilifi, Nakuru, and Wajir. Produces quarterly citizen scorecards and village-level town halls.",
    icon: MapPin,
    href: "/programmes/mashinani",
    stat: "4 Hubs",
    statLabel: "Focus devolution counties",
  },
  {
    id: "wanahabari",
    name: "Wanahabari Lab",
    desk: "Investigative Newsroom Desk",
    desc: "Trains journalists and citizen reporters to follow public funds. Provides data tools, leak-verification frameworks, and research fellowships.",
    icon: Newspaper,
    href: "/programmes/wanahabari-lab",
    stat: "120+",
    statLabel: "Journalists & fellows trained",
  },
  {
    id: "studios",
    name: "BNS Studios",
    desk: "Impact Production Desk",
    desc: "Commissioned audio-visual production powerhouse. Every commercial commission directly subsidizes grassroots budget tracking in 47 counties.",
    icon: Clapperboard,
    href: "/bns-studio",
    stat: "100%",
    statLabel: "Surplus funded back to mission",
  },
];

const CHARTER_PRINCIPLES = [
  {
    title: "Zero Partisan Bias",
    desc: "We follow the public money, not political factions. Our loyalty is strictly to Article 201 of the Constitution of Kenya and the Kenyan taxpayer.",
  },
  {
    title: "Primary Source Verification",
    desc: "Every data point is cross-verified against official documents from the National Treasury, OCOB, CRA, Auditor General, and parliamentary Hansards.",
  },
  {
    title: "Open-Source Civic Intelligence",
    desc: "All simplified data models, scorecards, and learning modules are published free of charge. No paywalls between citizens and public information.",
  },
  {
    title: "Double-Impact Commercial Ethics",
    desc: "BNS Studios charges fair market rates to external institutions for creative productions, reinvesting 100% of proceeds into grassroots watchdog operations.",
  },
];

export default function About() {
  const { hero, mission, photoStrip } = aboutContent;

  return (
    <div className="w-full bg-background min-h-screen text-foreground">
      {/* 01 — Hero & Institutional Credo */}
      <section className={cn(HERO_SECTION_PADDING, "border-b border-border/30 bg-background")}>
        <div className={SECTION_SHELL_INNER}>
          <GsapHeroChoreography className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
            <div data-gsap-hero-content className="flex flex-col gap-5 lg:col-span-7">
              <span className={cn(T.eyebrow, "inline-flex items-center gap-2")}>
                <span className="size-2 rounded-full bg-primary animate-pulse" />
                Kenya&apos;s Sovereign Youth Budget Watchdog
              </span>
              <h1 className={cn(T.heroTitle, "text-balance text-foreground")}>
                We follow Kenya&apos;s public money so it cannot move in the dark.
              </h1>
              <p className={cn(T.lead, "max-w-2xl text-foreground/75")}>
                Budget Ndio Story was founded by young Kenyans to dismantle the culture of budget secrecy. We track KSh 4.82 Trillion in national and county spending, transforming opaque fiscal policy into forensic investigations, viral media, and citizen accountability.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <PillButtonGroup href="/programmes" label="Explore the 4 Desks" />
                <PillButtonGroup href="#origin-story" label="Our Origin Story" />
              </div>

              <div className="grid max-w-lg grid-cols-3 gap-4 border-t border-border/40 pt-6">
                <div>
                  <p className="font-heading text-2xl font-bold text-foreground md:text-3xl">100%</p>
                  <p className={cn(T.caption, "mt-1 text-muted-foreground")}>Youth-Led & Managed</p>
                </div>
                <div>
                  <p className="font-heading text-2xl font-bold text-primary md:text-3xl">47</p>
                  <p className={cn(T.caption, "mt-1 text-muted-foreground")}>Counties Tracked</p>
                </div>
                <div>
                  <p className="font-heading text-2xl font-bold text-foreground md:text-3xl">20k+</p>
                  <p className={cn(T.caption, "mt-1 text-muted-foreground")}>Citizens in Ground Forums</p>
                </div>
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
                <span>Youth Budget Assembly</span>
                <span className="font-medium text-primary">Nairobi, Kenya</span>
              </div>
            </div>
          </GsapHeroChoreography>
        </div>
      </section>

      {/* 02 — The Origin Story: From Street Rage to Fiscal Scrutiny */}
      <section id="origin-story" className="border-b border-border/40 py-20 md:py-28 bg-muted/20">
        <div className={SECTION_SHELL_INNER}>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className={T.eyebrow}>The Awakening</span>
              <h2 className={cn(T.sectionTitle, "text-balance")}>
                From Street Rage to Forensic Institutional Oversight.
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-foreground/80 md:text-lg">
                <p>
                  In June 2024, millions of young Kenyans took to the streets to reject punitive tax proposals in the Finance Bill. It was a turning point in East African history. But as the teargas cleared, a deeper realization took hold among our founders:
                </p>
                <blockquote className="border-l-4 border-primary pl-4 font-semibold italic text-foreground text-lg md:text-xl py-1">
                  &ldquo;Protesting after a bill is gazetted is too late. Citizens must master the budget cycle 12 months in advance — before the money is stolen or misallocated.&rdquo;
                </blockquote>
                <p>
                  Public finance in Kenya has historically been locked behind deliberate opacity: 800-page Budget Policy Statements (BPS), confusing technical acronyms (CIDP, CFSP, CBROP), and rubber-stamp parliamentary public participation hearings.
                </p>
                <p>
                  Budget Ndio Story was built to smash that barrier forever. We combine forensic accounting with street-smart creative media so that a 19-year-old in Kakamega or Kilifi has the exact same fiscal intelligence as a Member of Parliament.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-border/50 shadow-md">
                <Image
                  src={BNS_COMMUNITY_IMAGES.forumA}
                  alt="Town hall community forum"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-border/50 shadow-md">
                  <Image
                    src={BNS_COMMUNITY_IMAGES.cohortA}
                    alt="Youth cohort training"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="rounded-2xl border border-border/40 bg-card p-4 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">Key Takeaway</p>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Budget literacy is the highest form of civic defense. When citizens track the budget, governance improves.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — The 4 Operational Desks */}
      <section className="border-b border-border/40 py-20 md:py-28 bg-background">
        <div className={SECTION_SHELL_INNER}>
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className={T.eyebrow}>Our Engine</span>
            <h2 className={T.sectionTitle}>Four Desks, One Purpose.</h2>
            <p className={cn(T.lead, "text-muted-foreground")}>
              Each desk attacks fiscal opacity from a distinct angle, forming an unbroken loop of citizen empowerment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DESKS.map((desk) => {
              const Icon = desk.icon;
              return (
                <div
                  key={desk.id}
                  className="group flex flex-col justify-between rounded-3xl border border-border/50 bg-card p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-xl"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex size-12 items-center justify-center rounded-2xl border border-border/50 bg-muted text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon className="size-6" />
                      </div>
                      <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                        {desk.stat}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{desk.desk}</p>
                      <h3 className="mt-1 text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                        {desk.name}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {desk.desc}
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-border/40 flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">{desk.statLabel}</span>
                    <Link
                      href={desk.href}
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                    >
                      Explore Desk
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 04 — Theory of Change: The 4-Stage Impact Engine */}
      <section id="theory-of-change" className="border-b border-border/40 py-20 md:py-28 bg-muted/20">
        <div className={SECTION_SHELL_INNER}>
          <div className="max-w-2xl mb-16 space-y-3">
            <span className={T.eyebrow}>Theory of Change</span>
            <h2 className={T.sectionTitle}>How Forensic Data Becomes Citizen Power.</h2>
            <p className={cn(T.lead, "text-muted-foreground")}>
              We do not stop at generating infographics. We build the complete institutional pathway from initial investigation to binding legal and budget revisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {IMPACT_STAGES.map((stage) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.step}
                  className="flex flex-col justify-between rounded-3xl border border-border/50 bg-card p-6 shadow-sm"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-extrabold text-primary">{stage.step}</span>
                      <span className="rounded-full border border-border/40 bg-muted px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {stage.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{stage.title}</h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {stage.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 05 — Cumulative Impact Ledger */}
      <section className="border-b border-border/40 py-20 md:py-28 bg-background">
        <div className={SECTION_SHELL_INNER}>
          <div className="rounded-3xl border border-primary/20 bg-primary/[0.03] p-8 md:p-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <p className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">KSh 4.82T</p>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">National Budget Tracked</p>
                <p className="text-xs text-muted-foreground">Audited down to sector votes, development ceilings, and KRA collections.</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">KSh 1.20T</p>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">Public Debt Scrutinized</p>
                <p className="text-xs text-muted-foreground">Tracking consolidated fund services, Eurobond amortizations, and domestic debt.</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">4 Counties</p>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">Focus County Hubs</p>
                <p className="text-xs text-muted-foreground">Dedicated field teams in Kakamega, Kilifi, Nakuru, and Wajir.</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">20,400+</p>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">Citizens Directly Reached</p>
                <p className="text-xs text-muted-foreground">Through town halls, youth workshops, barazas, and physical scorecards.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 06 — Data Integrity & Editorial Independence Charter */}
      <section id="methodology" className="border-b border-border/40 py-20 md:py-28 bg-muted/20">
        <div className={SECTION_SHELL_INNER}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className={T.eyebrow}>Governance & Ethics</span>
              <h2 className={T.sectionTitle}>
                Our Charter of Integrity.
              </h2>
              <p className={cn(T.lead, "text-muted-foreground")}>
                When challenging power and tracking public billions, accuracy is our armor. We hold ourselves to forensic journalistic standards.
              </p>
              <div className="rounded-2xl border border-border/40 bg-card p-5 space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <ShieldCheck className="size-4" />
                  <span>Constitutional Anchor</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Rooted in Article 201 (Principles of Public Finance) and Article 35 (Access to Information) of the Constitution of Kenya, 2010.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CHARTER_PRINCIPLES.map((principle) => (
                <div
                  key={principle.title}
                  className="rounded-2xl border border-border/50 bg-card p-6 space-y-2 shadow-sm"
                >
                  <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                    <CheckCircle2 className="size-4 text-primary shrink-0" />
                    <span>{principle.title}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {principle.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 07 — Photo Strip: Documenting the Movement in the Field */}
      <section className={cn(SECTION_SHELL_PADDING, "border-b border-border/40 bg-background")}>
        <div className={SECTION_SHELL_INNER}>
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className={T.eyebrow}>In The Field</span>
            <h3 className="text-2xl font-bold tracking-tight text-foreground">Documenting the Movement</h3>
            <p className="text-xs text-muted-foreground">Moments from citizen town halls, county assemblies, and youth cohorts nationwide.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {photoStrip.images.map((src, index) => (
              <div
                key={src + index}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/30 bg-muted/20 md:rounded-3xl transition-all duration-300 hover:border-primary/40 hover:shadow-lg"
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

      {/* 08 — Consortium Founding Partners */}
      <div id="consortium-founders">
        <ConsortiumFoundersSection />
      </div>

      {/* 09 — Team Roster Showcase */}
      <div id="team">
        <TeamSection />
      </div>

      {/* 10 — High-Conversion Civic Action & Partnership Portal */}
      <section className="py-20 md:py-28 bg-muted/30 border-t border-border/40">
        <div className={SECTION_SHELL_INNER}>
          <div className="rounded-3xl border border-border/60 bg-card p-8 md:p-14 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <span className={cn(T.eyebrow, "inline-flex items-center gap-2")}>
                  <HeartHandshake className="size-3.5 text-primary" />
                  Civic Collaboration
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                  Partner with Kenya&apos;s leading budget watchdog.
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Whether you are a development partner seeking to fund county accountability, a newsroom looking to co-publish an investigation, or a citizen wanting to bring BNS to your ward — there is a place for you.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Partner With Us
                </Link>
                <Link
                  href="/careers"
                  className="inline-flex items-center justify-center rounded-full border border-border/60 bg-background px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  Join Creative Network
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
