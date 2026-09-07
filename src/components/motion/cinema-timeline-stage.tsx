"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Film,
  Play,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Mic,
  Video,
  Palette,
  Radio,
} from "lucide-react";

interface FormatItem {
  id: string;
  name: string;
  aspectRatio: string;
  discipline: string;
  leadStat: string;
  description: string;
  clientUse: string;
}

const FORMAT_ITEMS: FormatItem[] = [
  {
    id: "documentaries",
    name: "Cinema Documentaries",
    aspectRatio: "21:9 Widescreen",
    discipline: "Long-Form Film & Field Audio",
    leadStat: "480K+ Organic Reach",
    description: "Broadcast-grade documentary features shot in 4K anamorphic, capturing the human stakes of public spending and corruption from village barazas to ministry corridors.",
    clientUse: "Commissioned by development banks, foreign embassies, and global civil society coalitions.",
  },
  {
    id: "animations",
    name: "2D & Motion Explainers",
    aspectRatio: "16:9 & 9:16 Vertical",
    discipline: "Vector & Cel Animation",
    leadStat: "82% Completion Rate",
    description: "High-velocity kinetic typography and character animation that turns 80-page debt amortizations and tax bills into 60-second viral explainers.",
    clientUse: "Syndicated across TikTok, Instagram Reels, and national high school civic clubs.",
  },
  {
    id: "podcasts",
    name: "Podcasts & Soundscapes",
    aspectRatio: "Bilingual Dolby Audio",
    discipline: "Audio Journalism",
    leadStat: "24-Episode Series",
    description: "The official Budget Ndio Story podcast, featuring field recordings from rural town halls, interviews with ex-Treasury officials, and youth roundtable debates.",
    clientUse: "Syndicated on Spotify, Apple Podcasts, and 14 regional vernacular radio stations.",
  },
  {
    id: "townhalls",
    name: "Multi-Camera Town Halls",
    aspectRatio: "Live Broadcast 1080p60",
    discipline: "Live Production & Streaming",
    leadStat: "2,500+ Live Attendees",
    description: "High-production-value public forums connecting Governors and Treasury officials directly with citizens, streamed simultaneously to thousands online.",
    clientUse: "Hosted in Nairobi, Kilifi, Nakuru, and Kisumu with unscripted citizen microphone sessions.",
  },
];

export function CinemaTimelineStage() {
  const [selectedFormatId, setSelectedFormatId] = useState<string>("documentaries");
  const activeFormat = FORMAT_ITEMS.find((f) => f.id === selectedFormatId) || FORMAT_ITEMS[0];

  return (
    <div className="relative my-12 overflow-hidden rounded-3xl border border-primary/40 bg-card p-6 sm:p-10 shadow-2xl">
      {/* Top Cinema Slate HUD */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-5 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex size-2 rounded-full bg-red-600 animate-ping" />
          <span className="font-bold text-red-600 uppercase tracking-widest">REC [●]</span>
          <span className="text-muted-foreground">00:24:18:09 · 21:9 ANAMORPHIC DCI</span>
        </div>

        {/* Format Selector Pills */}
        <div className="flex flex-wrap gap-1.5">
          {FORMAT_ITEMS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelectedFormatId(f.id)}
              className={`rounded-full px-3 py-1 transition-all ${
                selectedFormatId === f.id
                  ? "bg-primary text-white font-bold shadow-xs"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Viewport */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFormat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs text-primary">
                <Film className="size-3.5" />
                <span className="font-bold uppercase tracking-wider">{activeFormat.aspectRatio}</span>
                <span className="text-muted-foreground">· {activeFormat.discipline}</span>
              </div>

              <h3 className="font-heading text-3xl sm:text-4xl font-black text-foreground leading-tight">
                {activeFormat.name}
              </h3>

              <p className="text-sm sm:text-base text-foreground/80 leading-relaxed font-medium">
                {activeFormat.description}
              </p>

              <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 space-y-1">
                <span className="font-mono text-[10px] uppercase font-bold text-primary">
                  Commissioned Procurement Profile:
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {activeFormat.clientUse}
                </p>
              </div>
            </div>

            {/* Right Stat & Covenant Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-primary/20 pb-2 text-xs font-mono">
                  <span className="font-bold text-primary uppercase">PRODUCTION BENCHMARK</span>
                  <span className="text-muted-foreground">VERIFIED</span>
                </div>
                <p className="text-3xl sm:text-4xl font-black text-primary tracking-tighter">
                  {activeFormat.leadStat}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Achieved organically without synthetic advertising scale, proving that high aesthetic craft commands genuine audience loyalty.
                </p>
              </div>

              {/* The Sovereign Covenant Callout */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="size-4" />
                  <span>The Double-Impact Reinvestment Covenant</span>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  100% of operating surplus from commercial client commissions is legally pledged to fund grassroots audit scorecards and newsroom fellowships in all 47 counties.
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
