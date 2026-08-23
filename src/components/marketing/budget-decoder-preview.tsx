"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GsapReveal } from "@/motion/gsap";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Building2, Landmark, PieChart, ShieldAlert } from "lucide-react";
import { cn } from "@/utils";

type BudgetSector = {
  id: string;
  name: string;
  amount: string;
  percentage: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  insight: string;
  keyProjects: string[];
};

const SECTORS: BudgetSector[] = [
  {
    id: "debt",
    name: "Public Debt Servicing",
    amount: "KSh 1.86 Trillion",
    percentage: "43.5%",
    icon: ShieldAlert,
    tagline: "First-charge obligation on national revenue before services.",
    insight: "Over 60 cents of every tax shilling collected by the Kenya Revenue Authority is currently committed to interest and principal redemption.",
    keyProjects: ["Eurobond repayments", "Domestic debt rolling", "External bilateral loans"],
  },
  {
    id: "education",
    name: "Education & Skills",
    amount: "KSh 656 Billion",
    percentage: "15.3%",
    icon: Landmark,
    tagline: "Free primary, secondary capitation, and university funding.",
    insight: "Covers Teachers Service Commission salaries (KSh 360B+), Junior Secondary School infrastructure, and HELB student loans.",
    keyProjects: ["TSC payroll", "JSS classroom grants", "HEF university scholarships"],
  },
  {
    id: "infrastructure",
    name: "Transport & Energy",
    amount: "KSh 416 Billion",
    percentage: "9.7%",
    icon: Building2,
    tagline: "Highways, rural roads, ports, and power distribution.",
    insight: "Balances capital road completion across rural corridors against pending bills owed to local contractors.",
    keyProjects: ["RMLF county road maintenance", "SGR operations", "Last-mile electricity"],
  },
  {
    id: "health",
    name: "Health Services",
    amount: "KSh 146 Billion",
    percentage: "3.4%",
    icon: PieChart,
    tagline: "National referral hospitals, vaccines, and universal health.",
    insight: "While devolved counties manage primary clinics, national allocation funds KEMSA medical commodities and referral hospitals (KNH, MTRH).",
    keyProjects: ["KEMSA supplies", "Social Health Authority transition", "National referral facilities"],
  },
];

export function BudgetDecoderPreview() {
  const [activeSector, setActiveSector] = useState<BudgetSector>(SECTORS[0]);
  const [budgetScope, setBudgetScope] = useState<"national" | "county">("national");

  return (
    <section className="relative w-full bg-slate-950 text-slate-100 py-16 md:py-24 overflow-hidden border-y border-slate-800" id="intelligence">
      {/* Subtle background ambient gradient */}
      <div className="pointer-events-none absolute -left-40 top-0 size-96 rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 size-96 rounded-full bg-emerald-500/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <GsapReveal className="mb-12 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            <Sparkles className="size-3.5" />
            <span>Civic Intelligence Engine</span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            The Budget, Decoded.
          </h2>
          <p className="mt-3 max-w-2xl text-base text-slate-400 sm:text-lg">
            Follow the money from parliamentary appropriation to county implementation. We track allocations in real-time so nothing disappears into footnotes.
          </p>

          {/* Scope Selector Chips */}
          <div className="mt-8 inline-flex items-center rounded-2xl border border-slate-800 bg-slate-900/90 p-1.5 backdrop-blur-md">
            <button
              onClick={() => setBudgetScope("national")}
              className={cn(
                "rounded-xl px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300",
                budgetScope === "national"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-slate-400 hover:text-white"
              )}
            >
              National Budget (KSh 4.28T)
            </button>
            <button
              onClick={() => setBudgetScope("county")}
              className={cn(
                "rounded-xl px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300",
                budgetScope === "county"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-slate-400 hover:text-white"
              )}
            >
              Equitable County Share (KSh 400.1B)
            </button>
          </div>
        </GsapReveal>

        {/* Interactive Decoder Console */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 items-start">
          {/* Sector Buttons */}
          <div className="flex flex-col gap-3 lg:col-span-5">
            {SECTORS.map((sector) => {
              const Icon = sector.icon;
              const isSelected = activeSector.id === sector.id;
              return (
                <button
                  key={sector.id}
                  onClick={() => setActiveSector(sector)}
                  className={cn(
                    "group flex items-center justify-between rounded-2xl border p-4 sm:p-5 text-left transition-all duration-300",
                    isSelected
                      ? "border-primary/80 bg-slate-900/90 shadow-lg shadow-primary/5 ring-1 ring-primary/40"
                      : "border-slate-800/80 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60"
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={cn(
                        "inline-flex size-10 items-center justify-center rounded-xl transition-colors",
                        isSelected ? "bg-primary text-primary-foreground" : "bg-slate-800 text-slate-400 group-hover:text-white"
                      )}
                    >
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{sector.name}</h4>
                      <p className="text-xs text-slate-400">{sector.amount}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-slate-300">
                    {sector.percentage}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detailed Forensic Inspector Card */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-5">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
                    Sector Analysis
                  </span>
                  <h3 className="mt-1 text-2xl font-black text-white sm:text-3xl">
                    {activeSector.name}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold text-emerald-400 sm:text-3xl">
                    {activeSector.amount}
                  </div>
                  <p className="text-xs text-slate-400">{activeSector.percentage} of expenditure</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Editorial Takeaway
                  </p>
                  <p className="text-sm leading-relaxed text-slate-200">
                    {activeSector.insight}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Key Expenditure Lines
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeSector.keyProjects.map((item) => (
                      <span
                        key={item}
                        className="rounded-xl border border-slate-700/60 bg-slate-800/80 px-3 py-1.5 text-xs text-slate-200"
                      >
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-400">
                Data source: National Treasury Estimates & Controller of Budget (OCOB).
              </p>
              <Button asChild className="w-full sm:w-auto bg-primary text-primary-foreground font-bold shadow-md hover:bg-primary/90">
                <Link href="/reports">
                  <span>Explore Interactive Tracker</span>
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BudgetDecoderPreview;
