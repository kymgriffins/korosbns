"use client";

import { ParallaxWrapper, TelemetryHUD } from "@/components/motion";
import { ProgrammesProjectsLoop } from "@/components/programmes/programmes-projects-loop";
import { EditorialCtaBand, PillButtonGroup } from "@/components/ui/editorial";
import {
  BNS_COMMUNITY_IMAGES,
  BNS_MEDIA_IMAGES,
} from "@/constants/bns-media-images";
import { BNS_R2_REELS } from "@/constants/bns-r2-reels";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { ArrowDown, FileSearch, Radio, Smartphone } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

const STUDIOS_TEASER =
  BNS_R2_REELS.find((r) => r.id === "reel-04") ?? BNS_R2_REELS[0]!;

function DeskEyebrow({
  index,
  name,
  tag,
  tone,
}: {
  index: string;
  name: string;
  tag: string;
  tone: "primary" | "amber" | "red" | "studio";
}) {
  const toneClass =
    tone === "primary"
      ? "text-primary"
      : tone === "amber"
        ? "text-amber-700 dark:text-amber-400"
        : tone === "red"
          ? "text-red-500 dark:text-red-400"
          : "text-primary";
  const ruleClass =
    tone === "primary"
      ? "bg-primary/50"
      : tone === "amber"
        ? "bg-amber-500/50"
        : tone === "red"
          ? "bg-red-500/60"
          : "bg-primary/50";
  const muted =
    tone === "studio" || tone === "red"
      ? "text-white/50"
      : "text-muted-foreground";

  return (
    <div className="mb-5 flex items-center gap-3">
      <span className={`text-xs font-bold uppercase tracking-[0.2em] ${toneClass}`}>
        Desk {index} · {name}
      </span>
      <span className={`h-px w-10 sm:w-14 ${ruleClass}`} aria-hidden />
      <span className={`text-[11px] uppercase tracking-wider ${muted}`}>{tag}</span>
    </div>
  );
}

function StudiosBackdropVideo() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (reduceMotion || !ref.current) return;
    ref.current.play().catch(() => {});
  }, [reduceMotion]);

  if (reduceMotion) {
    return (
      <Image
        src={STUDIOS_TEASER.posterUrl}
        alt=""
        fill
        className="object-cover opacity-40"
        sizes="100vw"
        aria-hidden
      />
    );
  }

  return (
    <video
      ref={ref}
      className="absolute inset-0 size-full object-cover opacity-45"
      src={STUDIOS_TEASER.videoUrl}
      poster={STUDIOS_TEASER.posterUrl}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
    />
  );
}

