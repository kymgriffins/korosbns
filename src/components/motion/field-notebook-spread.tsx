"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Radio,
  FileCheck,
  AlertOctagon,
  CheckCircle,
  Compass,
} from "lucide-react";

interface FieldAuditCase {
  id: string;
  county: string;
  ward: string;
  project: string;
  status: "SITE_CHECK" | "ASSEMBLY_BRIEF" | "FOLLOW_UP";
  finding: string;
  actionTaken: string;
  methodNote: string;
}

/** Method vignettes for Mashinani — no invented budget amounts. */
const FIELD_CASES: FieldAuditCase[] = [
  {
    id: "kilifi-water",
    county: "Kilifi County",
    ward: "Kaloleni Ward",
    project: "Solar borehole and water kiosk",
    status: "FOLLOW_UP",
    finding:
      "County progress notes described the site as nearly commissioned. Field monitors found a dry shaft, missing inverter hardware, and a disconnected holding tank — photographed and dated for the public dossier.",
    actionTaken:
      "Community withheld completion sign-off at a ward baraza until the contractor returned with working solar pumping equipment. Attendance and photo evidence archived.",
    methodNote: "Signboard checklist · Site photos · Baraza summary",
  },
  {
    id: "nakuru-maternity",
    county: "Nakuru County",
    ward: "Subukia Ward",
    project: "Dispensary maternity wing",
    status: "ASSEMBLY_BRIEF",
    finding:
      "A facility listed as ready for service was roofed but unfinished — no plumbing, no staff housing, weeds at the entrance. Monitors compared the physical state to the county's published progress language.",
    actionTaken:
      "Youth monitors tabled a photo dossier with the County Assembly health conversation and published a citizen-readable summary within days of the baraza.",
    methodNote: "Photo dossier · Hansard-ready brief · Public summary",
  },
  {
    id: "wajir-feeder",
    county: "Wajir County",
    ward: "Tarbaj Ward",
    project: "Rural feeder road grading",
    status: "SITE_CHECK",
    finding:
      "Heavy equipment appeared briefly, then left an impassable stretch that blocked clinic access for pastoral households. Elders convened a tree-shade baraza; monitors recorded claims against what the road still looked like.",
    actionTaken:
      "Vernacular radio carried the community account; county roads officials were pressed to return the contractor. Mashinani kept the paper trail public rather than inventing completion kilometres.",
    methodNote: "Listening circle · Radio note · Follow-up visit",
  },
];

export function FieldNotebookSpread() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>("kilifi-water");
  const activeCase = FIELD_CASES.find((c) => c.id === selectedCaseId) || FIELD_CASES[0];

  return (
    <div className="relative my-10 py-8 border-y border-amber-500/30">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div className="flex items-center gap-2 font-mono text-xs">
          <Compass className="size-4 text-amber-600 dark:text-amber-400 animate-spin-slow" />
          <span className="font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Field notebook
          </span>
          <span className="text-muted-foreground">· Four-county method</span>
        </div>

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
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-xs text-amber-600 dark:text-amber-400">
                  <MapPin className="size-3.5" />
                  <span>
                    {activeCase.ward}, {activeCase.county}
                  </span>
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-black text-foreground leading-tight">
                  {activeCase.project}
                </h3>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                {activeCase.status === "FOLLOW_UP" && (
                  <>
                    <CheckCircle className="size-3.5 text-emerald-500" />
                    <span>STATUS: COMMUNITY FOLLOW-UP</span>
                  </>
                )}
                {activeCase.status === "ASSEMBLY_BRIEF" && (
                  <>
                    <AlertOctagon className="size-3.5 text-destructive" />
                    <span>STATUS: ASSEMBLY BRIEF FILED</span>
                  </>
                )}
                {activeCase.status === "SITE_CHECK" && (
                  <>
                    <CheckCircle className="size-3.5 text-emerald-500" />
                    <span>STATUS: SITE CHECK + RADIO NOTE</span>
                  </>
                )}
              </div>

              <div className="border-l-2 border-amber-500/80 pl-5 py-2 space-y-3">
                <p className="font-mono text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  What monitors saw
                </p>
                <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-medium">
                  {activeCase.finding}
                </p>
                <div className="pt-2 border-t border-border/40 space-y-1">
                  <p className="font-mono text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                    What happened next
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {activeCase.actionTaken}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 lg:border-l lg:border-border/40 lg:pl-8 space-y-6 divide-y divide-border/40">
              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono text-xs border-b border-border/40 pb-2">
                  <span className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    Method kit
                  </span>
                  <span className="text-muted-foreground">ILLUSTRATIVE</span>
                </div>

                <div className="space-y-2.5 font-mono text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-border/30">
                    <span className="text-muted-foreground">Tools used</span>
                    <span className="font-bold text-foreground text-right max-w-[55%]">
                      {activeCase.methodNote}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-border/30">
                    <span className="text-muted-foreground">Budget figures</span>
                    <span className="font-bold text-foreground">Cited only when published</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-muted-foreground">Unavailable lines</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">Labelled, never invented</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-foreground">
                  <FileCheck className="size-4 text-amber-500" />
                  <span>Waterproof scorecard standard</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We do not ask rural residents to download heavy apps on intermittent signal. Laminated checklists with simple visual benchmarks travel farther than a dashboard alone.
                </p>
                <div className="pt-1 flex items-center gap-2 text-[11px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
                  <Radio className="size-3.5" />
                  <span>Paired with vernacular radio notes where useful</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
