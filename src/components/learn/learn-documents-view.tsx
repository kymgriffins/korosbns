"use client";

import React, { useState } from "react";
import { 
  Search, Folder, FileText, FileImage, 
  MoreHorizontal, ChevronRight, PieChart,
  Bell, FileCheck, Users, ShieldAlert, Award, Database, CheckCircle2
} from "lucide-react";
import { cn } from "@/utils";
import { BitmojiAvatar } from "./bitmoji-avatar";
import { team } from "@/constants/team";

export function LearnDocumentsView({ profile }: { profile: any }) {
  const [activeFileTab, setActiveFileTab] = useState<"all" | "tracked" | "commentaries" | "images">("all");

  const folders = [
    { name: "Tracked Budgets", count: 24 },
    { name: "County Reports", count: 18 },
    { name: "Finance Bills", count: 156 },
    { name: "Legal Documents", count: 32 },
    { name: "Memoranda Drafts", count: 67 },
    { name: "Policy Guidelines", count: 45 },
  ];

  // Map the user's data to the files list
  const allFiles = [
    ...(profile?.trackedDocs || []).map((doc: any, i: number) => ({
      id: `tracked-${i}`,
      name: typeof doc === "string" ? doc : doc.name,
      type: "Tracked Doc",
      owner: "System",
      modified: new Date().toLocaleDateString(),
      size: "1.2 MB",
      icon: <FileCheck className="size-4 text-emerald-500" />,
      category: "tracked"
    })),
    ...(profile?.participationLogs || []).map((log: any, i: number) => ({
      id: `log-${i}`,
      name: log.documentName || "Draft Memorandum",
      type: "Commentary",
      owner: profile?.breakName || "Citizen",
      modified: new Date(log.dateSubmitted).toLocaleDateString(),
      size: "245 KB",
      icon: <FileText className="size-4 text-primary" />,
      category: "commentaries"
    })),
    // Authentic Kenyan budget dummy data
    {
      id: "dummy-1",
      name: "Nairobi County FY 25/26 Draft Budget",
      type: "County Reports",
      owner: team[2].name,
      modified: "2026-01-15",
      size: "2.4 MB",
      icon: <Folder className="size-4 text-amber-500" />,
      category: "all"
    },
    {
      id: "dummy-2",
      name: "Auditor General Report 2024",
      type: "Audit Reports",
      owner: team[1].name,
      modified: "2026-01-14",
      size: "15.2 MB",
      icon: <FileText className="size-4 text-indigo-500" />,
      category: "all"
    }
  ];

  const filteredFiles = activeFileTab === "all" 
    ? allFiles 
    : allFiles.filter(f => f.category === activeFileTab);

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-background overflow-hidden text-foreground">
      {/* Top Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-card border-b border-border shadow-sm shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-xl">
            <Database className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Budget Data Repository</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Access public civic data and reports</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search Repository..." 
              className="pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-xl text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          
          {/* User Profile snippet from design */}
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

      {/* Main Grid Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left/Center Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto p-6 space-y-8">
          
          {/* Folders Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Collections</h2>
              <button className="text-xs font-bold text-primary hover:underline">View All</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {folders.map((folder, idx) => (
                <div key={idx} className="bg-white dark:bg-card border border-border p-4 rounded-2xl flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group">
                  <div className="bg-muted/50 p-3 rounded-xl group-hover:bg-primary/10 transition-colors">
                    <Folder className="size-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{folder.name}</h3>
                    <p className="text-xs text-muted-foreground">{folder.count} documents</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Files Section */}
          <section className="space-y-4 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Documents</h2>
              
              <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-xl">
                {[
                  { id: "all", label: "All Docs" },
                  { id: "tracked", label: "Tracked" },
                  { id: "commentaries", label: "My Drafts" },
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveFileTab(tab.id as any)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                      activeFileTab === tab.id 
                        ? "bg-white dark:bg-card text-primary shadow-sm border border-border/50" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead className="bg-muted/30 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Author</th>
                      <th className="px-6 py-4">Published</th>
                      <th className="px-6 py-4">Size</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-sm">
                    {filteredFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-muted/10 transition-colors group">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className="bg-muted/50 p-2 rounded-lg">
                              {file.icon}
                            </div>
                            <div>
                              <p className="font-bold text-foreground line-clamp-1">{file.name}</p>
                              <p className="text-[10px] text-muted-foreground">{file.type}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 font-medium text-muted-foreground">{file.owner}</td>
                        <td className="px-6 py-3 font-medium text-muted-foreground">{file.modified}</td>
                        <td className="px-6 py-3 font-medium text-muted-foreground">{file.size}</td>
                        <td className="px-6 py-3 text-center">
                          <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors">
                            <MoreHorizontal className="size-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    
                    {filteredFiles.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                          <FileText className="size-8 mx-auto mb-2 opacity-20" />
                          <p className="text-sm font-semibold">No documents found in this category.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

        </div>

        {/* Right Sidebar (Repository Stats) */}
        <aside className="w-80 bg-white dark:bg-card border-l border-border p-6 overflow-y-auto hidden xl:block space-y-8 shrink-0">
          
          {/* Status Alert */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-500">
              <Database className="size-5" />
              <span className="text-sm font-bold">System Status</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-md">
              <CheckCircle2 className="size-3" />
              Online
            </div>
          </div>
          
          {/* Repository Chart */}
          <div className="flex items-center gap-6 justify-center mt-2">
            <div className="relative size-24 shrink-0 rounded-full bg-muted flex items-center justify-center">
               <div className="absolute inset-0 rounded-full bg-[conic-gradient(var(--tw-gradient-stops))] from-primary via-emerald-400 to-amber-400 p-2" style={{ clipPath: 'circle(50%)' }}>
                 <div className="w-full h-full bg-white dark:bg-card rounded-full flex flex-col items-center justify-center">
                    <span className="text-xl font-black leading-none">3.2k</span>
                    <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">Docs Indexed</span>
                 </div>
               </div>
            </div>
            
            <div className="space-y-3 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-full bg-primary" />
                <span>Counties</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-full bg-emerald-400" />
                <span>National</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-full bg-amber-400" />
                <span>Audits</span>
              </div>
            </div>
          </div>

          {/* Repository Stats */}
          <div className="space-y-4 pt-4 border-t border-border/50">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Repository Stats</h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>County Budgets</span>
                  <span className="text-muted-foreground">1,240 docs</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                   <div className="h-full bg-primary w-[70%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>National Reports</span>
                  <span className="text-muted-foreground">850 docs</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-400 w-[50%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Audit Findings</span>
                  <span className="text-muted-foreground">420 docs</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                   <div className="h-full bg-amber-400 w-[30%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-4 pt-4 border-t border-border/50">
            <div className="flex justify-between items-center">
               <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Recent Publications</h3>
               <button className="text-[10px] font-bold text-primary hover:underline uppercase">View All</button>
            </div>
            
            <div className="space-y-4">
               {[
                 { name: team[2].name, time: "2 hours ago", action: "Published Nairobi FY 25/26 Draft", avatar: team[2].image },
                 { name: team[1].name, time: "4 hours ago", action: "Uploaded OAG Report summary", avatar: team[1].image },
                 { name: team[4].name, time: "5 hours ago", action: "Indexed Kisumu Public Participation Forums", avatar: team[4].image }
               ].map((act, i) => (
                 <div key={i} className="flex gap-3">
                    {act.avatar ? (
                       <img src={act.avatar} alt="" className="size-7 rounded-full object-cover shrink-0 border border-border shadow-xs" />
                    ) : (
                       <div className="size-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold shrink-0">
                         {act.name.charAt(0)}
                       </div>
                    )}
                    <div className="space-y-0.5">
                       <p className="text-xs font-bold leading-none">{act.name} <span className="font-normal text-muted-foreground ml-1">{act.time}</span></p>
                       <p className="text-[10px] text-muted-foreground leading-tight">{act.action}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}
