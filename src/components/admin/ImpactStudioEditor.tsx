"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ImpactStudioEditorProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function ImpactStudioEditor({ data, onChange }: ImpactStudioEditorProps) {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateField = (path: string[], value: any) => {
    const newData = { ...data };
    let current: any = newData;
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) current[path[i]] = {};
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    onChange(newData);
  };

  const addArrayItem = (path: string[], item: any) => {
    const newData = { ...data };
    let current: any = newData;
    for (let i = 0; i < path.length; i++) {
      if (!current[path[i]]) current[path[i]] = [];
      if (i === path.length - 1) {
        current[path[i]] = [...current[path[i]], item];
      } else {
        current = current[path[i]];
      }
    }
    onChange(newData);
  };

  const removeArrayItem = (path: string[], index: number) => {
    const newData = { ...data };
    let current: any = newData;
    for (let i = 0; i < path.length; i++) {
      if (i === path.length - 1) {
        current[path[i]] = current[path[i]].filter(
          (_: any, idx: number) => idx !== index,
        );
      } else {
        current = current[path[i]];
      }
    }
    onChange(newData);
  };

  const moveArrayItem = (
    path: string[],
    index: number,
    direction: "up" | "down",
  ) => {
    const newData = { ...data };
    let current: any = newData;
    for (let i = 0; i < path.length; i++) {
      if (i === path.length - 1) {
        const arr = [...current[path[i]]];
        const newIdx = direction === "up" ? index - 1 : index + 1;
        if (newIdx < 0 || newIdx >= arr.length) return;
        [arr[index], arr[newIdx]] = [arr[newIdx], arr[index]];
        current[path[i]] = arr;
      } else {
        current = current[path[i]];
      }
    }
    onChange(newData);
  };

  const sections = [
    { key: "hero", label: "Hero Section", icon: "🎯" },
    { key: "metrics", label: "Impact Metrics", icon: "📊" },
    { key: "testimonials", label: "Testimonials", icon: "💬" },
    { key: "partners", label: "Partner Logos", icon: "🤝" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-border/50 pb-4">
        <div>
          <h2 className="text-base font-bold text-foreground">
            Impact Page Editor
          </h2>
          <p className="text-xs text-muted-foreground">
            Edit hero, metrics, testimonials, and partner logos sections.
          </p>
        </div>
        <Badge variant="secondary" className="font-mono text-xs">
          {sections.length} sections
        </Badge>
      </div>

      {sections.map((section) => (
        <div
          key={section.key}
          className="rounded-xl border border-border/60 bg-muted/20 overflow-hidden"
        >
          <button
            type="button"
            onClick={() => toggleSection(section.key)}
            className="flex w-full items-center gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
          >
            {expandedSections[section.key] ? (
              <ChevronDown className="size-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="size-4 text-muted-foreground" />
            )}
            <span className="text-lg">{section.icon}</span>
            <span className="text-sm font-semibold text-foreground">
              {section.label}
            </span>
            <Badge variant="outline" className="ml-auto text-[10px]">
              {section.key}
            </Badge>
          </button>

          {expandedSections[section.key] && (
            <div className="border-t border-border/40 p-4 space-y-4">
              {section.key === "hero" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">
                      Title
                    </label>
                    <Input
                      value={data?.hero?.title || ""}
                      onChange={(e) =>
                        updateField(["hero", "title"], e.target.value)
                      }
                      className="mt-1 h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">
                      Description
                    </label>
                    <textarea
                      value={data?.hero?.description || ""}
                      onChange={(e) =>
                        updateField(["hero", "description"], e.target.value)
                      }
                      rows={3}
                      className="mt-1 w-full rounded-md border border-border bg-background p-2 text-xs focus:outline-primary"
                    />
                  </div>
                </div>
              )}

              {section.key === "metrics" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">
                      Key Metrics
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        addArrayItem(["metrics", "items"], {
                          id: `metric-${Date.now()}`,
                          value: "0",
                          label: "New Metric",
                          description: "",
                        })
                      }
                      className="h-7 text-[10px]"
                    >
                      <Plus className="size-3 mr-1" /> Add Metric
                    </Button>
                  </div>
                  {(data?.metrics?.items || []).map(
                    (metric: any, idx: number) => (
                      <div
                        key={metric.id || idx}
                        className="rounded-lg border border-border/40 p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-muted-foreground">
                            #{idx + 1}
                          </span>
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                moveArrayItem(
                                  ["metrics", "items"],
                                  idx,
                                  "up",
                                )
                              }
                              disabled={idx === 0}
                              className="h-6 w-6 p-0"
                            >
                              <ArrowUp className="size-3" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                moveArrayItem(
                                  ["metrics", "items"],
                                  idx,
                                  "down",
                                )
                              }
                              className="h-6 w-6 p-0"
                            >
                              <ArrowDown className="size-3" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                removeArrayItem(["metrics", "items"], idx)
                              }
                              className="h-6 w-6 p-0 text-rose-500"
                            >
                              <Trash2 className="size-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            value={metric.value || ""}
                            onChange={(e) => {
                              const newMetrics = [
                                ...(data?.metrics?.items || []),
                              ];
                              newMetrics[idx] = {
                                ...newMetrics[idx],
                                value: e.target.value,
                              };
                              updateField(["metrics", "items"], newMetrics);
                            }}
                            className="h-7 text-xs"
                            placeholder="Value (e.g., 47)"
                          />
                          <Input
                            value={metric.label || ""}
                            onChange={(e) => {
                              const newMetrics = [
                                ...(data?.metrics?.items || []),
                              ];
                              newMetrics[idx] = {
                                ...newMetrics[idx],
                                label: e.target.value,
                              };
                              updateField(["metrics", "items"], newMetrics);
                            }}
                            className="h-7 text-xs"
                            placeholder="Label"
                          />
                        </div>
                        <textarea
                          value={metric.description || ""}
                          onChange={(e) => {
                            const newMetrics = [
                              ...(data?.metrics?.items || []),
                            ];
                            newMetrics[idx] = {
                              ...newMetrics[idx],
                              description: e.target.value,
                            };
                            updateField(["metrics", "items"], newMetrics);
                          }}
                          rows={2}
                          className="w-full rounded-md border border-border bg-background p-2 text-xs focus:outline-primary"
                          placeholder="Description (optional)"
                        />
                      </div>
                    ),
                  )}
                </div>
              )}

              {section.key === "testimonials" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">
                      Testimonials
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        addArrayItem(["testimonials", "items"], {
                          id: `testimonial-${Date.now()}`,
                          quote: "",
                          author: "",
                          role: "",
                          organization: "",
                        })
                      }
                      className="h-7 text-[10px]"
                    >
                      <Plus className="size-3 mr-1" /> Add Testimonial
                    </Button>
                  </div>
                  {(data?.testimonials?.items || []).map(
                    (testimonial: any, idx: number) => (
                      <div
                        key={testimonial.id || idx}
                        className="rounded-lg border border-border/40 p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-muted-foreground">
                            #{idx + 1}
                          </span>
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                moveArrayItem(
                                  ["testimonials", "items"],
                                  idx,
                                  "up",
                                )
                              }
                              disabled={idx === 0}
                              className="h-6 w-6 p-0"
                            >
                              <ArrowUp className="size-3" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                moveArrayItem(
                                  ["testimonials", "items"],
                                  idx,
                                  "down",
                                )
                              }
                              className="h-6 w-6 p-0"
                            >
                              <ArrowDown className="size-3" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                removeArrayItem(
                                  ["testimonials", "items"],
                                  idx,
                                )
                              }
                              className="h-6 w-6 p-0 text-rose-500"
                            >
                              <Trash2 className="size-3" />
                            </Button>
                          </div>
                        </div>
                        <textarea
                          value={testimonial.quote || ""}
                          onChange={(e) => {
                            const newTestimonials = [
                              ...(data?.testimonials?.items || []),
                            ];
                            newTestimonials[idx] = {
                              ...newTestimonials[idx],
                              quote: e.target.value,
                            };
                            updateField(
                              ["testimonials", "items"],
                              newTestimonials,
                            );
                          }}
                          rows={3}
                          className="w-full rounded-md border border-border bg-background p-2 text-xs focus:outline-primary"
                          placeholder="Testimonial quote"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <Input
                            value={testimonial.author || ""}
                            onChange={(e) => {
                              const newTestimonials = [
                                ...(data?.testimonials?.items || []),
                              ];
                              newTestimonials[idx] = {
                                ...newTestimonials[idx],
                                author: e.target.value,
                              };
                              updateField(
                                ["testimonials", "items"],
                                newTestimonials,
                              );
                            }}
                            className="h-7 text-xs"
                            placeholder="Author name"
                          />
                          <Input
                            value={testimonial.role || ""}
                            onChange={(e) => {
                              const newTestimonials = [
                                ...(data?.testimonials?.items || []),
                              ];
                              newTestimonials[idx] = {
                                ...newTestimonials[idx],
                                role: e.target.value,
                              };
                              updateField(
                                ["testimonials", "items"],
                                newTestimonials,
                              );
                            }}
                            className="h-7 text-xs"
                            placeholder="Role"
                          />
                          <Input
                            value={testimonial.organization || ""}
                            onChange={(e) => {
                              const newTestimonials = [
                                ...(data?.testimonials?.items || []),
                              ];
                              newTestimonials[idx] = {
                                ...newTestimonials[idx],
                                organization: e.target.value,
                              };
                              updateField(
                                ["testimonials", "items"],
                                newTestimonials,
                              );
                            }}
                            className="h-7 text-xs"
                            placeholder="Organization"
                          />
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}

              {section.key === "partners" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">
                      Partner Logos
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        addArrayItem(["partners", "logos"], {
                          id: `partner-${Date.now()}`,
                          name: "New Partner",
                          logo: "",
                          href: "",
                        })
                      }
                      className="h-7 text-[10px]"
                    >
                      <Plus className="size-3 mr-1" /> Add Partner
                    </Button>
                  </div>
                  {(data?.partners?.logos || []).map(
                    (partner: any, idx: number) => (
                      <div
                        key={partner.id || idx}
                        className="rounded-lg border border-border/40 p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-muted-foreground">
                            #{idx + 1}
                          </span>
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                moveArrayItem(
                                  ["partners", "logos"],
                                  idx,
                                  "up",
                                )
                              }
                              disabled={idx === 0}
                              className="h-6 w-6 p-0"
                            >
                              <ArrowUp className="size-3" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                moveArrayItem(
                                  ["partners", "logos"],
                                  idx,
                                  "down",
                                )
                              }
                              className="h-6 w-6 p-0"
                            >
                              <ArrowDown className="size-3" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                removeArrayItem(
                                  ["partners", "logos"],
                                  idx,
                                )
                              }
                              className="h-6 w-6 p-0 text-rose-500"
                            >
                              <Trash2 className="size-3" />
                            </Button>
                          </div>
                        </div>
                        <Input
                          value={partner.name || ""}
                          onChange={(e) => {
                            const newPartners = [
                              ...(data?.partners?.logos || []),
                            ];
                            newPartners[idx] = {
                              ...newPartners[idx],
                              name: e.target.value,
                            };
                            updateField(
                              ["partners", "logos"],
                              newPartners,
                            );
                          }}
                          className="h-7 text-xs"
                          placeholder="Partner name"
                        />
                        <Input
                          value={partner.logo || ""}
                          onChange={(e) => {
                            const newPartners = [
                              ...(data?.partners?.logos || []),
                            ];
                            newPartners[idx] = {
                              ...newPartners[idx],
                              logo: e.target.value,
                            };
                            updateField(
                              ["partners", "logos"],
                              newPartners,
                            );
                          }}
                          className="h-7 text-xs"
                          placeholder="Logo URL"
                        />
                        <Input
                          value={partner.href || ""}
                          onChange={(e) => {
                            const newPartners = [
                              ...(data?.partners?.logos || []),
                            ];
                            newPartners[idx] = {
                              ...newPartners[idx],
                              href: e.target.value,
                            };
                            updateField(
                              ["partners", "logos"],
                              newPartners,
                            );
                          }}
                          className="h-7 text-xs"
                          placeholder="Website URL"
                        />
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
