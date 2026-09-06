"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { EditorialPill } from "@/components/ui/editorial";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { cn } from "@/utils";

export interface ProductionDiscipline {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  formatsCount: number;
  description: string;
  formats: {
    number: string;
    label: string;
    formatQuery: string;
    description: string;
  }[];
  capabilities: string[];
}

export const STUDIO_DISCIPLINES: ProductionDiscipline[] = [
  {
    id: "visual-motion",
    badge: "Discipline 01 · Motion & Visual Data",
    title: "Animation & Visual Data",
    subtitle: "3 Formats · Demystifying Complex Fiscal Policy",
    imageSrc: "/images/studio/studio_motion_vfx.jpg",
    imageAlt: "3D skeuomorphic Data & Motion floppy disk with glowing cyan chart",
    formatsCount: 3,
    description:
      "We do not produce 200-page donor PDFs that nobody reads. We transform dense policy memos, Auditor-General findings, and county allocations into high-retention 2D animation and kinetic graphics.",
    formats: [
      {
        number: "FORMAT 02",
        label: "Animations",
        formatQuery: "Animations",
        description: "High-engagement 2D and motion explainers that demystify complex legislation and budget cycles.",
      },
      {
        number: "FORMAT 03",
        label: "Explainer Videos",
        formatQuery: "Explainer Videos",
        description: "Step-by-step visual breakdowns of public finance, policy memos, and sector allocations.",
      },
      {
        number: "FORMAT 04",
        label: "Research Spotlights",
        formatQuery: "Research Spotlights",
        description: "Digestible multimedia packaging for institutional policy briefs and data reports.",
      },
    ],
    capabilities: [
      "2D Character & Motion Explainers",
      "Forensic Data Chart Visualizations",
      "Kinetic Typography Breakdown Reels",
      "Policy Brief Multimedia Packaging",
      "Dynamic On-Screen Infographics",
      "Bilingual English / Sheng Subtitling",
    ],
  },
  {
    id: "cinema-doc",
    badge: "Discipline 02 · Cinema & Broadcast",
    title: "Cinema & Field Production",
    subtitle: "2 Formats · Grassroots Truth & Social Velocity",
    imageSrc: "/images/studio/studio_cinema_cam.jpg",
    imageAlt: "3D skeuomorphic Super 8 cinema camera with electric blue paracord",
    formatsCount: 2,
    description:
      "No matter the scale, we bring productions to life with precision. Backed by an on-ground crew across 47 counties, we capture character-driven community realities and vertical video engineered to spark street debate.",
    formats: [
      {
        number: "FORMAT 05",
        label: "Documentaries",
        formatQuery: "Documentaries",
        description: "Cinematic, character-driven storytelling capturing grassroots community realities.",
      },
      {
        number: "FORMAT 06",
        label: "Social Media Series",
        formatQuery: "Social Media Series",
        description: "Bite-sized vertical video engineered for reach and civic action.",
      },
    ],
    capabilities: [
      "Multi-Camera 4K Documentary Shoots",
      "9:16 Vertical Video & TikTok Series",
      "Field Cinematography in Remote Wards",
      "Aerial Drone Public Project Audits",
      "Broadcast Colour Grading & Finishing",
      "Frontline Citizen Witness Portrayals",
    ],
  },
  {
    id: "audio-podcast",
    badge: "Discipline 03 · Audio & Sound",
    title: "Audio Journalism & Podcasts",
    subtitle: "1 Format · Matatu Soundscapes & Studio Debates",
    imageSrc: "/images/studio/studio_audio_mic.jpg",
    imageAlt: "3D skeuomorphic broadcast studio microphone with blue XLR braided cable",
    formatsCount: 1,
    description:
      "Studio-grade multi-mic production, field acoustic soundscapes, and conversational fiscal deep-dives engineered for streaming, community radio, and matatu audio networks.",
    formats: [
      {
        number: "FORMAT 01",
        label: "Podcast & Audio",
        formatQuery: "Podcast & Audio",
        description: "Bilingual fiscal deep-dives, field soundscapes, and expert debate series.",
      },
    ],
    capabilities: [
      "Broadcast Multi-Mic Studio Recording",
      "Field Soundscapes & Street Vox Pops",
      "Multilingual Moderation (Sheng/Swahili)",
      "Full Broadcast Mastering & Sonic ID",
      "Matatu Audio Flash Drive Packaging",
      "Spotify & Apple Podcast Syndication",
    ],
  },
  {
    id: "convenings-evidence",
    badge: "Discipline 04 · Convenings & Barazas",
    title: "Civic Convenings & Evidence",
    subtitle: "2 Formats · Participatory Barazas & Testimony",
    imageSrc: "/images/studio/studio_convening_pencils.png",
    imageAlt: "3D tied bundle of production pencils representing participatory convening design",
    formatsCount: 2,
    description:
      "End-to-end convening architecture, facilitation frameworks, and multi-camera live documentation capturing authentic citizen witness testimony and grassroots budget evidence.",
    formats: [
      {
        number: "FORMAT 07",
        label: "Town Hall Design & Facilitation",
        formatQuery: "Town Hall Design & Facilitation",
        description: "Curated multi-stakeholder convening with live audio and visual recording.",
      },
      {
        number: "FORMAT 08",
        label: "Community Listening Sessions",
        formatQuery: "Community Listening Sessions",
        description: "Hyper-local participatory dialogues capturing ground-level budget evidence.",
      },
    ],
    capabilities: [
      "Participatory Facilitation Architecture",
      "Multi-Camera Live Broadcast & Stream",
      "Acoustic Testimony & Witness Capture",
      "Citizen Budget Scorecard Deliberation",
      "County Assembly & MCA Debriefings",
      "Ground-Level Policy Action Memos",
    ],
  },
];

