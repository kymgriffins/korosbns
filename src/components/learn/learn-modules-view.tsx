"use client";

import React, { useMemo } from "react";
import { motion } from "motion/react";
import { PlayCircle, Bookmark, CheckCircle2, Search, ChevronRight, BookOpen } from "lucide-react";
import { Button } from "@/ui/button";
import { BitmojiAvatar } from "./bitmoji-avatar";
import type { CivicModule } from "@/types/learn";
import { readProgress } from "@/lib/module-progress";
import { team } from "@/constants/team";

interface LearnModulesViewProps {
  profile: any;
  stages: CivicModule[];
  currentStage: CivicModule;
  onSelectStage: (stage: CivicModule) => void;
}

export function LearnModulesView({
  profile,
  stages,
  currentStage,
  onSelectStage,
}: LearnModulesViewProps) {
  
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

  // Next Lessons list bound to team facilitators
  const nextLessons = [
    { title: "Introduction to County Budgets", subtitle: "Foundations of civic participation", teacher: team[0].name, role: team[0].role, image: team[0].image, duration: "20 min" },
    { title: "Reading the MTEF Document", subtitle: "Understanding priorities", teacher: team[1].name, role: team[1].role, image: team[1].image, duration: "25 min" },
    { title: "Public Participation Forums", subtitle: "How to engage effectively", teacher: team[2].name, role: team[2].role, image: team[2].image, duration: "22 min" },
    { title: "Drafting a Memorandum", subtitle: "Crafting written submissions", teacher: team[3].name, role: team[3].role, image: team[3].image, duration: "28 min" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-background overflow-hidden text-foreground">
      {/* Top Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-card border-b border-border shadow-sm shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-xl">
            <BookOpen className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Civic Modules</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Master the budget process</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search modules & lessons..." 
              className="pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-xl text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3 ml-2 md:ml-4 md:pl-4 md:border-l border-border">
            {profile?.avatar_url ? (
               <img src={profile.avatar_url} alt="" className="size-9 rounded-full border border-border object-cover" />
            ) : (
               <BitmojiAvatar gender={profile?.gender as any} size="sm" className="rounded-full border border-border" />
            )}
            <div className="hidden lg:block text-sm">
              <p className="font-bold leading-none">{profile?.breakName || "Citizen"}</p>
              <p className="text-[10px] text-muted-foreground">{profile?.county || "Kenya"}</p>
            </div>
            <ChevronRight className="size-4 text-muted-foreground hidden lg:block ml-2" />
          </div>
        </div>
      </header>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="space-y-8 max-w-[1200px] mx-auto pb-10">
          
          {/* Header and Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-3xl font-black tracking-tight">My modules</h2>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
              {["All modules", "County", "National", "Audit"].map((filter, i) => (
                <button 
                  key={filter} 
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
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
                className={`p-6 rounded-[2rem] shadow-sm flex flex-col justify-between min-h-[220px] relative overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer ${card.colorClass}`}
                onClick={() => onSelectStage(card.stage)}
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
                      className="h-full bg-white rounded-full transition-all duration-500" 
                      style={{ width: `${card.total > 0 ? (card.completedCount / card.total) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex -space-x-2">
                      {/* Show avatars of other citizens learning */}
                      <div className="size-8 rounded-full border-2 border-transparent overflow-hidden bg-muted"><BitmojiAvatar gender="female" size="sm" /></div>
                      <div className="size-8 rounded-full border-2 border-transparent overflow-hidden bg-muted"><BitmojiAvatar gender="male" size="sm" /></div>
                      <div className="size-8 rounded-full border-2 border-transparent bg-black/20 flex items-center justify-center text-[10px] font-bold text-white">+110</div>
                    </div>
                    <Button 
                      className="rounded-full bg-[#CEFF00] hover:bg-[#b5e600] text-black font-bold px-6 border-none shadow-sm"
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
              
              <div className="space-y-0 bg-white dark:bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                {/* Table Header */}
                <div className="hidden sm:grid grid-cols-[1fr_200px_80px] gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/30 border-b border-border">
                  <div>Lesson</div>
                  <div>Facilitator</div>
                  <div className="text-right">Duration</div>
                </div>
                
                {/* List Items */}
                <div className="divide-y divide-border">
                  {nextLessons.map((lesson, i) => (
                    <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_200px_80px] gap-4 sm:items-center p-4 sm:p-6 hover:bg-muted/30 transition-colors cursor-pointer group">
                      <div>
                        <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{lesson.title}</h4>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{lesson.subtitle}</p>
                      </div>
                      <div className="flex items-center gap-3 mt-3 sm:mt-0">
                        <img src={lesson.image} alt={lesson.teacher} className="size-8 rounded-full object-cover border border-border shadow-xs" />
                        <div>
                          <span className="text-xs font-bold leading-none block">{lesson.teacher}</span>
                          <span className="text-[10px] text-muted-foreground">{lesson.role}</span>
                        </div>
                      </div>
                      <div className="sm:text-right text-xs font-bold text-muted-foreground flex items-center sm:justify-end gap-1.5 mt-2 sm:mt-0">
                        <PlayCircle className="size-3.5" />
                        {lesson.duration}
                      </div>
                    </div>
                  ))}
                </div>
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
                    <img src={team[4].image} alt="" className="size-10 rounded-full border-2 border-[#CEFF00] object-cover" />
                    <img src={team[5].image} alt="" className="size-10 rounded-full border-2 border-[#CEFF00] object-cover" />
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
      </div>
    </div>
  );
}
