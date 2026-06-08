"use client";

import { motion } from "motion/react";
import { Label } from "@/ui/label";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/ui/accordion";
import { Layers, Map } from "lucide-react";
import { StageCard, type StageCardData } from "./stage-card";

type Profile = { badges?: string[]; stageProgress?: number[]; };

export function StageRoadmap({ text, profile, stages, onSelectStage }: {
  text: { roadmapTitle: string; roadmapSubtitle: string; quickJump: string };
  profile: Profile;
  stages: StageCardData[];
  onSelectStage: (s: StageCardData) => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="space-y-0.5">
        <h2 className="text-base font-black tracking-tight">{text.roadmapTitle}</h2>
        <p className="text-[11px] text-muted-foreground">{text.roadmapSubtitle}</p>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[10px] font-semibold text-muted-foreground">{text.quickJump}</Label>
        <select
          onChange={(e) => {
            const selected = stages.find(s => s.id === parseInt(e.target.value));
            if (selected) onSelectStage(selected);
          }}
          className="w-full h-9 px-3 rounded-lg border-0 bg-muted/40 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
        >
          <option value="">Select a stage...</option>
          {stages.map((s) => {
            const done = profile.badges?.includes(s.badge);
            const active = profile.stageProgress?.includes(s.id);
            return (<option key={s.id} value={s.id}>Stage {s.id}: {s.documentName} {done ? "\u2713" : active ? "\u25B6" : ""}</option>);
          })}
        </select>
      </div>

      <Accordion type="single" collapsible className="w-full border-0">
        <AccordionItem value="map" className="bg-card shadow-xs rounded-xl overflow-hidden px-3 border-0">
          <AccordionTrigger className="hover:no-underline py-2.5 text-[11px] font-semibold">
            <div className="flex items-center gap-1.5">
              <Map className="size-3.5 text-primary" />
              <span>Budget Cycle Overview</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-2.5">
            <div className="grid grid-cols-2 gap-1.5">
              {stages.map((s) => {
                const done = profile.badges?.includes(s.badge);
                const active = profile.stageProgress?.includes(s.id);
                return (
                  <div key={s.id} className={`p-2 rounded-lg text-[10px] flex items-center gap-1.5 ${
                    done ? "bg-primary/5" : active ? "bg-card shadow-xs" : "bg-muted/20 opacity-40"
                  }`}>
                    <span className="text-sm">{s.badge}</span>
                    <div className="truncate">
                      <p className="font-bold truncate text-[9px]">{s.badgeName || s.title}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="space-y-1.5">
        {stages.map((stage) => {
          const completed = profile.badges?.includes(stage.badge);
          const active = profile.stageProgress?.includes(stage.id);
          return (
            <StageCard key={stage.id} stage={stage} isCompleted={!!completed} isActive={!!active} onSelect={() => onSelectStage(stage)} />
          );
        })}
      </div>
    </motion.div>
  );
}
