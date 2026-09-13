"use client";

import React from "react";
import { Input } from "@/components/ui/input";

export interface ColorFieldControlProps {
  label: string;
  value: string;
  onChange: (hexOrCss: string) => void;
  description?: string;
}

function toColorInputValue(value: string): string {
  const v = (value || "").trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(v)) return v;
  if (/^#[0-9A-Fa-f]{3}$/.test(v)) {
    const r = v[1];
    const g = v[2];
    const b = v[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return "#0055FF";
}

export function ColorFieldControl({
  label,
  value,
  onChange,
  description,
}: ColorFieldControlProps) {
  const pickerValue = toColorInputValue(value);

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-foreground">{label}</label>
      {description ? (
        <p className="text-[11px] text-muted-foreground">{description}</p>
      ) : null}
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={pickerValue}
          onChange={(e) => onChange(e.target.value)}
          className="size-10 shrink-0 cursor-pointer rounded-lg border border-border bg-background p-1"
          aria-label={`${label} color picker`}
        />
        <Input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#0055FF or rgba(...)"
          className="h-10 font-mono text-xs"
        />
      </div>
    </div>
  );
}