const DISCIPLINE_TABS = [
  { id: "all", label: "All Disciplines", count: 4 },
  { id: "visual-motion", label: "Motion & Data", count: 3 },
  { id: "cinema-doc", label: "Cinema & Social", count: 2 },
  { id: "audio-podcast", label: "Audio & Podcasts", count: 1 },
  { id: "convenings-evidence", label: "Civic Convenings", count: 2 },
];

export function StudioProductionSpectrum() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("all");

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -420, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 420, behavior: "smooth" });
    }
  };

  const filteredDisciplines =
    activeTab === "all"
      ? STUDIO_DISCIPLINES
      : STUDIO_DISCIPLINES.filter((d) => d.id === activeTab);

  return (
    <section className="py-24 md:py-36 bg-zinc-950 text-white border-y border-zinc-800/80 relative overflow-hidden">
      {/* Subtle Atmospheric Backdrop Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[400px] bg-primary/10 blur-[150px] rounded-full pointer-events-none select-none" />

      <div className={SECTION_SHELL_INNER}>
        {/* 01 — TOP HEADER & CONTROLS (Inspired by Reference Screenshot) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-zinc-800/80">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-3">
              <EditorialPill dot pulse variant="outline" size="sm" className="text-primary border-primary/40 bg-primary/10">
                Chapter 03 · Production Spectrum
              </EditorialPill>
              <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest hidden sm:inline-block">
                8 Formats · 4 Disciplines
              </span>
            </div>

            <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05]">
              Four creative disciplines. Engineered for civic impact.
            </h2>

            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
              We do not produce 200-page donor PDFs that nobody reads. We craft media formats people argue about in matatus, dissect in county barazas, and share on social feeds.
            </p>
          </div>

          {/* Carousel Navigation Buttons & Sub-navigation Counter */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
            <button
              type="button"
              onClick={scrollLeft}
              aria-label="Scroll left"
              className="flex size-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={scrollRight}
              aria-label="Scroll right"
              className="flex size-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        {/* 02 — CATEGORY FILTER TABS */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-6 border-b border-zinc-800/40">
          {DISCIPLINE_TABS.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-mono font-semibold transition-all whitespace-nowrap outline-none cursor-pointer",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                    : "border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                )}
              >
                <span>{tab.label}</span>
                <span className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full",
                  isSelected ? "bg-black/20 text-white font-bold" : "bg-zinc-800 text-zinc-400"
                )}>
                  [{tab.count}]
                </span>
              </button>
            );
          })}
        </div>

        {/* 03 — DISCIPLINE CARDS HORIZONTAL SCROLL CAROUSEL */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pt-8 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {filteredDisciplines.map((discipline) => (
            <article
              key={discipline.id}
              className="min-w-[310px] sm:min-w-[380px] lg:min-w-[430px] max-w-[460px] flex-shrink-0 snap-start flex flex-col justify-between rounded-3xl border border-zinc-800/90 bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-md hover:border-zinc-700 transition-all shadow-2xl group"
            >
              <div>
                {/* 3D Skeuomorphic Visual Artifact (Isolated on Black, Studio Lit) */}
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto mb-6 flex items-center justify-center rounded-2xl overflow-hidden bg-black/70 border border-zinc-800/60 shadow-inner group-hover:scale-105 transition-transform duration-500">
                  <Image
                    src={discipline.imageSrc}
                    alt={discipline.imageAlt}
                    fill
                    sizes="(max-width: 640px) 176px, 208px"
                    className="object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Eyebrow & Title */}
                <div className="space-y-1 mb-3">
                  <span className="font-mono text-[10px] font-bold text-primary uppercase tracking-wider">
                    {discipline.badge}
                  </span>
                  <h3 className="font-heading text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                    {discipline.title}
                  </h3>
                  <p className="font-mono text-xs text-zinc-400">
                    {discipline.subtitle}
                  </p>
                </div>

                {/* Editorial Description */}
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  {discipline.description}
                </p>

                {/* Format Cases Sub-List (Every format highlighted with direct case study link) */}
                <div className="space-y-3 pt-4 border-t border-zinc-800/80 mb-6">
                  <p className="font-mono text-[11px] font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="size-3 text-primary" />
                    <span>Included Production Formats</span>
                  </p>
                  <div className="space-y-2.5">
                    {discipline.formats.map((fmt) => (
                      <div
                        key={fmt.number}
                        className="rounded-xl border border-zinc-800/70 bg-zinc-950/60 p-3 flex flex-col gap-1 transition-colors hover:border-zinc-700"
                      >
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-primary font-bold text-[10px]">{fmt.number}</span>
                          <Link
                            href={`/bns-studio/work?format=${encodeURIComponent(fmt.formatQuery)}`}
                            className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors"
                          >
                            <span>Explore cases</span>
                            <ArrowUpRight className="size-3 text-primary" />
                          </Link>
                        </div>
                        <h4 className="font-heading text-sm font-bold text-white">
                          {fmt.label}
                        </h4>
                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                          {fmt.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Capabilities Checklist (2-Columns on wide, matching reference screenshot) */}
                <div className="pt-4 border-t border-zinc-800/80 mb-6">
                  <p className="font-mono text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-3">
                    Discipline Capabilities
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                    {discipline.capabilities.map((cap) => (
                      <div key={cap} className="flex items-start gap-2">
                        <Check className="size-3.5 text-primary shrink-0 mt-0.5" />
                        <span className="leading-snug">{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="pt-4 border-t border-zinc-800/80">
                <Link
                  href={`/bns-studio/work?format=${encodeURIComponent(discipline.formats[0].formatQuery)}`}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-800/80 hover:bg-primary hover:text-primary-foreground px-4 py-3 text-xs font-heading font-bold text-white transition-all shadow-sm group-hover:bg-primary group-hover:text-primary-foreground"
                >
                  <span>Explore {discipline.title} Portfolio</span>
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
