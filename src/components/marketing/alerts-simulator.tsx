"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Bell, Sparkles, Send, CheckCircle2, AlertTriangle, ArrowRight, UserCheck } from "lucide-react";
import { Button } from "@/ui/button";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";

interface SectorData {
  label: string;
  allocation: string;
  observation: string;
  action: string;
}

const SECTORS: Record<string, SectorData> = {
  "Agriculture": {
    label: "Agriculture & Food Security",
    allocation: "KES 52.4B",
    observation: "Only 32% of the KES 52.4B agriculture allocation reaches smallholder farmers directly — the rest goes to administrative overhead and fertiliser subsidies with limited last-mile tracking.",
    action: "Mandate county-level publication of beneficiary lists for all fertiliser and seed distribution programmes within 14 days of disbursement.",
  },
  "MSMEs": {
    label: "MSME Development",
    allocation: "KES 18.7B",
    observation: "The KES 18.7B MSME allocation lacks a transparent disbursement schedule — only 12% of registered MSME hubs have received any operational funding since gazettement.",
    action: "Publish a quarterly MSME fund disbursement dashboard with ward-level breakdowns and establish a direct complaint channel for delayed payments.",
  },
  "Healthcare": {
    label: "Universal Health Coverage",
    allocation: "KES 47.3B",
    observation: "KES 47.3B is allocated to SHA rollout but 40% is flagged for administrative contracts rather than frontline facility upgrades or community health promoter stipends.",
    action: "Ring-fence at least 60% of the SHA allocation for direct facility improvements and cap administrative contracting at 15% per county.",
  },
  "Housing": {
    label: "Housing & Settlement",
    allocation: "KES 31.2B",
    observation: "The affordable housing programme reports only 8,000 units completed against a target of 200,000 — that's 4% delivery with KES 31.2B spent.",
    action: "Publish a per-county housing completion tracker with photographic evidence and independent audit reports before additional tranches are released.",
  },
  "Digital": {
    label: "Digital Superhighway",
    allocation: "KES 15.8B",
    observation: "KES 15.8B for digital infrastructure — only 12% of planned public Wi-Fi hotspots are operational in counties outside Nairobi and Mombasa.",
    action: "Mandate quarterly connectivity audits for all 47 counties with public dashboard showing active vs planned hotspots per ward.",
  },
  "Roads": {
    label: "Roads & Infrastructure",
    allocation: "KES 178.6B",
    observation: "KES 178.6B road budget — 60% is consumed by debt repayments and design fees, leaving only 40% for actual tarmacking and maintenance on the ground.",
    action: "Require a per-kilometre cost breakdown for all road projects over KES 100M and publish a delayed-project tracker updated weekly.",
  },
  "Education": {
    label: "Education",
    allocation: "KES 628.6B",
    observation: "KES 628.6B education budget — capitation per learner has not increased in 3 years despite 18% cumulative inflation, squeezing school operations.",
    action: "Index capitation rates to inflation annually and mandate school-level financial transparency portals for all capitation recipients.",
  },
  "Water": {
    label: "Water & Sanitation",
    allocation: "KES 26.4B",
    observation: "KES 26.4B water allocation — 45% of rural water projects remain incomplete beyond their scheduled completion date with no penalty clauses invoked.",
    action: "Enforce penalty clauses on all water contracts exceeding deadline by 6+ months and publish a national water project completion tracker.",
  },
};

const sectorKeys = Object.keys(SECTORS);

