"use client";

import React, { useState } from "react";
import { Image as ImageIcon, Trash2, FolderOpen, Upload, Link as LinkIcon, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface ImageFieldControlProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  onOpenBucket: () => void;
  description?: string;
  placeholder?: string;
  compact?: boolean;
}

export function ImageFieldControl({
  label,
  value,
  onChange,
  onOpenBucket,
  description,
  placeholder = "e.g. /images/... or Cloudflare R2 URL",
  compact = false,
}: ImageFieldControlProps) {
  const [showManualInput, setShowManualInput] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hasImage = Boolean(value && value.trim());

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground">{label}</label>
        <button
          type="button"
          onClick={() => setShowManualInput((prev) => !prev)}
          className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          <LinkIcon className="size-2.5" />
          <span>{showManualInput ? "Hide raw URL" : "Manual URL"}</span>
        </button>
      </div>

      {description && (
        <p className="text-[11px] text-muted-foreground">{description}</p>
      )}

      {/* Visual Image Preview & Actions Card */}
      <div className="rounded-xl border border-border/70 bg-card p-3 shadow-xs">
        {hasImage ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3.5">
            {/* Thumbnail Box */}
            <div className="relative size-16 sm:size-20 shrink-0 rounded-lg overflow-hidden border border-border/80 bg-black/50 flex items-center justify-center">
              {!imageError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={value}
                  alt={label}
                  onError={() => setImageError(true)}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-1 text-center text-[9px] text-muted-foreground">
                  <ImageIcon className="size-4 mb-0.5 text-muted-foreground" />
                  <span>Invalid URL</span>
                </div>
              )}
            </div>

            {/* Info & Action Buttons */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-foreground truncate max-w-full font-medium" title={value}>
                  {value.split("/").pop() || value}
                </span>
                <a
                  href={value}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground shrink-0"
                  title="Open image in new tab"
                >
                  <ExternalLink className="size-3" />
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  onClick={onOpenBucket}
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs font-semibold h-7 px-2.5 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 text-foreground"
                >
                  <FolderOpen className="size-3.5 text-primary" />
                  <span>Select from Bucket</span>
                </Button>

                <Button
                  type="button"
                  onClick={() => onChange("")}
                  size="sm"
                  variant="ghost"
                  className="gap-1.5 text-xs font-medium h-7 px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-500/10"
                >
                  <Trash2 className="size-3 text-rose-500" />
                  <span>Remove</span>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 px-3 border border-dashed border-border/80 rounded-lg bg-muted/20 text-center gap-2">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <ImageIcon className="size-5" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-foreground">No image selected</p>
              <p className="text-[11px] text-muted-foreground">
                Pick an existing image from your Cloudflare R2 bucket or upload a new one.
              </p>
            </div>
            <Button
              type="button"
              onClick={onOpenBucket}
              size="sm"
              className="gap-1.5 text-xs font-bold bg-primary text-primary-foreground shadow-xs mt-1"
            >
              <FolderOpen className="size-3.5" />
              <span>Select from R2 Bucket</span>
            </Button>
          </div>
        )}

        {/* Collapsible Manual URL input */}
        {showManualInput && (
          <div className="mt-3 pt-2.5 border-t border-border/50 space-y-1">
            <span className="text-[10px] font-mono text-muted-foreground">Raw Image URL:</span>
            <Input
              value={value}
              onChange={(e) => {
                setImageError(false);
                onChange(e.target.value);
              }}
              placeholder={placeholder}
              className="h-7 text-xs font-mono"
            />
          </div>
        )}
      </div>
    </div>
  );
}
