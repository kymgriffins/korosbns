"use client";

import { useState } from "react";
import { Search, Folder, FileText, MoreHorizontal, Database, CheckCircle2, ChevronLeft, ArrowLeft } from "lucide-react";
import { cn } from "@/utils";
import { BitmojiAvatar } from "./bitmoji-avatar";

type FolderData = { name: string; count: number; category: string };

const FOLDERS: FolderData[] = [
  { name: "Tracked Budgets", count: 24, category: "tracked-budgets" },
  { name: "County Reports", count: 18, category: "county-reports" },
  { name: "Finance Bills", count: 156, category: "finance-bills" },
  { name: "Legal Documents", count: 32, category: "legal-documents" },
  { name: "Memoranda Drafts", count: 67, category: "memoranda-drafts" },
  { name: "Policy Guidelines", count: 45, category: "policy-guidelines" },
];

type FileItem = {
  id: string;
  name: string;
  type: string;
  owner: string;
  modified: string;
  size: string;
  icon: React.ReactNode;
  category: string;
};

function getFileIcon(type: string) {
  if (type.includes("Tracked")) return <CheckCircle2 className="size-3.5 text-emerald-500" />;
  if (type.includes("Commentary")) return <FileText className="size-3.5 text-primary" />;
  return <FileText className="size-3.5 text-muted-foreground" />;
}

