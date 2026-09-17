"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  CheckCircle2,
  Users,
  Compass,
  FileSearch,
  Building2,
  Mail,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import { EditorialPill } from "@/components/ui/editorial";
import { THEME_MOTION_PROFILES } from "@/motion/theme-motion";

const motionProfile = THEME_MOTION_PROFILES.default;

export function ObamaOrgShowcase() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
  };

  return (
    <div className="w-full bg-background text-foreground selection:bg-primary/20 selection:text-primary min-h-screen">
      {/* 1. Civic Movement Top Ribbon */}
      <aside aria-label="Announcement" className="w-full bg-primary/10 border-b border-primary/20 py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs font-medium">
          <div className="flex items-center gap-2.5">
            <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-foreground">
              FY2025/2026 Devolution Audit:
            </span>
            <span className="text-muted-foreground hidden sm:inline">
              Citizen assembly clinics now active in Nakuru, Kisumu, and Mombasa.
            </span>
          </div>
          <Link
            href="/connect"
            className="inline-flex items-center gap-1 text-primary font-semibold hover:underline shrink-0"
          >
            Attend Assembly <ArrowRight className="size-3" />
          </Link>
        </div>
      </aside>

      {/* 2. The Sovereign Split Hero */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 border-b border-border/60 overflow-hidden">
        {/* Subtle background ambient gradients */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute -top-24 -left-24 size-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute top-1/2 -right-24 size-96 rounded-full bg-amber-500/10 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Thesis & Action */}
            <motion.div
              initial={motionProfile.fadeUp.initial}
              animate={motionProfile.fadeUp.animate}
              transition={motionProfile.transition}
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex items-center gap-2">
                <EditorialPill variant="default">
                  CIVIC MOVEMENT · BUDGET NDIO STORY
                </EditorialPill>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.08]">
                Hope is not a passive sentiment.{" "}
                <span className="text-primary italic font-serif">It is civic work.</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                We organize grassroots citizens, investigative journalists, and youth across
                Kenya&apos;s 47 counties to transform public budgets from closed backroom documents
                into open, community-verified wealth.
              </p>

              {/* Dual Action Group */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full px-8 font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  <Link href="/programmes">
                    Explore The Work <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full px-7 font-semibold border-border hover:bg-muted/50"
                >
                  <Link href="/connect">Join An Assembly</Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-border/60 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" />
                  <span>100% Verified Open Data</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-primary" />
                  <span>Non-Partisan Grassroots Coalition</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Sovereign Media Anchor */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...motionProfile.transition, delay: 0.15 }}
              className="lg:col-span-5"
            >
              <div className="relative rounded-3xl overflow-hidden border border-border/80 bg-gradient-to-br from-card via-card/90 to-muted/40 p-3 shadow-xl">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden relative bg-muted/60 flex flex-col justify-end p-6 border border-border/40">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
                  
                  {/* Visual simulated hero artwork */}
                  <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />

                  <div className="relative z-20 space-y-2 text-white">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-white font-semibold">
                      <Sparkles className="size-3 text-amber-300" />
                      Community Action In Real Time
                    </span>
                    <h3 className="text-xl font-bold leading-snug">
                      Nakuru Ward Citizen Budget Clinic
                    </h3>
                    <p className="text-xs text-white/80 leading-relaxed">
                      Community members cross-examining municipal dispensary invoices against county statutory accounts.
                    </p>
                  </div>
                </div>

                {/* Sub-card metadata strip */}
                <div className="p-4 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-primary" />
                    <span className="font-medium text-foreground">Next Assembly: Oct 24, 2026</span>
                  </div>
                  <Link
                    href="/connect"
                    className="text-primary hover:underline font-semibold flex items-center gap-1"
                  >
                    RSVP Free <ChevronRightIcon className="size-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. The Three Movement Pillars */}
      <section className="py-20 border-b border-border/60 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12 space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
              THE THREE TENETS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              How We Build People-Powered Accountability
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Real institutional change cannot rely on sporadic outrage. It requires an interlocking,
              scalable civic infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                index: "01 / LITERACY",
                icon: Compass,
                title: "Civic Budget Literacy",
                description:
                  "Translating opaque Treasury estimates, debt repayment ceilings, and county fiscal papers into human, pocket-sized citizen briefs.",
                href: "/learn",
              },
              {
                index: "02 / FORENSICS",
                icon: FileSearch,
                title: "Investigative Newsrooms",
                description:
                  "Embedding data reporters inside county newsrooms to unearth public procurement fraud, tender rigging, and ghost capital projects.",
                href: "/programmes/wanahabari-lab",
              },
              {
                index: "03 / GRASSROOTS",
                icon: Users,
                title: "Community Assemblies",
                description:
                  "Convening decentralized ward town halls where residents, elders, and young auditors present audited ledgers directly to elected leaders.",
                href: "/programmes/mashinani",
              },
            ].map((pillar) => (
              <motion.div
                key={pillar.index}
                whileHover={{ y: -4 }}
                transition={motionProfile.transition}
                className="rounded-2xl border border-border/70 bg-card p-8 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary tracking-widest uppercase">
                      {pillar.index}
                    </span>
                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <pillar.icon className="size-5" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-foreground">{pillar.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <Link
                  href={pillar.href}
                  className="inline-flex items-center text-xs font-semibold text-primary hover:underline pt-2"
                >
                  Explore Pillar <ArrowRight className="ml-1.5 size-3" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Spotlight Initiatives (Bento Deck) */}
      <section className="py-20 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div className="space-y-2 max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
                ACTIVE PROGRAMMES
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Frontline Initiatives Driving Verifiable Change
              </h2>
            </div>
            <Button asChild variant="outline" className="rounded-full shrink-0">
              <Link href="/programmes">
                View All Programmes <ArrowRight className="ml-2 size-3.5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                tag: "BNS CONNECT",
                badge: "Institutional Lab",
                title: "Policy & Multi-Stakeholder Research",
                body: "Independent fiscal research tracking national debt, statutory obligations, and Treasury bond absorption with universities and global think-tanks.",
                link: "/programmes/connect",
              },
              {
                tag: "BNS MASHINANI",
                badge: "47 Counties",
                title: "Grassroots Town Halls & Ward Audits",
                body: "Empowering citizens with field verification toolkits to audit ward dispensaries, water boreholes, and school facilities on the ground.",
                link: "/programmes/mashinani",
              },
              {
                tag: "WANAHABARI LAB",
                badge: "Journalism Lab",
                title: "Investigative Reporting Fellowships",
                body: "Providing stipends, forensic financial coaching, and legal protection to reporters investigating multimillion-shilling procurement scams.",
                link: "/programmes/wanahabari-lab",
              },
            ].map((init) => (
              <div
                key={init.tag}
                className="group rounded-2xl border border-border/80 bg-card p-6 flex flex-col justify-between space-y-6 hover:border-primary/50 transition-all shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
                      {init.tag}
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {init.badge}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {init.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed sm:text-sm">
                    {init.body}
                  </p>
                </div>

                <Link
                  href={init.link}
                  className="inline-flex items-center text-xs font-semibold text-primary hover:underline pt-2"
                >
                  Programme Details <ArrowRight className="ml-1 size-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. People-First Voice (Frontline Testimony) */}
      <section className="py-20 border-b border-border/60 bg-muted/15">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex size-12 rounded-full bg-primary/10 items-center justify-center text-primary mx-auto">
            <Building2 className="size-6" />
          </div>

          <blockquote className="text-2xl sm:text-3xl font-medium font-serif italic text-foreground leading-relaxed">
            &ldquo;Before Budget Ndio Story held a budget clinic in our ward, we were told our
            local dispensary had no medicine due to national supply delays. When we checked the county
            expenditure books together, we uncovered KSh 18 Million had been allocated months earlier.
            We presented the receipts, and within three weeks, the supplies arrived.&rdquo;
          </blockquote>

          <div className="space-y-1">
            <cite className="not-italic font-bold text-base text-foreground block">
              Faith Muthoni
            </cite>
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-mono">
              Citizen Auditor & Community Organizer · Nakuru County
            </span>
          </div>
        </div>
      </section>

      {/* 6. The Civic Impact Ledger (4-Metric Grid) */}
      <section className="py-16 border-b border-border/60 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
              VERIFIED IMPACT RECORD
            </span>
            <h3 className="text-2xl font-bold text-foreground tracking-tight">
              Evidence Across 47 Counties
            </h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { value: "47", label: "Counties Monitored", note: "Full national scope" },
              { value: "KSh 4.2B", label: "Audited Expenditure", note: "County & national budgets" },
              { value: "12,400+", label: "Citizens Mobilized", note: "Town hall participants" },
              { value: "350+", label: "Forensic Investigations", note: "Published briefs & reports" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="border-l-2 border-primary/50 pl-5 space-y-1 py-1"
              >
                <div className="font-mono text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-foreground">
                  {stat.label}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {stat.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Action Band: The BNS Dispatch */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border/80 bg-card p-8 sm:p-12 shadow-sm text-center space-y-6">
            <div className="space-y-3 max-w-2xl mx-auto">
              <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
                THE BNS DISPATCH
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Join 25,000+ citizens building an accountable Kenya.
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Receive weekly verified budget breakdowns, county town hall schedules, and
                investigative dispatches direct to your inbox. No spam. 100% public interest.
              </p>
            </div>

            {subscribed ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 max-w-md mx-auto flex items-center justify-center gap-2 text-sm font-semibold">
                <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
                <span>You are subscribed to the BNS Dispatch. Karibu!</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2"
              >
                <div className="relative w-full">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border/80 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <Button
                  type="submit"
                  size="default"
                  className="rounded-full px-6 font-semibold shrink-0 w-full sm:w-auto"
                >
                  Subscribe Free
                </Button>
              </form>
            )}

            <div className="flex justify-center items-center gap-6 pt-4 text-xs text-muted-foreground">
              <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
              <span>•</span>
              <Link href="/programmes" className="hover:underline">Explore Programmes</Link>
              <span>•</span>
              <Link href="/cms" className="hover:underline">CMS Management</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}
