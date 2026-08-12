"use client";

import React, { useState, useEffect } from "react";
import {
  FileCode,
  Save,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Database,
  Key,
  Layers,
  Code2,
  ExternalLink,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import {
  headlessCmsApi,
  CMS_COLLECTIONS_CATALOG,
  MASTER_CMS_EMAIL,
  type CmsCollectionSlug,
} from "@/lib/headless-cms";

export function HeadlessCmsStudio() {
  const [selectedSlug, setSelectedSlug] = useState<CmsCollectionSlug>("programmes");
  const [rawJsonText, setRawJsonText] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeView, setActiveView] = useState<"json" | "preview">("json");

  const collectionMeta = CMS_COLLECTIONS_CATALOG[selectedSlug];

  useEffect(() => {
    const data = headlessCmsApi.getCollectionData(selectedSlug);
    setRawJsonText(JSON.stringify(data, null, 2));
    setJsonError(null);
    setSaveSuccess(false);
  }, [selectedSlug]);

  const handleJsonChange = (text: string) => {
    setRawJsonText(text);
    setSaveSuccess(false);
    try {
      JSON.parse(text);
      setJsonError(null);
    } catch (err) {
      setJsonError(err instanceof Error ? err.message : "Invalid JSON syntax");
    }
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(rawJsonText);
      setRawJsonText(JSON.stringify(parsed, null, 2));
      setJsonError(null);
    } catch (err) {
      setJsonError(err instanceof Error ? err.message : "Cannot format invalid JSON");
    }
  };

  const handleRevert = () => {
    const data = headlessCmsApi.getCollectionData(selectedSlug);
    setRawJsonText(JSON.stringify(data, null, 2));
    setJsonError(null);
    setSaveSuccess(false);
  };

  const handleSaveAndPublish = async () => {
    try {
      const parsed = JSON.parse(rawJsonText);
      setIsSaving(true);
      setJsonError(null);

      // Save via Headless CMS Data API
      headlessCmsApi.updateCollectionData(selectedSlug, parsed, MASTER_CMS_EMAIL);

      // Perform API fetch POST to verify endpoint
      await fetch(`/api/cms/${selectedSlug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: parsed, editorEmail: MASTER_CMS_EMAIL }),
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      setJsonError(err instanceof Error ? err.message : "Failed to publish JSON");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportJson = () => {
    const blob = new Blob([rawJsonText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedSlug}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Studio Header Banner */}
      <div className="rounded-2xl border border-border/80 bg-card shadow-md p-6 relative overflow-hidden space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 border border-purple-500/20 shrink-0">
              <Database className="size-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  Headless CMS Studio & Data Engine
                </span>
                <span className="text-xs text-muted-foreground">
                  Master Editor: <code className="text-foreground font-bold px-1.5 py-0.5 rounded bg-muted">{MASTER_CMS_EMAIL}</code>
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold font-heading text-foreground mt-0.5">
                JSON Content Management & Data Publishing
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground transition-colors shadow-xs"
            >
              <Download className="size-3.5 text-blue-500" />
              <span>Export {selectedSlug}.json</span>
            </button>
            <a
              href={`/api/cms/${selectedSlug}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold transition-colors shadow-xs"
            >
              <span>View API Endpoint</span>
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Studio Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Collection Navigation */}
        <div className="lg:col-span-1 space-y-3">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1 flex items-center justify-between">
            <span>JSON Collections ({Object.keys(CMS_COLLECTIONS_CATALOG).length})</span>
            <Layers className="size-3.5 text-primary" />
          </div>

          <div className="space-y-1.5">
            {(Object.keys(CMS_COLLECTIONS_CATALOG) as CmsCollectionSlug[]).map((slug) => {
              const meta = CMS_COLLECTIONS_CATALOG[slug];
              const isSelected = selectedSlug === slug;
              return (
                <button
                  key={slug}
                  onClick={() => setSelectedSlug(slug)}
                  className={`w-full text-left p-3 rounded-xl border transition-all space-y-1 ${
                    isSelected
                      ? "border-primary/40 bg-primary/10 shadow-xs text-foreground font-semibold"
                      : "border-border/50 bg-card hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-foreground">{slug}.json</span>
                    {isSelected && <CheckCircle2 className="size-3.5 text-primary shrink-0" />}
                  </div>
                  <div className="text-[11px] font-medium text-foreground truncate">{meta.name}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{meta.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Code Editor & Preview Window */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2">
              <FileCode className="size-4 text-purple-500" />
              <span className="text-sm font-bold text-foreground font-mono">{selectedSlug}.json</span>
              <span className="text-xs text-muted-foreground">({collectionMeta.description})</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveView(activeView === "json" ? "preview" : "json")}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-border bg-muted/40 hover:bg-muted"
              >
                {activeView === "json" ? "View Formatted Tree" : "View Code"}
              </button>
              <button
                onClick={handleFormatJson}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-border bg-muted/40 hover:bg-muted flex items-center gap-1"
              >
                <Code2 className="size-3" />
                <span>Format</span>
              </button>
              <button
                onClick={handleRevert}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-border bg-muted/40 hover:bg-muted flex items-center gap-1"
              >
                <RotateCcw className="size-3" />
                <span>Revert</span>
              </button>
              <button
                onClick={handleSaveAndPublish}
                disabled={isSaving || !!jsonError}
                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
              >
                {isSaving ? (
                  <RefreshCw className="size-3.5 animate-spin" />
                ) : (
                  <Save className="size-3.5" />
                )}
                <span>Save & Publish JSON</span>
              </button>
            </div>
          </div>

          {/* Validation Banner */}
          {jsonError && (
            <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-mono flex items-center gap-2">
              <AlertTriangle className="size-4 shrink-0" />
              <span>JSON Syntax Error: {jsonError}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>Collection {selectedSlug}.json published successfully by {MASTER_CMS_EMAIL}!</span>
            </div>
          )}

          {/* JSON Text Editor Window */}
          {activeView === "json" ? (
            <div className="rounded-xl border border-border/80 bg-neutral-950 p-4 font-mono text-xs text-neutral-100 shadow-inner">
              <textarea
                value={rawJsonText}
                onChange={(e) => handleJsonChange(e.target.value)}
                spellCheck={false}
                className="w-full h-[520px] bg-transparent text-emerald-400 focus:outline-none resize-none leading-relaxed font-mono"
              />
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-4 h-[520px] overflow-y-auto space-y-3 font-mono text-xs">
              <pre className="text-foreground whitespace-pre-wrap leading-relaxed">
                {rawJsonText}
              </pre>
            </div>
          )}

          {/* API Info Footer */}
          <div className="p-3 rounded-xl border border-border/60 bg-muted/30 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>REST API Endpoint: <code className="text-foreground font-bold">/api/cms/{selectedSlug}</code></span>
            <span>Master Editor Permissions: <strong className="text-emerald-600 dark:text-emerald-400">Granted to {MASTER_CMS_EMAIL}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
