"use client";

import { useState } from "react";
import { Search, Folder, FileText, MoreHorizontal, Database, CheckCircle2 } from "lucide-react";
import { cn } from "@/utils";
import { BitmojiAvatar } from "./bitmoji-avatar";

export function LearnDocumentsView({ profile }: { profile: any }) {
  const [activeFileTab, setActiveFileTab] = useState<"all" | "tracked" | "commentaries">("all");

  const folders = [
    { name: "Tracked Budgets", count: 24 },
    { name: "County Reports", count: 18 },
    { name: "Finance Bills", count: 156 },
    { name: "Legal Documents", count: 32 },
    { name: "Memoranda Drafts", count: 67 },
    { name: "Policy Guidelines", count: 45 },
  ];

  const allFiles = [
    ...(profile?.trackedDocs || []).map((doc: any, i: number) => ({
      id: `tracked-${i}`, name: typeof doc === "string" ? doc : doc.name,
      type: "Tracked Doc", owner: "System", modified: new Date().toLocaleDateString(),
      size: "1.2 MB", icon: <CheckCircle2 className="size-3.5 text-emerald-500" />, category: "tracked"
    })),
    ...(profile?.participationLogs || []).map((log: any, i: number) => ({
      id: `log-${i}`, name: log.documentName || "Draft Memorandum",
      type: "Commentary", owner: profile?.breakName || "Citizen",
      modified: new Date(log.dateSubmitted).toLocaleDateString(),
      size: "245 KB", icon: <FileText className="size-3.5 text-primary" />, category: "commentaries"
    })),
  ];

  const filteredFiles = activeFileTab === "all" ? allFiles : allFiles.filter(f => f.category === activeFileTab);

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <header className="flex items-center justify-between px-4 md:px-5 py-3 border-b border-border/50 shrink-0 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary/8 p-1.5 rounded-lg">
            <Database className="size-4 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight">Data Repository</h1>
            <p className="text-[10px] text-muted-foreground font-semibold">Access public civic data</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input type="text" placeholder="Search..." className="pl-8 pr-3 py-1.5 bg-muted/40 border-0 rounded-lg text-xs w-44 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
          <div className="flex items-center gap-2 ml-2 md:ml-3 md:pl-3 md:border-l border-border/50">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="size-7 rounded-full object-cover" />
            ) : (
              <BitmojiAvatar gender={profile?.gender} size="sm" className="shrink-0" />
            )}
            <div className="hidden lg:block text-xs">
              <p className="font-bold leading-none">{profile?.breakName || "Citizen"}</p>
              <p className="text-[10px] text-muted-foreground">{profile?.county || "Kenya"}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto p-3 md:p-4 space-y-5">
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Collections</h2>
              <button className="text-[10px] font-semibold text-primary/70 hover:text-primary">View All</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {folders.map((folder, idx) => (
                <div key={idx} className="bg-card shadow-xs rounded-xl p-3 flex items-center gap-3 hover:shadow-sm transition-all cursor-pointer group">
                  <div className="bg-muted/30 p-2 rounded-lg group-hover:bg-primary/10 transition-colors">
                    <Folder className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs">{folder.name}</h3>
                    <p className="text-[10px] text-muted-foreground">{folder.count} documents</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Documents</h2>
              <div className="flex items-center gap-1 bg-muted/20 p-0.5 rounded-lg">
                {[
                  { id: "all", label: "All" },
                  { id: "tracked", label: "Tracked" },
                  { id: "commentaries", label: "My Drafts" },
                ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveFileTab(tab.id as any)}
                    className={cn("px-3 py-1 rounded-md text-[10px] font-bold transition-all",
                      activeFileTab === tab.id ? "bg-card shadow-xs text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-card shadow-xs rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Author</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Size</th>
                      <th className="px-4 py-3 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-xs">
                    {filteredFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-muted/20 transition-colors group">
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="bg-muted/30 p-1.5 rounded-lg">{file.icon}</div>
                            <div>
                              <p className="font-bold text-foreground text-[11px] line-clamp-1">{file.name}</p>
                              <p className="text-[10px] text-muted-foreground">{file.type}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground text-[10px]">{file.owner}</td>
                        <td className="px-4 py-2.5 text-muted-foreground text-[10px]">{file.modified}</td>
                        <td className="px-4 py-2.5 text-muted-foreground text-[10px]">{file.size}</td>
                        <td className="px-4 py-2.5 text-center">
                          <button className="p-1.5 hover:bg-muted/50 rounded-lg text-muted-foreground transition-colors">
                            <MoreHorizontal className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredFiles.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                          <FileText className="size-6 mx-auto mb-1.5 opacity-20" />
                          <p className="text-xs font-semibold">No documents in this category.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>

        <aside className="w-72 border-l border-border/50 p-4 overflow-y-auto hidden xl:block space-y-5 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-500">
              <Database className="size-4" />
              <span className="text-xs font-bold">Status</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              <CheckCircle2 className="size-2.5" /> Online
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Repository Stats</h3>
            <div className="space-y-2">
              {[
                { label: "County Budgets", value: "1,240 docs", pct: 70, color: "bg-primary" },
                { label: "National Reports", value: "850 docs", pct: 50, color: "bg-emerald-400" },
                { label: "Audit Findings", value: "420 docs", pct: 30, color: "bg-amber-400" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="flex justify-between text-[10px] font-semibold mb-0.5">
                    <span>{stat.label}</span>
                    <span className="text-muted-foreground">{stat.value}</span>
                  </div>
                  <div className="h-1 bg-muted/50 rounded-full overflow-hidden">
                    <div className={`h-full ${stat.color} rounded-full`} style={{ width: `${stat.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-border/30">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Recent Activity</h3>
            <div className="text-center py-4">
              <p className="text-[10px] text-muted-foreground/60">No recent activity yet.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
