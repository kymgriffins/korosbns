"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Film,
  Image as ImageIcon,
  Layers,
  Plus,
  Trash2,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ImageFieldControl } from "./ImageFieldControl";
import { ColorFieldControl } from "./ColorFieldControl";

type StudioSection = Record<string, unknown> & {
  id: string;
  type: string;
};

type VisibilityRow = {
  id: string;
  label?: string;
  visible?: boolean;
};

const SECTION_TYPE_OPTIONS = [
  { id: "hero-reel", label: "Hero reel (images + videos)" },
  { id: "hero-image", label: "Screening / hero image + YouTube" },
  { id: "feature-grid", label: "Feature / production grid" },
  { id: "image-marquee", label: "Image gallery marquee" },
  { id: "text-with-stats", label: "About / story + stats" },
  { id: "partner-with-us", label: "Partner CTA" },
  { id: "cta-banner", label: "Commission CTA banner" },
  { id: "insights-bento", label: "Insights bento (shadcn-space style)" },
] as const;

function blankSection(type: string): StudioSection {
  const id = `${type}-${Date.now().toString(36)}`;
  switch (type) {
    case "hero-reel":
      return {
        id,
        type,
        badge: "New series",
        formatsLabel: "formats",
        autoPlayMs: 7000,
        slides: [
          {
            id: "slide-1",
            label: "Slide title",
            shortDesc: "Short description",
            image: "",
            videoUrl: "",
            year: "2026",
            layout: "cinema",
          },
        ],
      };
    case "hero-image":
      return {
        id,
        type,
        eyebrow: "Screening",
        title: "Title",
        description: "Description",
        videoUrl: "",
        videoTitle: "",
        playButtonLabel: "Play",
        credit: "",
        image: "",
        imageAlt: "",
      };
    case "image-marquee":
      return {
        id,
        type,
        eyebrow: "Gallery",
        title: "From field to frame.",
        description: "",
        images: [{ src: "", alt: "", caption: "" }],
        speed: "normal",
        direction: "left",
      };
    case "text-with-stats":
      return {
        id,
        type,
        eyebrow: "About",
        title: "Title",
        subtitle: "",
        description: "",
        tagline: "",
        ctaPrompt: "",
        stats: [{ value: "01", label: "Stat" }],
        image: "",
        imageAlt: "",
      };
    case "insights-bento":
      return {
        id,
        type,
        title: "Latest insights",
        viewAllLabel: "View All",
        viewAllHref: "/stories",
        layout: "featured-side-list",
        featured: {
          category: "Insights",
          title: "Featured story title",
          summary: "Short supporting sentence.",
          image: "",
          href: "/stories",
          authorName: "",
          authorRole: "",
          authorAvatar: "",
          date: "",
          overlayColor: "#0a2540",
        },
        items: [
          {
            category: "Updates",
            title: "Side story title",
            image: "",
            href: "/stories",
            authorName: "",
            authorRole: "",
            authorAvatar: "",
            date: "",
          },
        ],
      };
    case "cta-banner":
      return {
        id,
        type,
        eyebrow: "Commission",
        title: "Title",
        description: "",
        ctaLabel: "Get started",
        ctaHref: "/contact",
        theme: "contrast",
      };
    case "partner-with-us":
      return {
        id,
        type,
        variant: "split-image",
        eyebrow: "Partner With Us",
        title: "Title",
        description: "",
        primaryCta: { label: "Start a Partnership", href: "/contact" },
        secondaryCta: { label: "View Our Work", href: "/bns-studio" },
        image: "",
        imageAlt: "",
        partnerLogos: [],
        features: [],
      };
    default:
      return {
        id,
        type: "feature-grid",
        eyebrow: "Features",
        title: "Title",
        description: "",
        items: [],
      };
  }
}

