"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Eye,
  EyeOff,
  Film,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  Sliders,
  CheckCircle2,
  Video,
  ListPlus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MediaEmbed } from "@/components/ui/media-embed";
import { MediaAssetPicker, type MediaSelection } from "@/components/admin/MediaAssetPicker";
import {
  type CustomPageItem,
  type PageSection,
  type SectionType,
  createDefaultSection,
  ensurePageSections,
} from "@/lib/headless-page-cms";

export type CustomPageStudioEditorProps = {
  page: CustomPageItem;
  onChange: (updatedPage: CustomPageItem) => void;
};

const SECTION_TYPE_LABELS: Record<SectionType, { label: string; icon: string; color: string }> = {
  hero: { label: "Hero Header", icon: "⭐", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  video_showcase: { label: "Video Showcase", icon: "🎬", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  stats_grid: { label: "Key Metrics", icon: "📊", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  feature_cards: { label: "Feature Cards", icon: "🃏", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  narrative: { label: "Narrative Prose", icon: "📝", color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
  faq: { label: "FAQ Accordion", icon: "❓", color: "bg-teal-500/10 text-teal-600 border-teal-500/20" },
  cta_banner: { label: "CTA Banner", icon: "🚀", color: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
};

export function CustomPageStudioEditor({
  page,
  onChange,
}: CustomPageStudioEditorProps) {
  const sections = ensurePageSections(page);
  const [activeMediaSectionId, setActiveMediaSectionId] = useState<string | null>(null);
  const [expandedSectionIds, setExpandedSectionIds] = useState<Record<string, boolean>>({});

  function updatePage(updater: (draft: CustomPageItem) => void) {
    const clone = JSON.parse(JSON.stringify(page)) as CustomPageItem;
    clone.sections = ensurePageSections(clone);
    updater(clone);
    onChange(clone);
  }

  function toggleSectionExpand(id: string) {
    setExpandedSectionIds((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id],
    }));
  }

  function handleToggleSectionEnabled(idx: number) {
    updatePage((draft) => {
      if (draft.sections && draft.sections[idx]) {
        draft.sections[idx].enabled = !draft.sections[idx].enabled;
      }
    });
  }

  function handleMoveSection(idx: number, direction: "up" | "down") {
    updatePage((draft) => {
      if (!draft.sections) return;
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= draft.sections.length) return;
      const temp = draft.sections[idx];
      draft.sections[idx] = draft.sections[targetIdx];
      draft.sections[targetIdx] = temp;
    });
  }

  function handleDeleteSection(idx: number) {
    if (!confirm("Are you sure you want to remove this section?")) return;
    updatePage((draft) => {
      if (draft.sections) {
        draft.sections.splice(idx, 1);
      }
    });
  }

  function handleDuplicateSection(idx: number) {
    updatePage((draft) => {
      if (!draft.sections) return;
      const copy = JSON.parse(JSON.stringify(draft.sections[idx]));
      copy.id = `section-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      draft.sections.splice(idx + 1, 0, copy);
    });
  }

  function handleAddSection(type: SectionType) {
    updatePage((draft) => {
      if (!draft.sections) draft.sections = [];
      const newSec = createDefaultSection(type);
      draft.sections.push(newSec);
      setExpandedSectionIds((prev) => ({ ...prev, [newSec.id]: true }));
    });
  }

  function handleUpdateSection(idx: number, field: keyof PageSection, value: any) {
    updatePage((draft) => {
      if (draft.sections && draft.sections[idx]) {
        draft.sections[idx] = { ...draft.sections[idx], [field]: value };
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Top Bar: Title, Slug & Publication Status */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Editing: {page.title}
            </h2>
            <p className="text-xs text-muted-foreground">
              Route: <code className="font-mono font-bold text-primary">/pages/{page.slug}</code>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
              <a href={`/pages/${page.slug}?preview=true`} target="_blank" rel="noreferrer">
                <span>Open Preview</span>
                <ExternalLink className="size-3.5" />
              </a>
            </Button>

            {/* Published / Draft Pill Selector */}
            <div className="flex items-center rounded-xl bg-muted/80 p-0.5 border border-border/80 shadow-xs">
              <button
                type="button"
                onClick={() => updatePage((d) => (d.published = false))}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  page.published === false
                    ? "bg-amber-500 text-white font-bold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Draft
              </button>
              <button
                type="button"
                onClick={() => updatePage((d) => (d.published = true))}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  page.published !== false
                    ? "bg-emerald-600 text-white font-bold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Published
              </button>
            </div>
          </div>
        </div>

        {/* Essential Page Meta Fields */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-foreground">Page Title</label>
            <Input
              value={page.title ?? ""}
              onChange={(e) => updatePage((d) => (d.title = e.target.value))}
              className="mt-1 h-8 text-xs font-semibold"
              placeholder="e.g. Kenya Sovereign Debt Brief"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">URL Slug</label>
            <Input
              value={page.slug ?? ""}
              onChange={(e) =>
                updatePage((d) => (d.slug = e.target.value.toLowerCase().replace(/\s+/g, "-")))
              }
              className="mt-1 h-8 text-xs font-mono"
              placeholder="e.g. kenya-sovereign-debt-brief"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-foreground">Eyebrow Pill Tag</label>
            <Input
              value={page.eyebrow ?? ""}
              onChange={(e) => updatePage((d) => (d.eyebrow = e.target.value))}
              className="mt-1 h-8 text-xs"
              placeholder="e.g. Special Brief · BNS Connect"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">SEO Meta Description</label>
            <Input
              value={page.seoDescription ?? ""}
              onChange={(e) => updatePage((d) => (d.seoDescription = e.target.value))}
              className="mt-1 h-8 text-xs"
              placeholder="Concise summary for search engines and WhatsApp sharing previews"
            />
          </div>
        </div>
      </div>

      {/* MODULAR SECTIONS ENGINE */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Layers className="size-4 text-primary" />
              <span>Page Sections ({sections.length})</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Every visible element can be edited, toggled on/off, reordered, or enhanced with Cloudflare R2 / YouTube media.
            </p>
          </div>

          {/* Add Section Menu */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-muted-foreground mr-1">+ Add Section:</span>
            {(Object.keys(SECTION_TYPE_LABELS) as SectionType[]).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => handleAddSection(st)}
                className="px-2.5 py-1 rounded-lg border border-border/80 bg-muted/40 hover:bg-muted text-[11px] font-semibold text-foreground transition-colors"
              >
                {SECTION_TYPE_LABELS[st].icon} {SECTION_TYPE_LABELS[st].label}
              </button>
            ))}
          </div>
        </div>

        {/* Sections List */}
        <div className="space-y-4">
          {sections.map((section, idx) => {
            const typeMeta = SECTION_TYPE_LABELS[section.type] || {
              label: section.type,
              icon: "📦",
              color: "bg-muted text-foreground border-border",
            };
            const isExpanded = expandedSectionIds[section.id] !== false; // default expanded

            return (
              <div
                key={section.id}
                className={`rounded-2xl border transition-all ${
                  section.enabled
                    ? "border-border bg-card shadow-xs"
                    : "border-dashed border-border/60 bg-muted/20 opacity-75"
                }`}
              >
                {/* Section Card Header */}
                <div className="flex items-center justify-between gap-3 p-4 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-md border text-xs font-bold ${typeMeta.color}`}>
                      {typeMeta.icon} {typeMeta.label}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleSectionEnabled(idx)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                        section.enabled
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                      title="Toggle visibility on live site"
                    >
                      {section.enabled ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                      <span>{section.enabled ? "Enabled" : "Disabled (Hidden)"}</span>
                    </button>
                  </div>

                  {/* Move, Duplicate, Delete Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveSection(idx, "up")}
                      className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30"
                      title="Move Up"
                    >
                      <MoveUp className="size-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === sections.length - 1}
                      onClick={() => handleMoveSection(idx, "down")}
                      className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30"
                      title="Move Down"
                    >
                      <MoveDown className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicateSection(idx)}
                      className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                      title="Duplicate Section"
                    >
                      <Copy className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSection(idx)}
                      className="p-1.5 rounded hover:bg-red-500/10 text-red-500"
                      title="Delete Section"
                    >
                      <Trash2 className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSectionExpand(section.id)}
                      className="p-1.5 rounded hover:bg-muted text-muted-foreground ml-1"
                    >
                      {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                    </button>
                  </div>
                </div>

                {/* Section Form Fields (Collapsible) */}
                {isExpanded ? (
                  <div className="p-5 space-y-4">
                    {/* Common Header Fields */}
                    {["hero", "video_showcase", "stats_grid", "feature_cards", "narrative", "faq", "cta_banner"].includes(
                      section.type,
                    ) ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-semibold text-muted-foreground">Section Eyebrow</label>
                            <Input
                              value={section.eyebrow ?? ""}
                              onChange={(e) => handleUpdateSection(idx, "eyebrow", e.target.value)}
                              placeholder="e.g. Evidence Series · BNS Connect"
                              className="h-8 text-xs mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-muted-foreground">Main Headline</label>
                            <Input
                              value={section.headline ?? ""}
                              onChange={(e) => handleUpdateSection(idx, "headline", e.target.value)}
                              placeholder="e.g. Tracking Public Expenditure"
                              className="h-8 text-xs font-semibold mt-1"
                            />
                          </div>
                        </div>

                        {["hero", "video_showcase", "feature_cards", "faq", "cta_banner"].includes(section.type) ? (
                          <div>
                            <label className="text-[11px] font-semibold text-muted-foreground">Lead / Subtitle Description</label>
                            <textarea
                              value={section.body ?? ""}
                              onChange={(e) => handleUpdateSection(idx, "body", e.target.value)}
                              rows={2}
                              className="w-full rounded-md border border-input bg-background p-2 text-xs text-foreground focus-visible:outline-none mt-1 leading-relaxed"
                              placeholder="Brief introductory statement..."
                            />
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    {/* TYPE: VIDEO SHOWCASE or HERO MEDIA */}
                    {["video_showcase", "hero"].includes(section.type) ? (
                      <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <Film className="size-3.5 text-primary" />
                            <span>Featured Media (Cloudflare R2 Video / YouTube / Image)</span>
                          </h4>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setActiveMediaSectionId(section.id)}
                            className="h-7 text-xs gap-1.5 font-semibold"
                          >
                            <Sliders className="size-3.5" />
                            <span>Select or Upload Media</span>
                          </Button>
                        </div>

                        {section.media?.url ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                            <div className="rounded-lg overflow-hidden border border-border bg-black max-w-sm">
                              <MediaEmbed
                                src={section.media.url}
                                type={section.media.type}
                                title={section.media.title}
                              />
                            </div>
                            <div className="space-y-2 text-xs">
                              <div>
                                <span className="font-semibold text-muted-foreground">URL: </span>
                                <span className="font-mono text-[11px] break-all text-foreground">{section.media.url}</span>
                              </div>
                              <div>
                                <label className="text-[11px] font-semibold text-muted-foreground">Media Title</label>
                                <Input
                                  value={section.media.title ?? ""}
                                  onChange={(e) =>
                                    handleUpdateSection(idx, "media", { ...section.media, title: e.target.value })
                                  }
                                  className="h-7 text-xs mt-0.5"
                                  placeholder="e.g. Sovereign Debt Investigation"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-semibold text-muted-foreground">Caption</label>
                                <Input
                                  value={section.media.caption ?? ""}
                                  onChange={(e) =>
                                    handleUpdateSection(idx, "media", { ...section.media, caption: e.target.value })
                                  }
                                  className="h-7 text-xs mt-0.5"
                                  placeholder="e.g. Produced by Budget Ndio Story"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-6 border border-dashed border-border rounded-lg text-xs text-muted-foreground">
                            No media attached yet. Click &ldquo;Select or Upload Media&rdquo; to pick an R2 video or embed YouTube.
                          </div>
                        )}
                      </div>
                    ) : null}

                    {/* BUTTONS CONTROLS */}
                    {["hero", "video_showcase", "cta_banner"].includes(section.type) ? (
                      <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Action Buttons ({section.buttons?.length || 0})
                          </h4>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const newBtn = {
                                id: `btn-${Date.now()}`,
                                label: "Get Involved",
                                href: "/contact",
                                variant: "primary" as const,
                                enabled: true,
                              };
                              handleUpdateSection(idx, "buttons", [...(section.buttons || []), newBtn]);
                            }}
                            className="h-7 text-xs gap-1"
                          >
                            <Plus className="size-3" />
                            <span>Add Button</span>
                          </Button>
                        </div>

                        <div className="space-y-2.5">
                          {(section.buttons || []).map((btn, bIdx) => (
                            <div key={btn.id} className="flex flex-wrap items-center gap-2 p-2.5 rounded-lg border border-border/60 bg-background">
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...(section.buttons || [])];
                                  updated[bIdx].enabled = !updated[bIdx].enabled;
                                  handleUpdateSection(idx, "buttons", updated);
                                }}
                                className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 ${
                                  btn.enabled ? "bg-emerald-500/15 text-emerald-600" : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {btn.enabled ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                                <span>{btn.enabled ? "Active" : "Hidden"}</span>
                              </button>

                              <Input
                                value={btn.label}
                                onChange={(e) => {
                                  const updated = [...(section.buttons || [])];
                                  updated[bIdx].label = e.target.value;
                                  handleUpdateSection(idx, "buttons", updated);
                                }}
                                placeholder="Button Label"
                                className="h-7 text-xs flex-1 min-w-[120px]"
                              />

                              <Input
                                value={btn.href}
                                onChange={(e) => {
                                  const updated = [...(section.buttons || [])];
                                  updated[bIdx].href = e.target.value;
                                  handleUpdateSection(idx, "buttons", updated);
                                }}
                                placeholder="Target Route / URL"
                                className="h-7 text-xs font-mono flex-1 min-w-[140px]"
                              />

                              <select
                                value={btn.variant || "primary"}
                                onChange={(e) => {
                                  const updated = [...(section.buttons || [])];
                                  updated[bIdx].variant = e.target.value as any;
                                  handleUpdateSection(idx, "buttons", updated);
                                }}
                                className="h-7 rounded border border-border bg-muted/40 px-2 text-xs"
                              >
                                <option value="primary">Primary</option>
                                <option value="outline">Outline</option>
                              </select>

                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...(section.buttons || [])];
                                  updated.splice(bIdx, 1);
                                  handleUpdateSection(idx, "buttons", updated);
                                }}
                                className="p-1 rounded text-red-500 hover:bg-red-500/10"
                                title="Remove Button"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {/* TYPE: STATS GRID */}
                    {section.type === "stats_grid" ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Metric Stats ({section.items?.length || 0})
                          </h4>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const newItem = {
                                id: `stat-${Date.now()}`,
                                title: "New Metric",
                                value: "100+",
                                label: "New Metric Label",
                                enabled: true,
                              };
                              handleUpdateSection(idx, "items", [...(section.items || []), newItem]);
                            }}
                            className="h-7 text-xs gap-1"
                          >
                            <Plus className="size-3" />
                            <span>Add Stat</span>
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {(section.items || []).map((stat, sIdx) => (
                            <div key={stat.id} className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-bold text-primary">#{sIdx + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...(section.items || [])];
                                    updated.splice(sIdx, 1);
                                    handleUpdateSection(idx, "items", updated);
                                  }}
                                  className="text-red-500 p-1 hover:bg-red-500/10 rounded"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </div>
                              <Input
                                value={stat.value ?? ""}
                                onChange={(e) => {
                                  const updated = [...(section.items || [])];
                                  updated[sIdx].value = e.target.value;
                                  handleUpdateSection(idx, "items", updated);
                                }}
                                placeholder="Value (e.g. 11.2T)"
                                className="h-7 text-xs font-bold font-mono"
                              />
                              <Input
                                value={stat.label ?? ""}
                                onChange={(e) => {
                                  const updated = [...(section.items || [])];
                                  updated[sIdx].label = e.target.value;
                                  handleUpdateSection(idx, "items", updated);
                                }}
                                placeholder="Label (e.g. Debt Tracked)"
                                className="h-7 text-xs"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {/* TYPE: FEATURE CARDS */}
                    {section.type === "feature_cards" ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Deliverables / Cards ({section.items?.length || 0})
                          </h4>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const newCard = {
                                id: `card-${Date.now()}`,
                                title: "New Deliverable Card",
                                description: "Description of the tangible deliverable or module.",
                                tag: "Evidence",
                                link: "/contact",
                                enabled: true,
                              };
                              handleUpdateSection(idx, "items", [...(section.items || []), newCard]);
                            }}
                            className="h-7 text-xs gap-1"
                          >
                            <Plus className="size-3" />
                            <span>Add Card</span>
                          </Button>
                        </div>

                        <div className="space-y-3">
                          {(section.items || []).map((card, cIdx) => (
                            <div key={card.id} className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <Input
                                  value={card.tag ?? ""}
                                  onChange={(e) => {
                                    const updated = [...(section.items || [])];
                                    updated[cIdx].tag = e.target.value;
                                    handleUpdateSection(idx, "items", updated);
                                  }}
                                  placeholder="Tag / Eyebrow (e.g. Macro Finance)"
                                  className="h-7 text-xs font-mono max-w-[180px]"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...(section.items || [])];
                                    updated.splice(cIdx, 1);
                                    handleUpdateSection(idx, "items", updated);
                                  }}
                                  className="text-red-500 p-1 hover:bg-red-500/10 rounded"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </div>
                              <Input
                                value={card.title}
                                onChange={(e) => {
                                  const updated = [...(section.items || [])];
                                  updated[cIdx].title = e.target.value;
                                  handleUpdateSection(idx, "items", updated);
                                }}
                                placeholder="Card Title"
                                className="h-7 text-xs font-semibold"
                              />
                              <textarea
                                value={card.description ?? ""}
                                onChange={(e) => {
                                  const updated = [...(section.items || [])];
                                  updated[cIdx].description = e.target.value;
                                  handleUpdateSection(idx, "items", updated);
                                }}
                                rows={2}
                                className="w-full rounded-md border border-input bg-background p-2 text-xs text-foreground focus-visible:outline-none leading-relaxed"
                                placeholder="Card description..."
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {/* TYPE: NARRATIVE PROSE */}
                    {section.type === "narrative" ? (
                      <div className="space-y-2">
                        <label className="text-[11px] font-semibold text-muted-foreground">
                          Markdown / Prose Content (Separate paragraphs with blank lines)
                        </label>
                        <textarea
                          value={section.content ?? ""}
                          onChange={(e) => handleUpdateSection(idx, "content", e.target.value)}
                          rows={6}
                          className="w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground leading-relaxed focus-visible:outline-none"
                          placeholder="Write full longform article or investigation narrative..."
                        />
                      </div>
                    ) : null}

                    {/* TYPE: FAQ ACCORDION */}
                    {section.type === "faq" ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            FAQ Items ({section.items?.length || 0})
                          </h4>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const newFaq = {
                                id: `faq-${Date.now()}`,
                                title: "Question title here?",
                                description: "Detailed answer explaining the policy or methodology.",
                                enabled: true,
                              };
                              handleUpdateSection(idx, "items", [...(section.items || []), newFaq]);
                            }}
                            className="h-7 text-xs gap-1"
                          >
                            <Plus className="size-3" />
                            <span>Add FAQ</span>
                          </Button>
                        </div>

                        <div className="space-y-3">
                          {(section.items || []).map((faq, fIdx) => (
                            <div key={faq.id} className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-mono text-xs font-bold text-primary">Q{fIdx + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...(section.items || [])];
                                    updated.splice(fIdx, 1);
                                    handleUpdateSection(idx, "items", updated);
                                  }}
                                  className="text-red-500 p-1 hover:bg-red-500/10 rounded"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </div>
                              <Input
                                value={faq.title}
                                onChange={(e) => {
                                  const updated = [...(section.items || [])];
                                  updated[fIdx].title = e.target.value;
                                  handleUpdateSection(idx, "items", updated);
                                }}
                                placeholder="Question?"
                                className="h-7 text-xs font-semibold"
                              />
                              <textarea
                                value={faq.description ?? ""}
                                onChange={(e) => {
                                  const updated = [...(section.items || [])];
                                  updated[fIdx].description = e.target.value;
                                  handleUpdateSection(idx, "items", updated);
                                }}
                                rows={2}
                                className="w-full rounded-md border border-input bg-background p-2 text-xs text-foreground focus-visible:outline-none leading-relaxed"
                                placeholder="Answer..."
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* MEDIA ASSET PICKER MODAL */}
      {activeMediaSectionId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-4xl">
            <MediaAssetPicker
              title="Attach Video, Cloudflare R2 Asset, or YouTube Embed"
              onClose={() => setActiveMediaSectionId(null)}
              onSelect={(media: MediaSelection) => {
                const sIdx = sections.findIndex((s) => s.id === activeMediaSectionId);
                if (sIdx !== -1) {
                  handleUpdateSection(sIdx, "media", {
                    type: media.type,
                    url: media.url,
                    title: media.title,
                  });
                }
                setActiveMediaSectionId(null);
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
