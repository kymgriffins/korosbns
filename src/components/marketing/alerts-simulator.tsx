"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Bell, Sparkles, Send, CheckCircle2, AlertTriangle, ArrowRight, UserCheck } from "lucide-react";
import { Button } from "@/ui/button";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";

export default function AlertsSimulator() {
  const [step, setStep] = useState<"alert" | "typing" | "done">("alert");
  const [county, setCounty] = useState("Nairobi");
  const shouldReduceMotion = useReducedMotion();

  const mockText = `PUBLIC PARTICIPATION BUDGET MEMORANDUM
County: Nairobi County
Document: CFSP FY 2026/27

[Observation]: The proposed KES 450M allocation for Governor's office upgrades exceeds dispensary supplies by 10x.
[Legal Basis]: Section 107 of PFM Act 2012 requires minimum 30% development spending and Article 201 mandates prudent resource use.
[Action]: Reallocate KES 200M to purchase local dispensary medical supplies.`;

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

  const countiesList = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Kiambu"];

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
              We track county portals and notify you when budget doors open. Our system matches your county, pulls relevant data, and generates a structured memorandum. You can submit it directly to your county assembly with a single tap.
            </p>

            {/* County Switcher */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-extrabold">
                Select county to simulate:
              </span>
              <div className="flex flex-wrap gap-2">
                {countiesList.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setCounty(c); handleRestart(); }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                      county === c
                        ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "bg-card border-border text-muted-foreground hover:border-foreground/30"
                    }`}
                  >
                    {c}
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
                            <span className="text-xs font-black uppercase tracking-wider">County Alert</span>
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-sm font-black text-foreground">{county} County Alert</h4>
                            <p className="text-[10px] text-muted-foreground">
                              Proposed County Fiscal Strategy Paper (CFSP) has open comments for 3 more days.
                            </p>
                          </div>
                        </div>
                        <div className="p-3.5 bg-muted/40 border border-border rounded-2xl space-y-2.5 text-[11px]">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Document Type</span>
                            <span className="font-bold text-foreground">CFSP 2026/27</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Target Segment</span>
                            <span className="font-bold text-foreground">Development Caps</span>
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
                            The document has been securely forwarded to the {county} County Assembly public participation registry.
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
