"use client";

import Image from "next/image";
import { Button } from "@/ui/button";
import { motion } from "motion/react";
import type { CivicModuleAuthor } from "@/types/learn";

interface CourseOverviewProps {
  badge: string;
  title: string;
  credits?: string;
  author?: CivicModuleAuthor;
  description: string;
  expectations: string[];
  onStartLearning: () => void;
}

export function CourseOverview({ badge, title, credits, author, description, expectations, onStartLearning }: CourseOverviewProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center gap-4 py-6">
      <span className="text-5xl">{badge}</span>
      <div className="space-y-0.5">
        <h2 className="text-xl font-black tracking-tight">{title}</h2>
        {credits && <p className="text-[11px] text-muted-foreground">{credits}</p>}
      </div>

      {author && (
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-card shadow-xs">
          <Image src={author.image} alt={author.name} width={32} height={32} className="size-8 rounded-full object-cover" />
          <div className="text-left">
            <p className="text-xs font-bold leading-tight">{author.name}</p>
            <p className="text-[10px] text-muted-foreground">{author.role}</p>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">{description}</p>

      {expectations.length > 0 && (
        <div className="text-left w-full max-w-md space-y-2 bg-muted/20 p-3.5 rounded-xl">
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">What to expect</p>
          <ul className="space-y-1">
            {expectations.map((exp, i) => (
              <li key={i} className="text-[11px] flex items-start gap-2">
                <span className="text-primary mt-0.5 shrink-0">\u25C6</span>
                <span>{exp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button onClick={onStartLearning} className="rounded-lg font-bold text-xs h-9 px-5">Start Course</Button>
    </motion.div>
  );
}
