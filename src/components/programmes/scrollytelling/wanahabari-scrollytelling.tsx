"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  FileText,
  Eye,
  ShieldCheck,
  Newspaper,
  Terminal,
  ExternalLink,
  Unlock,
} from "lucide-react";
import { motion } from "motion/react";
import { EditorialPill } from "@/components/ui/editorial/editorial-pill";
import { PillButtonGroup } from "@/components/ui/editorial/pill-button-group";
import { BNS_MEDIA_IMAGES, BNS_COMMUNITY_IMAGES } from "@/constants/bns-media-images";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";

interface RedactedItemProps {
  redactedId: string;
  classification: string;
  sourceDoc: string;
  hiddenAmount: string;
  findingHeadline: string;
  findingDetail: string;
  impactNote: string;
}

function RedactedInvestigationFold({
  redactedId,
  classification,
  sourceDoc,
  hiddenAmount,
  findingHeadline,
  findingDetail,
  impactNote,
}: RedactedItemProps) {
  const [unredacted, setUnredacted] = useState(false);

  return (
    <div className="py-16 md:py-24 border-t border-border/40 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2.5 py-1 rounded-sm bg-red-500/10 text-red-600 dark:text-red-400 font-bold border border-red-500/20">
            {classification}
          </span>
          <span className="text-muted-foreground">REF: {redactedId}</span>
        </div>

        <button
          onClick={() => setUnredacted(!unredacted)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-muted hover:bg-muted/80 text-foreground transition-all cursor-pointer border border-border"
        >
          {unredacted ? (
            <>
              <Eye className="size-3.5 text-primary" />
              <span>Conceal Redaction</span>
            </>
          ) : (
            <>
              <Unlock className="size-3.5 text-red-500" />
              <span>Click or Scroll to Declassify</span>
            </>
          )}
        </button>
      </div>

      {/* The Redaction Visual Box */}
      <div className="relative rounded-2xl border border-border/70 bg-card p-6 sm:p-8 space-y-4 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground border-b border-border/40 pb-3">
          <span>Source: {sourceDoc}</span>
          <span className="text-primary font-bold">Wanahabari Lab Leak Desk</span>
        </div>

        {/* Animated Redaction Bar Container */}
        <div className="relative">
          <div className="space-y-3">
            <h3 className="font-heading text-2xl sm:text-3xl font-black text-foreground">
              {findingHeadline}
            </h3>

            <div className="flex items-baseline gap-3">
              <span className="font-heading text-4xl sm:text-6xl font-black text-primary tracking-tighter">
                {hiddenAmount}
              </span>
              <span className="font-mono text-xs uppercase text-muted-foreground font-bold">
                Unaccounted Variance
              </span>
            </div>

            <p className="text-base sm:text-lg text-foreground/85 leading-relaxed pt-2">
              {findingDetail}
            </p>
          </div>

          {/* Black Confidential Overlay that slides away */}
          <motion.div
            initial={false}
            animate={{
              clipPath: unredacted
                ? "inset(0 100% 0 0)"
                : "inset(0 0% 0 0)",
              opacity: unredacted ? 0 : 1,
            }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setUnredacted(true)}
            className="absolute inset-0 bg-zinc-950 text-white p-6 rounded-xl flex flex-col justify-center cursor-pointer select-none border border-zinc-800"
          >
            <div className="font-mono text-xs text-red-500 font-bold uppercase tracking-widest mb-1">
              CONFIDENTIAL · SECTION 34 ARTICLE 201
            </div>
            <p className="font-mono text-lg sm:text-2xl font-black uppercase tracking-wider text-zinc-300">
              ████████████ REDACTED FISCAL LINE ████████████
            </p>
            <p className="text-xs font-mono text-zinc-500 mt-2">
              Tap to unveil leaked Treasury ledger line verified by Wanahabari fellows.
            </p>
          </motion.div>
        </div>

        <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs font-mono text-muted-foreground">
          <span>{impactNote}</span>
          <span className="text-foreground font-bold">Audited & Verified</span>
        </div>
      </div>
    </div>
  );
}

export function WanahabariScrollytelling() {
  return (
    <article className="min-h-screen bg-background text-foreground selection:bg-red-500/20">
      {/* 01 — NEWSPAPER EDITORIAL MASTHEAD HERO (Extreme Macro-White Space) */}
      <header className="relative border-b border-border/40 bg-linear-to-b from-red-500/5 via-muted/10 to-background pt-24 pb-20 md:pt-36 md:pb-32">
        <div className={SECTION_SHELL_INNER}>
          {/* Breadcrumb back to programmes */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <Link
              href="/programmes"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              <span>All Operational Desks</span>
            </Link>
          </nav>

          <div className="space-y-8 max-w-5xl">
            {/* Masthead Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4 font-mono text-xs">
              <div className="flex items-center gap-2">
                <EditorialPill dot pulse>
                  Desk 03 · The Investigative Media Arm
                </EditorialPill>
                <span className="text-muted-foreground">EAST AFRICA PRESS DISPATCH</span>
              </div>
              <span className="text-muted-foreground">QUARTERLY COHORTS · 120+ REPORTERS</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.02]">
              Training reporters to follow the public shilling for the other 364 days.
            </h1>

            <p className="text-xl sm:text-2xl font-medium text-foreground/80 leading-relaxed max-w-3xl">
              Kenyan newsrooms allocate 90% of their fiscal coverage to Budget Day in June. Once the Minister packs his briefcase, reporting drops to zero while billions are quietly spent. Wanahabari Lab equips investigative reporters to investigate public funds year-round.
            </p>

            {/* Editorial Overview Strip (Prose Margins, Zero Boxy Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-8 border-t border-border/50">
              <div>
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Operational Altitude
                </p>
                <p className="mt-1 text-base font-bold text-foreground">
                  Investigative Newsrooms
                </p>
                <p className="text-xs text-muted-foreground">National & Regional Press</p>
              </div>

              <div>
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Alumni Network
                </p>
                <p className="mt-1 text-base font-bold text-foreground">
                  120+ Trained Fellows
                </p>
                <p className="text-xs text-muted-foreground">Daily Nation, Standard, BBC</p>
              </div>

              <div>
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Core Method
                </p>
                <p className="mt-1 text-base font-bold text-primary">
                  Data Scraping & Leaks
                </p>
                <p className="text-xs text-muted-foreground">OCOB Reports & Hansard Audits</p>
              </div>

              <div>
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Media Standard
                </p>
                <p className="mt-1 text-base font-bold text-foreground">
                  Continuous Oversight
                </p>
                <p className="text-xs text-muted-foreground">364-Day Budget Journalism</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 02 — THE NARRATIVE ARC: CHAPTER 01 — THE 1-DAY SPECTACLE */}
      <section className="py-24 md:py-36 border-b border-border/30">
        <div className={SECTION_SHELL_INNER}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-2">
                <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
                  Chapter 01 · The Media Failure
                </span>
                <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground leading-tight">
                  The budget speech is theatre. The real story begins the morning after.
                </h2>
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed text-foreground/80 space-y-6">
                <p className="first-letter:float-left first-letter:mr-3 first-letter:font-heading first-letter:text-6xl first-letter:font-black first-letter:text-primary">
                  Every June, television anchors wear red ties, newspapers print commemorative glossy inserts, and camera crews follow the Cabinet Secretary walking into Parliament holding a leather briefcase. For 24 hours, the nation is obsessed with tax changes.
                </p>
                <p>
                  By July 1st, coverage drops off a cliff. The actual disbursements—the quarterly releases by the Controller of Budget, supplementary budgets passed late at night, and pending bill settlements—happen in complete media darkness. Newsrooms lack the dedicated data desks to parse thousands of spreadsheet rows.
                </p>
              </div>

              {/* Fellow Voice Pull */}
              <blockquote className="border-l-2 border-primary pl-6 py-2 my-8 space-y-3 bg-muted/20 rounded-r-2xl pr-6">
                <p className="font-heading text-xl font-medium italic text-foreground md:text-2xl leading-relaxed">
                  &ldquo;The budget story doesn&rsquo;t end on Budget Day. That is just when the spending begins. Journalists must be in the room for the other 364 days.&rdquo;
                </p>
                <footer className="text-xs font-mono font-bold text-primary uppercase tracking-wider">
                  — David Otieno, Investigative Editor & Wanahabari Fellow
                </footer>
              </blockquote>
            </div>

            {/* Right Column: Sharp Editorial Journalist Portrait */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border/60 shadow-2xl bg-muted">
                <Image
                  src={BNS_MEDIA_IMAGES.productionA}
                  alt="Investigative journalism fellow on set examining county spending leaks"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-primary font-bold">
                    Wanahabari Newsroom Fellowship
                  </span>
                  <p className="text-sm font-semibold leading-snug">
                    Training investigative reporters to cross-reference Treasury exchequer tables with auditor reports.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — CHAPTER 02: THE FORENSIC CURRICULUM (Zero Cards, Broadstream Flow) */}
      <section className="py-24 md:py-36 border-b border-border/30 bg-muted/10">
        <div className={SECTION_SHELL_INNER}>
          <div className="max-w-3xl space-y-4 mb-16">
            <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
              Chapter 02 · The Forensic Curriculum
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground">
              Three investigative pillars newsrooms never teach.
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Our 12-week fellowship takes practicing reporters out of daily press scrums and gives them technical forensic skills to break national stories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Pillar 01 */}
            <div className="space-y-4 border-t-2 border-primary pt-6">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-primary">
                <Terminal className="size-4" />
                <span>Pillar 01 · Data Scraping & Parsing</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground">
                Automated OCOB & Treasury Ingestion
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Reporters learn to write Python and Excel scripts that automatically convert locked PDF tables from the Office of the Controller of Budget into structured searchable databases within seconds.
              </p>
            </div>

            {/* Pillar 02 */}
            <div className="space-y-4 border-t-2 border-primary pt-6">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-primary">
                <FileText className="size-4" />
                <span>Pillar 02 · Off-Budget Verification</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground">
                Pending Bills & Contingent Liabilities
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Investigating off-balance-sheet debt, letters of comfort, and stalled contractor claims that government ministries hide outside the approved parliamentary ceiling.
              </p>
            </div>

            {/* Pillar 03 */}
            <div className="space-y-4 border-t-2 border-primary pt-6">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-primary">
                <Newspaper className="size-4" />
                <span>Pillar 03 · Front-Page Story Packaging</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground">
                Multi-Platform Syndicate Delivery
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Transforming complex forensic datasets into front-page headlines, broadcast TV packages, podcast series, and bilingual social feeds that compel official parliamentary inquests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — CHAPTER 03: SCROLL-TRIGGERED REDACTED REVELATIONS */}
      <section className="py-24 md:py-36 border-b border-border/30">
        <div className={SECTION_SHELL_INNER}>
          <div className="max-w-3xl space-y-4 mb-16">
            <span className="font-mono text-xs font-bold text-red-500 uppercase tracking-widest">
              Chapter 03 · Leaked Evidence Ledger
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground">
              What our investigative alumni uncovered.
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Real investigative revelations published by Wanahabari Lab fellows that forced government audits and parliamentary corrections.
            </p>
          </div>

          <div className="space-y-6 max-w-4xl">
            <RedactedInvestigationFold
              redactedId="OCOB-2025-Q3-LINE-402"
              classification="RESTRICTED REVENUE LEAK"
              sourceDoc="County Executive Expenditure Returns & Central Bank Exchequer Releases"
              hiddenAmount="KSh 1,840,000,000"
              findingHeadline="County Health Revenue Diverted to Executive Foreign Travel Reserves"
              findingDetail="An investigative team of 4 Wanahabari fellows cross-referenced hospital user fee collections with county revenue funds. They proved that KSh 1.84 Billion collected from maternal and dispensary wards was never banked into the County Revenue Fund, but held in commercial bank transit accounts to fund foreign benchmarking trips."
              impactNote="Investigative series published in Daily Nation; Senate Public Accounts Committee summoned 3 Governors."
            />

            <RedactedInvestigationFold
              redactedId="DEBT-AMORT-2026-BPS"
              classification="CLASSIFIED DEBT SINK"
              sourceDoc="National Treasury Debt Management Office Maturity Registry"
              hiddenAmount="KSh 1,203,100,000,000"
              findingHeadline="Debt Interest Servicing Consuming 65% of Ordinary Revenue Before Capitation"
              findingDetail="Wanahabari fellows uncovered that debt interest payments alone (excluding principal repayments) rose to KSh 1,203.1 Billion in FY2026/27. While school capitation faced an 8-month delay, sovereign bond interest payments were prioritised via Consolidated Fund Services without parliamentary debate."
              impactNote="Published in Business Daily & BBC Africa; ignited national debt audit petitions."
            />

            <RedactedInvestigationFold
              redactedId="KILIFI-DISP-HANSARD-09"
              classification="FRAUDULENT SIGN-OFF"
              sourceDoc="County Hansard & Project Completion Certification Rolls"
              hiddenAmount="KSh 64,000,000"
              findingHeadline="4 Non-Existent Coastal Dispensaries Billed as 100% Operational"
              findingDetail="Working alongside BNS Mashinani monitors, fellows verified that four rural health dispensaries billed as fully operational in county official returns had only foundation trenches dug. Contractor invoices totaling KSh 64 Million had been paid in full."
              impactNote="Published in The Standard; EACC initiated asset recovery and contractor blacklisting."
            />
          </div>
        </div>
      </section>

      {/* 05 — DESK CALL TO ACTION & ALLIED ENGAGEMENT */}
      <footer className="border-t border-border/40 bg-muted/20 py-20 md:py-32">
        <div className={SECTION_SHELL_INNER}>
          <div className="rounded-3xl border border-border/60 bg-card p-8 sm:p-14 lg:p-20 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-8 space-y-6">
                <EditorialPill dot pulse>
                  Newsroom Partnership
                </EditorialPill>
                <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
                  Apply for the next Wanahabari Investigative Fellowship.
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                  We admit 30 practicing reporters, newsroom editors, and independent data creators every quarter. Fellows receive forensic data access, investigative stipends, and legal defense backing.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <PillButtonGroup
                    href="/contact"
                    label="Apply for Fellowship Cohort"
                    variant="primary"
                    size="lg"
                  />
                  <PillButtonGroup
                    href="/work?programme=wanahabari-lab"
                    label="View Published Lab Investigations"
                    variant="outline"
                    size="lg"
                  />
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-start lg:items-end gap-3 text-xs font-mono text-muted-foreground">
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 w-full space-y-2">
                  <p className="text-foreground font-bold text-sm">Wanahabari Press Lab</p>
                  <p>Inquiries: wanahabari@budgetndiostory.org</p>
                  <p>Cohorts: March, June, September, December</p>
                  <p className="text-red-500 font-semibold">Forensic Public Finance Reporting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </article>
  );
}
