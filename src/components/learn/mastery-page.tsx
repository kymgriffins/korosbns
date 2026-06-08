"use client";

import { motion } from "motion/react";
import { Button } from "@/ui/button";
import { Award, ArrowRight } from "lucide-react";

interface MasteryPageProps {
  badge: string;
  badgeName: string;
  title: string;
  hasNext: boolean;
  onNextStage?: () => void;
  onClose: () => void;
}

export function MasteryPage({ badge, badgeName, title, hasNext, onNextStage, onClose }: MasteryPageProps) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center gap-4 py-10">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12 }} className="text-6xl">{badge}</motion.div>
      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">{badgeName} Unlocked!</span>
      <h2 className="text-xl font-black tracking-tight">{title}</h2>

      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 space-y-1 max-w-xs shadow-xs">
        <p className="text-xs font-bold text-primary flex items-center gap-1.5"><Award className="size-3.5" /> Rewards Earned</p>
        <p className="text-lg font-black text-primary">+25 SVG</p>
        <p className="text-[9px] text-muted-foreground">Credential: BNS-{badge}-{Date.now().toString(36).toUpperCase()}</p>
      </div>

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
