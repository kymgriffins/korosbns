"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ClipboardList,
  FileText,
  BarChart3,
  Megaphone,
  Gavel,
  FileSignature,
  Building2,
  ShieldCheck,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { SectionHeader, SectionShell } from "@/layouts/section-shell";
import { Routes } from "@/constants/routes";
import { Button } from "@/ui/button";

interface ProcessStage {
  id: number;
  title: string;
  authority: string;
  description: string;
  icon: LucideIcon;
}

const PROCESS_STAGES: ProcessStage[] = [
  {
    id: 1,
    title: "Formulation & MTEF",
    authority: "National Treasury",
    description:
      "Treasury issues the Budget Circular and sets sector ceilings through the Medium-Term Expenditure Framework.",
    icon: ClipboardList,
  },
  {
    id: 2,
    title: "Budget Policy Statement",
    authority: "Treasury → Parliament",
    description:
      "The BPS is tabled by 15 February, fixing the medium-term fiscal framework and priorities.",
    icon: FileText,
  },
  {
    id: 3,
    title: "Budget Estimates",
    authority: "National Treasury",
    description:
      "Detailed revenue and expenditure estimates for every ministry and county are tabled in Parliament.",
    icon: BarChart3,
  },
  {
    id: 4,
    title: "Review & Public Participation",
    authority: "Budget & Appropriations Cmte",
    description:
      "The Committee scrutinises the estimates and gathers citizen views — a constitutional right under Article 201.",
    icon: Megaphone,
  },
  {
    id: 5,
    title: "Parliamentary Approval",
    authority: "National Assembly",
    description:
      "MPs debate and vote on the estimates, then the Cabinet Secretary reads the Budget Statement.",
    icon: Gavel,
  },
  {
    id: 6,
    title: "Appropriation Act",
    authority: "Parliament → President",
    description:
      "The Appropriation Act is passed and assented to, giving legal authority to spend public funds.",
    icon: FileSignature,
  },
  {
    id: 7,
    title: "Implementation",
    authority: "MDAs, Counties & CoB",
    description:
      "Money is spent as the Controller of Budget authorises every withdrawal from public funds.",
    icon: Building2,
  },
  {
    id: 8,
    title: "Audit & Oversight",
    authority: "Auditor-General & Citizens",
    description:
      "Spending is audited and Parliament — alongside citizens — holds the government to account.",
    icon: ShieldCheck,
  },
];

const CURRENT_PROCESS_STAGE_ID = 5;

function StageCard({ stage }: { stage: ProcessStage }) {
  const Icon = stage.icon;
  const isCurrent = stage.id === CURRENT_PROCESS_STAGE_ID;
  const isPast = stage.id < CURRENT_PROCESS_STAGE_ID;

  return (
    <Link
      href={Routes.Learn}
      aria-label={`Stage ${stage.id}: ${stage.title} — learn more`}
      className={`group relative flex h-full flex-col gap-3 rounded-3xl border bg-card p-5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 md:gap-4 md:p-7 ${
        isCurrent
          ? "border-primary/40 shadow-lg shadow-primary/5"
          : "border-border hover:border-primary/30 hover:shadow-md"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={`flex size-11 items-center justify-center rounded-2xl border transition-colors ${
            isCurrent || isPast
              ? "border-primary/20 bg-primary/10 text-primary"
              : "border-border bg-muted/40 text-muted-foreground group-hover:text-primary"
          }`}
        >
          <Icon className="size-5" />
        </span>
        <span className="font-mono text-2xl font-black tracking-tight text-muted-foreground/25 transition-colors group-hover:text-muted-foreground/40 md:text-3xl">
          {String(stage.id).padStart(2, "0")}
        </span>
      </div>

      {isCurrent ? (
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
          </span>
          We are here now
        </span>
      ) : null}

      <div className="space-y-2">
        <span className="block text-[10px] font-bold uppercase tracking-widest text-primary/70">
          {stage.authority}
        </span>
        <h3 className="text-lg font-bold tracking-tight text-foreground">{stage.title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{stage.description}</p>
      </div>

      <span className="mt-auto hidden items-center gap-1.5 pt-2 text-xs font-semibold text-muted-foreground transition-colors group-hover:text-primary sm:inline-flex">
        Explore on the Learn Hub
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export default function BudgetProcessStepper() {
  return (
    <SectionShell
      id="how-budget-is-made"
      className="relative overflow-hidden border-t border-border/40 bg-background text-foreground scroll-mt-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklch,var(--primary)_10%,transparent),transparent_60%)]" />

      <div className="relative z-10">
        <SectionHeader
          eyebrow="How Kenya's Budget Is Made"
          title={
            <>
              Eight stages from{" "}
              <span className="font-heading italic text-primary">circular to audit</span>.
            </>
          }
          description="Every shilling follows a constitutional path. Here is how Kenya's national budget travels from formulation to oversight — and where you can step in."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STAGES.map((stage, index) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
            >
              <StageCard stage={stage} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 flex flex-col items-center justify-between gap-5 rounded-3xl border border-primary/20 bg-primary/5 p-5 text-center md:mt-10 md:flex-row md:text-left md:p-8"
        >
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">Right now</span>, Kenya is at stage 5 —
            the FY2026/27 estimates have been approved and the Budget Statement read. Follow the live
            cycle below, or learn each stage in depth.
          </p>
          <Link href={Routes.Learn} className="w-full shrink-0 md:w-auto">
            <Button size="lg" className="w-full gap-2 rounded-full px-7 md:w-auto">
              Start the Learn Hub
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </SectionShell>
  );
}