interface BnsStudioSectionsEditorProps {
  data: Record<string, any>;
  onChange: (updatedData: Record<string, any>) => void;
  onOpenMediaPicker: (onSelect: (url: string) => void, title?: string, currentUrl?: string) => void;
  visibilityRows?: VisibilityRow[];
  onToggleVisibility?: (sectionId: string) => void;
}

export function BnsStudioSectionsEditor({
  data,
  onChange,
  onOpenMediaPicker,
  visibilityRows = [],
  onToggleVisibility,
}: BnsStudioSectionsEditorProps) {
  const sections = (Array.isArray(data?.sections) ? data.sections : []) as StudioSection[];
  const [selectedId, setSelectedId] = useState<string>(sections[0]?.id || "");
  const [addType, setAddType] = useState<string>("hero-reel");

  const selected = useMemo(
    () => sections.find((s) => s.id === selectedId) || sections[0] || null,
    [sections, selectedId],
  );

  const visibilityMap = useMemo(() => {
    const map = new Map<string, VisibilityRow>();
    visibilityRows.forEach((row) => map.set(row.id, row));
    return map;
  }, [visibilityRows]);

  const commitSections = (next: StudioSection[]) => {
    onChange({ ...data, sections: next });
  };

  const updateSelected = (patch: Record<string, unknown>) => {
    if (!selected) return;
    commitSections(
      sections.map((s) => (s.id === selected.id ? { ...s, ...patch } : s)),
    );
  };

  const moveSection = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    const [row] = next.splice(index, 1);
    next.splice(target, 0, row);
    commitSections(next);
  };

  const removeSection = (id: string) => {
    const next = sections.filter((s) => s.id !== id);
    commitSections(next);
    if (selectedId === id) setSelectedId(next[0]?.id || "");
  };

  const addSection = () => {
    const created = blankSection(addType);
    commitSections([...sections, created]);
    setSelectedId(created.id);
  };

  const openMedia = (onSelect: (url: string) => void, title: string, currentUrl?: string) => {
    onOpenMediaPicker(onSelect, title, currentUrl);
  };

  const mediaInventory = useMemo(() => {
    const rows: { sectionId: string; kind: string; count: number }[] = [];
    sections.forEach((section) => {
      if (Array.isArray(section.slides)) {
        rows.push({ sectionId: section.id, kind: "slides (image + video)", count: section.slides.length });
      }
      if (Array.isArray(section.images)) {
        rows.push({ sectionId: section.id, kind: "gallery images", count: section.images.length });
      }
      if (Array.isArray(section.partnerLogos)) {
        rows.push({ sectionId: section.id, kind: "partner logos", count: section.partnerLogos.length });
      }
      if (section.type === "insights-bento" && Array.isArray(section.items)) {
        rows.push({
          sectionId: section.id,
          kind: "insights cards",
          count: section.items.length + (section.featured ? 1 : 0),
        });
      }
      if (typeof section.image === "string" && section.image) {
        rows.push({ sectionId: section.id, kind: "single image", count: 1 });
      }
      if (typeof section.videoUrl === "string" && section.videoUrl) {
        rows.push({ sectionId: section.id, kind: "video / YouTube", count: 1 });
      }
    });
    return rows;
  }, [sections]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Film className="size-4 text-primary" />
          BNS Studio landing sections
        </h2>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          Edit the live <code className="font-mono">/bns-studio</code> page: hero reel slides, screening video,
          gallery images, about story, partner logos, and insights bento packs.
          Programme-level <code className="font-mono">visual.gallery[]</code> lives under{" "}
          <span className="font-medium">BNS Studios (Programme) → Media</span>.
        </p>
        {mediaInventory.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {mediaInventory.map((row) => (
              <button
                key={`${row.sectionId}-${row.kind}`}
                type="button"
                onClick={() => setSelectedId(row.sectionId)}
                className="rounded-full border border-border/70 bg-card px-2.5 py-1 text-[10px] font-medium text-foreground hover:border-primary"
              >
                {row.sectionId}: {row.kind} ({row.count})
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-4">
          <div className="rounded-xl border border-border bg-card p-3 shadow-xs space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Sections
              </span>
              <Badge variant="secondary" className="text-[10px]">
                {sections.length}
              </Badge>
            </div>
            <div className="space-y-1 max-h-[28rem] overflow-y-auto">
              {sections.map((section, index) => {
                const vis = visibilityMap.get(section.id);
                const isOn = vis ? vis.visible !== false : true;
                const active = (selected?.id || selectedId) === section.id;
                return (
                  <div
                    key={section.id}
                    className={`rounded-lg border p-2 transition-colors ${
                      active
                        ? "border-primary bg-primary/10"
                        : "border-border/60 hover:bg-muted/40"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedId(section.id)}
                      className="w-full text-left"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-foreground truncate">
                          {String(section.title || section.eyebrow || section.badge || section.id)}
                        </span>
                        <span
                          className={`size-2 rounded-full shrink-0 ${
                            isOn ? "bg-emerald-500" : "bg-muted-foreground/40"
                          }`}
                          title={isOn ? "Visible on page" : "Hidden on page"}
                        />
                      </div>
                      <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                        {section.type} · {section.id}
                      </div>
                    </button>
                    <div className="mt-2 flex items-center gap-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2"
                        onClick={() => moveSection(index, -1)}
                        aria-label="Move up"
                      >
                        <ArrowUp className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2"
                        onClick={() => moveSection(index, 1)}
                        aria-label="Move down"
                      >
                        <ArrowDown className="size-3.5" />
                      </Button>
                      {onToggleVisibility ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-[10px]"
                          onClick={() => onToggleVisibility(section.id)}
                        >
                          {isOn ? "Hide" : "Show"}
                        </Button>
                      ) : null}
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-destructive ml-auto"
                        onClick={() => removeSection(section.id)}
                        aria-label="Delete section"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border/60 pt-3 space-y-2">
              <label className="text-[11px] font-semibold text-foreground">Add section type</label>
              <select
                value={addType}
                onChange={(e) => setAddType(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-2 py-2 text-xs"
              >
                {SECTION_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <Button type="button" size="sm" className="w-full gap-1.5" onClick={addSection}>
                <Plus className="size-3.5" />
                Add section
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          {!selected ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No sections yet. Add a hero reel or story section to begin.
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-4 lg:p-6">
              <div className="flex flex-wrap items-center gap-2 border-b border-border/50 pb-3">
                <Layers className="size-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">
                  Edit · {selected.type}
                </h3>
                <Badge variant="outline" className="font-mono text-[10px]">
                  {selected.id}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold">Section id</label>
                  <Input
                    value={String(selected.id)}
                    onChange={(e) => {
                      const nextId = e.target.value.trim() || selected.id;
                      commitSections(
                        sections.map((s) =>
                          s.id === selected.id ? { ...s, id: nextId } : s,
                        ),
                      );
                      setSelectedId(nextId);
                    }}
                    className="mt-1 h-9 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold">Type</label>
                  <Input value={String(selected.type)} disabled className="mt-1 h-9 font-mono text-xs" />
                </div>
              </div>

              {selected.type === "hero-reel" ? (
                <HeroReelFields
                  section={selected}
                  onChange={updateSelected}
                  openMedia={openMedia}
                />
              ) : null}
              {selected.type === "hero-image" ? (
                <HeroImageFields
                  section={selected}
                  onChange={updateSelected}
                  openMedia={openMedia}
                />
              ) : null}
              {selected.type === "image-marquee" ? (
                <GalleryFields
                  section={selected}
                  onChange={updateSelected}
                  openMedia={openMedia}
                />
              ) : null}
              {selected.type === "text-with-stats" ? (
                <AboutStoryFields
                  section={selected}
                  onChange={updateSelected}
                  openMedia={openMedia}
                />
              ) : null}
              {selected.type === "insights-bento" ? (
                <InsightsBentoFields
                  section={selected}
                  onChange={updateSelected}
                  openMedia={openMedia}
                />
              ) : null}
              {selected.type === "cta-banner" || selected.type === "partner-with-us" || selected.type === "feature-grid" ? (
                <GenericCopyFields
                  section={selected}
                  onChange={updateSelected}
                  openMedia={openMedia}
                />
              ) : null}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 space-y-2">
        <h3 className="text-xs font-bold text-foreground">SEO</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold">Title</label>
            <Input
              value={String(data?.seo?.title || "")}
              onChange={(e) =>
                onChange({
                  ...data,
                  seo: { ...(data.seo || {}), title: e.target.value },
                })
              }
              className="mt-1 h-9 text-xs"
            />
          </div>
          <div>
            <label className="text-xs font-semibold">OG image</label>
            <ImageFieldControl
              label=""
              value={String(data?.seo?.ogImage || "")}
              onChange={(url) =>
                onChange({
                  ...data,
                  seo: { ...(data.seo || {}), ogImage: url },
                })
              }
              onOpenBucket={() =>
                openMedia(
                  (url) =>
                    onChange({
                      ...data,
                      seo: { ...(data.seo || {}), ogImage: url },
                    }),
                  "Select OG image",
                  String(data?.seo?.ogImage || ""),
                )
              }
              compact
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold">Description</label>
          <textarea
            value={String(data?.seo?.description || "")}
            onChange={(e) =>
              onChange({
                ...data,
                seo: { ...(data.seo || {}), description: e.target.value },
              })
            }
            rows={2}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs"
          />
        </div>
      </div>
    </div>
  );
}

type FieldProps = {
  section: StudioSection;
  onChange: (patch: Record<string, unknown>) => void;
  openMedia: (onSelect: (url: string) => void, title: string, currentUrl?: string) => void;
};

function TextInput({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-foreground">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs"
        />
      ) : (
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 h-9 text-xs" />
      )}
    </div>
  );
}

function HeroReelFields({ section, onChange, openMedia }: FieldProps) {
  const slides = (Array.isArray(section.slides) ? section.slides : []) as Record<string, unknown>[];

  const updateSlide = (index: number, patch: Record<string, unknown>) => {
    const next = slides.map((slide, i) => (i === index ? { ...slide, ...patch } : slide));
    onChange({ slides: next });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TextInput
          label="Badge"
          value={String(section.badge || "")}
          onChange={(v) => onChange({ badge: v })}
        />
        <TextInput
          label="Formats label"
          value={String(section.formatsLabel || "")}
          onChange={(v) => onChange({ formatsLabel: v })}
        />
      </div>
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Video className="size-3.5" />
          Slides (image + optional video)
        </h4>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-7 text-[10px]"
          onClick={() =>
            onChange({
              slides: [
                ...slides,
                {
                  id: `slide-${Date.now().toString(36)}`,
                  label: "New slide",
                  shortDesc: "",
                  image: "",
                  videoUrl: "",
                  year: "2026",
                  layout: "cinema",
                },
              ],
            })
          }
        >
          <Plus className="size-3 mr-1" />
          Slide
        </Button>
      </div>
      <div className="space-y-3">
        {slides.map((slide, index) => (
          <div key={String(slide.id || index)} className="rounded-xl border border-border/70 p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">Slide {index + 1}</span>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7 text-destructive"
                onClick={() => onChange({ slides: slides.filter((_, i) => i !== index) })}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TextInput
                label="Label"
                value={String(slide.label || "")}
                onChange={(v) => updateSlide(index, { label: v })}
              />
              <TextInput
                label="Year"
                value={String(slide.year || "")}
                onChange={(v) => updateSlide(index, { year: v })}
              />
            </div>
            <TextInput
              label="Short description"
              value={String(slide.shortDesc || "")}
              onChange={(v) => updateSlide(index, { shortDesc: v })}
              multiline
            />
            <ImageFieldControl
              label="Poster / still image"
              value={String(slide.image || "")}
              onChange={(url) => updateSlide(index, { image: url })}
              onOpenBucket={() =>
                openMedia(
                  (url) => updateSlide(index, { image: url }),
                  "Select reel poster",
                  String(slide.image || ""),
                )
              }
            />
            <TextInput
              label="Video URL (mp4 / stream / YouTube embed)"
              value={String(slide.videoUrl || "")}
              onChange={(v) => updateSlide(index, { videoUrl: v })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroImageFields({ section, onChange, openMedia }: FieldProps) {
  return (
    <div className="space-y-3">
      <TextInput label="Eyebrow" value={String(section.eyebrow || "")} onChange={(v) => onChange({ eyebrow: v })} />
      <TextInput label="Title" value={String(section.title || "")} onChange={(v) => onChange({ title: v })} />
      <TextInput
        label="Description"
        value={String(section.description || "")}
        onChange={(v) => onChange({ description: v })}
        multiline
      />
      <ImageFieldControl
        label="Poster image"
        value={String(section.image || "")}
        onChange={(url) => onChange({ image: url })}
        onOpenBucket={() =>
          openMedia((url) => onChange({ image: url }), "Select screening poster", String(section.image || ""))
        }
      />
      <TextInput label="Image alt" value={String(section.imageAlt || "")} onChange={(v) => onChange({ imageAlt: v })} />
      <TextInput
        label="YouTube / video embed URL"
        value={String(section.videoUrl || "")}
        onChange={(v) => onChange({ videoUrl: v })}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TextInput
          label="Video title"
          value={String(section.videoTitle || "")}
          onChange={(v) => onChange({ videoTitle: v })}
        />
        <TextInput
          label="Play button label"
          value={String(section.playButtonLabel || "")}
          onChange={(v) => onChange({ playButtonLabel: v })}
        />
      </div>
      <TextInput label="Credit" value={String(section.credit || "")} onChange={(v) => onChange({ credit: v })} />
    </div>
  );
}

function GalleryFields({ section, onChange, openMedia }: FieldProps) {
  const images = (Array.isArray(section.images) ? section.images : []) as Record<string, unknown>[];

  return (
    <div className="space-y-3">
      <TextInput label="Eyebrow" value={String(section.eyebrow || "")} onChange={(v) => onChange({ eyebrow: v })} />
      <TextInput label="Title" value={String(section.title || "")} onChange={(v) => onChange({ title: v })} />
      <TextInput
        label="Description"
        value={String(section.description || "")}
        onChange={(v) => onChange({ description: v })}
        multiline
      />
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <ImageIcon className="size-3.5" />
          Gallery images
        </h4>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-7 text-[10px]"
          onClick={() => onChange({ images: [...images, { src: "", alt: "", caption: "" }] })}
        >
          <Plus className="size-3 mr-1" />
          Image
        </Button>
      </div>
      {images.map((img, index) => (
        <div key={index} className="rounded-xl border border-border/70 p-3 space-y-2">
          <div className="flex justify-between">
            <span className="text-xs font-semibold">Image {index + 1}</span>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-7 text-destructive"
              onClick={() => onChange({ images: images.filter((_, i) => i !== index) })}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
          <ImageFieldControl
            label="Source"
            value={String(img.src || "")}
            onChange={(url) => {
              const next = images.map((row, i) => (i === index ? { ...row, src: url } : row));
              onChange({ images: next });
            }}
            onOpenBucket={() =>
              openMedia(
                (url) => {
                  const next = images.map((row, i) => (i === index ? { ...row, src: url } : row));
                  onChange({ images: next });
                },
                "Select gallery image",
                String(img.src || ""),
              )
            }
          />
          <TextInput
            label="Alt"
            value={String(img.alt || "")}
            onChange={(v) => {
              const next = images.map((row, i) => (i === index ? { ...row, alt: v } : row));
              onChange({ images: next });
            }}
          />
          <TextInput
            label="Caption"
            value={String(img.caption || "")}
            onChange={(v) => {
              const next = images.map((row, i) => (i === index ? { ...row, caption: v } : row));
              onChange({ images: next });
            }}
          />
        </div>
      ))}
    </div>
  );
}

function AboutStoryFields({ section, onChange, openMedia }: FieldProps) {
  const stats = (Array.isArray(section.stats) ? section.stats : []) as Record<string, unknown>[];

  return (
    <div className="space-y-3">
      <TextInput label="Eyebrow" value={String(section.eyebrow || "")} onChange={(v) => onChange({ eyebrow: v })} />
      <TextInput label="Title" value={String(section.title || "")} onChange={(v) => onChange({ title: v })} />
      <TextInput label="Subtitle" value={String(section.subtitle || "")} onChange={(v) => onChange({ subtitle: v })} />
      <TextInput
        label="Description (background story)"
        value={String(section.description || "")}
        onChange={(v) => onChange({ description: v })}
        multiline
      />
      <TextInput label="Tagline" value={String(section.tagline || "")} onChange={(v) => onChange({ tagline: v })} />
      <TextInput
        label="CTA prompt"
        value={String(section.ctaPrompt || "")}
        onChange={(v) => onChange({ ctaPrompt: v })}
      />
      <ImageFieldControl
        label="Story image"
        value={String(section.image || "")}
        onChange={(url) => onChange({ image: url })}
        onOpenBucket={() =>
          openMedia((url) => onChange({ image: url }), "Select about image", String(section.image || ""))
        }
      />
      <TextInput label="Image alt" value={String(section.imageAlt || "")} onChange={(v) => onChange({ imageAlt: v })} />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Stats</h4>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7 text-[10px]"
            onClick={() => onChange({ stats: [...stats, { value: "01", label: "New stat" }] })}
          >
            <Plus className="size-3 mr-1" />
            Stat
          </Button>
        </div>
        {stats.map((stat, index) => (
          <div key={index} className="grid grid-cols-[1fr_2fr_auto] gap-2">
            <Input
              value={String(stat.value || "")}
              onChange={(e) => {
                const next = stats.map((row, i) =>
                  i === index ? { ...row, value: e.target.value } : row,
                );
                onChange({ stats: next });
              }}
              className="h-9 text-xs"
              placeholder="04"
            />
            <Input
              value={String(stat.label || "")}
              onChange={(e) => {
                const next = stats.map((row, i) =>
                  i === index ? { ...row, label: e.target.value } : row,
                );
                onChange({ stats: next });
              }}
              className="h-9 text-xs"
              placeholder="Label"
            />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-9 text-destructive"
              onClick={() => onChange({ stats: stats.filter((_, i) => i !== index) })}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function InsightsBentoFields({ section, onChange, openMedia }: FieldProps) {
  const featured = (typeof section.featured === "object" && section.featured
    ? section.featured
    : {}) as Record<string, unknown>;
  const items = (Array.isArray(section.items) ? section.items : []) as Record<string, unknown>[];

  const setFeatured = (patch: Record<string, unknown>) => {
    onChange({ featured: { ...featured, ...patch } });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TextInput label="Section title" value={String(section.title || "")} onChange={(v) => onChange({ title: v })} />
        <div>
          <label className="text-xs font-semibold">Layout</label>
          <select
            value={String(section.layout || "featured-side-list")}
            onChange={(e) => onChange({ layout: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs"
          >
            <option value="featured-side-list">Featured + side list</option>
            <option value="featured-side-duo">Featured + two side cards</option>
          </select>
        </div>
        <TextInput
          label="View all label"
          value={String(section.viewAllLabel || "")}
          onChange={(v) => onChange({ viewAllLabel: v })}
        />
        <TextInput
          label="View all href"
          value={String(section.viewAllHref || "")}
          onChange={(v) => onChange({ viewAllHref: v })}
        />
      </div>

      <div className="rounded-xl border border-border/70 p-3 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Featured card</h4>
        <TextInput label="Category" value={String(featured.category || "")} onChange={(v) => setFeatured({ category: v })} />
        <TextInput label="Title" value={String(featured.title || "")} onChange={(v) => setFeatured({ title: v })} />
        <TextInput
          label="Summary"
          value={String(featured.summary || "")}
          onChange={(v) => setFeatured({ summary: v })}
          multiline
        />
        <ImageFieldControl
          label="Image"
          value={String(featured.image || "")}
          onChange={(url) => setFeatured({ image: url })}
          onOpenBucket={() =>
            openMedia((url) => setFeatured({ image: url }), "Featured image", String(featured.image || ""))
          }
        />
        <ColorFieldControl
          label="Overlay color"
          value={String(featured.overlayColor || "#0a2540")}
          onChange={(v) => setFeatured({ overlayColor: v })}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextInput label="Author" value={String(featured.authorName || "")} onChange={(v) => setFeatured({ authorName: v })} />
          <TextInput label="Role" value={String(featured.authorRole || "")} onChange={(v) => setFeatured({ authorRole: v })} />
        </div>
        <ImageFieldControl
          label="Author avatar"
          value={String(featured.authorAvatar || "")}
          onChange={(url) => setFeatured({ authorAvatar: url })}
          onOpenBucket={() =>
            openMedia(
              (url) => setFeatured({ authorAvatar: url }),
              "Author avatar",
              String(featured.authorAvatar || ""),
            )
          }
        />
        <TextInput label="Date" value={String(featured.date || "")} onChange={(v) => setFeatured({ date: v })} />
        <TextInput label="Link href" value={String(featured.href || "")} onChange={(v) => setFeatured({ href: v })} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Side cards</h4>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7 text-[10px]"
            onClick={() =>
              onChange({
                items: [
                  ...items,
                  {
                    category: "Updates",
                    title: "New insight",
                    image: "",
                    href: "/stories",
                    authorName: "",
                    authorRole: "",
                    authorAvatar: "",
                    date: "",
                  },
                ],
              })
            }
          >
            <Plus className="size-3 mr-1" />
            Card
          </Button>
        </div>
        {items.map((item, index) => (
          <div key={index} className="rounded-xl border border-border/70 p-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-xs font-semibold">Card {index + 1}</span>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7 text-destructive"
                onClick={() => onChange({ items: items.filter((_, i) => i !== index) })}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
            <TextInput
              label="Category"
              value={String(item.category || "")}
              onChange={(v) => {
                const next = items.map((row, i) => (i === index ? { ...row, category: v } : row));
                onChange({ items: next });
              }}
            />
            <TextInput
              label="Title"
              value={String(item.title || "")}
              onChange={(v) => {
                const next = items.map((row, i) => (i === index ? { ...row, title: v } : row));
                onChange({ items: next });
              }}
            />
            <ImageFieldControl
              label="Image"
              value={String(item.image || "")}
              onChange={(url) => {
                const next = items.map((row, i) => (i === index ? { ...row, image: url } : row));
                onChange({ items: next });
              }}
              onOpenBucket={() =>
                openMedia(
                  (url) => {
                    const next = items.map((row, i) => (i === index ? { ...row, image: url } : row));
                    onChange({ items: next });
                  },
                  "Side card image",
                  String(item.image || ""),
                )
              }
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <TextInput
                label="Author"
                value={String(item.authorName || "")}
                onChange={(v) => {
                  const next = items.map((row, i) => (i === index ? { ...row, authorName: v } : row));
                  onChange({ items: next });
                }}
              />
              <TextInput
                label="Date"
                value={String(item.date || "")}
                onChange={(v) => {
                  const next = items.map((row, i) => (i === index ? { ...row, date: v } : row));
                  onChange({ items: next });
                }}
              />
            </div>
            <TextInput
              label="Href"
              value={String(item.href || "")}
              onChange={(v) => {
                const next = items.map((row, i) => (i === index ? { ...row, href: v } : row));
                onChange({ items: next });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function PartnerLogosFields({ section, onChange, openMedia }: FieldProps) {
  const logos = (Array.isArray(section.partnerLogos) ? section.partnerLogos : []) as Record<
    string,
    unknown
  >[];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Partner logos array
        </h4>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-7 text-[10px]"
          onClick={() => onChange({ partnerLogos: [...logos, { src: "", alt: "" }] })}
        >
          <Plus className="size-3 mr-1" />
          Logo
        </Button>
      </div>
      {logos.length === 0 ? (
        <p className="text-[11px] text-muted-foreground">No logos yet. Add partner mark media here.</p>
      ) : null}
      {logos.map((logo, index) => (
        <div key={index} className="rounded-xl border border-border/70 p-3 space-y-2">
          <div className="flex justify-between">
            <span className="text-xs font-semibold">Logo {index + 1}</span>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-7 text-destructive"
              onClick={() => onChange({ partnerLogos: logos.filter((_, i) => i !== index) })}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
          <ImageFieldControl
            label="Logo image"
            value={String(logo.src || "")}
            onChange={(url) => {
              const next = logos.map((row, i) => (i === index ? { ...row, src: url } : row));
              onChange({ partnerLogos: next });
            }}
            onOpenBucket={() =>
              openMedia(
                (url) => {
                  const next = logos.map((row, i) => (i === index ? { ...row, src: url } : row));
                  onChange({ partnerLogos: next });
                },
                "Partner logo",
                String(logo.src || ""),
              )
            }
          />
          <TextInput
            label="Alt text"
            value={String(logo.alt || "")}
            onChange={(v) => {
              const next = logos.map((row, i) => (i === index ? { ...row, alt: v } : row));
              onChange({ partnerLogos: next });
            }}
          />
        </div>
      ))}
    </div>
  );
}

function GenericCopyFields({ section, onChange, openMedia }: FieldProps) {
  return (
    <div className="space-y-3">
      <TextInput label="Eyebrow" value={String(section.eyebrow || "")} onChange={(v) => onChange({ eyebrow: v })} />
      <TextInput label="Title" value={String(section.title || "")} onChange={(v) => onChange({ title: v })} />
      <TextInput
        label="Description"
        value={String(section.description || "")}
        onChange={(v) => onChange({ description: v })}
        multiline
      />
      {section.type === "cta-banner" ? (
        <>
          <TextInput
            label="CTA label"
            value={String(section.ctaLabel || "")}
            onChange={(v) => onChange({ ctaLabel: v })}
          />
          <TextInput
            label="CTA href"
            value={String(section.ctaHref || "")}
            onChange={(v) => onChange({ ctaHref: v })}
          />
        </>
      ) : null}
      {"image" in section ? (
        <ImageFieldControl
          label="Image"
          value={String(section.image || "")}
          onChange={(url) => onChange({ image: url })}
          onOpenBucket={() =>
            openMedia((url) => onChange({ image: url }), "Select section image", String(section.image || ""))
          }
        />
      ) : null}
      {section.type === "partner-with-us" ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextInput
              label="Primary CTA label"
              value={String((section.primaryCta as any)?.label || "")}
              onChange={(v) =>
                onChange({
                  primaryCta: { ...((section.primaryCta as object) || {}), label: v },
                })
              }
            />
            <TextInput
              label="Primary CTA href"
              value={String((section.primaryCta as any)?.href || "")}
              onChange={(v) =>
                onChange({
                  primaryCta: { ...((section.primaryCta as object) || {}), href: v },
                })
              }
            />
          </div>
          <PartnerLogosFields section={section} onChange={onChange} openMedia={openMedia} />
        </>
      ) : null}
      {section.type === "feature-grid" ? (
        <p className="text-[11px] text-muted-foreground">
          Feature grid items (capabilities lists) remain editable via Save after structure changes.
          Prefer adding an insights-bento or hero-reel for media-led packs from shadcn-space.
        </p>
      ) : null}
    </div>
  );
}
