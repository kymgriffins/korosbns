"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Eye,
  EyeOff,
  Newspaper,
  ShieldAlert,
  Award,
  ExternalLink,
  Search,
} from "lucide-react";

interface NewsroomCase {
  id: string;
  headline: string;
  publication: string;
  fellow: string;
  bureau: string;
  leakSubject: string;
  redactedAmount: string;
  revealedDetail: string;
  impactScore: string;
}

const NEWSROOM_CASES: NewsroomCase[] = [
  {
    id: "hospitality-ghosts",
    headline: "How KSh 2.4 Billion in County Travel Disappeared into Non-Existent Workshops",
    publication: "Daily Nation / Investigative Desk",
    fellow: "Brian Ochieng (Cohort 03)",
    bureau: "Western Kenya News Hub",
    leakSubject: "Vote 4012: County Executive Hospitality & Per Diem Requisitions",
    redactedAmount: "KSh 2,420,000,000",
    revealedDetail: "Per diem claims submitted for 42 county officers attending a climate workshop in Mombasa on dates when airline manifests showed only 3 officers traveled.",
    impactScore: "Ethics & Anti-Corruption Commission (EACC) opened formal recovery proceedings; 7 county accountants suspended.",
  },
  {
    id: "road-tarmac-ghost",
    headline: "The Ghost Highway: Shilling-by-Shilling Breakdown of an Unpaved 30km Link",
    publication: "The Standard / Sunday Special",
    fellow: "Amina Hassan (Cohort 02)",
    bureau: "Coast Devolution Desk",
    leakSubject: "IFMIS Voucher Batch #7819-A: Periodic Road Maintenance Fund",
    redactedAmount: "KSh 480,000,000",
    revealedDetail: "Full contract balance wired to an offshore subcontractor registered 4 days before tender closure, with zero heavy machinery deployed to site.",
    impactScore: "Contract terminated by Public Procurement Regulatory Authority (PPRA); funds frozen in escrow.",
  },
  {
    id: "medical-consortium",
    headline: "Procurement Cartels: Why Rural Dispensaries Wait 9 Months for Essential Syringes",
    publication: "The EastAfrican",
    fellow: "Kevin Mutua (Cohort 04)",
    bureau: "Nairobi Data Bureau",
    leakSubject: "Framework Contract #MED-2024: Essential Medical Supplies",
    redactedAmount: "KSh 890,000,000",
    revealedDetail: "Single-source procurement markup of 340% on basic pharmaceuticals compared to direct KEMSA catalogue pricing.",
    impactScore: "Senate Health Committee summoned 5 Governors for public inquiry into single-source medical tenders.",
  },
];

export function ForensicLightTable() {
  const [selectedId, setSelectedId] = useState<string>("hospitality-ghosts");
  const [isUnredacted, setIsUnredacted] = useState<boolean>(false);
  const activeCase = NEWSROOM_CASES.find((c) => c.id === selectedId) || NEWSROOM_CASES[0];

  return (
    <div className="relative my-10 py-8 border-y border-red-500/30">
      {/* Light Table Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="size-2 rounded-full bg-red-600 animate-ping" />
          <span className="font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
            Forensic Newsroom Light-Table
          </span>
          <span className="text-muted-foreground">· 364-Day Investigative Desk</span>
        </div>

        {/* Dossier Tabs */}
        <div className="flex flex-wrap gap-1.5 font-mono text-xs">
          {NEWSROOM_CASES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setSelectedId(c.id);
                setIsUnredacted(false);
              }}
              className={`rounded-full px-3 py-1 transition-all ${
                selectedId === c.id
                  ? "bg-red-600 text-white font-bold shadow-xs"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.fellow.split(" ")[0]}&apos;s Scoop
            </button>
          ))}
        </div>
      </div>

      {/* Main Light Table Body */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Investigative Lead & Headline */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs text-red-600 dark:text-red-400">
              <Newspaper className="size-3.5" />
              <span className="font-bold uppercase tracking-wider">{activeCase.publication}</span>
              <span className="text-muted-foreground">· By {activeCase.fellow}</span>
            </div>
            <h3 className="font-heading text-2xl sm:text-3xl font-black text-foreground leading-snug">
              &ldquo;{activeCase.headline}&rdquo;
            </h3>
          </div>

          {/* Interactive Redacted Light-Table Document (Unboxed Editorial Memo) */}
          <div className="space-y-4 font-mono text-xs pt-2">
            <div className="flex items-center justify-between border-b border-red-500/20 pb-2">
              <span className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <Search className="size-3.5" />
                OCOB AUDIT DISCREPANCY MEMO
              </span>
              <button
                type="button"
                onClick={() => setIsUnredacted(!isUnredacted)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white font-bold text-[11px] hover:bg-red-700 transition-colors shadow-xs"
              >
                {isUnredacted ? (
                  <>
                    <EyeOff className="size-3" />
                    <span>Hide Unredacted Evidence</span>
                  </>
                ) : (
                  <>
                    <Eye className="size-3" />
                    <span>Click to Reveal Unredacted Wire</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-muted-foreground">{activeCase.leakSubject}</p>

            <div className="flex items-baseline gap-2 py-1">
              <span className="text-muted-foreground">Flagged Discrepancy Amount:</span>
              <span className="font-bold text-red-600 dark:text-red-400 text-base">
                {activeCase.redactedAmount}
              </span>
            </div>

            {/* Unredacted Field Evidence with editorial accent border */}
            <div className="border-l-2 border-red-500 pl-4 py-1.5 space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground font-mono">
                Unredacted Field Evidence:
              </span>
              {isUnredacted ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-foreground text-sm leading-relaxed font-sans font-medium"
                >
                  {activeCase.revealedDetail}
                </motion.p>
              ) : (
                <p className="bg-foreground/15 text-transparent select-none rounded px-1 text-sm blur-[3px]">
                  {activeCase.revealedDetail}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Institutional Accountability & Fellow Pipeline (Flat Editorial Sidebar) */}
        <div className="lg:col-span-5 lg:border-l lg:border-border/40 lg:pl-8 space-y-6 divide-y divide-border/40">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-foreground uppercase">
              <ShieldAlert className="size-4 text-red-500" />
              <span>Investigative Impact Outcome</span>
            </div>
            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
              {activeCase.impactScore}
            </p>
          </div>

          <div className="pt-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-foreground">
              <Award className="size-4 text-red-500" />
              <span>Wanahabari Newsroom Fellowship</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We provide 6-month stipends, encrypted leak drops, and forensic accounting software to reporters across 18 regional newsrooms, ensuring fiscal scrutiny continues long after Budget Day.
            </p>
            <div className="pt-1 flex items-center justify-between text-[11px] font-mono">
              <span className="text-muted-foreground">Trained Alumni</span>
              <span className="font-bold text-red-600 dark:text-red-400">120+ Active Fellows</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
