"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowUpRight,
} from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { cn } from "@/utils";

export interface ProductionDiscipline {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  description: string;
  capabilities: string[];
  primaryFormatQuery: string;
}

export const STUDIO_DISCIPLINES: ProductionDiscipline[] = [
  {
    id: "visual-motion",
    badge: "Discipline 01 · Motion & Visual Data",
    title: "Animation & Visual Data",
    subtitle: "High-retention 2D explainer reels and forensic policy visuals",
    imageSrc: "/images/studio/studio_motion_vfx.jpg",
    imageAlt: "3D skeuomorphic Data & Motion floppy disk with glowing cyan chart",
    description:
      "We do not produce 200-page donor PDFs that nobody reads. We transform dense policy memos, Auditor-General tables, and sector allocations into high-clarity 2D animation and kinetic graphics that citizens actually share.",
    primaryFormatQuery: "Animations",
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
    subtitle: "Character-driven grassroots documentaries and vertical feeds",
    imageSrc: "/images/studio/studio_cinema_cam.jpg",
    imageAlt: "3D skeuomorphic Super 8 cinema camera with electric blue paracord",
    description:
      "No matter the scale, we bring productions to life with precision. Backed by an on-ground crew across 47 counties, we capture character-driven community realities and vertical video engineered to ignite street debate.",
    primaryFormatQuery: "Documentaries",
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
    subtitle: "Studio-grade multi-mic debates and field soundscapes",
    imageSrc: "/images/studio/studio_audio_mic.jpg",
    imageAlt: "3D skeuomorphic broadcast studio microphone with blue XLR braided cable",
    description:
      "Studio-grade multi-mic production, field acoustic soundscapes, and conversational fiscal deep-dives engineered for streaming, community radio syndication, and matatu audio networks.",
    primaryFormatQuery: "Podcast & Audio",
    capabilities: [
      "Broadcast Multi-Mic Studio Recording",
      "Field Soundscapes & Street Vox Pops",
      "Multilingual Moderation (Sheng/Swahili)",
      "Full Broadcast Mastering & Sonic ID",
      "Matatu Audio Flash Drive Packaging",
      "Spotify & Apple Podcast Syndication",
    ],
  },
];

const DISCIPLINE_TABS = [
  { id: "all", label: "All Disciplines", count: 3 },
  { id: "visual-motion", label: "Motion & Data", count: 1 },
  { id: "cinema-doc", label: "Cinema & Social", count: 1 },
  { id: "audio-podcast", label: "Audio & Podcasts", count: 1 },
];

