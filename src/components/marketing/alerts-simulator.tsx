"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Sprout,
  Store,
  HeartPulse,
  Home,
  Wifi,
  Route,
  BookOpen,
  Droplets,
} from "lucide-react";
import { Button } from "@/ui/button";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";

interface SectorData {
  label: string;
  allocation: string;
  shortLabel: string;
  color: string;
  icon: React.ElementType;
  slides: {
    title: string;
    value: string;
    body: string;
    accent: string;
  }[];
}

const SECTORS: Record<string, SectorData> = {
  Agriculture: {
    label: "Agriculture & Food Security",
    shortLabel: "Agriculture",
    allocation: "KES 52.4B",
    color: "from-emerald-700 via-green-600 to-lime-500",
    icon: Sprout,
    slides: [
      { title: "Budget Allocation", value: "KES 52.4B", body: "Total allocation to agriculture and food security for FY 2026/27", accent: "Food security" },
      { title: "The Gap", value: "68%", body: "Only 32% reaches smallholder farmers — rest lost to overhead and untracked subsidies", accent: "Last-mile leakage" },
      { title: "Your Action", value: "Demand transparency", body: "Insist on public beneficiary lists for all fertiliser and seed programmes within 14 days of disbursement", accent: "PFM Act 2012 §25" },
    ],
  },
  MSMEs: {
    label: "MSME Development",
    shortLabel: "MSMEs",
    allocation: "KES 18.7B",
    color: "from-amber-700 via-yellow-600 to-orange-400",
    icon: Store,
    slides: [
      { title: "Budget Allocation", value: "KES 18.7B", body: "Allocated to MSME development and enterprise support", accent: "Enterprise fund" },
      { title: "The Gap", value: "88%", body: "Only 12% of registered MSME hubs have received operational funding since gazettement", accent: "Disbursement failure" },
      { title: "Your Action", value: "Track disbursement", body: "Demand a quarterly MSME fund dashboard with ward-level breakdowns and a complaint channel for delayed payments", accent: "Accountability tool" },
    ],
  },
  Healthcare: {
    label: "Universal Health Coverage",
    shortLabel: "Healthcare",
    allocation: "KES 47.3B",
    color: "from-rose-700 via-red-600 to-pink-400",
    icon: HeartPulse,
    slides: [
      { title: "Budget Allocation", value: "KES 47.3B", body: "Allocated to SHA rollout and primary healthcare", accent: "UHC fund" },
      { title: "The Gap", value: "40%", body: "Flagged for admin contracts — not frontline facilities or community health worker stipends", accent: "Admin bloat" },
      { title: "Your Action", value: "Ring-fence frontline care", body: "Push for 60% minimum of SHA allocation to direct facility improvements; cap admin at 15%", accent: "PFM Act 2012 §107" },
    ],
  },
  Housing: {
    label: "Housing & Settlement",
    shortLabel: "Housing",
    allocation: "KES 31.2B",
    color: "from-blue-800 via-blue-600 to-sky-400",
    icon: Home,
    slides: [
      { title: "Budget Allocation", value: "KES 31.2B", body: "Affordable housing programme budget", accent: "Housing fund" },
      { title: "The Gap", value: "4%", body: "Only 8,000 of 200,000 target units completed — KES 31.2B spent for 4% delivery", accent: "Delivery crisis" },
      { title: "Your Action", value: "Audit the programme", body: "Demand a per-county completion tracker with photographic proof and independent audit reports before next tranche", accent: "Value for money" },
    ],
  },
  Digital: {
    label: "Digital Superhighway",
    shortLabel: "Digital",
    allocation: "KES 15.8B",
    color: "from-blue-800 via-blue-600 to-blue-400",
    icon: Wifi,
    slides: [
      { title: "Budget Allocation", value: "KES 15.8B", body: "Digital infrastructure and connectivity budget", accent: "Digital fund" },
      { title: "The Gap", value: "12%", body: "Only 12% of planned public Wi-Fi hotspots operational outside Nairobi and Mombasa", accent: "Urban bias" },
      { title: "Your Action", value: "Connectivity audits", body: "Insist on quarterly connectivity audits for all 47 counties with a live dashboard of active vs planned hotspots per ward", accent: "Digital inclusion" },
    ],
  },
  Roads: {
    label: "Roads & Infrastructure",
    shortLabel: "Roads",
    allocation: "KES 178.6B",
    color: "from-orange-800 via-orange-600 to-yellow-400",
    icon: Route,
    slides: [
      { title: "Budget Allocation", value: "KES 178.6B", body: "Roads and infrastructure development budget", accent: "Infrastructure fund" },
      { title: "The Gap", value: "40%", body: "Only 40% goes to actual tarmacking — 60% consumed by debt repayments and design fees", accent: "Spending efficiency" },
      { title: "Your Action", value: "Per-km cost breakdown", body: "Demand per-kilometre cost breakdowns for all projects over KES 100M and a weekly delayed-project tracker", accent: "Public Works Act" },
    ],
  },
  Education: {
    label: "Education",
    shortLabel: "Education",
    allocation: "KES 784.5B",
    color: "from-emerald-800 via-emerald-600 to-emerald-400",
    icon: BookOpen,
    slides: [
      { title: "Budget Allocation", value: "KES 784.5B", body: "Total education sector budget", accent: "Education fund" },
      { title: "The Gap", value: "18%", body: "Capitation per learner frozen for 3 years despite 18% cumulative inflation — schools squeezed", accent: "Inflation erosion" },
      { title: "Your Action", value: "Index capitation", body: "Push for inflation-indexed capitation rates and school-level financial transparency portals for all recipients", accent: "Right to education" },
    ],
  },
  Water: {
    label: "Water & Sanitation",
    shortLabel: "Water",
    allocation: "KES 26.4B",
    color: "from-cyan-800 via-teal-600 to-emerald-400",
    icon: Droplets,
    slides: [
      { title: "Budget Allocation", value: "KES 26.4B", body: "Water and sanitation sector budget", accent: "Water fund" },
      { title: "The Gap", value: "45%", body: "Of rural water projects remain incomplete beyond their scheduled completion date — no penalties invoked", accent: "Project delays" },
      { title: "Your Action", value: "Enforce deadlines", body: "Demand penalty enforcement on all water contracts exceeding deadline by 6+ months and a national completion tracker", accent: "Contract compliance" },
    ],
  },
};

