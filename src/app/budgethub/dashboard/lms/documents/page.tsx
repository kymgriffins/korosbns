"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Download, ExternalLink, File, FileText, FolderClosed, FolderOpen, Loader2, RefreshCw, Search, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { usePageView } from "@/hooks/use-page-view";
import { contentData } from "@/data/content";
import type { DocumentType, DocumentFile } from "@/constants/documents";

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${units[i]}`;
}

function FileRow({ file }: { file: DocumentFile }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/40">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
        <File className="size-4.5 text-blue-600" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{file.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(file.size)}
          {file.modified > 0 && ` · ${format(new Date(file.modified * 1000), "MMM d, yyyy")}`}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-xs" asChild title="View">
          <a href={file.url} target="_blank" rel="noopener noreferrer"><ExternalLink className="size-3.5" /></a>
        </Button>
        <Button variant="ghost" size="icon-xs" asChild title="Download">
          <a href={file.downloadUrl} target="_blank" rel="noopener noreferrer" download><Download className="size-3.5" /></a>
        </Button>
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  usePageView();
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<DocumentType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await contentData.documents.fetchFromDirectory();
    if (result.error) { setError(result.error); }
    setDocuments(result.documents);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredDocs = useMemo(() => {
    if (!searchQuery) return documents;
    const q = searchQuery.toLowerCase();
    return documents.filter((doc) =>
      doc.title.toLowerCase().includes(q) ||
      doc.fullName.toLowerCase().includes(q) ||
      doc.description.toLowerCase().includes(q) ||
      doc.files.some((f) => f.name.toLowerCase().includes(q))
    );
  }, [documents, searchQuery]);

  const selectedDocFiltered = useMemo(() => {
    if (!selectedDoc || !searchQuery) return selectedDoc;
    const q = searchQuery.toLowerCase();
    return {
      ...selectedDoc,
      files: selectedDoc.files.filter((f) => f.name.toLowerCase().includes(q)),
    };
  }, [selectedDoc, searchQuery]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
            <p className="text-sm text-muted-foreground">Browse budget and policy documents</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}><CardContent className="p-6"><Skeleton className="h-5 w-20" /><Skeleton className="mt-2 h-4 w-3/4" /><Skeleton className="mt-1 h-3 w-1/2" /></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
            <p className="text-sm text-muted-foreground">Browse budget and policy documents</p>
          </div>
        </div>
        <Card><CardContent className="flex flex-col items-center gap-3 py-16"><FileText className="size-12 text-muted-foreground/30" /><p className="text-lg font-medium">Repository Unavailable</p><p className="text-sm text-muted-foreground text-center max-w-md">{error}</p><Button variant="outline" size="sm" onClick={fetchData}><RefreshCw className="size-4" /> Retry</Button></CardContent></Card>
      </div>
    );
  }

  if (selectedDoc) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => { setSelectedDoc(null); setSearchQuery(""); }}>
              <FolderClosed className="size-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">{selectedDoc.fullName}</h1>
              <p className="text-sm text-muted-foreground">{selectedDoc.description}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search files in this folder..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-8"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary" className="text-[10px]">{selectedDocFiltered?.files.length ?? 0} file{(selectedDocFiltered?.files.length ?? 0) !== 1 ? "s" : ""}</Badge>
          {selectedDoc.years.length > 0 && (
            <Badge variant="outline" className="text-[10px]">{selectedDoc.years[0]}–{selectedDoc.years[selectedDoc.years.length - 1]}</Badge>
          )}
        </div>

        {selectedDocFiltered && selectedDocFiltered.files.length > 0 ? (
          <div className="space-y-2">
            {selectedDocFiltered.files.map((file, idx) => <FileRow key={`${file.name}-${idx}`} file={file} />)}
          </div>
        ) : (
          <Card><CardContent className="flex flex-col items-center gap-2 py-12"><FileText className="size-10 text-muted-foreground/30" /><p className="text-sm text-muted-foreground">No files match your search.</p></CardContent></Card>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
          <p className="text-sm text-muted-foreground">Browse budget and policy documents</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
          Refresh
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search document collections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-8"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {filteredDocs.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center gap-3 py-16"><FolderOpen className="size-12 text-muted-foreground/30" /><p className="text-lg font-medium">No documents found</p><p className="text-sm text-muted-foreground">{searchQuery ? "No collections match your search." : "The document repository is empty."}</p></CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDocs.map((doc) => (
            <button key={doc.id} onClick={() => setSelectedDoc(doc)} className="group text-left">
              <Card className="h-full transition-all hover:border-primary/40 hover:shadow-sm">
                <CardContent className="flex flex-col gap-2 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                      <FolderClosed className="size-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{doc.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{doc.fullName}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{doc.description}</p>
                  <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-[10px]">{doc.files.length} file{doc.files.length !== 1 ? "s" : ""}</Badge>
                    {doc.years.length > 0 && (
                      <Badge variant="outline" className="text-[10px]">{doc.years[0]}–{doc.years[doc.years.length - 1]}</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
