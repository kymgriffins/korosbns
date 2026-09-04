"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  Building2,
  Layers,
  ShieldCheck,
  Quote,
  FileText,
  Play,
  Volume2,
  Share2,
  Check,
} from "lucide-react";
import type { StudioProjectEvidence } from "@/data/studios-evidence";
import { studiosEvidenceData } from "@/data/studios-evidence";
import { StudioBookingForm } from "@/components/studio/StudioBookingForm";
import { BNS_COMMUNITY_IMAGES, BNS_MEDIA_IMAGES } from "@/constants/bns-media-images";
import { cn } from "@/utils";

function youtubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{6,})/,
  );
  if (!match?.[1]) return null;
  return `https://www.youtube.com/embed/${match[1]}`;
}

export function AgencyCaseStudyTemplate({ project }: { project: StudioProjectEvidence }) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const embed = project.media.videoUrl ? youtubeEmbedUrl(project.media.videoUrl) : null;
  const related = studiosEvidenceData.getRelatedProjects(project.id, 3);

  const getProgrammeLabel = (slug: string) => {
    switch (slug) {
      case "connect":
        return "BNS Connect Desk";
      case "mashinani":
        return "BNS Mashinani Desk";
      case "wanahabari-lab":
        return "Wanahabari Lab Desk";
      case "studios":
      default:
        return "BNS Studios Desk";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30">
      {/* 01 — ASYMMETRIC SPLIT HERO HEADER (Purpose Style) */}
      <section className="relative overflow-hidden border-b border-zinc-800 bg-linear-to-b from-zinc-950 via-black to-black pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              All Work & Evidence
            </Link>
          </nav>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
            {/* Left Column: Case Study Brief */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[10px] font-bold text-primary uppercase tracking-widest">
                  {project.contentType}
                </span>
                <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  {getProgrammeLabel(project.programmeSlug)}
                </span>
                <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  {project.year}
                </span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.05]">
                {project.title}
              </h1>

              {project.subtitle && (
                <p className="text-xl sm:text-2xl font-medium text-zinc-300 leading-snug">
                  {project.subtitle}
                </p>
              )}

              <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl">
                {project.briefChallenge}
              </p>

              {/* Quick Facts Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 backdrop-blur-sm">
                <div>
                  <p className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Partner / Client
                  </p>
                  <p className="mt-1 text-xs font-bold text-white leading-tight truncate">
                    {project.organization.name}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Sector
                  </p>
                  <p className="mt-1 text-xs font-bold text-white leading-tight truncate">
                    {project.organization.sector}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Delivery Mode
                  </p>
                  <p className="mt-1 text-xs font-bold text-primary capitalize leading-tight">
                    {project.deliveryMode.replace("-", " ")}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Outputs Count
                  </p>
                  <p className="mt-1 text-xs font-bold text-white leading-tight">
                    {project.outputs.length} Deliverables
                  </p>
                </div>
              </div>

              {/* Primary Impact Evidence Ribbon */}
              {project.impactEvidence.primaryMetric && (
                <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 space-y-1.5">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                    Verified Primary Impact Metric
                  </p>
                  <p className="font-heading text-2xl sm:text-3xl font-black text-white">
                    {project.impactEvidence.primaryMetric}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {project.impactEvidence.context} · {project.impactEvidence.verificationOutcome}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Hero Poster Preview */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden rounded-3xl border border-zinc-800 shadow-2xl">
                <Image
                  src={project.media.posterUrl}
                  alt={project.title}
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-xs font-medium backdrop-blur-md bg-black/60 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                  <span className="truncate pr-2">{project.title} · Production Master</span>
                  <span className="font-mono text-[10px] text-primary font-bold shrink-0">BNS Studios</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — CINEMATIC HERO MEDIA / VIDEO CANVAS */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl">
          {embed ? (
            <div className="relative aspect-[16/9] w-full">
              <iframe
                src={embed}
                title={project.title}
                className="size-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={project.media.posterUrl}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="rounded-full bg-primary/90 p-5 text-white shadow-2xl backdrop-blur-sm">
                  {project.contentType === "Podcast & Audio" ? (
                    <Volume2 className="size-8" />
                  ) : (
                    <Play className="size-8 fill-current" />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 03 — EDITORIAL NARRATIVE & FRONTLINE VOICE (Two Columns) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start border-y border-zinc-800 py-12">
          {/* Quote Column */}
          <div className="lg:col-span-5 space-y-4">
            <Quote className="size-10 text-primary/40" />
            <blockquote className="font-serif italic text-2xl sm:text-3xl text-zinc-200 font-normal leading-snug">
              &ldquo;Transforming complex government budgeting into stories that citizens can actually use is the highest form of democratic accountability.&rdquo;
            </blockquote>
            <div className="pt-2">
              <p className="text-sm font-bold text-white">{project.organization.name}</p>
              <p className="font-mono text-xs text-zinc-500">Commissioning Partner / Stakeholder</p>
            </div>
          </div>

          {/* Detailed Narrative */}
          <div className="lg:col-span-7 space-y-8 lg:border-l lg:border-zinc-800 lg:pl-12">
            <div>
              <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
                01 / The Strategic Challenge
              </span>
              <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold text-white">
                What was broken, obscured, or missing
              </h2>
              <p className="mt-3 text-base text-zinc-400 leading-relaxed">
                {project.briefChallenge}
              </p>
            </div>

            <div>
              <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
                02 / What BNS Studios Built
              </span>
              <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold text-white">
                The Creative & Production Solution
              </h2>
              <p className="mt-3 text-base text-zinc-400 leading-relaxed">
                {project.whatWeProduced}
              </p>
              <p className="mt-3 text-base text-zinc-400 leading-relaxed">
                {project.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — 2x2 ON-THE-GROUND PRODUCTION & COMMUNITY MOSAIC */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8 space-y-2">
          <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
            03 / Production Evidence
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
            Behind the camera, in the editing suite, on the street.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
            <Image
              src={BNS_MEDIA_IMAGES.productionA}
              alt="On-set videography"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="font-mono text-[10px] text-primary uppercase font-bold">On-Set Filming</p>
              <p className="text-sm font-semibold mt-1">Cinematography capturing community testimony</p>
            </div>
          </div>

          <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
            <Image
              src={BNS_COMMUNITY_IMAGES.forumA}
              alt="Town hall engagement"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="font-mono text-[10px] text-primary uppercase font-bold">Field Screening</p>
              <p className="text-sm font-semibold mt-1">Direct citizen dialogue and participatory review</p>
            </div>
          </div>

          <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
            <Image
              src={BNS_MEDIA_IMAGES.productionB}
              alt="Studio session"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="font-mono text-[10px] text-primary uppercase font-bold">Audio & Dialogue</p>
              <p className="text-sm font-semibold mt-1">Bilingual podcast and vodcast studio recording</p>
            </div>
          </div>

          <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
            <Image
              src={BNS_COMMUNITY_IMAGES.stakeholdersB}
              alt="Stakeholder review"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="font-mono text-[10px] text-primary uppercase font-bold">Data Verification</p>
              <p className="text-sm font-semibold mt-1">Fact-checking and alignment with published Treasury tables</p>
            </div>
          </div>
        </div>
      </section>

      {/* 05 — 3-PILLAR EXECUTION ARCHITECTURE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t border-zinc-800">
        <div className="mb-8 space-y-2">
          <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
            04 / Production Methodology
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
            The Three-Stage Creative Engine
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 space-y-4">
            <span className="font-mono text-2xl font-black text-primary">01</span>
            <h3 className="font-heading text-xl font-bold text-white">
              Forensic Scripting & Data Mining
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Every sentence is cross-referenced against primary documents: Controller of Budget reports, Treasury BPS tables, and county development plans. Zero fabricated statistics.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 space-y-4">
            <span className="font-mono text-2xl font-black text-primary">02</span>
            <h3 className="font-heading text-xl font-bold text-white">
              High-Craft Production & Animation
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Cinema-grade cameras, broadcast sound engineering, and fluid 2D motion graphics that make complex fiscal mechanics instantly understandable for mobile audiences.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 space-y-4">
            <span className="font-mono text-2xl font-black text-primary">03</span>
            <h3 className="font-heading text-xl font-bold text-white">
              Multi-Format Syndication & Action
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              From flagship YouTube cuts to 9:16 TikTok explainers, WhatsApp audio snippets, and radio briefs — distributed across BNS youth networks for maximum democratic reach.
            </p>
          </div>
        </div>
      </section>

      {/* 06 — CREATIVE CAMPAIGN COLLATERAL & OOH EXHIBITION (Purpose Agency Showcase) */}
      <section className="border-y border-zinc-800 bg-zinc-950/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="space-y-2">
            <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
              05 / Campaign Collateral & Public Takeovers
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              Out-of-Home, Street Art & Mobile Activations
            </h2>
            <p className="text-base text-zinc-400 max-w-2xl">
              How BNS Studios campaigns live beyond the screen — taking over public transit, street paste-ups, and social feeds.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Billboard Mockup */}
            <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-zinc-700 bg-black p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 font-black text-8xl pointer-events-none select-none">
                BNS
              </div>
              <div className="space-y-4 relative z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 font-mono text-[10px] font-bold text-primary uppercase tracking-wider border border-primary/30">
                  Urban Transit & Billboard Installation
                </span>
                <h3 className="font-heading text-3xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                  {project.title.toUpperCase()}
                </h3>
                <p className="text-sm text-zinc-400 font-mono">
                  {project.briefChallenge}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500 font-mono">
                <span>Commissioned by {project.organization.name}</span>
                <span>Produced by BNS Studios</span>
              </div>
            </div>

            {/* Mobile / Social Activation Mockup */}
            <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-mono text-[10px] font-bold text-primary uppercase tracking-wider">
                  Mobile Social Distribution
                </span>
                <h3 className="font-heading text-xl font-bold text-white">
                  Vertical Cuts for TikTok, Reels & WhatsApp
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Bilingual short-form cut-downs optimized for algorithmic engagement and high peer-to-peer forwarding.
                </p>
              </div>

              {/* Smartphone Preview Card */}
              <div className="mt-6 rounded-2xl border border-zinc-700 bg-black p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>📱 Vertical Cut 9:16</span>
                  <span className="text-primary font-bold">{project.impactEvidence.primaryMetric || "High Retention"}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-primary rounded-full w-3/4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 07 — PRODUCTION DELIVERABLES CHECKLIST */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8 space-y-2">
          <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
            06 / Commission Deliverables
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
            What Was Produced & Shipped
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {project.outputs.map((output, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 flex items-start gap-3"
            >
              <Check className="size-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-zinc-200 leading-snug">{output}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 08 — RELATED PROJECTS IN THIS LANE */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t border-zinc-800">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
                07 / Adjacent Evidence
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                More Work in This Programme Lane
              </h2>
            </div>
            <Link
              href="/work"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              <span>Explore full catalog</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((rel) => (
              <Link
                key={rel.id}
                href={`/bns-studio/${rel.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition-all hover:border-primary/50"
              >
                <div className="space-y-2">
                  <span className="font-mono text-[10px] font-bold text-primary uppercase">
                    {rel.contentType}
                  </span>
                  <h4 className="font-heading text-base font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-zinc-400 line-clamp-2">
                    {rel.briefChallenge}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                  <span className="font-mono text-zinc-500">{rel.year}</span>
                  <span className="inline-flex items-center gap-1 font-bold text-white group-hover:text-primary">
                    View Case Study <ArrowUpRight className="size-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 09 — DIRECT COMMISSIONING CALL TO ACTION & DRAWER */}
      <section className="border-t border-zinc-800 bg-zinc-950 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary uppercase tracking-wider">
            Double Impact Production
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-white">
            Have a story, report, or campaign to commission?
          </h2>
          <p className="text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Partner with BNS Studios to produce podcasts, documentaries, animations, and town halls. Every project funds Kenya's grassroots civic budget tracking.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setBookingOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-xs font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all cursor-pointer"
            >
              <span>Commission BNS Studios</span>
              <ArrowRight className="size-4" />
            </button>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-8 py-3.5 text-xs font-bold text-white hover:bg-zinc-800 transition-colors"
            >
              <span>Back to All Work</span>
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Commission Booking Drawer Modal */}
      <StudioBookingForm open={bookingOpen} onOpenChange={setBookingOpen} />
    </div>
  );
}
