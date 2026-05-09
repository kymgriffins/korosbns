"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  HeroSection, 
  ProblemSection, 
  VerificationHub, 
  CTASection,
  TownHallSection 
} from "@/components/marketing/RedesignComponents";

export default function RedesignGuidePage() {
  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container px-4 mx-auto py-12">
        <div className="mb-12 border-b border-border pb-8">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic mb-4">
            UX/UI <span className="text-primary">Redesign Guide</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            A comprehensive system for "Civic Urgency" — moving users from 
            confrontation to commitment through motion and clarity.
          </p>
        </div>

        <Tabs defaultValue="mockup" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-12 h-auto p-1 bg-muted rounded-xl">
            <TabsTrigger value="philosophy" className="py-3 font-bold uppercase text-xs tracking-widest">
              01 Philosophy
            </TabsTrigger>
            <TabsTrigger value="motion" className="py-3 font-bold uppercase text-xs tracking-widest">
              02 Motion Specs
            </TabsTrigger>
            <TabsTrigger value="ai-guide" className="py-3 font-bold uppercase text-xs tracking-widest">
              03 AI Agent Guide
            </TabsTrigger>
            <TabsTrigger value="mockup" className="py-3 font-bold uppercase text-xs tracking-widest">
              04 Live Mockup
            </TabsTrigger>
          </TabsList>

          <TabsContent value="philosophy" className="space-y-12">
            <div className="max-w-4xl mx-auto prose dark:prose-invert">
              <h2 className="text-3xl font-black uppercase tracking-tight">The Core: Civic Urgency</h2>
              <p className="text-lg leading-relaxed">
                A hybrid between a <strong>Bloomberg terminal</strong> and <strong>Nairobi street press</strong>. 
                The aesthetic anchors on authority, speed, and undeniable truth.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                <div className="p-6 border border-border rounded-2xl bg-card">
                  <h4 className="font-black uppercase mb-3">Confrontation</h4>
                  <p className="text-sm text-muted-foreground">
                    Start with the raw reality. High contrast, bold typography, and immediate 
                    data visualization. Force the user to engage with the gap between 
                    expectation and reality.
                  </p>
                </div>
                <div className="p-6 border border-border rounded-2xl bg-card">
                  <h4 className="font-black uppercase mb-3">Commitment</h4>
                  <p className="text-sm text-muted-foreground">
                    End with actionable clarity. The motion slows down, the palette 
                    stabilizes, and the call to action is the only path forward.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="motion" className="space-y-12">
            <div className="max-w-4xl mx-auto overflow-hidden border border-border rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-4 font-black uppercase text-xs tracking-widest border-b border-border">Section</th>
                    <th className="p-4 font-black uppercase text-xs tracking-widest border-b border-border">Motion Direction</th>
                    <th className="p-4 font-black uppercase text-xs tracking-widest border-b border-border">Implementation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-4 font-bold uppercase text-xs">Hero Ticker</td>
                    <td className="p-4 text-sm">Constant flow, representing the non-stop nature of fiscal data.</td>
                    <td className="p-4 font-mono text-[10px]">CSS translateX (0 to -50%)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold uppercase text-xs">Problem Cards</td>
                    <td className="p-4 text-sm">Spring bounce, suggesting a "reactive" confrontation with reality.</td>
                    <td className="p-4 font-mono text-[10px]">Framer Motion (Spring)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold uppercase text-xs">Strategy Counters</td>
                    <td className="p-4 text-sm">Earning the numbers. Climbing counters provide a sense of progress.</td>
                    <td className="p-4 font-mono text-[10px]">JS RequestAnimationFrame</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold uppercase text-xs">Verification Scan</td>
                    <td className="p-4 text-sm">Systematic audit. A scanning beam suggests thorough verification.</td>
                    <td className="p-4 font-mono text-[10px]">CSS Keyframes (scan-beam)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="ai-guide" className="space-y-12">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="p-8 border border-primary/30 bg-primary/5 rounded-[2rem]">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Context Before Code</h3>
                <p className="text-muted-foreground mb-6">
                  To get the best output from AI agents, always inject the "feel" description 
                  and motion specs before asking for code. This collapses rework by 80%.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="p-4 border border-border bg-background rounded-xl text-[10px] font-bold uppercase tracking-widest hover:border-primary transition-colors text-center">
                    Copy "Civic" System Prompt
                  </button>
                  <button className="p-4 border border-border bg-background rounded-xl text-[10px] font-bold uppercase tracking-widest hover:border-primary transition-colors text-center">
                    Copy Motion Specs
                  </button>
                  <button className="p-4 border border-border bg-background rounded-xl text-[10px] font-bold uppercase tracking-widest hover:border-primary transition-colors text-center">
                    Generate New Section
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mockup" className="space-y-0 rounded-2xl overflow-hidden border border-border">
            <div className="bg-muted p-2 border-b border-border flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
              </div>
              <div className="bg-background px-4 py-0.5 rounded-md text-[10px] font-mono text-muted-foreground flex-1 text-center">
                app.budgetndiostory.org/mockup/redesign_v1
              </div>
            </div>
            <div className="max-h-[80vh] overflow-y-auto">
              <HeroSection />
              <TownHallSection />
              <ProblemSection />
              <VerificationHub />
              <CTASection />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
