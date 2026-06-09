"use client";

import { motion } from "motion/react";
import { Button } from "@/ui/button";
import { Award, ArrowRight, Download, ExternalLink } from "lucide-react";

interface MasteryPageProps {
  badge: string;
  badgeName: string;
  title: string;
  hasNext: boolean;
  onNextStage?: () => void;
  onClose: () => void;
  certificateUrl?: string | null;
  certificateId?: string | null;
}

export function MasteryPage({ badge, badgeName, title, hasNext, onNextStage, onClose, certificateUrl, certificateId }: MasteryPageProps) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center gap-4 py-10">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12 }} className="text-6xl">{badge}</motion.div>
      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">{badgeName} Unlocked!</span>
      <h2 className="text-xl font-black tracking-tight">{title}</h2>

      <div className="bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 rounded-xl p-4 space-y-2 max-w-xs shadow-xs">
        <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5"><Award className="size-3.5" /> Rewards Earned</p>
        <p className="text-lg font-black text-emerald-600">+25 SVG</p>
        {certificateId && (
          <p className="text-[9px] text-muted-foreground">Credential: BNS-{badgeName}-{certificateId.slice(0, 8).toUpperCase()}</p>
        )}
      </div>

      {certificateUrl && (
        <a
          href={certificateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border/40 shadow-xs hover:bg-accent/30 hover:border-primary/30 transition-all group"
        >
          <Download className="size-4 text-primary group-hover:scale-110 transition-transform" />
          <div className="text-left">
            <p className="text-xs font-bold group-hover:text-primary transition-colors">Download Certificate</p>
            <p className="text-[9px] text-muted-foreground">PDF — BNS Certified</p>
          </div>
          <ExternalLink className="size-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
        </a>
      )}

      <div className="flex gap-2 mt-2">
        {hasNext && onNextStage ? (
          <Button onClick={onNextStage} className="rounded-lg font-bold text-xs h-9 gap-1.5">
            Next Stage <ArrowRight className="size-3.5" />
          </Button>
        ) : (
          <Button onClick={onClose} className="rounded-lg font-bold text-xs h-9">Finish Journey</Button>
        )}
      </div>
    </motion.div>
  );
}
