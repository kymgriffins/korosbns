"use client";

import { Button } from "@/ui/button";
import { FileCheck, History, DownloadCloud, Share2, AlertCircle } from "lucide-react";
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

export function DocumentsTab({
  stageId,
  documentName,
  selectedYear,
  constitutionTab,
  apiLoading,
  currentStageDocs,
  yearOptions,
  isDocTracked,
  onYearChange,
  onConstitutionTabChange,
  onToggleTrackDoc,
  onCopyShareLink,
  onRequestDocument,
}: DocumentsTabProps) {
  return (
    <div className="space-y-5 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="space-y-1">
        <h3 className="font-black text-sm flex items-center gap-1.5">
          <FileCheck className="size-4.5 text-primary" /> Documents Repository
        </h3>
        <p className="text-[11px] text-muted-foreground leading-normal">
          Access official statutory and planning records. Filter historical archives and download PDFs for offline analysis.
        </p>
      </div>

      {apiLoading && (
        <div className="flex items-center justify-center py-4 gap-2 text-xs text-muted-foreground">
          <div className="animate-spin size-4 border-2 border-primary border-t-transparent rounded-full" />
          <span>Loading live API files...</span>
        </div>
      )}

      {stageId === 1 && (
        <div className="grid grid-cols-2 gap-2 bg-muted/50 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => onConstitutionTabChange("current")}
            className={cn("py-1.5 rounded-lg transition-all", constitutionTab === "current" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground")}
          >
            Current Document
          </button>
          <button
            onClick={() => onConstitutionTabChange("timeline")}
            className={cn("py-1.5 rounded-lg transition-all", constitutionTab === "timeline" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground")}
          >
            <History className="inline size-3.5 mr-1" /> Historical Timeline
          </button>
        </div>
      )}

      {(stageId !== 1 || constitutionTab === "current") && (
        <div className="space-y-2">
          <label className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">Select Financial Year:</label>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {yearOptions.map((yr) => (
              <button
                key={yr}
                onClick={() => onYearChange(yr)}
                className={cn("px-3 py-1.5 rounded-xl border text-[11px] font-bold shrink-0 transition-all",
                  selectedYear === yr ? "bg-primary border-primary text-primary-foreground shadow-sm" : "bg-card border-border text-muted-foreground hover:text-foreground"
                )}
              >
                {yr === 2010 && stageId === 1 ? "2010 (Current)" : yr}
              </button>
            ))}
          </div>
        </div>
      )}

      {stageId === 1 && constitutionTab === "timeline" ? (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="p-3 bg-muted/20 border border-border rounded-xl text-[10px] text-muted-foreground leading-normal flex items-start gap-2">
            <History className="size-4 text-primary shrink-0 mt-0.5" />
            <span>Select a year on the timeline below to open its historical draft details, referendums context, and download PDFs.</span>
          </div>
          <div className="space-y-4 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
            {CONSTITUTION_HISTORICAL_DOCS.map((doc) => {
              const isDocSelected = selectedYear === doc.year;
              return (
                <div
                  key={doc.id}
                  onClick={() => onYearChange(doc.year)}
                  className={cn("relative cursor-pointer transition-all p-3 rounded-xl border",
                    isDocSelected ? "border-primary bg-primary/5 shadow-xs" : "border-border bg-card hover:bg-muted/40"
                  )}
                >
                  <div className={cn("absolute -left-[22px] top-[14px] size-3.5 rounded-full border-2 transition-all",
                    isDocSelected ? "bg-primary border-primary scale-110" : "bg-background border-muted-foreground/40"
                  )} />
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-black text-foreground">{doc.title}</h4>
                    <span className="text-[9px] bg-muted border border-border px-1.5 py-0.5 rounded-full font-bold text-muted-foreground">{doc.year}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-normal">{doc.historicalContext || doc.description}</p>
                  {isDocSelected && (
                    <div className="mt-3 pt-3 border-t border-border flex flex-wrap gap-2">
                      {doc.isAvailable ? (
                        <>
                          <a href={doc.pdfUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-bold hover:bg-primary/95 transition-all">📄 View PDF</a>
                          <a href={`${doc.pdfUrl}?download=1`} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] bg-muted border border-border text-foreground px-3 py-1.5 rounded-lg font-bold hover:bg-muted/80 transition-all">
                            <DownloadCloud className="size-3" /> Download
                          </a>
                        </>
                      ) : (
                        <div className="flex-1 flex flex-col space-y-2">
                          <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-600 font-bold px-2 py-1.5 rounded-lg text-center">⚠️ PDF Not Available (Archived)</span>
                          <Button size="xs" onClick={() => onRequestDocument(doc.title, doc.year)} className="w-full text-[9px] font-bold">Request PDF Copy</Button>
                        </div>
                      )}
                      <a href={doc.sourceUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] bg-muted border border-border text-foreground px-3 py-1.5 rounded-lg font-bold hover:bg-muted/70">🔗 Source Portal</a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-3.5 border border-border bg-card rounded-xl flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-foreground">Alert Subscriptions</h4>
              <p className="text-[9px] text-muted-foreground">Subscribe to alerts when counties upload local updates.</p>
            </div>
            <Button size="sm" variant={isDocTracked ? "outline" : "default"} onClick={onToggleTrackDoc} className="font-bold shrink-0 text-xs h-9 rounded-xl px-3">
              {isDocTracked ? "Tracking" : "Track Stage"}
            </Button>
          </div>

          {currentStageDocs.length > 0 ? (
            <div className="space-y-3.5">
              <div className="flex justify-between items-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                <span>Auditable Documents ({currentStageDocs.length})</span>
                <span>{selectedYear}</span>
              </div>
              {currentStageDocs.map((doc) => (
                <div key={doc.id} className="p-4 border border-border bg-card rounded-xl space-y-3 shadow-xs animate-in slide-in-from-bottom-1 duration-200">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="text-xs font-black text-foreground truncate max-w-[200px] sm:max-w-xs">{doc.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " ")}</h4>
                      <p className="text-[9px] text-muted-foreground mt-0.5">{doc.issuingBody} · {doc.financialYear}</p>
                    </div>
                    {doc.isCurrent && <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">Current</span>}
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{doc.description}</p>
                  <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <a href={doc.pdfUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex h-8 px-2.5 items-center gap-1 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold hover:bg-primary/95 transition-all shadow-xs">📄 View</a>
                      <a href={doc.pdfUrl} download={doc.name}
                        className="inline-flex h-8 px-2.5 items-center gap-1 rounded-lg border border-border bg-muted/20 text-foreground text-[10px] font-bold hover:bg-muted/50 transition-all">
                        <DownloadCloud className="size-3" /> Get
                      </a>
                      <button onClick={() => onCopyShareLink(doc.pdfUrl)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted/20 text-muted-foreground hover:text-foreground transition-all" title="Share Document Link">
                        <Share2 className="size-3.5" />
                      </button>
                    </div>
                    <span className="text-[9px] font-mono text-muted-foreground shrink-0 uppercase">
                      {doc.sizeBytes ? `${(doc.sizeBytes / 1024 / 1024).toFixed(1)} MB` : "PDF"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 border border-dashed border-border bg-muted/15 rounded-xl text-center space-y-4">
              <AlertCircle className="size-10 mx-auto text-muted-foreground/60" />
              <div>
                <h4 className="font-bold text-xs text-foreground">No stage documents found for year {selectedYear}</h4>
                <p className="text-[10px] text-muted-foreground max-w-xs mx-auto mt-1 leading-normal">The statutory document may not have been gazetted or uploaded for this financial year yet.</p>
              </div>
              <div className="flex flex-col gap-1.5 max-w-xs mx-auto">
                <Button size="sm" onClick={() => onYearChange(2026)} className="rounded-xl text-xs font-bold">Reset to Current Year (2026)</Button>
                <Button size="sm" variant="outline" onClick={() => onRequestDocument(documentName, selectedYear)} className="rounded-xl text-xs font-bold">Request Document from Authority</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