export default function AlertsSimulator() {
  const [step, setStep] = useState<"alert" | "typing" | "done">("alert");
  const [sector, setSector] = useState(sectorKeys[0]);
  const shouldReduceMotion = useReducedMotion();

  const sd = SECTORS[sector];
  const mockText = `PUBLIC PARTICIPATION BUDGET MEMORANDUM
Sector: ${sd.label}
Allocation: ${sd.allocation}
Document: BPS 2026/27 — Sectoral Ceilings

[Observation]: ${sd.observation}
[Legal Basis]: Section 25 of PFM Act 2012 mandates public participation in budget-making; Article 201(a) requires openness and accountability in public finance.
[Action]: ${sd.action}`;

  // Typing animation simulation state
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    if (step === "typing") {
      let idx = 0;
      setTypedText("");
      const interval = setInterval(() => {
        if (idx < mockText.length) {
          setTypedText((prev) => prev + mockText.charAt(idx));
          idx++;
        } else {
          clearInterval(interval);
          setTimeout(() => setStep("done"), 1200);
        }
      }, 12);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Restart loop for visual presentation
  const handleRestart = () => {
    setTypedText("");
    setStep("alert");
  };

  return (
    <section className="relative w-full py-24 bg-background border-b border-border overflow-hidden">
      {/* Ambient background glows */}
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
              Citizen Action
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-none">
              Hyper-local alerts. <br />
              Zero friction.
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              We track budget data by sector and notify you when public participation windows open. Our system pulls relevant allocations, identifies gaps, and generates a structured memorandum you can submit to county assembly or national treasury with a single tap.
            </p>

            {/* Sector Switcher */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-extrabold">
                Select a sector to simulate:
              </span>
              <div className="flex flex-wrap gap-2">
                {sectorKeys.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setSector(s); handleRestart(); }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                      sector === s
                        ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "bg-card border-border text-muted-foreground hover:border-foreground/30"
                    }`}
                  >
                    {SECTORS[s].label}
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

          {/* Right Column: Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1], delay: 0.1 }}
            className="lg:col-span-7 flex justify-center items-center"
          >
            <div className="relative w-full max-w-[340px] h-[580px] rounded-[40px] border-[6px] border-border bg-card p-3 shadow-2xl flex flex-col justify-between overflow-hidden">

              {/* Phone Camera Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-muted rounded-b-xl z-25 flex items-center justify-center">
                <div className="size-2 bg-card rounded-full mr-2" />
                <div className="w-8 h-1 bg-muted-foreground/20 rounded-full" />
              </div>

              {/* Status Header */}
              <div className="flex justify-between items-center px-4 pt-1 pb-3 text-[10px] text-muted-foreground font-bold border-b border-border">
                <span>9:41 AM</span>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                  📶 DPA 2019 Secured
                </span>
              </div>

              {/* App Body */}
              <div className="flex-1 py-4 flex flex-col justify-between relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {step === "alert" && (
                    <motion.div
                      key="alert-state"
                      initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="flex-1 flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 text-rose-300 space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="p-1 rounded-md bg-rose-500/20">
                              <Bell className="size-4 text-rose-500 animate-bounce" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-wider">Sector Alert</span>
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-sm font-black text-foreground">{sd.label} — Budget Alert</h4>
                            <p className="text-[10px] text-muted-foreground">
                              Public participation on {sd.label} budget ceilings is open for 3 more days.
                            </p>
                          </div>
                        </div>
                        <div className="p-3.5 bg-muted/40 border border-border rounded-2xl space-y-2.5 text-[11px]">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Allocation</span>
                            <span className="font-bold text-foreground">{sd.allocation}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Document</span>
                            <span className="font-bold text-foreground">BPS 2026/27</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => setStep("typing")}
                        className="w-full rounded-xl py-5 font-bold gap-2 text-xs"
                      >
                        <Sparkles className="size-3.5 fill-current" /> Build Submission Memorandum
                      </Button>
                    </motion.div>
                  )}

                  {step === "typing" && (
                    <motion.div
                      key="typing-state"
                      initial={shouldReduceMotion ? {} : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 flex flex-col justify-between h-full"
                    >
                      <div className="space-y-2">
                        <span className="text-[9px] uppercase tracking-widest font-black text-primary">
                          Drafting Memorandum
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-semibold mb-2">
                          <span className="size-1.5 bg-primary rounded-full animate-ping" />
                          <span>AI generator drafting text...</span>
                        </div>
                        <div className="w-full rounded-xl border border-border bg-card p-3 h-[300px] overflow-y-auto font-mono text-[9px] leading-relaxed text-foreground/80 whitespace-pre-wrap">
                          {typedText}
                          <span className="inline-block w-1.5 h-3 bg-primary animate-pulse ml-0.5" />
                        </div>
                      </div>
                      <Button disabled className="w-full rounded-xl text-xs">
                        Generating...
                      </Button>
                    </motion.div>
                  )}

                  {step === "done" && (
                    <motion.div
                      key="done-state"
                      initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex-1 flex flex-col justify-between"
                    >
                      <div className="my-auto text-center space-y-4">
                        <div className="size-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                          <CheckCircle2 className="size-8 text-emerald-500 animate-pulse" />
                        </div>
                        <div className="space-y-1.5 px-4">
                          <h4 className="text-sm font-black text-foreground uppercase tracking-tight">
                            Memorandum Submitted!
                          </h4>
                          <p className="text-[11px] text-muted-foreground">
                            The memorandum has been securely forwarded to the responsible oversight committee for the {sd.label} sector.
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-center text-[10px] text-emerald-500 font-bold flex items-center justify-center gap-1.5">
                          <UserCheck className="size-3.5" />
                          <span>Logged in citizen profile (+10 SVG)</span>
                        </div>
                        <Button
                          onClick={handleRestart}
                          variant="outline"
                          className="w-full rounded-xl text-xs border-border text-muted-foreground"
                        >
                          Restart Simulator
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
