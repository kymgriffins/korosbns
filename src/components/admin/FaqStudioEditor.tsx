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

interface FaqStudioEditorProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function FaqStudioEditor({ data, onChange }: FaqStudioEditorProps) {
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
    { key: "categories", label: "FAQ Categories", icon: "📂" },
    { key: "items", label: "FAQ Items", icon: "❓" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-border/50 pb-4">
        <div>
          <h2 className="text-base font-bold text-foreground">
            FAQ Page Editor
          </h2>
          <p className="text-xs text-muted-foreground">
            Edit hero, FAQ categories, and FAQ items sections.
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

              {section.key === "categories" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">
                      Categories
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        addArrayItem(["categories", "items"], {
                          id: `category-${Date.now()}`,
                          name: "New Category",
                          slug: "",
                          icon: "📂",
                        })
                      }
                      className="h-7 text-[10px]"
                    >
                      <Plus className="size-3 mr-1" /> Add Category
                    </Button>
                  </div>
                  {(data?.categories?.items || []).map(
                    (category: any, idx: number) => (
                      <div
                        key={category.id || idx}
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
                                  ["categories", "items"],
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
                                  ["categories", "items"],
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
                                  ["categories", "items"],
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
                          value={category.name || ""}
                          onChange={(e) => {
                            const newCategories = [
                              ...(data?.categories?.items || []),
                            ];
                            newCategories[idx] = {
                              ...newCategories[idx],
                              name: e.target.value,
                            };
                            updateField(
                              ["categories", "items"],
                              newCategories,
                            );
                          }}
                          className="h-7 text-xs"
                          placeholder="Category name"
                        />
                        <Input
                          value={category.slug || ""}
                          onChange={(e) => {
                            const newCategories = [
                              ...(data?.categories?.items || []),
                            ];
                            newCategories[idx] = {
                              ...newCategories[idx],
                              slug: e.target.value,
                            };
                            updateField(
                              ["categories", "items"],
                              newCategories,
                            );
                          }}
                          className="h-7 text-xs"
                          placeholder="Slug"
                        />
                      </div>
                    ),
                  )}
                </div>
              )}

              {section.key === "items" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">
                      FAQ Items
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        addArrayItem(["items", "list"], {
                          id: `faq-${Date.now()}`,
                          question: "New Question",
                          answer: "",
                          category: "",
                        })
                      }
                      className="h-7 text-[10px]"
                    >
                      <Plus className="size-3 mr-1" /> Add FAQ
                    </Button>
                  </div>
                  {(data?.items?.list || []).map(
                    (item: any, idx: number) => (
                      <div
                        key={item.id || idx}
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
                                  ["items", "list"],
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
                                  ["items", "list"],
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
                                removeArrayItem(["items", "list"], idx)
                              }
                              className="h-6 w-6 p-0 text-rose-500"
                            >
                              <Trash2 className="size-3" />
                            </Button>
                          </div>
                        </div>
                        <Input
                          value={item.question || ""}
                          onChange={(e) => {
                            const newItems = [
                              ...(data?.items?.list || []),
                            ];
                            newItems[idx] = {
                              ...newItems[idx],
                              question: e.target.value,
                            };
                            updateField(["items", "list"], newItems);
                          }}
                          className="h-7 text-xs"
                          placeholder="Question"
                        />
                        <textarea
                          value={item.answer || ""}
                          onChange={(e) => {
                            const newItems = [
                              ...(data?.items?.list || []),
                            ];
                            newItems[idx] = {
                              ...newItems[idx],
                              answer: e.target.value,
                            };
                            updateField(["items", "list"], newItems);
                          }}
                          rows={3}
                          className="w-full rounded-md border border-border bg-background p-2 text-xs focus:outline-primary"
                          placeholder="Answer"
                        />
                        <Input
                          value={item.category || ""}
                          onChange={(e) => {
                            const newItems = [
                              ...(data?.items?.list || []),
                            ];
                            newItems[idx] = {
                              ...newItems[idx],
                              category: e.target.value,
                            };
                            updateField(["items", "list"], newItems);
                          }}
                          className="h-7 text-xs"
                          placeholder="Category"
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
