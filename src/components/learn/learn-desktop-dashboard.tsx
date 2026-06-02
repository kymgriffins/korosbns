"use client";

import React, { useMemo } from "react";
import { motion } from "motion/react";
import { PlayCircle, Bookmark, CheckCircle2 } from "lucide-react";
import { Button } from "@/ui/button";
import { BitmojiAvatar } from "./bitmoji-avatar";
import type { CivicModule } from "@/types/learn";
import { readProgress } from "@/lib/module-progress";

interface LearnDesktopDashboardProps {
  profile: any;
  stages: CivicModule[];
  currentStage: CivicModule;
  onSelectStage: (stage: CivicModule) => void;
}

export function LearnDesktopDashboard({
  profile,
  stages,
  currentStage,
  onSelectStage,
}: LearnDesktopDashboardProps) {
  
  // Categorize stages for the colored cards (first 3)
  const dashboardCards = stages.slice(0, 3).map((stage, idx) => {
    const p = readProgress(stage.slug, stage.order);
    const completedCount = Object.keys(p.stepsCompleted).length;
    const total = stage.steps.length;
    
    // Assign specific colors to match the mockup: Blue, Orange, Dark
    const colors = [
      "bg-[#2563EB] text-white", // Blue
      "bg-[#F97316] text-white", // Orange
      "bg-[#171717] text-white", // Dark
    ];
    
    return {
      stage,
      completedCount,
      total,
      colorClass: colors[idx % colors.length],
      tag: stage.badgeName || "Civic Basics",
    };
  });

  // Next Lessons list
  const nextLessons = [
    { title: "Introduction to County Budgets", subtitle: "Foundations of civic participation", teacher: "Alex Chen", duration: "20 min" },
    { title: "Reading the MTEF Document", subtitle: "Understanding priorities", teacher: "Mia Roberts", duration: "25 min" },
    { title: "Public Participation Forums", subtitle: "How to engage effectively", teacher: "Priya Kapoor", duration: "22 min" },
    { title: "Drafting a Memorandum", subtitle: "Crafting written submissions", teacher: "Samuel Wright", duration: "28 min" },
  ];

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto p-2 pb-10">
      
      {/* Header and Filters */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black tracking-tight">My modules</h2>
        <div className="flex items-center gap-2">
          {["All modules", "County", "National", "Audit"].map((filter, i) => (
            <button 
              key={filter} 
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                i === 0 
                  ? "bg-[#2563EB] text-white" 
                  : "bg-transparent border border-border hover:bg-muted text-foreground"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* 3 Colored Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {dashboardCards.map((card, idx) => (
          <div 
            key={idx} 
            className={`p-6 rounded-[2rem] shadow-sm flex flex-col justify-between min-h-[220px] relative overflow-hidden transition-transform hover:scale-[1.02] ${card.colorClass}`}
          >
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 bg-black/20 rounded-full text-[10px] font-black uppercase tracking-wider">
                {card.tag}
              </span>
              <Bookmark className="size-5 opacity-80" />
            </div>
            
            <div className="mt-4 mb-8">
              <h3 className="text-2xl font-black leading-tight max-w-[90%]">{card.stage.title}</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold opacity-90">
                <span>Progress</span>
                <span>{card.completedCount}/{card.total} lessons</span>
              </div>
              <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full" 
                  style={{ width: `${card.total > 0 ? (card.completedCount / card.total) * 100 : 0}%` }}
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex -space-x-2">
                  <div className="size-8 rounded-full border-2 border-transparent overflow-hidden bg-muted"><BitmojiAvatar gender="female" size="sm" /></div>
                  <div className="size-8 rounded-full border-2 border-transparent overflow-hidden bg-muted"><BitmojiAvatar gender="male" size="sm" /></div>
                  <div className="size-8 rounded-full border-2 border-transparent overflow-hidden bg-muted"><BitmojiAvatar gender="female" size="sm" /></div>
                  <div className="size-8 rounded-full border-2 border-transparent bg-black/20 flex items-center justify-center text-[10px] font-bold">+110</div>
                </div>
                <Button 
                  onClick={() => onSelectStage(card.stage)}
                  className="rounded-full bg-[#CEFF00] hover:bg-[#b5e600] text-black font-bold px-6 border-none"
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Grid: Next Lessons & Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        
        {/* Next Lessons List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black">My next lessons</h3>
            <button className="text-sm font-bold text-orange-500 hover:underline">View all lessons</button>
          </div>
          
          <div className="space-y-0">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_150px_80px] gap-4 px-4 pb-2 text-xs font-semibold text-muted-foreground border-b border-border">
              <div>Lesson</div>
              <div>Facilitator</div>
              <div className="text-right">Duration</div>
            </div>
            
            {/* List Items */}
            {nextLessons.map((lesson, i) => (
              <div key={i} className="grid grid-cols-[1fr_150px_80px] gap-4 items-center p-4 border-b border-border hover:bg-muted/30 transition-colors cursor-pointer rounded-xl">
                <div>
                  <h4 className="font-bold text-sm">{lesson.title}</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{lesson.subtitle}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-full bg-muted overflow-hidden shrink-0">
                     <BitmojiAvatar gender={i % 2 === 0 ? "male" : "female"} size="sm" />
                  </div>
                  <span className="text-xs font-semibold">{lesson.teacher}</span>
                </div>
                <div className="text-right text-xs font-bold text-muted-foreground">
                  {lesson.duration}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lime Green Recommendation Card */}
        <div className="bg-[#CEFF00] text-black p-8 rounded-[2rem] shadow-sm flex flex-col relative overflow-hidden">
          <div className="space-y-1 mb-6">
            <p className="text-sm font-semibold opacity-80">New module matching your interests</p>
            <span className="inline-block px-3 py-1 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-wider mt-2">
              Civic Engagement
            </span>
          </div>
          
          <h3 className="text-4xl font-black leading-none mb-auto">
            Advanced Public Participation Tactics
          </h3>
          
          <div className="mt-8 space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold opacity-80">They are already studying</p>
              <div className="flex -space-x-2">
                <div className="size-10 rounded-full border-2 border-[#CEFF00] overflow-hidden bg-white"><BitmojiAvatar gender="female" size="sm" /></div>
                <div className="size-10 rounded-full border-2 border-[#CEFF00] overflow-hidden bg-white"><BitmojiAvatar gender="male" size="sm" /></div>
                <div className="size-10 rounded-full border-2 border-[#CEFF00] overflow-hidden bg-white"><BitmojiAvatar gender="female" size="sm" /></div>
                <div className="size-10 rounded-full border-2 border-[#CEFF00] bg-white text-black flex items-center justify-center text-xs font-bold shadow-sm">+100</div>
              </div>
            </div>
            
            <Button className="w-full rounded-full bg-[#F97316] hover:bg-[#ea580c] text-white font-bold h-12 border-none shadow-md">
              More details
            </Button>
          </div>
        </div>

      </div>

    </div>
  );
}