export function LearnDocumentsView({ profile }: { profile: any }) {
  const [activeFileTab, setActiveFileTab] = useState<"all" | "tracked" | "commentaries">("all");
  const [selectedFolder, setSelectedFolder] = useState<FolderData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const allFiles: FileItem[] = [
    ...(profile?.trackedDocs || []).map((doc: any, i: number) => ({
      id: `tracked-${i}`,
      name: typeof doc === "string" ? doc : doc.name,
      type: "Tracked Doc",
      owner: "System",
      modified: new Date().toLocaleDateString(),
      size: "1.2 MB",
      icon: <CheckCircle2 className="size-3.5 text-emerald-500" />,
      category: "tracked",
    })),
    ...(profile?.participationLogs || []).map((log: any, i: number) => ({
      id: `log-${i}`,
      name: log.documentName || "Draft Memorandum",
      type: "Commentary",
      owner: profile?.breakName || "Citizen",
      modified: new Date(log.dateSubmitted).toLocaleDateString(),
      size: "245 KB",
      icon: <FileText className="size-3.5 text-primary" />,
      category: "commentaries",
    })),
  ];

  const filteredFiles = activeFileTab === "all" ? allFiles : allFiles.filter(f => f.category === activeFileTab);
  const folderFiles = selectedFolder
    ? allFiles.filter(f => f.category === selectedFolder.category)
    : [];

  const displayedFiles = selectedFolder ? folderFiles : filteredFiles;

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <header className="flex items-center justify-between px-4 md:px-5 py-3 border-b border-border/50 shrink-0 gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {selectedFolder ? (
            <button onClick={() => setSelectedFolder(null)} className="p-1 hover:bg-muted/50 rounded-lg transition-colors -ml-1 shrink-0 focus-visible:ring-2 focus-visible:ring-primary/50">
              <ArrowLeft className="size-4" />
            </button>
          ) : (
            <div className="bg-primary/8 p-1.5 rounded-lg shrink-0">
              <Database className="size-4 text-primary" />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="font-bold text-sm leading-tight truncate">
              {selectedFolder ? selectedFolder.name : "Data Repository"}
            </h1>
            <p className="text-[10px] text-muted-foreground font-semibold">
              {selectedFolder
                ? `${folderFiles.length} document${folderFiles.length !== 1 ? "s" : ""}`
                : "Access public civic data"
              }
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-muted/40 border-0 rounded-lg text-xs w-28 md:w-44 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 ml-1 md:ml-3 md:pl-3 md:border-l border-border/50">
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

      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4 md:space-y-5">
        {!selectedFolder ? (
          <>
            {/* Folder grid */}
            <section className="space-y-3">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Collections</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {FOLDERS.map((folder) => (
                  <button
                    key={folder.category}
                    onClick={() => setSelectedFolder(folder)}
                    className="bg-card shadow-xs rounded-xl p-3 flex items-center gap-3 hover:shadow-sm transition-all cursor-pointer group text-left focus-visible:ring-2 focus-visible:ring-primary/50"
                  >
                    <div className="bg-muted/30 p-2 rounded-lg group-hover:bg-primary/10 transition-colors shrink-0">
                      <Folder className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-xs truncate">{folder.name}</h3>
                      <p className="text-[10px] text-muted-foreground">{folder.count} docs</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Documents list */}
            <section className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Documents</h2>
                <div className="flex items-center gap-1 bg-muted/20 p-0.5 rounded-lg">
                  {[
                    { id: "all", label: "All" },
                    { id: "tracked", label: "Tracked" },
                    { id: "commentaries", label: "My Drafts" },
                  ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveFileTab(tab.id as any)}
                      className={cn("px-3 py-1 rounded-md text-[10px] font-bold transition-all focus-visible:ring-2 focus-visible:ring-primary/50",
                        activeFileTab === tab.id ? "bg-card shadow-xs text-foreground" : "text-muted-foreground hover:text-foreground"
                      )}>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Desktop: table */}
              <div className="hidden md:block bg-card shadow-xs rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
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
                    {displayedFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="bg-muted/30 p-1.5 rounded-lg">{file.icon}</div>
                            <div className="min-w-0">
                              <p className="font-bold text-foreground text-[11px] truncate">{file.name}</p>
                              <p className="text-[10px] text-muted-foreground">{file.type}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground text-[10px]">{file.owner}</td>
                        <td className="px-4 py-2.5 text-muted-foreground text-[10px]">{file.modified}</td>
                        <td className="px-4 py-2.5 text-muted-foreground text-[10px]">{file.size}</td>
                        <td className="px-4 py-2.5 text-center">
                          <button className="p-1.5 hover:bg-muted/50 rounded-lg text-muted-foreground transition-colors focus-visible:ring-2 focus-visible:ring-primary/50">
                            <MoreHorizontal className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {displayedFiles.length === 0 && (
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

              {/* Mobile: card list */}
              <div className="md:hidden space-y-2">
                {displayedFiles.length > 0 ? (
                  displayedFiles.map((file) => (
                    <div key={file.id} className="bg-card shadow-xs rounded-xl p-3 flex items-center gap-3">
                      <div className="bg-muted/30 p-1.5 rounded-lg shrink-0">{file.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground text-[11px] truncate">{file.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-[10px] text-muted-foreground">{file.type}</p>
                          <span className="text-[10px] text-muted-foreground/50">·</span>
                          <p className="text-[10px] text-muted-foreground truncate">{file.owner}</p>
                        </div>
                      </div>
                      <button className="p-1.5 hover:bg-muted/50 rounded-lg text-muted-foreground transition-colors shrink-0 focus-visible:ring-2 focus-visible:ring-primary/50">
                        <MoreHorizontal className="size-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 border border-dashed border-border rounded-2xl">
                    <FileText className="size-6 mx-auto mb-1.5 opacity-20" />
                    <p className="text-xs font-semibold text-muted-foreground">No documents in this category.</p>
                  </div>
                )}
              </div>
            </section>
          </>
        ) : (
          /* Folder contents view */
          <section className="space-y-3">
            {folderFiles.length > 0 ? (
              <>
                {/* Desktop: table */}
                <div className="hidden md:block bg-card shadow-xs rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Author</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Size</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30 text-xs">
                      {folderFiles.map((file) => (
                        <tr key={file.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2.5">
                              <div className="bg-muted/30 p-1.5 rounded-lg">{file.icon}</div>
                              <div className="min-w-0">
                                <p className="font-bold text-foreground text-[11px] truncate">{file.name}</p>
                                <p className="text-[10px] text-muted-foreground">{file.type}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-muted-foreground text-[10px]">{file.owner}</td>
                          <td className="px-4 py-2.5 text-muted-foreground text-[10px]">{file.modified}</td>
                          <td className="px-4 py-2.5 text-muted-foreground text-[10px]">{file.size}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile: card list */}
                <div className="md:hidden space-y-2">
                  {folderFiles.map((file) => (
                    <div key={file.id} className="bg-card shadow-xs rounded-xl p-3 flex items-center gap-3">
                      <div className="bg-muted/30 p-1.5 rounded-lg shrink-0">{file.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground text-[11px] truncate">{file.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-[10px] text-muted-foreground">{file.type}</p>
                          <span className="text-[10px] text-muted-foreground/50">·</span>
                          <p className="text-[10px] text-muted-foreground truncate">{file.owner}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-10 border border-dashed border-border rounded-2xl">
                <Folder className="size-8 mx-auto mb-2 text-muted-foreground/20" />
                <p className="text-xs font-semibold text-muted-foreground">No documents in this folder yet.</p>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
