"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Eye,
  EyeOff,
  Newspaper,
  ShieldAlert,
  Award,
  Search,
} from "lucide-react";

interface NewsroomCase {
  id: string;
  headline: string;
  publication: string;
  fellow: string;
  documentFocus: string;
  methodStep: string;
  revealedDetail: string;
  craftNote: string;
}

/** Lab method vignettes — no invented KSh fraud totals or fake EACC outcomes. */
const NEWSROOM_CASES: NewsroomCase[] = [
  {
    id: "hospitality-travel",
    headline: "How to read a hospitality vote without inventing the scandal",
    publication: "Lab craft note",
    fellow: "Cohort method",
    documentFocus: "County executive hospitality and travel requisitions in published OCOB tables",
    methodStep: "Compare claimed workshop attendance to public travel records — then report only what both sources support.",
    revealedDetail:
      "Fellows practise lining up published vote lines with airline and attendance evidence. Where a figure is missing or redacted, the Lab labels it unavailable instead of guessing a billion-shilling headline.",
    craftNote: "Source discipline before the splash. Blank cells stay blank until a public document fills them.",
  },
  {
    id: "road-maintenance",
    headline: "The ghost highway story starts with a site visit, not a rumour",
    publication: "Lab craft note",
    fellow: "Cohort method",
    documentFocus: "Periodic road maintenance vouchers and contract notices on the public record",
    methodStep: "Walk the corridor, photograph milestones, then return to the voucher language — never the reverse.",
    revealedDetail:
      "Reporters learn to hold a contract claim against what the road still looks like. Completion language without heavy equipment on site becomes a question for officials, not an invented kilometre count.",
    craftNote: "Field notes and published vouchers travel together. Neither alone is enough for a front page.",
  },
  {
    id: "medical-supplies",
    headline: "Rural dispensary delays: follow the framework contract",
    publication: "Lab craft note",
    fellow: "Cohort method",
    documentFocus: "Essential medical supplies framework contracts versus KEMSA catalogue prices",
    methodStep: "Build a price comparison table from published catalogues, then interview the clinic that waited.",
    revealedDetail:
      "The Lab trains mark-up analysis only against public price lists. Markup percentages that cannot be sourced stay off the page — even when the clinic story is urgent.",
    craftNote: "Human delay plus document trail. One without the other is advocacy, not journalism.",
  },
];

export function ForensicLightTable() {
  const [selectedId, setSelectedId] = useState<string>("hospitality-travel");
  const [isUnredacted, setIsUnredacted] = useState<boolean>(false);
  const activeCase = NEWSROOM_CASES.find((c) => c.id === selectedId) || NEWSROOM_CASES[0];

  return (
    <div className="relative my-10 py-8 border-y border-red-500/30">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="size-2 rounded-full bg-red-600 animate-ping" />
          <span className="font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
            Newsroom light-table
          </span>
          <span className="text-muted-foreground">· Method vignettes</span>
        </div>

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
              {c.id.replace(/-/g, " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs text-red-600 dark:text-red-400">
              <Newspaper className="size-3.5" />
              <span className="font-bold uppercase tracking-wider">{activeCase.publication}</span>
              <span className="text-muted-foreground">· {activeCase.fellow}</span>
            </div>
            <h3 className="font-heading text-2xl sm:text-3xl font-black text-foreground leading-snug">
              &ldquo;{activeCase.headline}&rdquo;
            </h3>
          </div>

          <div className="space-y-4 font-mono text-xs pt-2">
            <div className="flex items-center justify-between border-b border-red-500/20 pb-2">
              <span className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <Search className="size-3.5" />
                DOCUMENT FOCUS
              </span>
              <button
                type="button"
                onClick={() => setIsUnredacted(!isUnredacted)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white font-bold text-[11px] hover:bg-red-700 transition-colors shadow-xs"
              >
                {isUnredacted ? (
                  <>
                    <EyeOff className="size-3" />
                    <span>Hide method detail</span>
                  </>
                ) : (
                  <>
                    <Eye className="size-3" />
                    <span>Reveal method detail</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-muted-foreground">{activeCase.documentFocus}</p>

            <div className="flex items-baseline gap-2 py-1">
              <span className="text-muted-foreground">First move:</span>
              <span className="font-bold text-red-600 dark:text-red-400 text-sm font-sans">
                {activeCase.methodStep}
              </span>
            </div>

            <div className="border-l-2 border-red-500 pl-4 py-1.5 space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground font-mono">
                Lab detail
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

        <div className="lg:col-span-5 lg:border-l lg:border-border/40 lg:pl-8 space-y-6 divide-y divide-border/40">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-foreground uppercase">
              <ShieldAlert className="size-4 text-red-500" />
              <span>Craft note</span>
            </div>
            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
              {activeCase.craftNote}
            </p>
          </div>

          <div className="pt-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-foreground">
              <Award className="size-4 text-red-500" />
              <span>Wanahabari Lab</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Quarterly one-day intensives leave participants with filed draft stories and a toolkit — data habits, contacts, and angles — not invented scoops.
            </p>
            <div className="pt-1 flex items-center justify-between text-[11px] font-mono">
              <span className="text-muted-foreground">Annual bench</span>
              <span className="font-bold text-red-600 dark:text-red-400">About 120–200 trained</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
