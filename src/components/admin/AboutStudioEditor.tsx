"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  GripVertical,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface AboutStudioEditorProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function AboutStudioEditor({ data, onChange }: AboutStudioEditorProps) {
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
    {
      key: "hero",
      label: "Hero & Credo",
      icon: "🎯",
    },
    {
      key: "originStory",
      label: "Origin Story",
      icon: "📖",
    },
    {
      key: "theoryOfChange",
      label: "Theory of Change",
      icon: "🔄",
    },
    {
      key: "integrityCharter",
      label: "Integrity Charter",
      icon: "🛡️",
    },
    {
      key: "team",
      label: "Team Roster",
      icon: "👥",
    },
    {
      key: "partnerCta",
      label: "Partnership CTA",
      icon: "🤝",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-border/50 pb-4">
        <div>
          <h2 className="text-base font-bold text-foreground">
            About Page Editor
          </h2>
          <p className="text-xs text-muted-foreground">
            Edit hero, origin story, theory of change, charter, team, and
            partner CTA sections.
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
                      Pill Badge
                    </label>
                    <Input
                      value={data?.hero?.pill || ""}
                      onChange={(e) =>
                        updateField(["hero", "pill"], e.target.value)
                      }
                      className="mt-1 h-8 text-xs"
                      placeholder="Kenya's Sovereign Youth Budget Watchdog"
                    />
                  </div>
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
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">
                      CTA Label
                    </label>
                    <Input
                      value={data?.hero?.ctaLabel || ""}
                      onChange={(e) =>
                        updateField(["hero", "ctaLabel"], e.target.value)
                      }
                      className="mt-1 h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">
                      CTA Href
                    </label>
                    <Input
                      value={data?.hero?.ctaHref || ""}
                      onChange={(e) =>
                        updateField(["hero", "ctaHref"], e.target.value)
                      }
                      className="mt-1 h-8 text-xs"
                    />
                  </div>
                </div>
              )}

              {section.key === "team" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">
                      Team Members
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        addArrayItem(["team", "members"], {
                          name: "New Member",
                          role: "Role",
                          bio: "",
                          image: "",
                        })
                      }
                      className="h-7 text-[10px]"
                    >
                      <Plus className="size-3 mr-1" /> Add Member
                    </Button>
                  </div>
                  {(data?.team?.members || []).map(
                    (member: any, idx: number) => (
                      <div
                        key={idx}
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
                                  ["team", "members"],
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
                                  ["team", "members"],
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
                                removeArrayItem(["team", "members"], idx)
                              }
                              className="h-6 w-6 p-0 text-rose-500"
                            >
                              <Trash2 className="size-3" />
                            </Button>
                          </div>
                        </div>
                        <Input
                          value={member.name || ""}
                          onChange={(e) => {
                            const newMembers = [
                              ...(data?.team?.members || []),
                            ];
                            newMembers[idx] = {
                              ...newMembers[idx],
                              name: e.target.value,
                            };
                            updateField(["team", "members"], newMembers);
                          }}
                          className="h-7 text-xs"
                          placeholder="Name"
                        />
                        <Input
                          value={member.role || ""}
                          onChange={(e) => {
                            const newMembers = [
                              ...(data?.team?.members || []),
                            ];
                            newMembers[idx] = {
                              ...newMembers[idx],
                              role: e.target.value,
                            };
                            updateField(["team", "members"], newMembers);
                          }}
                          className="h-7 text-xs"
                          placeholder="Role"
                        />
                      </div>
                    ),
                  )}
                </div>
              )}

              {section.key === "theoryOfChange" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">
                      Eyebrow
                    </label>
                    <Input
                      value={data?.theoryOfChange?.eyebrow || ""}
                      onChange={(e) =>
                        updateField(
                          ["theoryOfChange", "eyebrow"],
                          e.target.value,
                        )
                      }
                      className="mt-1 h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">
                      Title
                    </label>
                    <Input
                      value={data?.theoryOfChange?.title || ""}
                      onChange={(e) =>
                        updateField(
                          ["theoryOfChange", "title"],
                          e.target.value,
                        )
                      }
                      className="mt-1 h-8 text-xs"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">
                      Steps
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        addArrayItem(["theoryOfChange", "items"], {
                          id: `theory-${Date.now()}`,
                          step: String(
                            (data?.theoryOfChange?.items?.length || 0) + 1,
                          ).padStart(2, "0"),
                          title: "New Step",
                          description: "",
                          badge: "",
                        })
                      }
                      className="h-7 text-[10px]"
                    >
                      <Plus className="size-3 mr-1" /> Add Step
                    </Button>
                  </div>
                  {(data?.theoryOfChange?.items || []).map(
                    (item: any, idx: number) => (
                      <div
                        key={item.id || idx}
                        className="rounded-lg border border-border/40 p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-muted-foreground">
                            Step {item.step || idx + 1}
                          </span>
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                moveArrayItem(
                                  ["theoryOfChange", "items"],
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
                                  ["theoryOfChange", "items"],
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
                                  ["theoryOfChange", "items"],
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
                          value={item.title || ""}
                          onChange={(e) => {
                            const newItems = [
                              ...(data?.theoryOfChange?.items || []),
                            ];
                            newItems[idx] = {
                              ...newItems[idx],
                              title: e.target.value,
                            };
                            updateField(
                              ["theoryOfChange", "items"],
                              newItems,
                            );
                          }}
                          className="h-7 text-xs"
                          placeholder="Step title"
                        />
                        <textarea
                          value={item.description || ""}
                          onChange={(e) => {
                            const newItems = [
                              ...(data?.theoryOfChange?.items || []),
                            ];
                            newItems[idx] = {
                              ...newItems[idx],
                              description: e.target.value,
                            };
                            updateField(
                              ["theoryOfChange", "items"],
                              newItems,
                            );
                          }}
                          rows={2}
                          className="w-full rounded-md border border-border bg-background p-2 text-xs focus:outline-primary"
                          placeholder="Step description"
                        />
                      </div>
                    ),
                  )}
                </div>
              )}

              {section.key === "originStory" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">
                      Title
                    </label>
                    <Input
                      value={data?.originStory?.title || ""}
                      onChange={(e) =>
                        updateField(["originStory", "title"], e.target.value)
                      }
                      className="mt-1 h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">
                      Description
                    </label>
                    <textarea
                      value={data?.originStory?.description || ""}
                      onChange={(e) =>
                        updateField(
                          ["originStory", "description"],
                          e.target.value,
                        )
                      }
                      rows={3}
                      className="mt-1 w-full rounded-md border border-border bg-background p-2 text-xs focus:outline-primary"
                    />
                  </div>
                </div>
              )}

              {section.key === "integrityCharter" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">
                      Title
                    </label>
                    <Input
                      value={data?.integrityCharter?.title || ""}
                      onChange={(e) =>
                        updateField(
                          ["integrityCharter", "title"],
                          e.target.value,
                        )
                      }
                      className="mt-1 h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">
                      Description
                    </label>
                    <textarea
                      value={data?.integrityCharter?.description || ""}
                      onChange={(e) =>
                        updateField(
                          ["integrityCharter", "description"],
                          e.target.value,
                        )
                      }
                      rows={3}
                      className="mt-1 w-full rounded-md border border-border bg-background p-2 text-xs focus:outline-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">
                      Principles
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        addArrayItem(
                          ["integrityCharter", "principles"],
                          {
                            title: "New Principle",
                            description: "",
                          },
                        )
                      }
                      className="h-7 text-[10px]"
                    >
                      <Plus className="size-3 mr-1" /> Add Principle
                    </Button>
                  </div>
                  {(data?.integrityCharter?.principles || []).map(
                    (principle: any, idx: number) => (
                      <div
                        key={idx}
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
                                  ["integrityCharter", "principles"],
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
                                  ["integrityCharter", "principles"],
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
                                  ["integrityCharter", "principles"],
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
                          value={principle.title || ""}
                          onChange={(e) => {
                            const newPrinciples = [
                              ...(data?.integrityCharter?.principles || []),
                            ];
                            newPrinciples[idx] = {
                              ...newPrinciples[idx],
                              title: e.target.value,
                            };
                            updateField(
                              ["integrityCharter", "principles"],
                              newPrinciples,
                            );
                          }}
                          className="h-7 text-xs"
                          placeholder="Principle title"
                        />
                        <textarea
                          value={principle.description || ""}
                          onChange={(e) => {
                            const newPrinciples = [
                              ...(data?.integrityCharter?.principles || []),
                            ];
                            newPrinciples[idx] = {
                              ...newPrinciples[idx],
                              description: e.target.value,
                            };
                            updateField(
                              ["integrityCharter", "principles"],
                              newPrinciples,
                            );
                          }}
                          rows={2}
                          className="w-full rounded-md border border-border bg-background p-2 text-xs focus:outline-primary"
                          placeholder="Principle description"
                        />
                      </div>
                    ),
                  )}
                </div>
              )}

              {section.key === "partnerCta" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">
                      Heading
                    </label>
                    <Input
                      value={data?.partnerCta?.heading || ""}
                      onChange={(e) =>
                        updateField(
                          ["partnerCta", "heading"],
                          e.target.value,
                        )
                      }
                      className="mt-1 h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">
                      Description
                    </label>
                    <textarea
                      value={data?.partnerCta?.description || ""}
                      onChange={(e) =>
                        updateField(
                          ["partnerCta", "description"],
                          e.target.value,
                        )
                      }
                      rows={3}
                      className="mt-1 w-full rounded-md border border-border bg-background p-2 text-xs focus:outline-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground">
                        Primary CTA Label
                      </label>
                      <Input
                        value={data?.partnerCta?.primaryCta?.label || ""}
                        onChange={(e) =>
                          updateField(
                            ["partnerCta", "primaryCta", "label"],
                            e.target.value,
                          )
                        }
                        className="mt-1 h-8 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground">
                        Primary CTA Href
                      </label>
                      <Input
                        value={data?.partnerCta?.primaryCta?.href || ""}
                        onChange={(e) =>
                          updateField(
                            ["partnerCta", "primaryCta", "href"],
                            e.target.value,
                          )
                        }
                        className="mt-1 h-8 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
