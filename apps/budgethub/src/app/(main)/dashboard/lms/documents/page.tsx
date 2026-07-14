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
import { documentData, type DocumentType, type DocumentFile } from "@/data/documents";
import { extractYearFromName, formatBytes, type FlatFile } from "@/data/documents";
import { DocumentFolderCard, DocumentFileRow, DocumentFileView } from "@/components/documents";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<DocumentType | null>(null);
  const [selectedFile, setSelectedFile] = useState<FlatFile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await documentData.fetch();
      setDocuments(result.documents);
    } catch {
      setError("Failed to load documents. Please try again later.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => { setSelectedFile(null); }, [selectedDoc]);

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

  const flatFiles: FlatFile[] = useMemo(() => {
    if (!selectedDocFiltered) return [];
    return selectedDocFiltered.files.map((f, i) => ({
      id: `${selectedDoc!.id}-${f.name}-${i}`,
      name: f.name,
      size: f.size,
      url: f.url,
      downloadUrl: f.downloadUrl,
      modified: f.modified,
      folderName: selectedDoc!.fullName,
      docType: selectedDoc!.title,
      year: extractYearFromName(f.name),
      county: null,
    }));
  }, [selectedDocFiltered]);

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

  // File detail view — DocumentFileView has its own breadcrumb
  if (selectedFile && selectedDoc) {
    return (
      <DocumentFileView
        file={selectedFile}
        folderName={selectedDoc.fullName}
        docType={selectedDoc.title}
        onBack={() => setSelectedFile(null)}
      />
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
          <Badge variant="secondary" className="text-[10px]">{flatFiles.length} file{flatFiles.length !== 1 ? "s" : ""}</Badge>
          {selectedDoc.years.length > 0 && (
            <Badge variant="outline" className="text-[10px]">{selectedDoc.years[0]}\u2013{selectedDoc.years[selectedDoc.years.length - 1]}</Badge>
          )}
        </div>

        {flatFiles.length > 0 ? (
          <div className="space-y-2">
            {flatFiles.map((file) => (
              <DocumentFileRow
                key={file.id}
                file={file}
                viewMode="card"
                onView={() => setSelectedFile(file)}
              />
            ))}
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
                      <Badge variant="outline" className="text-[10px]">{doc.years[0]}\u2013{doc.years[doc.years.length - 1]}</Badge>
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
