"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Folder, FileText, MoreHorizontal, Database, CheckCircle2, ArrowLeft, Download, ExternalLink, Loader2 } from "lucide-react";
import { cn } from "@/utils";
import { BitmojiAvatar } from "./bitmoji-avatar";
import { fetchDocumentsFromAPI, type DocumentType, type DocumentFile } from "@/constants/documents";

type TabFilter = "all" | "tracked" | "commentaries";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(timestamp: number): string {
  if (!timestamp) return "—";
  return new Date(timestamp * 1000).toLocaleDateString();
}

export function LearnDocumentsView({ profile }: { profile: any }) {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<DocumentType | null>(null);
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchDocumentsFromAPI().then((result) => {
      if (cancelled) return;
      if (result.error) {
        setError(result.error);
      }
      setDocuments(result.documents);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const trackedFiles: DocumentFile[] = useMemo(() => {
    return (profile?.trackedDocs || []).map((doc: any, i: number) => ({
      name: typeof doc === "string" ? doc : doc.name,
      size: 0,
      url: "#",
      downloadUrl: "#",
      modified: Date.now() / 1000,
    }));
  }, [profile?.trackedDocs]);

  const commentaryFiles: DocumentFile[] = useMemo(() => {
    return (profile?.participationLogs || []).map((log: any) => ({
      name: log.documentName || "Draft Memorandum",
      size: 0,
      url: "#",
      downloadUrl: "#",
      modified: new Date(log.dateSubmitted).getTime() / 1000,
    }));
  }, [profile?.participationLogs]);

  const filteredDocs = useMemo(() => {
    if (!searchQuery.trim()) return documents;
    const q = searchQuery.toLowerCase();
    return documents.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.fullName.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
    );
  }, [documents, searchQuery]);

  const folderFiles = useMemo(() => {
    if (!selectedFolder) return [];
    if (!searchQuery.trim()) return selectedFolder.files;
    const q = searchQuery.toLowerCase();
    return selectedFolder.files.filter((f) => f.name.toLowerCase().includes(q));
  }, [selectedFolder, searchQuery]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[40vh] gap-3">
        <Loader2 className="size-6 text-primary animate-spin" />
        <p className="text-xs text-muted-foreground font-semibold">Loading document repository...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[40vh] gap-3 p-6 text-center">
        <Database className="size-8 text-muted-foreground/30" />
        <p className="text-sm font-bold text-foreground">Repository unavailable</p>
        <p className="text-xs text-muted-foreground max-w-xs">{error}</p>
      </div>
    );
  }

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
              {selectedFolder ? selectedFolder.fullName : "Data Repository"}
            </h1>
            <p className="text-[10px] text-muted-foreground font-semibold">
              {selectedFolder
                ? `${folderFiles.length} file${folderFiles.length !== 1 ? "s" : ""}`
                : `${documents.length} collections`
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
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4 md:space-y-5">
        {!selectedFolder ? (
          <>
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-muted/20 p-0.5 rounded-lg w-fit">
              {([
                { id: "all" as const, label: "Repository" },
                { id: "tracked" as const, label: "Tracked" },
                { id: "commentaries" as const, label: "My Drafts" },
              ]).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-3 py-1 rounded-md text-[10px] font-bold transition-all focus-visible:ring-2 focus-visible:ring-primary/50",
                    activeTab === tab.id ? "bg-card shadow-xs text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "all" && (
              <>
                {/* Folder grid */}
                <section className="space-y-3">
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Collections</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {filteredDocs.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => setSelectedFolder(doc)}
                        className="bg-card shadow-xs rounded-xl p-3 flex items-center gap-3 hover:shadow-sm transition-all cursor-pointer group text-left focus-visible:ring-2 focus-visible:ring-primary/50"
                      >
                        <div className="bg-muted/30 p-2 rounded-lg group-hover:bg-primary/10 transition-colors shrink-0">
                          <Folder className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-xs truncate">{doc.title}</h3>
                          <p className="text-[10px] text-muted-foreground">{doc.files.length} file{doc.files.length !== 1 ? "s" : ""}</p>
                        </div>
                      </button>
                    ))}
                    {filteredDocs.length === 0 && (
                      <div className="col-span-full text-center py-8">
                        <Folder className="size-8 mx-auto mb-2 text-muted-foreground/20" />
                        <p className="text-xs font-semibold text-muted-foreground">No collections found.</p>
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}

            {activeTab === "tracked" && (
              <section className="space-y-3">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Tracked Documents</h2>
                {trackedFiles.length > 0 ? (
                  <FileList files={trackedFiles} />
                ) : (
                  <EmptyState message="No tracked documents yet. Complete a learning stage to start tracking." />
                )}
              </section>
            )}

            {activeTab === "commentaries" && (
              <section className="space-y-3">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">My Drafts</h2>
                {commentaryFiles.length > 0 ? (
                  <FileList files={commentaryFiles} />
                ) : (
                  <EmptyState message="No drafts submitted yet. Complete a learning stage to draft a memorandum." />
                )}
              </section>
            )}
          </>
        ) : (
          /* Folder contents */
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{selectedFolder.fullName}</h2>
              <span className="text-[10px] text-muted-foreground/60">·</span>
              <p className="text-[10px] text-muted-foreground">{selectedFolder.description}</p>
            </div>
            {folderFiles.length > 0 ? (
              <FileList files={folderFiles} />
            ) : (
              <EmptyState message={`No files found${searchQuery ? " matching your search" : ""} in this collection.`} />
            )}
          </section>
        )}
      </div>
    </div>
  );
}

function FileList({ files }: { files: DocumentFile[] }) {
  return (
    <>
      {/* Desktop: table */}
      <div className="hidden md:block bg-card shadow-xs rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30 text-xs">
            {files.map((file, idx) => (
              <tr key={idx} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="bg-muted/30 p-1.5 rounded-lg shrink-0">
                      <FileText className="size-3.5 text-primary" />
                    </div>
                    <p className="font-bold text-foreground text-[11px] truncate">{file.name}</p>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-muted-foreground text-[10px]">{formatBytes(file.size)}</td>
                <td className="px-4 py-2.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {file.url && file.url !== "#" && (
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 hover:bg-muted/50 rounded-lg text-muted-foreground hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary/50"
                        title="Open"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                    )}
                    {file.downloadUrl && file.downloadUrl !== "#" && (
                      <a
                        href={file.downloadUrl}
                        className="p-1.5 hover:bg-muted/50 rounded-lg text-muted-foreground hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary/50"
                        title="Download"
                      >
                        <Download className="size-3.5" />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: card list */}
      <div className="md:hidden space-y-2">
        {files.map((file, idx) => (
          <div key={idx} className="bg-card shadow-xs rounded-xl p-3 flex items-center gap-3">
            <div className="bg-muted/30 p-1.5 rounded-lg shrink-0">
              <FileText className="size-3.5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-foreground text-[11px] truncate">{file.name}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{formatBytes(file.size)}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {file.url && file.url !== "#" && (
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 hover:bg-muted/50 rounded-lg text-muted-foreground hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <ExternalLink className="size-3.5" />
                </a>
              )}
              {file.downloadUrl && file.downloadUrl !== "#" && (
                <a
                  href={file.downloadUrl}
                  className="p-1.5 hover:bg-muted/50 rounded-lg text-muted-foreground hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <Download className="size-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-10 border border-dashed border-border rounded-2xl">
      <FileText className="size-8 mx-auto mb-2 text-muted-foreground/20" />
      <p className="text-xs font-semibold text-muted-foreground">{message}</p>
    </div>
  );
}