export function StudioProductionSpectrum() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [activeIndex, setActiveIndex] = useState(0);

  const filteredDisciplines =
    activeTab === "all"
      ? STUDIO_DISCIPLINES
      : STUDIO_DISCIPLINES.filter((d) => d.id === activeTab);

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const cardWidth = container.offsetWidth * 0.88;
      container.scrollTo({ left: index * cardWidth, behavior: "smooth" });
      setActiveIndex(index);
    }
  };

  const scrollLeft = () => {
    const prev = Math.max(0, activeIndex - 1);
    scrollToIndex(prev);
  };

  const scrollRight = () => {
    const next = Math.min(filteredDisciplines.length - 1, activeIndex + 1);
    scrollToIndex(next);
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft: sLeft, offsetWidth } = scrollRef.current;
      const cardWidth = offsetWidth * 0.88;
      if (cardWidth > 0) {
        const newIdx = Math.round(sLeft / cardWidth);
        setActiveIndex(Math.min(filteredDisciplines.length - 1, Math.max(0, newIdx)));
      }
    }
  };

  return (
    <section className="py-16 sm:py-24 md:py-36 bg-zinc-950 text-white border-y border-zinc-800/80 relative overflow-hidden">
      {/* Subtle Atmospheric Backdrop Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[400px] bg-primary/10 blur-[150px] rounded-full pointer-events-none select-none" />

      <div className={SECTION_SHELL_INNER}>
        {/* 01 — TOP HEADER & CONTROLS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 sm:pb-12 border-b border-zinc-800/80">
          <div className="space-y-4 max-w-3xl">
            <div>
              <SectionBadge title="Chapter 03 · Production Spectrum" />
            </div>

            <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Three creative disciplines. Engineered for civic impact.
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-zinc-400 leading-relaxed max-w-2xl">
              We do not produce 200-page donor PDFs that nobody reads. We craft media formats people argue about in matatus, dissect in county barazas, and share on social feeds.
            </p>
          </div>

          {/* Carousel Navigation Buttons (Visible on mobile/tablet to avoid vertical scrolling) */}
          <div className="flex lg:hidden items-center gap-3 shrink-0 self-start md:self-end">
            <button
              type="button"
              onClick={scrollLeft}
              aria-label="Scroll left"
              className="flex size-10 sm:size-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={scrollRight}
              aria-label="Scroll right"
              className="flex size-10 sm:size-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        {/* 02 — CATEGORY FILTER TABS */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-6 border-b border-zinc-800/80">
          {DISCIPLINE_TABS.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setActiveIndex(0);
                }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-mono font-semibold transition-all whitespace-nowrap outline-none cursor-pointer",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                    : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-white"
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full",
                    isSelected ? "bg-black/20 text-white" : "bg-zinc-800 text-zinc-400"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 03 — DISCIPLINE CARDS: MOBILE HORIZONTAL SNAP CAROUSEL / DESKTOP BALANCED 3-COL */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className={cn(
            "pt-6 sm:pt-8 pb-4",
            "flex overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0",
            "lg:grid lg:grid-cols-3 gap-6 w-full"
          )}
        >
          {filteredDisciplines.map((discipline) => (
            <article
              key={discipline.id}
              className="w-[85vw] max-w-[360px] sm:max-w-[420px] lg:w-full shrink-0 snap-center flex flex-col justify-between rounded-3xl border border-zinc-800/90 bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-md hover:border-zinc-700 transition-all shadow-2xl group"
            >
              <div>
                {/* 3D Skeuomorphic Visual Artifact */}
                <div className="relative w-32 h-32 sm:w-44 sm:h-44 mx-auto mb-5 sm:mb-6 flex items-center justify-center rounded-2xl overflow-hidden bg-black/70 border border-zinc-800/60 shadow-inner group-hover:scale-105 transition-transform duration-500">
                  <Image
                    src={discipline.imageSrc}
                    alt={discipline.imageAlt}
                    fill
                    sizes="(max-width: 640px) 128px, (max-width: 1024px) 176px, 240px"
                    className="object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Eyebrow & Title */}
                <div className="space-y-1 mb-3">
                  <span className="font-mono text-[10px] font-bold text-primary uppercase tracking-wider">
                    {discipline.badge}
                  </span>
                  <h3 className="font-heading text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight">
                    {discipline.title}
                  </h3>
                  <p className="font-mono text-[11px] text-zinc-400">
                    {discipline.subtitle}
                  </p>
                </div>

                {/* Editorial Description */}
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                  {discipline.description}
                </p>

                {/* Capabilities Checklist */}
                <div className="pt-4 border-t border-zinc-800/80 mb-6">
                  <p className="font-mono text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-3">
                    Capabilities & Delivery
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
                  href={`/bns-studio/work?format=${encodeURIComponent(discipline.primaryFormatQuery)}`}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-800/80 hover:bg-primary hover:text-primary-foreground px-4 py-3 text-xs font-heading font-bold text-white transition-all shadow-sm group-hover:bg-primary group-hover:text-primary-foreground whitespace-nowrap"
                >
                  <span>Explore Portfolio</span>
                  <ArrowUpRight className="size-4 shrink-0" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile Pagination Indicator Dots */}
        {filteredDisciplines.length > 1 && (
          <div className="flex lg:hidden items-center justify-center gap-2 pt-4">
            {filteredDisciplines.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={cn(
                  "size-2 rounded-full transition-all cursor-pointer",
                  activeIndex === idx
                    ? "bg-primary w-6"
                    : "bg-zinc-700 hover:bg-zinc-500"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