const sectorKeys = Object.keys(SECTORS);

const SLIDE_INTERVAL = 4500;

export default function AlertsSimulator() {
  const [sector, setSector] = useState(sectorKeys[0]);
  const [slideIdx, setSlideIdx] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sd = SECTORS[sector];

  const resetCarousel = useCallback((s: string) => {
    setSector(s);
    setSlideIdx(0);
  }, []);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % sd.slides.length);
    }, SLIDE_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sector, sd.slides.length]);

  const slide = sd.slides[slideIdx];
  const Icon = sd.icon;

  return (
    <section className="relative w-full py-24 bg-background border-b border-border overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-full h-full opacity-5 blur-[120px] pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[35vw] h-[35vw] bg-primary rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-teal-500 rounded-full" />
      </div>

      <div className={`${SECTION_SHELL_INNER} max-w-7xl`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            <span className="inline-block text-xs uppercase tracking-widest text-primary font-black">
              Civic Intelligence
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-none">
              Actionable stories for <br />
              civic engagement <br />
              and democratic audit.
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              We translate dry budget allocations into sharp, sector-by-sector narratives that show you exactly where public money is falling short — and what you can do about it before the window closes.
            </p>

            <div className="space-y-3 pt-2">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-extrabold">
                Select a sector to simulate:
              </span>
              <div className="flex flex-wrap gap-2">
                {sectorKeys.map((s) => (
                  <button
                    key={s}
                    onClick={() => resetCarousel(s)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                      sector === s
                        ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "bg-card border-border text-muted-foreground hover:border-foreground/30"
                    }`}
                  >
                    {SECTORS[s].shortLabel}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <a href="/learn">
                <Button size="lg" className="rounded-full px-6 gap-2">
                  Opt-in to Alerts <ArrowRight className="size-4" />
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Phone Mockup — Story Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1], delay: 0.1 }}
            className="lg:col-span-7 flex justify-center items-center"
          >
            <div className="relative w-full max-w-[340px] h-[580px] rounded-[40px] border-[6px] border-border bg-black p-3 shadow-2xl overflow-hidden">
              {/* Camera Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-b-xl z-30 flex items-center justify-center">
                <div className="size-2 bg-card rounded-full mr-2" />
                <div className="w-8 h-1 bg-muted-foreground/20 rounded-full" />
              </div>

              {/* Story Container */}
              <div className="relative w-full h-full rounded-[30px] overflow-hidden bg-black">

                {/* Story Progress Bar */}
                <div className="absolute top-3 left-3 right-3 z-20 flex gap-1">
                  {sd.slides.map((_, i) => (
                    <div key={i} className="flex-1 h-0.5 rounded-full bg-white/20 overflow-hidden">
                      <motion.div
                        className="h-full bg-white rounded-full"
                        initial={{ scaleX: i < slideIdx ? 1 : 0, transformOrigin: "left" }}
                        animate={
                          i === slideIdx
                            ? { scaleX: 1 }
                            : i < slideIdx
                              ? { scaleX: 1 }
                              : { scaleX: 0 }
                        }
                        transition={
                          i === slideIdx
                            ? { duration: SLIDE_INTERVAL / 1000, ease: "linear" }
                            : { duration: 0 }
                        }
                      />
                    </div>
                  ))}
                </div>

                {/* Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${sd.color} transition-all duration-700`}
                />

                {/* Pattern overlay */}
                <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.3)_0%,transparent_50%),radial-gradient(circle_at_75%_75%,rgba(255,255,255,0.2)_0%,transparent_50%)]"
                />

                {/* Slide content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${sector}-${slideIdx}`}
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? {} : { opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
                    className="relative z-10 flex flex-col justify-end h-full p-6 pb-12"
                  >
                    {/* Sector icon chip */}
                    <div className="absolute top-12 left-6 flex items-center gap-2 bg-black/25 backdrop-blur-sm rounded-full px-3 py-1.5 text-[10px] text-white/90 font-bold uppercase tracking-wider">
                      <Icon className="size-3" />
                      {sd.shortLabel}
                    </div>

                    {/* Stat Card */}
                    <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold">
                            {slide.title}
                          </p>
                          <p className="text-2xl font-black text-white mt-0.5 leading-none">
                            {slide.value}
                          </p>
                        </div>
                        <span className="text-[9px] uppercase tracking-wider bg-white/10 rounded-full px-2.5 py-1 text-white/70 font-bold whitespace-nowrap">
                          {slide.accent}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/70 leading-relaxed">
                        {slide.body}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Bottom gradient fade */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
