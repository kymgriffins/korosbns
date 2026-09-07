"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Radio,
  FileCheck,
  AlertOctagon,
  CheckCircle,
  Clock,
  Compass,
  Volume2,
} from "lucide-react";

interface FieldAuditCase {
  id: string;
  county: string;
  ward: string;
  coordinates: string;
  project: string;
  budgeted: string;
  status: "FLAGGED_DISCREPANCY" | "RECTIFIED" | "ACTION_ENFORCED";
  finding: string;
  actionTaken: string;
  barazaParticipants: number;
  radioReach: string;
}

const FIELD_CASES: FieldAuditCase[] = [
  {
    id: "kilifi-water",
    county: "Kilifi County",
    ward: "Kaloleni Ward",
    coordinates: "3°48'12\"S 39°39'24\"E",
    project: "Solar Hybrid Borehole & Water Kiosk",
    budgeted: "KSh 14,800,000",
    status: "ACTION_ENFORCED",
    finding: "County Gazette recorded project at '95% Commissioned'. Field monitors discovered dry bore shaft, missing solar inverter, and disconnected plastic holding tank.",
    actionTaken: "BNS Mashinani hosted village baraza with Ward Representative. Community withheld completion sign-off; contractor returned and installed functional 5.5kW solar array.",
    barazaParticipants: 240,
    radioReach: "180K listeners on Kaya FM",
  },
  {
    id: "nakuru-maternity",
    county: "Nakuru County",
    ward: "Subukia Ward",
    coordinates: "0°04'30\"N 36°14'45\"E",
    project: "Level 3 Dispensary Maternity Wing",
    budgeted: "KSh 22,500,000",
    status: "FLAGGED_DISCREPANCY",
    finding: "Budget line allocated KSh 22.5M over 2 fiscal years. Physical inspection revealed structure roofed but unpainted, with zero plumbing, no staff housing, and overgrown weeds.",
    actionTaken: "Youth monitors compiled verified photo dossier and presented it before County Assembly Health Committee. Supplementary budget re-allocated KSh 6.2M for immediate completion.",
    barazaParticipants: 310,
    radioReach: "240K listeners on Radio Amani",
  },
  {
    id: "wajir-feeder",
    county: "Wajir County",
    ward: "Tarbaj Ward",
    coordinates: "1°45'22\"N 40°03'15\"E",
    project: "Bush Clearing & Rural Feeder Road Murraming",
    budgeted: "KSh 18,200,000",
    status: "RECTIFIED",
    finding: "Heavy grader clocked only 4 days on site before departing. 18km stretch remained impassable sand, blocking emergency clinic access for livestock pastoralists.",
    actionTaken: "Community elders held tree-shade baraza broadcast live on local vernacular radio. County Roads Executive summoned contractor back to site; full 18km graded and compacted.",
    barazaParticipants: 185,
    radioReach: "120K listeners on Star FM",
  },
];

export function FieldNotebookSpread() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>("kilifi-water");
  const activeCase = FIELD_CASES.find((c) => c.id === selectedCaseId) || FIELD_CASES[0];

  return (
    <div className="relative my-12 overflow-hidden rounded-3xl border border-amber-500/30 bg-card p-6 sm:p-10 shadow-2xl">
      {/* Top Field Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div className="flex items-center gap-2 font-mono text-xs">
          <Compass className="size-4 text-amber-600 dark:text-amber-400 animate-spin-slow" />
          <span className="font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Field Monitor Dossier
          </span>
          <span className="text-muted-foreground">· 47-County Grassroots Ledger</span>
        </div>

        {/* Coordinate / County Selector Pills */}
        <div className="flex flex-wrap gap-1.5 font-mono text-xs">
          {FIELD_CASES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedCaseId(item.id)}
              className={`rounded-full px-3 py-1 transition-all ${
                selectedCaseId === item.id
                  ? "bg-amber-500 text-black font-bold shadow-xs"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.county.replace(" County", "")}
            </button>
          ))}
        </div>
      </div>

      {/* Main Field Journal Notebook View */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCase.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left Page: Forensic Investigation Log */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-xs text-amber-600 dark:text-amber-400">
                  <MapPin className="size-3.5" />
                  <span>{activeCase.ward}, {activeCase.county}</span>
                  <span className="text-muted-foreground">· [{activeCase.coordinates}]</span>
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-black text-foreground leading-tight">
                  {activeCase.project}
                </h3>
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                {activeCase.status === "ACTION_ENFORCED" && (
                  <>
                    <CheckCircle className="size-3.5 text-emerald-500" />
                    <span>STATUS: COMMUNITY SIGN-OFF WITHHELD → CONTRACTOR RETURNED</span>
                  </>
                )}
                {activeCase.status === "FLAGGED_DISCREPANCY" && (
                  <>
                    <AlertOctagon className="size-3.5 text-destructive" />
                    <span>STATUS: BUDGET LINE DISCREPANCY TABLED IN ASSEMBLY</span>
                  </>
                )}
                {activeCase.status === "RECTIFIED" && (
                  <>
                    <CheckCircle className="size-3.5 text-emerald-500" />
                    <span>STATUS: PHYSICAL WORKS COMPLETED &amp; AUDITED</span>
                  </>
                )}
              </div>

              {/* Finding Narrative */}
              <div className="space-y-3 rounded-2xl border border-border/60 bg-muted/30 p-5">
                <p className="font-mono text-xs uppercase font-bold text-muted-foreground">
                  The Ground Reality Check:
                </p>
                <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-medium">
                  {activeCase.finding}
                </p>
                <div className="pt-2 border-t border-border/40 space-y-1">
                  <p className="font-mono text-xs uppercase font-bold text-emerald-600 dark:text-emerald-400">
                    Direct Community Impact:
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {activeCase.actionTaken}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Page: Tactical Baraza Metadata & Field Tools */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-3 font-mono text-xs">
                  <span className="font-bold text-amber-600 dark:text-amber-400 uppercase">
                    BARAZA AUDIT METRICS
                  </span>
                  <span className="text-muted-foreground">VERIFIED</span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground">Gazette Budget Allocation</span>
                    <span className="font-bold text-foreground">{activeCase.budgeted}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground">Direct Baraza Attendees</span>
                    <span className="font-bold text-foreground">{activeCase.barazaParticipants} Citizens</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-muted-foreground">Vernacular Radio Broadcast</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{activeCase.radioReach}</span>
                  </div>
                </div>
              </div>

              {/* The Physical Waterproof Scorecard Feature */}
              <div className="rounded-2xl border border-border/60 bg-card p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-foreground">
                  <FileCheck className="size-4 text-amber-500" />
                  <span>The Waterproof Scorecard Standard</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We don&rsquo;t ask rural citizens to download 20MB apps in areas with intermittent 2G signal. We print laminated Swahili checklists with 5 simple visual verification benchmarks.
                </p>
                <div className="pt-1 flex items-center gap-2 text-[11px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
                  <Radio className="size-3.5" />
                  <span>Syndicated across 14 community radio stations</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
