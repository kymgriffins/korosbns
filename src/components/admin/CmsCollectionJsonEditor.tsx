"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronRight } from "lucide-react";

function setAtPath(
  root: unknown,
  path: (string | number)[],
  value: unknown,
): unknown {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  if (Array.isArray(root)) {
    const next = [...root];
    const idx = Number(head);
    next[idx] = setAtPath(next[idx], rest, value);
    return next;
  }
  const obj = (typeof root === "object" && root !== null
    ? { ...(root as Record<string, unknown>) }
    : {}) as Record<string, unknown>;
  obj[String(head)] = setAtPath(obj[String(head)], rest, value);
  return obj;
}

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
    return <span className="text-xs italic text-muted-foreground">null</span>;
  }

  if (typeof data === "string") {
    const isMultiline = data.includes("\n") || data.length > 80;
    if (isMultiline) {
      return (
        <textarea
          value={data}
          onChange={(e) => onUpdate(path, e.target.value)}
          rows={3}
          className="w-full rounded-md border border-border bg-background p-2 font-mono text-xs focus:outline-primary"
        />
      );
    }
    return (
      <Input
        value={data}
        onChange={(e) => onUpdate(path, e.target.value)}
        className="h-8 bg-background font-mono text-xs"
      />
    );
  }

  if (typeof data === "number") {
    return (
      <Input
        type="number"
        value={data}
        onChange={(e) => onUpdate(path, Number(e.target.value))}
        className="h-8 w-40 bg-background font-mono text-xs"
      />
    );
  }

  if (typeof data === "boolean") {
    return (
      <button
        type="button"
        onClick={() => onUpdate(path, !data)}
        className={`rounded-md px-3 py-1 text-xs font-bold transition-colors ${
          data ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"
        }`}
      >
        {data ? "TRUE" : "FALSE"}
      </button>
    );
  }

  if (Array.isArray(data)) {
    return (
      <div className="space-y-2 border-l-2 border-primary/20 pl-3">
        <div className="text-[11px] font-semibold text-muted-foreground">
          Array ({data.length} items)
        </div>
        {data.map((item, idx) => (
          <div
            key={idx}
            className="space-y-1 rounded-lg border border-border/40 bg-muted/20 p-2"
          >
            <div className="font-mono text-[10px] font-bold text-primary">
              Item [{idx}]
            </div>
            <JsonTreeEditor data={item} path={[...path, idx]} onUpdate={onUpdate} />
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
              className="space-y-1.5 rounded-lg border border-border/50 bg-background/60 p-2.5 transition-colors hover:border-border"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex items-center gap-1.5 font-mono text-xs font-bold text-foreground ${
                    isComplex ? "cursor-pointer select-none" : ""
                  }`}
                  onClick={isComplex ? () => toggleCollapse(key) : undefined}
                  onKeyDown={
                    isComplex
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") toggleCollapse(key);
                        }
                      : undefined
                  }
                  role={isComplex ? "button" : undefined}
                  tabIndex={isComplex ? 0 : undefined}
                >
                  {isComplex &&
                    (isCollapsed ? (
                      <ChevronRight className="size-3.5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="size-3.5 text-primary" />
                    ))}
                  <span>{key}</span>
                  {isComplex && (
                    <span className="text-[10px] font-normal text-muted-foreground">
                      {Array.isArray(val)
                        ? `[${val.length}]`
                        : `{${Object.keys(val as object).length}}`}
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

  return <span className="text-xs text-muted-foreground">{String(data)}</span>;
}

const COLLECTION_PAGE_KEYS = [
  "faq",
  "stories",
  "impact",
  "consortium",
  "careers",
  "legal",
  "team-initiatives",
  "landing-hero",
  "landing-sections",
  "programme-reels",
  "studios-evidence",
  "bns-studio",
] as const;

export type CollectionPageKey = (typeof COLLECTION_PAGE_KEYS)[number];

export function isCollectionPageKey(key: string): key is CollectionPageKey {
  return (COLLECTION_PAGE_KEYS as readonly string[]).includes(key);
}

export function CmsCollectionJsonEditor({
  title,
  description,
  data,
  onChange,
}: {
  title: string;
  description?: string;
  data: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-xs lg:p-6">
      <div className="mb-4 space-y-1">
        <h2 className="text-sm font-bold text-foreground">{title}</h2>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <JsonTreeEditor
        data={data}
        path={[]}
        onUpdate={(path, value) => {
          onChange(setAtPath(data, path, value) as Record<string, unknown>);
        }}
      />
    </div>
  );
}
