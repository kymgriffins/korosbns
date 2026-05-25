"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Badge } from "@/ui/badge";
import { Check, Loader2, Circle, TrendingUp, TrendingDown, Minus, CalendarDays, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface TimelineItem {
  id: number;
  date: string;
  title: string;
  description: string;
  status: 'completed' | 'running' | 'pending';
  icon: string;
  details: string;
  impact?: string;
}

const financeBillTimeline: TimelineItem[] = [
  {
    id: 1,
    date: "Apr 30, 2026",
    title: "Finance Bill Published",
    description: "Kenya's Finance Bill 2026 released with proposed tax reforms",
    status: "completed",
    icon: "📄",
    details: "Published by National Treasury with amendments to tax laws"
  },
  {
    id: 2,
    date: "May 5, 2026",
    title: "Submitted to National Assembly",
    description: "Bill submitted to Parliament for first reading",
    status: "completed",
    icon: "🏛️",
    details: "Cabinet submission completed successfully"
  },
  {
    id: 3,
    date: "May 10, 2026",
    title: "Public Participation Opened",
    description: "National Assembly opens public participation period",
    status: "completed",
    icon: "📢",
    details: "Citizens can submit written feedback and concerns",
    impact: "Active Engagement"
  },
  {
    id: 4,
    date: "Current Stage",
    title: "Committee Review Stage",
    description: "Bill under review by National Assembly committees",
    status: "running",
    icon: "🔄",
    details: "Stakeholder engagements and hearings ongoing",
    impact: "Ongoing Feedback"
  },
  {
    id: 5,
    date: "Jun-Jul 2026",
    title: "National Assembly Debate",
    description: "Second and third reading in National Assembly",
    status: "pending",
    icon: "🗳️",
    details: "Expected voting and parliamentary amendments"
  },
  {
    id: 6,
    date: "Aug 2026",
    title: "Senate Review",
    description: "Bill proceeds to Senate for consideration",
    status: "pending",
    icon: "🏛️",
    details: "Senate debate and approval required"
  },
  {
    id: 7,
    date: "Sep 2026",
    title: "Presidential Assent",
    description: "Bill presented to President for signing",
    status: "pending",
    icon: "✍️",
    details: "Becomes Finance Act 2026 upon presidential assent"
  },
  {
    id: 8,
    date: "Jan 1, 2027",
    title: "Implementation",
    description: "Finance Act 2026 comes into effect",
    status: "pending",
    icon: "🚀",
    details: "New tax measures and economic reforms take effect"
  }
];

/** Reached = completed or in progress; pending stages stay muted. */
function isTimelineReached(status: TimelineItem["status"]): boolean {
  return status === "completed" || status === "running";
}

const economicIndicators = [
  { label: "GDP Growth 2025", value: "4.6%", trend: "stable", trendIcon: Minus, trendColor: "text-zinc-400" },
  { label: "GDP Forecast 2026", value: "4.9-5.3%", trend: "up", trendIcon: TrendingUp, trendColor: "text-green-500" },
  { label: "Inflation Rate", value: "4.6%", trend: "down", trendIcon: TrendingDown, trendColor: "text-green-500" },
  { label: "Central Bank Rate", value: "9.5%", trend: "stable", trendIcon: Minus, trendColor: "text-zinc-400" }
];

export default function KenyaFinanceTimeline() {
  return (
    <section className="py-20 md:py-32 bg-background text-foreground relative overflow-x-clip border-t border-border/40">
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-1/2 bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-primary font-bold uppercase tracking-widest text-xs mb-4 block">
            Finance Bill 2026
          </span>
          <h2 className="gusto-heading mb-6">
            Legislative Tracker & <span className="italic font-heading text-primary">Context</span>.
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Real-time tracking of the legislative process and economic context surrounding the proposed tax reforms.
          </p>
        </div>

        {/* Economic Indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-24 max-w-6xl mx-auto">
          {economicIndicators.map((indicator, index) => {
            const Icon = indicator.trendIcon;
            return (
              <motion.div 
                key={indicator.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="p-5 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all flex flex-col justify-between min-w-0"
              >
                <div>
                  <span className="text-xs text-muted-foreground block mb-2">{indicator.label}</span>
                  <span className="text-2xl md:text-3xl font-black tracking-tight">{indicator.value}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-4">
                  <Icon className={`w-4 h-4 ${indicator.trendColor}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${indicator.trendColor}`}>
                    {indicator.trend}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Timeline container */}
        <div className="relative max-w-5xl mx-auto mb-24 w-full min-w-0 px-1">
          <div className="hidden md:block absolute left-1/2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary/10 via-primary/30 to-primary/10 -translate-x-1/2" />
          <div className="md:hidden absolute left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary/10 via-primary/30 to-primary/10" />

          <div className="space-y-10 md:space-y-16">
            {financeBillTimeline.map((item, index) => {
              const isCompleted = item.status === 'completed';
              const isRunning = item.status === 'running';
              const isReached = isTimelineReached(item.status);
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className={`relative flex flex-col md:flex-row items-start gap-6 md:gap-8 min-w-0 w-full ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full -translate-x-1/2 md:-translate-x-4 z-10 flex items-center justify-center bg-background border border-border">
                    {isCompleted ? (
                      <span className="flex size-6 items-center justify-center rounded-full bg-green-500/20 border border-green-500 text-green-500">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : isRunning ? (
                      <span className="flex size-6 items-center justify-center rounded-full bg-primary/20 border border-primary text-primary animate-pulse">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      </span>
                    ) : (
                      <span className="flex size-6 items-center justify-center rounded-full bg-muted border border-border text-muted-foreground">
                        <Circle className="w-2.5 h-2.5 fill-current" />
                      </span>
                    )}
                  </div>

                  {/* Content card */}
                  <div className={`flex-1 min-w-0 pl-12 md:pl-0 w-full max-w-full ${index % 2 === 0 ? 'md:pr-10' : 'md:pl-10'}`}>
                    <div
                      className={`rounded-2xl border bg-card p-5 transition-all duration-300 md:rounded-3xl md:p-7 ${
                        isRunning
                          ? "border-primary/30 hover:border-primary/40"
                          : isReached
                            ? "border-border hover:border-primary/20"
                            : "border-muted bg-card/60 opacity-60 hover:border-muted"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <span
                          className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest ${
                            isReached ? "text-primary" : "text-muted-foreground"
                          }`}
                        >
                          <CalendarDays className="w-3.5 h-3.5" />
                          {item.date}
                        </span>
                        {item.impact && isReached && (
                          <Badge variant="outline" className="border-primary/30 text-primary text-[9px] uppercase tracking-wider font-bold">
                            {item.impact}
                          </Badge>
                        )}
                      </div>
                      
                      <h3
                        className={`mb-3 flex items-center gap-2 text-xl font-bold tracking-tight md:text-2xl ${
                          isReached ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        <span className={`text-xl ${isReached ? "" : "opacity-50"}`}>{item.icon}</span>
                        {item.title}
                      </h3>
                      
                      <p
                        className={`mb-4 text-sm leading-relaxed md:text-base ${
                          isReached ? "text-muted-foreground" : "text-muted-foreground/80"
                        }`}
                      >
                        {item.description}
                      </p>
                      
                      <div
                        className={`border-t pt-4 text-xs ${
                          isReached
                            ? "border-border/60 text-muted-foreground"
                            : "border-muted text-muted-foreground/70"
                        }`}
                      >
                        {item.details}
                      </div>
                    </div>
                  </div>

                  {/* Spacer for desktop layout */}
                  <div className="hidden md:block flex-1" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Highlight Alert Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto p-6 md:p-8 rounded-3xl border border-yellow-500/20 bg-yellow-500/5 flex flex-col md:flex-row items-start gap-5"
        >
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-2xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-yellow-500 text-lg mb-2">Key Proposals in Finance Bill 2026:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-yellow-500" />
                Rental income tax increase: 7.5% → 10%
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-yellow-500" />
                Excise duty adjustments on tobacco products
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-yellow-500" />
                Enhanced digital service tax enforcement
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-yellow-500" />
                Aggressive tax compliance tracking desk
              </li>
            </ul>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
