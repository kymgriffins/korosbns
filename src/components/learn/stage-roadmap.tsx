"use client";

import { motion } from "motion/react";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/ui/accordion";
import { Map } from "lucide-react";
import { cn } from "@/utils";
import { StageCard, type StageCardData } from "./stage-card";

type Profile = { badges?: string[]; stageProgress?: number[] };

// State-based class maps — defined once, referenced by key
const STAGE_OVERVIEW_CLASSES = {
  done:    "bg-primary/5",
  active:  "bg-card shadow-xs",
  locked:  "bg-muted/20 opacity-40",
} as const;

export function StageRoadmap({ text, profile, stages, onSelectStage }: {
  text: { roadmapTitle: string; roadmapSubtitle: string; quickJump: string };
  profile: Profile;
  stages: StageCardData[];
  onSelectStage: (s: StageCardData) => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="space-y-0.5">
        <h2 className="text-base font-bold tracking-tight">{text.roadmapTitle}</h2>
        <p className="text-sm text-muted-foreground">{text.roadmapSubtitle}</p>
      </div>

      {/* Quick jump — shadcn Select replaces native <select> */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground">{text.quickJump}</Label>
        <Select
          onValueChange={(val) => {
            const selected = stages.find((s) => String(s.id) === val);
            if (selected) onSelectStage(selected);
          }}
        >
          <SelectTrigger className="w-full h-9 text-xs">
            <SelectValue placeholder="Select a stage…" />
          </SelectTrigger>
          <SelectContent>
            {stages.map((s) => {
              const done   = profile.badges?.includes(s.badge);
              const active = profile.stageProgress?.includes(s.id);
              return (
                <SelectItem key={s.id} value={String(s.id)} className="text-xs">
                  Stage {s.id}: {s.documentName} {done ? "✓" : active ? "▶" : ""}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Budget Cycle Overview accordion */}
      <Accordion type="single" collapsible className="w-full border-0">
        <AccordionItem value="map" className="bg-card shadow-xs rounded-xl overflow-hidden px-3 border-0">
          <AccordionTrigger className="hover:no-underline py-2.5 text-sm font-semibold">
            <div className="flex items-center gap-1.5">
              <Map className="size-3.5 text-primary" aria-hidden />
              <span>Budget Cycle Overview</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-2.5">
            <div className="grid grid-cols-2 gap-1.5">
              {stages.map((s) => {
                const done   = profile.badges?.includes(s.badge);
                const active = profile.stageProgress?.includes(s.id);
                const stateKey = done ? "done" : active ? "active" : "locked";
                return (
                  <div key={s.id} className={cn("p-2 rounded-lg flex items-center gap-1.5", STAGE_OVERVIEW_CLASSES[stateKey])}>
                    <span role="img" aria-label={s.badgeName ?? s.title} className="text-sm">{s.badge}</span>
                    <div className="truncate">
                      <p className="font-semibold truncate text-xs">{s.badgeName || s.title}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Stage list */}
      <div className="space-y-1.5">
        {stages.map((stage) => {
          const completed = profile.badges?.includes(stage.badge);
          const active    = profile.stageProgress?.includes(stage.id);
          return (
            <StageCard
              key={stage.id}
              stage={stage}
              isCompleted={!!completed}
              isActive={!!active}
              isLocked={!completed && !active}
              onSelect={() => onSelectStage(stage)}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
