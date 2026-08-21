"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  FileCode,
  Save,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Database,
  Layers,
  Code2,
  ExternalLink,
  RefreshCw,
  Search,
  Check,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  FolderOpen,
  Users,
  BarChart3,
  BookOpen,
  FileJson,
} from "lucide-react";
import { toast } from "sonner";
import {
  headlessCmsApi,
  CMS_COLLECTIONS_CATALOG,
  MASTER_CMS_EMAIL,
  type CmsCollectionSlug,
  type CmsCategory,
} from "@/lib/headless-cms";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CATEGORIES: ("All" | CmsCategory)[] = [
  "All",
  "Marketing & Site Copy",
  "Organization & Team",
  "Civic Allocations",
  "Platform Config & Documents",
  "KE Budget Engine Datasets",
  "Learning Curriculum Fallbacks",
];

export function HeadlessCmsStudio() {
  const allCollections = useMemo(() => headlessCmsApi.getAllCollections(), []);
  const [selectedSlug, setSelectedSlug] = useState<CmsCollectionSlug>("landing");
  const [selectedCategory, setSelectedCategory] = useState<"All" | CmsCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [rawJsonText, setRawJsonText] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPushingAll, setIsPushingAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<"json" | "tree" | "preview">("json");
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [diskPersisted, setDiskPersisted] = useState(true);

  const collectionMeta = CMS_COLLECTIONS_CATALOG[selectedSlug] || allCollections[0];

  // Load collection data from persistent API
  const loadCollection = useCallback(async (slug: CmsCollectionSlug) => {
    setIsLoading(true);
    setJsonError(null);
    setSaveSuccess(false);

    try {
      const res = await fetch(`/api/cms/${slug}`);
      if (res.ok) {
        const payload = await res.json();
        const formatted = JSON.stringify(payload.data, null, 2);
        setRawJsonText(formatted);
        setLastSavedTime(payload.timestamp ? new Date(payload.timestamp).toLocaleTimeString() : null);
        setDiskPersisted(payload.source === "disk");
      } else {
        // Fallback to local memory API
        const fallbackData = headlessCmsApi.getCollectionData(slug);
        setRawJsonText(JSON.stringify(fallbackData, null, 2));
      }
    } catch {
      const fallbackData = headlessCmsApi.getCollectionData(slug);
      setRawJsonText(JSON.stringify(fallbackData, null, 2));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCollection(selectedSlug);
  }, [selectedSlug, loadCollection]);

  // Filter collections
  const filteredCollections = useMemo(() => {
    return allCollections.filter((meta) => {
      const matchesCategory =
        selectedCategory === "All" || meta.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        meta.name.toLowerCase().includes(query) ||
        meta.slug.toLowerCase().includes(query) ||
        meta.description.toLowerCase().includes(query) ||
        meta.filePath.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [allCollections, selectedCategory, searchQuery]);

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
      toast.success("JSON formatted successfully");
    } catch (err) {
      setJsonError(err instanceof Error ? err.message : "Cannot format invalid JSON");
      toast.error("Invalid JSON syntax");
    }
  };

  const handleRevert = () => {
    loadCollection(selectedSlug);
    toast.info(`Reverted ${selectedSlug}.json to last saved version`);
  };

  const handleSaveAndPublish = async () => {
    try {
      const parsed = JSON.parse(rawJsonText);
      setIsSaving(true);
      setJsonError(null);

      // Save via API (persists to disk and memory)
      const res = await fetch(`/api/cms/${selectedSlug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: parsed, editorEmail: MASTER_CMS_EMAIL }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to save JSON to disk");
      }

      // Also update in-memory client store
      try {
        headlessCmsApi.updateCollectionData(selectedSlug, parsed, MASTER_CMS_EMAIL);
      } catch {
        // memory sync
      }

      setSaveSuccess(true);
      setDiskPersisted(Boolean(result.diskPersisted ?? true));
      setLastSavedTime(new Date().toLocaleTimeString());
      toast.success(`Saved and persisted ${selectedSlug}.json to disk!`, {
        description: `Path: ${result.filePath || collectionMeta.filePath}`,
      });
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to publish JSON";
      setJsonError(msg);
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePushAllToDisk = async () => {
    setIsPushingAll(true);
    try {
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "push-all", editorEmail: MASTER_CMS_EMAIL }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to push all datasets");
      }

      toast.success(
        `Bulk Synced & Pushed ${result.totalSynced}/${result.totalDatasets} JSON Datasets to Disk!`,
        { description: "All files updated persistently on disk." },
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to push all datasets");
    } finally {
      setIsPushingAll(false);
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
    toast.success(`Exported ${selectedSlug}.json`);
  };

  const handleExportAllBundle = async () => {
    try {
      const res = await fetch("/api/cms?export=all");
      const json = await res.json();
      const blob = new Blob([JSON.stringify(json.bundle, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bns-all-datasets-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Exported bundle of ${json.totalCollections} datasets!`);
    } catch {
      toast.error("Failed to export all datasets");
    }
  };

  // Helper for Tree Editor to update a nested key path
  const handleTreeValueUpdate = (pathKeys: (string | number)[], newValue: unknown) => {
    try {
      const root = JSON.parse(rawJsonText);
      let current: Record<string, unknown> = root;
      for (let i = 0; i < pathKeys.length - 1; i++) {
        const k = pathKeys[i];
        current = current[k] as Record<string, unknown>;
      }
      current[pathKeys[pathKeys.length - 1]] = newValue;
      const updatedStr = JSON.stringify(root, null, 2);
      setRawJsonText(updatedStr);
      setJsonError(null);
    } catch {
      toast.error("Failed to update field value");
    }
  };

  const parsedJson = useMemo(() => {
    try {
      return JSON.parse(rawJsonText);
    } catch {
      return null;
    }
  }, [rawJsonText]);

  const getCategoryIcon = (category: CmsCategory) => {
    switch (category) {
      case "Marketing & Site Copy":
        return FolderOpen;
      case "Organization & Team":
        return Users;
      case "Civic Allocations":
        return BarChart3;
      case "Platform Config & Documents":
        return Layers;
      case "KE Budget Engine Datasets":
        return Database;
      case "Learning Curriculum Fallbacks":
        return BookOpen;
      default:
        return FileJson;
    }
  };

  return (
    <div className="space-y-6">
      {/* Studio Header Banner */}
      <div className="rounded-2xl border border-border/80 bg-card shadow-sm p-6 relative overflow-hidden space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 border border-purple-500/20 shrink-0">
              <Database className="size-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 font-bold">
                  JSON Data Engine &amp; Content CMS
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Persistent Storage: <code className="text-foreground font-semibold px-1.5 py-0.5 rounded bg-muted">Local Filesystem + API</code>
                </span>
                <span className="text-xs text-muted-foreground">
                  {allCollections.length} JSON Datasets Available
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold font-heading text-foreground mt-1">
                Admin JSON Content Studio
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              variant="default"
              size="sm"
              onClick={handlePushAllToDisk}
              disabled={isPushingAll}
              className="gap-1.5 text-xs font-bold bg-primary text-primary-foreground shadow-xs"
            >
              {isPushingAll ? (
                <RefreshCw className="size-3.5 animate-spin" />
              ) : (
                <Save className="size-3.5" />
              )}
              <span>Push All to Disk</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportAllBundle}
              className="gap-1.5 text-xs font-semibold"
            >
              <Download className="size-3.5 text-purple-500" />
              <span>Export All (Bundle)</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJson}
              className="gap-1.5 text-xs font-semibold"
            >
              <Download className="size-3.5 text-blue-500" />
              <span>Export {selectedSlug}.json</span>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="sm"
              className="gap-1.5 text-xs font-bold"
            >
              <a
                href={`/api/cms/${selectedSlug}`}
                target="_blank"
                rel="noreferrer"
              >
                <span>View API</span>
                <ExternalLink className="size-3.5" />
              </a>
            </Button>
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/40">
          {CATEGORIES.map((cat) => {
            const count =
              cat === "All"
                ? allCollections.length
                : allCollections.filter((c) => c.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-background/80 text-muted-foreground"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Collection Navigation & Search */}
        <div className="lg:col-span-1 space-y-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search JSON collections..."
              className="pl-8 h-9 text-xs"
            />
          </div>

          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1 flex items-center justify-between">
            <span>Datasets ({filteredCollections.length})</span>
            <Layers className="size-3.5 text-primary" />
          </div>

          <div className="space-y-1.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredCollections.map((meta) => {
              const slug = meta.slug;
              const isSelected = selectedSlug === slug;
              const IconComp = getCategoryIcon(meta.category);

              return (
                <button
                  key={slug}
                  type="button"
                  onClick={() => setSelectedSlug(slug)}
                  className={`w-full text-left p-3 rounded-xl border transition-all space-y-1 ${
                    isSelected
                      ? "border-primary/50 bg-primary/10 shadow-xs text-foreground font-semibold"
                      : "border-border/60 bg-card hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <IconComp className="size-3.5 text-primary shrink-0" />
                      <span className="text-xs font-mono font-bold text-foreground truncate">{slug}.json</span>
                    </div>
                    {isSelected && <CheckCircle2 className="size-3.5 text-primary shrink-0" />}
                  </div>
                  <div className="text-[11px] font-medium text-foreground truncate">{meta.name}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{meta.filePath}</div>
                </button>
              );
            })}
            {filteredCollections.length === 0 && (
              <div className="p-4 text-center text-xs text-muted-foreground">
                No collections match &ldquo;{searchQuery}&rdquo;
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Editor / Form View Window */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-card shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <FileCode className="size-4 text-purple-500 shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground font-mono">{selectedSlug}.json</span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                    {collectionMeta.category}
                  </Badge>
                </div>
                <div className="text-[11px] text-muted-foreground truncate font-mono">
                  {collectionMeta.filePath}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
              {/* View Switcher */}
              <div className="flex rounded-lg border border-border bg-muted/40 p-0.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveView("json")}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    activeView === "json" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Code
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView("tree")}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    activeView === "tree" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Tree Editor
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView("preview")}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    activeView === "preview" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Overview
                </button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleFormatJson}
                className="gap-1 text-xs h-8"
              >
                <Code2 className="size-3" />
                <span>Format</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRevert}
                className="gap-1 text-xs h-8"
              >
                <RotateCcw className="size-3" />
                <span>Revert</span>
              </Button>
              <Button
                onClick={handleSaveAndPublish}
                disabled={isSaving || !!jsonError}
                size="sm"
                className="bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 gap-1.5 text-xs font-bold h-8 shadow-xs"
              >
                {isSaving ? (
                  <RefreshCw className="size-3.5 animate-spin" />
                ) : (
                  <Save className="size-3.5" />
                )}
                <span>Save to Disk</span>
              </Button>
            </div>
          </div>

          {/* Validation & Status Banners */}
          {jsonError && (
            <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-mono flex items-center gap-2">
              <AlertTriangle className="size-4 shrink-0" />
              <span>JSON Syntax Error: {jsonError}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>{selectedSlug}.json saved &amp; persisted directly to disk!</span>
            </div>
          )}

          {/* Main Content Workspace */}
          {isLoading ? (
            <div className="h-[520px] rounded-xl border border-border bg-card flex flex-col items-center justify-center gap-2 text-muted-foreground text-xs">
              <RefreshCw className="size-5 animate-spin text-primary" />
              <span>Loading dataset from disk...</span>
            </div>
          ) : activeView === "json" ? (
            /* Code View */
            <div className="rounded-xl border border-border/80 bg-neutral-950 p-4 font-mono text-xs text-neutral-100 shadow-inner">
              <textarea
                value={rawJsonText}
                onChange={(e) => handleJsonChange(e.target.value)}
                spellCheck={false}
                className="w-full h-[520px] bg-transparent text-emerald-400 focus:outline-none resize-none leading-relaxed font-mono selection:bg-emerald-800"
              />
            </div>
          ) : activeView === "tree" ? (
            /* Visual Tree & Field Editor */
            <div className="rounded-xl border border-border bg-card p-4 h-[520px] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <span className="text-xs font-bold text-foreground">Interactive Field Editor</span>
                <span className="text-[11px] text-muted-foreground">Changes reflect in raw JSON instantly</span>
              </div>
              {parsedJson && typeof parsedJson === "object" ? (
                <JsonTreeEditor
                  data={parsedJson}
                  path={[]}
                  onUpdate={handleTreeValueUpdate}
                />
              ) : (
                <div className="text-xs text-rose-500">
                  Cannot render tree view: Fix JSON syntax errors first.
                </div>
              )}
            </div>
          ) : (
            /* Overview & Schema Preview */
            <div className="rounded-xl border border-border bg-card p-5 h-[520px] overflow-y-auto space-y-4">
              <div>
                <h3 className="text-sm font-bold text-foreground">{collectionMeta.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{collectionMeta.description}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg border border-border/60 bg-muted/30 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">File Location</div>
                  <div className="text-xs font-mono font-semibold text-foreground truncate">{collectionMeta.filePath}</div>
                </div>
                <div className="p-3 rounded-lg border border-border/60 bg-muted/30 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">Category</div>
                  <div className="text-xs font-semibold text-foreground">{collectionMeta.category}</div>
                </div>
                <div className="p-3 rounded-lg border border-border/60 bg-muted/30 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">Top-Level Keys</div>
                  <div className="text-xs font-mono font-semibold text-foreground">
                    {parsedJson && typeof parsedJson === "object" ? Object.keys(parsedJson).length : 0} keys
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-foreground">Schema Keys Overview:</div>
                <div className="flex flex-wrap gap-1.5">
                  {collectionMeta.schemaKeys.map((key) => (
                    <Badge key={key} variant="outline" className="text-xs font-mono">
                      {key}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <div className="text-xs font-bold text-foreground mb-2">Live JSON Snapshot:</div>
                <pre className="p-3 rounded-lg bg-muted text-[11px] font-mono text-muted-foreground overflow-x-auto max-h-64">
                  {rawJsonText}
                </pre>
              </div>
            </div>
          )}

          {/* API Info & Disk Persistence Footer */}
          <div className="p-3 rounded-xl border border-border/60 bg-muted/30 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-block size-2 rounded-full bg-emerald-500" />
              <span>Target File: <code className="text-foreground font-bold">{collectionMeta.filePath}</code></span>
            </div>
            <div className="flex items-center gap-3">
              {lastSavedTime && (
                <span>Last saved: <strong className="text-foreground">{lastSavedTime}</strong></span>
              )}
              <span>Master Editor: <strong className="text-emerald-600 dark:text-emerald-400">{MASTER_CMS_EMAIL}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Recursive Tree Node Component for viewing and editing nested JSON values in-place.
 */
function JsonTreeEditor({
  data,
  path,
  onUpdate,
}: {
  data: unknown;
  path: (string | number)[];
  onUpdate: (path: (string | number)[], value: unknown) => void;
}) {
  const [collapsedKeys, setCollapsedKeys] = useState<Record<string, boolean>>({});

  const toggleCollapse = (key: string) => {
    setCollapsedKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (data === null || data === undefined) {
    return <span className="text-muted-foreground italic text-xs">null</span>;
  }

  if (typeof data === "string") {
    const isMultiline = data.includes("\n") || data.length > 80;
    if (isMultiline) {
      return (
        <textarea
          value={data}
          onChange={(e) => onUpdate(path, e.target.value)}
          rows={3}
          className="w-full text-xs font-mono p-2 rounded-md border border-border bg-background focus:outline-primary"
        />
      );
    }
    return (
      <Input
        value={data}
        onChange={(e) => onUpdate(path, e.target.value)}
        className="h-8 text-xs font-mono bg-background"
      />
    );
  }

  if (typeof data === "number") {
    return (
      <Input
        type="number"
        value={data}
        onChange={(e) => onUpdate(path, Number(e.target.value))}
        className="h-8 w-40 text-xs font-mono bg-background"
      />
    );
  }

  if (typeof data === "boolean") {
    return (
      <button
        type="button"
        onClick={() => onUpdate(path, !data)}
        className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
          data ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"
        }`}
      >
        {data ? "TRUE" : "FALSE"}
      </button>
    );
  }

  if (Array.isArray(data)) {
    return (
      <div className="space-y-2 pl-3 border-l-2 border-primary/20">
        <div className="text-[11px] font-semibold text-muted-foreground">
          Array ({data.length} items)
        </div>
        {data.map((item, idx) => (
          <div key={idx} className="space-y-1 p-2 rounded-lg bg-muted/20 border border-border/40">
            <div className="text-[10px] font-mono font-bold text-primary">Item [{idx}]</div>
            <JsonTreeEditor
              data={item}
              path={[...path, idx]}
              onUpdate={onUpdate}
            />
          </div>
        ))}
      </div>
    );
  }

  if (typeof data === "object") {
    const obj = data as Record<string, unknown>;
    const keys = Object.keys(obj);

    return (
      <div className="space-y-2.5">
        {keys.map((key) => {
          const val = obj[key];
          const isComplex = typeof val === "object" && val !== null;
          const isCollapsed = Boolean(collapsedKeys[key]);

          return (
            <div
              key={key}
              className="p-2.5 rounded-lg border border-border/50 bg-background/60 space-y-1.5 transition-colors hover:border-border"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex items-center gap-1.5 text-xs font-mono font-bold text-foreground ${
                    isComplex ? "cursor-pointer select-none" : ""
                  }`}
                  onClick={isComplex ? () => toggleCollapse(key) : undefined}
                >
                  {isComplex && (
                    isCollapsed ? (
                      <ChevronRight className="size-3.5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="size-3.5 text-primary" />
                    )
                  )}
                  <span>{key}</span>
                  {isComplex && (
                    <span className="text-[10px] text-muted-foreground font-normal">
                      {Array.isArray(val) ? `[${val.length}]` : `{${Object.keys(val).length}}`}
                    </span>
                  )}
                </div>
              </div>

              {!isCollapsed && (
                <div className={isComplex ? "pt-1" : ""}>
                  <JsonTreeEditor
                    data={val}
                    path={[...path, key]}
                    onUpdate={onUpdate}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return <span className="text-xs font-mono">{String(data)}</span>;
}

