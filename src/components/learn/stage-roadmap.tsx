"use client";

import { motion } from "motion/react";
import { Label } from "@/ui/label";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/ui/accordion";
import { Layers } from "lucide-react";
import { StageCard, type StageCardData } from "./stage-card";

type Profile = {
  badges?: string[];
  stageProgress?: number[];
};

export function StageRoadmap({
  text,
  profile,
  stages,
  onSelectStage,
}: {
  text: { roadmapTitle: string; roadmapSubtitle: string; quickJump: string };
  profile: Profile;
  stages: StageCardData[];
  onSelectStage: (s: StageCardData) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="space-y-1">
        <h2 className="text-lg font-black uppercase tracking-tight">{text.roadmapTitle}</h2>
        <p className="text-xs text-muted-foreground">{text.roadmapSubtitle}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="stageSelect" className="text-xs font-bold text-muted-foreground">{text.quickJump}</Label>
        <select
          id="stageSelect"
          onChange={(e) => {
            const selected = stages.find(s => s.id === parseInt(e.target.value));
            if (selected) onSelectStage(selected);
          }}
          className="w-full h-10 px-3 rounded-xl border border-input bg-card text-xs focus-visible:outline-none"
        >
          <option value="">Select a stage...</option>
          {stages.map((s) => {
            const done = profile.badges?.includes(s.badge);
            const active = profile.stageProgress?.includes(s.id);
            return (
              <option key={s.id} value={s.id}>
                Stage {s.id}: {s.documentName} {done ? "✓" : active ? "▶" : ""}
              </option>
            );
          })}
        </select>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-2 border-none">
        <AccordionItem value="map-overview" className="border border-border bg-card rounded-xl overflow-hidden px-4">
          <AccordionTrigger className="hover:no-underline py-3 text-xs font-bold flex items-center justify-between text-muted-foreground">
            <div className="flex items-center gap-1.5 text-foreground">
              <Layers className="size-4 text-primary" />
              <span>Overview: Map of the Budget Cycle</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="border-t border-border pt-3 pb-3">
            <div className="grid grid-cols-2 gap-2">
              {stages.map((s) => {
                const done = profile.badges?.includes(s.badge);
                const active = profile.stageProgress?.includes(s.id);
                return (
                  <div
                    key={s.id}
                    className={`p-2 rounded-lg border text-xs flex items-center gap-2 ${
                      done
                        ? "border-primary/20 bg-primary/5"
                        : active
                        ? "border-foreground/30 bg-card"
                        : "border-border opacity-40 bg-muted/20"
                    }`}
                  >
                    <span className="text-base">{s.badge}</span>
                    <div className="truncate">
                      <p className="font-bold truncate text-[10px] leading-tight">{s.badgeName || s.title}</p>
                      <p className="text-[9px] text-muted-foreground truncate">{s.documentName}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="space-y-3 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-border">
        {stages.map((stage) => {
          const completed = profile.badges?.includes(stage.badge);
          const active = profile.stageProgress?.includes(stage.id);
          return (
            <StageCard
              key={stage.id}
              stage={stage}
              isCompleted={!!completed}
              isActive={!!active}
              onSelect={() => onSelectStage(stage)}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