export function ProgrammesLanding() {
  return (
    <article className="prog-page min-h-screen bg-background text-foreground selection:bg-primary/20">
      <TelemetryHUD
        activeDesk=""
        focusArea="NATIONAL TO  GRASSROOTS"
        badgeLabel="SOVEREIGN "
      />

      <nav
        aria-label="Programmes Navigation"
        className="sticky top-12 z-30 border-b border-border/40 bg-background/90 py-2.5 backdrop-blur-md md:top-16"
      >
        <div className={SECTION_SHELL_INNER}>
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Feel the four:
              </span>
              <Link
                href="#desk-01"
                className="rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                01 Connect
              </Link>
              <Link
                href="#desk-02"
                className="rounded-full bg-amber-500/10 px-2.5 py-1 font-medium text-amber-800 transition-colors hover:bg-amber-500 hover:text-white dark:text-amber-300"
              >
                02 Mashinani
              </Link>
              <Link
                href="#desk-03"
                className="rounded-full bg-red-500/15 px-2.5 py-1 font-medium text-red-600 transition-colors hover:bg-red-600 hover:text-white dark:text-red-400"
              >
                03 Wanahabari
              </Link>
              <Link
                href="#desk-04"
                className="rounded-full bg-foreground/10 px-2.5 py-1 font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                04 Studios
              </Link>
            </div>

            <a
              href="#public-evidence-loop"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-mono text-[11px] font-bold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
            >
              <span>Explore All Projects</span>
              <ArrowDown className="size-3" />
            </a>
          </div>
        </div>
      </nav>

      {/* THEATRE OPENING */}
      <section className="relative overflow-hidden border-b border-border/40 bg-background py-16 sm:py-24 md:py-32">
        <div
          className="pointer-events-none absolute -right-24 top-0 size-[28rem] rounded-full bg-primary/10 blur-[100px]"
          aria-hidden
        />
        <div className={SECTION_SHELL_INNER}>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            className="max-w-5xl space-y-6"
          >
            <motion.p
              variants={fadeInUp}
              className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-primary"
            >
              Four desks · One public shilling
            </motion.p>
            <motion.h1
              variants={fadeInUp}
              className="gusto-heading text-foreground"
            >
              Scroll the rooms.
              <span className="mt-2 block text-primary italic">Feel each programme.</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              Connect for the national feed. Mashinani for the baraza. Wanahabari
              for the 364-day newsroom. Studios for the craft that funds the rest.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* DESK 01 — CONNECT · light / brand blue theatre */}
      <section
        id="desk-01"
        className="scroll-mt-28 border-b border-border/40 bg-background py-16 sm:py-20 md:py-28"
      >
        <div className={SECTION_SHELL_INNER}>
          <DeskEyebrow
            index="01"
            name="BNS Connect"
            tag="Youth Digital Mobilization"
            tone="primary"
          />

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mb-10 max-w-5xl space-y-4"
          >
            <h2 className="font-heading text-3xl font-black leading-[1.02] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Translating 400-page accounting sheets into{" "}
              <span className="text-primary">60-second mobile power.</span>
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              National money, explained for the feed — not the filing cabinet.
            </p>
          </motion.div>

          <ParallaxWrapper speed={0.15}>
            <div className="relative mb-10 aspect-[21/9] w-full overflow-hidden rounded-2xl bg-muted shadow-lg sm:mb-12">
              <Image
                src={BNS_COMMUNITY_IMAGES.cohortA}
                alt="Young Kenyans interrogating national debt amortization tables"
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 max-w-2xl space-y-1 text-white sm:bottom-6 sm:left-6">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                  Nairobi Youth Baraza
                </p>
                <p className="text-sm font-medium leading-snug sm:text-base">
                  Auditing national debt amortization tables against real-time
                  Ministry disbursements.
                </p>
              </div>
            </div>
          </ParallaxWrapper>

          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="space-y-4 text-sm leading-relaxed text-foreground/85 sm:text-base lg:col-span-7">
              <p>
                When Treasury drops the annual Budget Policy Statement,
                accountability historically vanished inside 400-page PDF tables
                written in impenetrable bureaucratic jargon. Parliamentary
                committees debated behind closed doors while millions of young
                taxpayers were locked out of the conversation.
              </p>
              <p>
                BNS Connect flips this dynamic. We ingest raw exchequer tables,
                debt amortization schedules, and tax bills, distilling them into
                rapid-fire 60-second video explainers, swipeable TikTok
                carousels, and verified WhatsApp infographics.
              </p>
              <p className="font-medium text-foreground">
                Young Kenyans nationwide track national budget allocations
                directly on their screens, turning passive reading into targeted
                public participation submissions to the National Assembly.
              </p>
            </div>

            <div className="space-y-6 lg:col-span-5">
              <div className="space-y-1.5 border-l-2 border-primary pl-5">
                <blockquote className="font-heading text-lg font-medium italic leading-snug text-foreground sm:text-xl">
                  &ldquo;We don&rsquo;t summarize the budget for archives. We
                  translate the data into immediate leverage for citizen
                  action.&rdquo;
                </blockquote>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground not-italic">
                  — BNS Digital Desk, Nairobi
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3 text-sm text-foreground/90">
                  <Smartphone className="size-4 shrink-0 text-primary" />
                  <span>Direct integration with our TikTok &amp; Reels format</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground/90">
                  <FileSearch className="size-4 shrink-0 text-primary" />
                  <span>80-page citizen memorandum submitted to Finance Committee</span>
                </div>
                <div className="pt-2">
                  <PillButtonGroup
                    href="/programmes/connect"
                    label="Open BNS Connect Dossier"
                    variant="outline"
                    size="default"
                    className="w-full justify-center sm:w-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DESK 02 — MASHINANI · warm earth field */}
      <section
        id="desk-02"
        className="scroll-mt-28 border-b border-amber-900/10 bg-amber-50/70 py-16 sm:py-20 md:py-28 dark:border-amber-500/10 dark:bg-amber-950/25"
      >
        <div className={SECTION_SHELL_INNER}>
          <DeskEyebrow
            index="02"
            name="BNS Mashinani"
            tag="The Devolved Grassroots Engine"
            tone="amber"
          />

          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="space-y-6 lg:col-span-6">
              <h2 className="font-heading text-3xl font-black leading-[1.02] tracking-tight text-foreground sm:text-5xl">
                Taking budget tracking from Nairobi boardrooms to the{" "}
                <span className="text-amber-700 italic dark:text-amber-400">
                  village baraza.
                </span>
              </h2>

              <div className="space-y-1.5 border-l-2 border-amber-500/80 pl-5">
                <blockquote className="font-heading text-base font-medium italic leading-snug text-foreground sm:text-lg">
                  &ldquo;In the village, the budget isn&rsquo;t numbers in a
                  book — it is whether the dispensary has medicine and whether
                  the borehole actually pumps clean water.&rdquo;
                </blockquote>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground not-italic">
                  — Subukia Ward Community Baraza, Nakuru County
                </p>
              </div>

              <div className="space-y-3 text-sm leading-relaxed text-foreground/85 sm:text-base">
                <p>
                  Fiscal devolution was designed to place resources into the
                  hands of local communities. Yet 78% of rural Kenyans report
                  never seeing a ward development breakdown before projects are
                  approved.
                </p>
                <p>
                  BNS Mashinani deploys embedded civic field leads across
                  Kakamega, Kilifi, Nakuru, and Wajir. We train residents with
                  waterproof audit scorecards to cross-check county gazette
                  budgets against actual physical contractor work.
                </p>
                <p>
                  Through weekly vernacular radio broadcasts and open-air
                  barazas under village trees, we empower farmers, youth groups,
                  and artisanal fisherfolk to challenge ghost allocations before
                  completion certificates are rubber-stamped.
                </p>
              </div>

              <div className="flex flex-col items-stretch gap-3 pt-2 sm:flex-row sm:items-center">
                <PillButtonGroup
                  href="/programmes/mashinani"
                  label="Open BNS Mashinani Dossier"
                  variant="outline"
                  size="default"
                  className="w-full justify-center sm:w-auto"
                />
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  <Radio className="size-4 shrink-0" />
                  <span>800K+ Vernacular Listeners</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <ParallaxWrapper speed={0.2}>
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-muted shadow-lg sm:aspect-[4/5]">
                  <Image
                    src={BNS_COMMUNITY_IMAGES.forumD}
                    alt="Community members conducting outdoor ward budget audit baraza"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 space-y-1.5 text-white">
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                      Kilifi County Field Baraza
                    </span>
                    <p className="text-xs font-medium leading-snug sm:text-sm">
                      Artisanal fisherfolk cross-referencing blue economy
                      devolved funds with actual landing site infrastructure.
                    </p>
                  </div>
                </div>
              </ParallaxWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* DESK 03 — WANAHABARI · dark red punch / theatre */}
      <section
        id="desk-03"
        className="relative scroll-mt-28 border-b border-red-950 bg-zinc-950 py-16 text-white sm:py-20 md:py-28 dark:border-red-900/40"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent"
          aria-hidden
        />
        <div className={SECTION_SHELL_INNER}>
          <DeskEyebrow
            index="03"
            name="Wanahabari Lab"
            tag="The 364-Day Investigative Newsroom"
            tone="red"
          />

          <div className="mb-10 max-w-5xl space-y-5 sm:mb-12">
            <h2 className="font-heading text-3xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
              The budget speech is{" "}
              <span className="text-red-500 italic dark:text-red-400">theatre.</span>
              <span className="mt-2 block text-white/90">
                The real story begins the morning after.
              </span>
            </h2>
            <p className="max-w-3xl text-base font-normal leading-relaxed text-zinc-400 sm:text-lg">
              Kenyan commercial media concentrates 90% of fiscal reportage on
              Budget Day in June. Wanahabari Lab equips investigative reporters
              to track exchequer requisitions and forensic procurement for the
              other 364 days.
            </p>
          </div>

          <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12 sm:mb-12">
            <div className="space-y-3 rounded-2xl border border-red-500/20 bg-red-950/30 p-5 sm:p-6">
              <span className="text-xs font-bold uppercase tracking-widest text-red-400">
                Case Inquiry 01 · County Health Diversions
              </span>
              <h3 className="font-heading text-xl font-bold leading-snug text-white">
                Uncovering KSh 1.84 Billion in locked maternity wings.
              </h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                When county health allocations were diverted to pay recurrent
                supplier debts, Wanahabari fellows scraped Controller of Budget
                quarterly releases, matched them to local contractor records,
                and co-published the findings in national print dailies.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-red-500/20 bg-red-950/30 p-5 sm:p-6">
              <span className="text-xs font-bold uppercase tracking-widest text-red-400">
                Case Inquiry 02 · Consolidated Fund Services
              </span>
              <h3 className="font-heading text-xl font-bold leading-snug text-white">
                Exposing KSh 1,203 Billion public debt interest appetite.
              </h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                Our fellowship analyzed sovereign amortization tables to
                demonstrate that out of every KSh 100 collected by KRA, KSh 64
                was swallowed by debt servicing before a single development
                grant left the exchequer account.
              </p>
            </div>
          </div>

          <ParallaxWrapper speed={0.15}>
            <div className="relative mb-8 aspect-[21/9] w-full overflow-hidden rounded-2xl bg-zinc-900 shadow-lg sm:mb-10">
              <Image
                src={BNS_MEDIA_IMAGES.productionA}
                alt="Wanahabari investigative fellowship journalists examining fiscal leak documents"
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 space-y-1 text-white sm:bottom-6 sm:left-6">
                <p className="text-xs font-bold uppercase tracking-widest text-red-400">
                  Newsroom Fellowship Cohort
                </p>
                <p className="text-xs font-medium leading-snug sm:text-sm">
                  Fellows cross-referencing exchequer requisition tables with
                  Auditor-General audit queries.
                </p>
              </div>
            </div>
          </ParallaxWrapper>

          <div className="flex flex-col items-stretch justify-between gap-4 pt-2 sm:flex-row sm:items-center">
            <PillButtonGroup
              href="/programmes/wanahabari-lab"
              label="Open Wanahabari Lab Dossier"
              variant="outline"
              size="default"
              className="w-full justify-center border-red-500/40 text-red-300 hover:bg-red-500/10 sm:w-auto"
            />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              120+ Reporters Trained Annually Across Kenya
            </span>
          </div>
        </div>
      </section>

      {/* DESK 04 — STUDIOS · midnight cinema + live motion */}
      <section
        id="desk-04"
        className="relative scroll-mt-28 overflow-hidden border-b border-zinc-800 bg-black py-16 text-white sm:py-20 md:py-28"
      >
        <StudiosBackdropVideo />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/75 to-black/95" aria-hidden />

        <div className={`relative z-10 ${SECTION_SHELL_INNER}`}>
          <DeskEyebrow
            index="04"
            name="BNS Studios"
            tag="Commercial Creative Craft"
            tone="studio"
          />

          <div className="mb-10 max-w-4xl space-y-4 sm:mb-12">
            <h2 className="font-heading text-3xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Commercial creative craft that{" "}
              <span className="text-primary italic">bankrolls</span> citizen
              budget audits.
            </h2>
            <p className="max-w-3xl text-base font-normal leading-relaxed text-zinc-300 sm:text-lg">
              We operate an independent, top-tier creative production studio
              producing podcasts, documentaries, 2D animations, and street
              campaigns for leading civic institutions.
            </p>
          </div>

          <div className="my-6 grid grid-cols-2 gap-4 border-y border-white/10 py-6 lg:grid-cols-4">
            <div className="space-y-1">
              <span className="font-heading text-xl font-black tracking-tight text-primary sm:text-2xl">
                EN / FR
              </span>
              <p className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                Bilingual Productions
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-heading text-xl font-black tracking-tight text-white sm:text-2xl">
                Dual Impact
              </span>
              <p className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                Craft Supporting Civic Work
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-heading text-xl font-black tracking-tight text-primary sm:text-2xl">
                4 Counties
              </span>
              <p className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                Embedded Grassroots Oversight
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-heading text-xl font-black tracking-tight text-white sm:text-2xl">
                21:9
              </span>
              <p className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                Cinematic Master Reels
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 items-start gap-8 pt-4 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-8">
              <h3 className="font-heading text-lg font-bold text-white sm:text-xl">
                The Double Impact Covenant
              </h3>
              <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">
                Rather than relying solely on donor cycles, BNS Studios sells
                premium storytelling, motion design, and video production to
                commercial and development partners. Operating surplus is
                channeled directly into printing grassroots scorecards and
                funding investigative fellowships across our focus counties.
              </p>
            </div>

            <div className="flex flex-col justify-center gap-3 pt-2 sm:items-start lg:col-span-4 lg:items-end">
              <PillButtonGroup
                href="/programmes/studios"
                label="Open BNS Studios Dossier"
                variant="outline"
                size="default"
                className="w-full justify-center border-white/30 text-white hover:bg-white/10 sm:w-auto"
              />
              <Link
                href="/bns-studio"
                className="text-xs font-bold uppercase tracking-wider text-primary transition-opacity hover:opacity-80"
              >
                Enter full studio theatre →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ProgrammesProjectsLoop />

      <section className="bg-background py-12 sm:py-16 md:py-20">
        <div className={SECTION_SHELL_INNER}>
          <EditorialCtaBand
            eyebrow="The Sovereign Standard"
            title="Follow the public shilling. Reclaim civic power."
            description="Join millions of Kenyans auditing national debt, tracking county disbursements, and enforcing Article 201."
            ctaHref="/work"
            ctaLabel="Explore All Evidence"
            secondaryHref="/contact"
            secondaryLabel="Direct Partnership"
            motionBackground={true}
          />
        </div>
      </section>
    </article>
  );
}
