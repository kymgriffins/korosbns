"use client";

import { Button } from "@/ui/button";
import { FileCheck, History, DownloadCloud, Share2, AlertCircle, FileText } from "lucide-react";
import { cn } from "@/utils";
import { CONSTITUTION_HISTORICAL_DOCS, GovernmentDocument } from "@/constants/documents-registry";

interface DocumentsTabProps {
  stageId: number;
  documentName: string;
  selectedYear: number;
  constitutionTab: "current" | "timeline";
  apiLoading: boolean;
  currentStageDocs: GovernmentDocument[];
  yearOptions: number[];
  isDocTracked: boolean;
  onYearChange: (year: number) => void;
  onConstitutionTabChange: (tab: "current" | "timeline") => void;
  onToggleTrackDoc: () => void;
  onCopyShareLink: (url: string) => void;
  onRequestDocument: (docType: string, year: number) => void;
}

export function DocumentsTab({ stageId, documentName, selectedYear, constitutionTab, apiLoading, currentStageDocs, yearOptions, isDocTracked, onYearChange, onConstitutionTabChange, onToggleTrackDoc, onCopyShareLink, onRequestDocument }: DocumentsTabProps) {
  return (
    <div className="space-y-4 max-w-4xl mx-auto animate-in fade-in duration-200">
      <div className="space-y-0.5">
        <h3 className="font-bold text-xs flex items-center gap-1.5">
          <FileCheck className="size-3.5 text-primary" /> Documents Repository
        </h3>
        <p className="text-[10px] text-muted-foreground">Access official statutory and planning records. Download PDFs.</p>
      </div>

      {apiLoading && (
        <div className="flex items-center justify-center py-3 gap-2 text-xs text-muted-foreground">
          <div className="animate-spin size-3.5 border-2 border-primary border-t-transparent rounded-full" />
          <span>Loading...</span>
        </div>
      )}

      {stageId === 1 && (
        <div className="grid grid-cols-2 gap-1 bg-muted/30 p-0.5 rounded-lg text-[10px] font-bold">
          <button onClick={() => onConstitutionTabChange("current")}
            className={cn("py-1.5 rounded-md transition-all", constitutionTab === "current" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground")}>Current</button>
          <button onClick={() => onConstitutionTabChange("timeline")}
            className={cn("py-1.5 rounded-md transition-all", constitutionTab === "timeline" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground")}>
            <History className="inline size-3 mr-1" /> Timeline
          </button>
        </div>
      )}

      {(stageId !== 1 || constitutionTab === "current") && (
        <div className="space-y-1.5">
          <label className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">Financial Year:</label>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
            {yearOptions.map((yr) => (
              <button key={yr} onClick={() => onYearChange(yr)}
                className={cn("px-2.5 py-1.5 rounded-lg border text-[10px] font-semibold shrink-0 transition-all",
                  selectedYear === yr ? "bg-primary border-primary text-primary-foreground shadow-xs" : "bg-card border-border/50 text-muted-foreground hover:text-foreground")}>
                {yr === 2010 && stageId === 1 ? "2010 (Current)" : yr}
              </button>
            ))}
          </div>
        </div>
      )}

      {stageId === 1 && constitutionTab === "timeline" ? (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-2.5 bg-muted/20 rounded-lg text-[10px] text-muted-foreground flex items-start gap-2">
            <History className="size-3.5 text-primary shrink-0 mt-0.5" />
            <span>Select a year to view historical drafts and context.</span>
          </div>
          <div className="space-y-3 relative pl-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/50">
            {CONSTITUTION_HISTORICAL_DOCS.map((doc) => {
              const isDocSelected = selectedYear === doc.year;
              return (
                <div key={doc.id} onClick={() => onYearChange(doc.year)}
                  className={cn("relative cursor-pointer transition-all p-3 rounded-xl",
                    isDocSelected ? "bg-primary/5 shadow-xs" : "bg-card hover:bg-muted/30"
                  )}>
                  <div className={cn("absolute -left-[18px] top-[13px] size-3 rounded-full border-2 transition-all",
                    isDocSelected ? "bg-primary border-primary" : "bg-background border-muted-foreground/30"
                  )} />
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold">{doc.title}</h4>
                    <span className="text-[8px] bg-muted/30 px-1.5 py-0.5 rounded font-semibold text-muted-foreground">{doc.year}</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-1">{doc.historicalContext || doc.description}</p>
                  {isDocSelected && (
                    <div className="mt-2.5 pt-2.5 border-t border-border/30 flex flex-wrap gap-1.5">
                      {doc.isAvailable ? (
                        <>
                          <a href={doc.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[9px] bg-primary text-primary-foreground px-2.5 py-1.5 rounded-lg font-bold hover:bg-primary/95 transition-all">\uD83D\uDCC4 View</a>
                          <a href={`${doc.pdfUrl}?download=1`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[9px] bg-muted/30 text-foreground px-2.5 py-1.5 rounded-lg font-bold hover:bg-muted/50 transition-all">
                            <DownloadCloud className="size-2.5" /> Download
                          </a>
                        </>
                      ) : (
                        <div className="flex-1 flex flex-col space-y-1.5">
                          <span className="text-[8px] bg-amber-500/10 text-amber-600 font-bold px-2 py-1 rounded text-center">PDF Archived</span>
                          <Button size="xs" onClick={() => onRequestDocument(doc.title, doc.year)} className="text-[8px] font-bold h-6 rounded-lg">Request Copy</Button>
                        </div>
                      )}
                      <a href={doc.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[9px] bg-muted/30 text-foreground px-2.5 py-1.5 rounded-lg font-bold hover:bg-muted/50">\uD83D\uDD17 Source</a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="p-3 bg-card shadow-xs rounded-xl flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold">Alert Subscriptions</h4>
              <p className="text-[9px] text-muted-foreground">Get notified when counties upload updates.</p>
            </div>
            <Button size="sm" variant={isDocTracked ? "outline" : "default"} onClick={onToggleTrackDoc} className="font-bold text-[9px] h-7 rounded-lg px-2.5">
              {isDocTracked ? "Tracking" : "Track"}
            </Button>
          </div>

          {currentStageDocs.length > 0 ? (
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                <span>Documents ({currentStageDocs.length})</span>
                <span>{selectedYear}</span>
              </div>
              {currentStageDocs.map((doc) => (
                <div key={doc.id} className="p-3 bg-card shadow-xs rounded-xl space-y-2.5 animate-in slide-in-from-bottom-1 duration-200">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="text-xs font-bold truncate max-w-[200px]">{doc.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " ")}</h4>
                      <p className="text-[8px] text-muted-foreground mt-0.5">{doc.issuingBody} · {doc.financialYear}</p>
                    </div>
                    {doc.isCurrent && <span className="text-[7px] bg-emerald-500/10 text-emerald-600 font-bold px-1 py-0.5 rounded uppercase tracking-wider shrink-0">Current</span>}
                  </div>
                  <p className="text-[9px] text-muted-foreground leading-relaxed">{doc.description}</p>
                  <div className="pt-2 border-t border-border/30 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <a href={doc.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-7 px-2 items-center gap-1 rounded-lg bg-primary text-primary-foreground text-[9px] font-bold hover:bg-primary/95 transition-all shadow-xs">\uD83D\uDCC4 View</a>
                      <a href={doc.pdfUrl} download={doc.name} className="inline-flex h-7 px-2 items-center gap-1 rounded-lg bg-muted/30 text-foreground text-[9px] font-bold hover:bg-muted/50 transition-all">
                        <DownloadCloud className="size-2.5" /> Get
                      </a>
                      <button onClick={() => onCopyShareLink(doc.pdfUrl)} className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-muted/30 text-muted-foreground hover:text-foreground transition-all" title="Share">
                        <Share2 className="size-3" />
                      </button>
                    </div>
                    <span className="text-[8px] font-mono text-muted-foreground uppercase">{doc.sizeBytes ? `${(doc.sizeBytes / 1024 / 1024).toFixed(1)} MB` : "PDF"}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-5 bg-muted/10 rounded-xl text-center space-y-3">
              <FileText className="size-8 mx-auto text-muted-foreground/40" />
              <div>
                <h4 className="font-bold text-xs">No documents for {selectedYear}</h4>
                <p className="text-[9px] text-muted-foreground mt-1">Not yet gazetted or uploaded for this year.</p>
              </div>
              <div className="flex gap-1.5 justify-center">
                <Button size="sm" onClick={() => onYearChange(2026)} className="rounded-lg text-[9px] font-bold h-7">Reset to 2026</Button>
                <Button size="sm" variant="outline" onClick={() => onRequestDocument(documentName, selectedYear)} className="rounded-lg text-[9px] font-bold h-7">Request</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
