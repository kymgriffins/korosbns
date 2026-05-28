"use client";

import { Button } from "@/ui/button";
import { motion } from "motion/react";

interface CourseOverviewProps {
  badge: string;
  title: string;
  credits?: string;
  description: string;
  expectations: string[];
  onStartLearning: () => void;
}

export function CourseOverview({
  badge,
  title,
  credits,
  description,
  expectations,
  onStartLearning,
}: CourseOverviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center text-center gap-4 py-8"
    >
      <span className="text-6xl">{badge}</span>
      <div className="space-y-1">
        <h2 className="text-2xl font-black uppercase tracking-tight">{title}</h2>
        {credits && (
          <p className="text-xs font-medium text-muted-foreground">{credits}</p>
        )}
      </div>
      <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">{description}</p>

      {expectations.length > 0 && (
        <div className="text-left w-full max-w-md space-y-2 bg-muted/20 p-4 rounded-xl border border-border">
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            What to expect
          </p>
          <ul className="space-y-1.5">
            {expectations.map((exp, i) => (
              <li key={i} className="text-xs flex items-start gap-2">
                <span className="text-primary mt-0.5 shrink-0">◆</span>
                <span>{exp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button onClick={onStartLearning} className="rounded-xl font-bold mt-4">
        Start Learning Course
      </Button>
    </motion.div>
  );
}
