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

interface CareersStudioEditorProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function CareersStudioEditor({
  data,
  onChange,
}: CareersStudioEditorProps) {
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
    { key: "culture", label: "Culture & Values", icon: "🏛️" },
    { key: "openRoles", label: "Open Roles", icon: "💼" },
    { key: "applicationProcess", label: "Application Process", icon: "📋" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-border/50 pb-4">
        <div>
          <h2 className="text-base font-bold text-foreground">
            Careers Page Editor
          </h2>
          <p className="text-xs text-muted-foreground">
            Edit hero, culture, open roles, and application process sections.
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

              {section.key === "culture" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">
                      Title
                    </label>
                    <Input
                      value={data?.culture?.title || ""}
                      onChange={(e) =>
                        updateField(["culture", "title"], e.target.value)
                      }
                      className="mt-1 h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">
                      Description
                    </label>
                    <textarea
                      value={data?.culture?.description || ""}
                      onChange={(e) =>
                        updateField(
                          ["culture", "description"],
                          e.target.value,
                        )
                      }
                      rows={3}
                      className="mt-1 w-full rounded-md border border-border bg-background p-2 text-xs focus:outline-primary"
                    />
                  </div>
                </div>
              )}

              {section.key === "openRoles" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">
                      Job Listings
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        addArrayItem(["openRoles", "listings"], {
                          id: `role-${Date.now()}`,
                          title: "New Role",
                          department: "Department",
                          location: "Nairobi, Kenya",
                          type: "Full-time",
                          description: "",
                          requirements: [],
                        })
                      }
                      className="h-7 text-[10px]"
                    >
                      <Plus className="size-3 mr-1" /> Add Role
                    </Button>
                  </div>
                  {(data?.openRoles?.listings || []).map(
                    (role: any, idx: number) => (
                      <div
                        key={role.id || idx}
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
                                  ["openRoles", "listings"],
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
                                  ["openRoles", "listings"],
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
                                  ["openRoles", "listings"],
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
                          value={role.title || ""}
                          onChange={(e) => {
                            const newRoles = [
                              ...(data?.openRoles?.listings || []),
                            ];
                            newRoles[idx] = {
                              ...newRoles[idx],
                              title: e.target.value,
                            };
                            updateField(
                              ["openRoles", "listings"],
                              newRoles,
                            );
                          }}
                          className="h-7 text-xs"
                          placeholder="Job title"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            value={role.department || ""}
                            onChange={(e) => {
                              const newRoles = [
                                ...(data?.openRoles?.listings || []),
                              ];
                              newRoles[idx] = {
                                ...newRoles[idx],
                                department: e.target.value,
                              };
                              updateField(
                                ["openRoles", "listings"],
                                newRoles,
                              );
                            }}
                            className="h-7 text-xs"
                            placeholder="Department"
                          />
                          <Input
                            value={role.location || ""}
                            onChange={(e) => {
                              const newRoles = [
                                ...(data?.openRoles?.listings || []),
                              ];
                              newRoles[idx] = {
                                ...newRoles[idx],
                                location: e.target.value,
                              };
                              updateField(
                                ["openRoles", "listings"],
                                newRoles,
                              );
                            }}
                            className="h-7 text-xs"
                            placeholder="Location"
                          />
                        </div>
                        <textarea
                          value={role.description || ""}
                          onChange={(e) => {
                            const newRoles = [
                              ...(data?.openRoles?.listings || []),
                            ];
                            newRoles[idx] = {
                              ...newRoles[idx],
                              description: e.target.value,
                            };
                            updateField(
                              ["openRoles", "listings"],
                              newRoles,
                            );
                          }}
                          rows={2}
                          className="w-full rounded-md border border-border bg-background p-2 text-xs focus:outline-primary"
                          placeholder="Job description"
                        />
                      </div>
                    ),
                  )}
                </div>
              )}

              {section.key === "applicationProcess" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">
                      Title
                    </label>
                    <Input
                      value={data?.applicationProcess?.title || ""}
                      onChange={(e) =>
                        updateField(
                          ["applicationProcess", "title"],
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
                      value={data?.applicationProcess?.description || ""}
                      onChange={(e) =>
                        updateField(
                          ["applicationProcess", "description"],
                          e.target.value,
                        )
                      }
                      rows={3}
                      className="mt-1 w-full rounded-md border border-border bg-background p-2 text-xs focus:outline-primary"
                    />
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
