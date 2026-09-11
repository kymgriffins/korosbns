"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link2,
  Minus,
  Eye,
  Edit3,
  Columns,
  Sparkles,
  HelpCircle,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaAssetPicker, type MediaSelection } from "./MediaAssetPicker";
import { MediaEmbed } from "@/components/ui/media-embed";

export interface WysiwygProseEditorProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  description?: string;
  placeholder?: string;
  minRows?: number;
  allowMediaPicker?: boolean;
}

/**
 * Simple markdown / prose parser for live WYSIWYG preview
 */
export function renderWysiwygProseHtml(text: string): string {
  if (!text) return "";

  const lines = text.split("\n");
  const htmlParts: string[] = [];
  let inList = false;
  let listType: "ul" | "ol" = "ul";

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Check empty line
    if (line.trim() === "") {
      if (inList) {
        htmlParts.push(listType === "ul" ? "</ul>" : "</ol>");
        inList = false;
      }
      continue;
    }

    // Dividers
    if (/^(\-\-\-|\*\*\*|___)$/.test(line.trim())) {
      if (inList) {
        htmlParts.push(listType === "ul" ? "</ul>" : "</ol>");
        inList = false;
      }
      htmlParts.push("<hr class='my-6 border-border/60' />");
      continue;
    }

    // Headings
    if (line.startsWith("### ")) {
      if (inList) {
        htmlParts.push(listType === "ul" ? "</ul>" : "</ol>");
        inList = false;
      }
      htmlParts.push(`<h3 class="text-lg font-bold tracking-tight text-foreground mt-6 mb-2">${formatInline(line.slice(4))}</h3>`);
      continue;
    }
    if (line.startsWith("## ")) {
      if (inList) {
        htmlParts.push(listType === "ul" ? "</ul>" : "</ol>");
        inList = false;
      }
      htmlParts.push(`<h2 class="text-xl font-bold tracking-tight text-foreground mt-8 mb-3 border-b border-border/40 pb-1.5">${formatInline(line.slice(3))}</h2>`);
      continue;
    }
    if (line.startsWith("# ")) {
      if (inList) {
        htmlParts.push(listType === "ul" ? "</ul>" : "</ol>");
        inList = false;
      }
      htmlParts.push(`<h1 class="text-2xl font-extrabold tracking-tight text-foreground mt-8 mb-4">${formatInline(line.slice(2))}</h1>`);
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      if (inList) {
        htmlParts.push(listType === "ul" ? "</ul>" : "</ol>");
        inList = false;
      }
      htmlParts.push(`<blockquote class="border-l-4 border-primary/60 pl-4 py-1 italic text-muted-foreground my-4 bg-muted/20 rounded-r">${formatInline(line.slice(2))}</blockquote>`);
      continue;
    }

    // Unordered List
    if (/^[-*]\s+/.test(line)) {
      if (!inList || listType !== "ul") {
        if (inList) htmlParts.push(listType === "ul" ? "</ul>" : "</ol>");
        htmlParts.push("<ul class='list-disc list-inside space-y-1 my-3 text-foreground/90'>");
        inList = true;
        listType = "ul";
      }
      htmlParts.push(`<li>${formatInline(line.replace(/^[-*]\s+/, ""))}</li>`);
      continue;
    }

    // Ordered List
    if (/^\d+\.\s+/.test(line)) {
      if (!inList || listType !== "ol") {
        if (inList) htmlParts.push(listType === "ul" ? "</ul>" : "</ol>");
        htmlParts.push("<ol class='list-decimal list-inside space-y-1 my-3 text-foreground/90'>");
        inList = true;
        listType = "ol";
      }
      htmlParts.push(`<li>${formatInline(line.replace(/^\d+\.\s+/, ""))}</li>`);
      continue;
    }

    // Paragraph
    if (inList) {
      htmlParts.push(listType === "ul" ? "</ul>" : "</ol>");
      inList = false;
    }
    htmlParts.push(`<p class="text-sm leading-relaxed text-foreground/90 mb-3.5">${formatInline(line)}</p>`);
  }

  if (inList) {
    htmlParts.push(listType === "ul" ? "</ul>" : "</ol>");
  }

  return htmlParts.join("\n");
}

function formatInline(text: string): string {
  return text
    // Bold
    .replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold text-foreground'>$1</strong>")
    .replace(/__(.*?)__/g, "<strong class='font-bold text-foreground'>$1</strong>")
    // Italic
    .replace(/\*(.*?)\*/g, "<em class='italic'>$1</em>")
    .replace(/_(.*?)_/g, "<em class='italic'>$1</em>")
    // Code
    .replace(/`([^`]+)`/g, "<code class='rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-primary'>$1</code>")
    // Links
    .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, "<a href='$2' target='_blank' rel='noopener noreferrer' class='text-primary underline hover:text-primary/80 font-medium'>$1</a>");
}

export function WysiwygProseEditor({
  value,
  onChange,
  label,
  description,
  placeholder = "Write or paste formatted prose, findings, and analysis here...",
  minRows = 8,
  allowMediaPicker = true,
}: WysiwygProseEditorProps) {
  const [viewMode, setViewMode] = useState<"write" | "preview" | "split">("split");
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyFormatting = useCallback((prefix: string, suffix: string = "", defaultPlaceholder: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end) || defaultPlaceholder;
    const replacement = prefix + selected + suffix;

    const updated = value.substring(0, start) + replacement + value.substring(end);
    onChange(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 10);
  }, [value, onChange]);

  const insertBlock = useCallback((block: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(value ? value + "\n\n" + block : block);
      return;
    }

    const start = textarea.selectionStart;
    const prefix = value.substring(0, start);
    const suffix = value.substring(start);
    const needNewlineBefore = prefix.length > 0 && !prefix.endsWith("\n\n") ? (prefix.endsWith("\n") ? "\n" : "\n\n") : "";

    const updated = prefix + needNewlineBefore + block + "\n\n" + suffix;
    onChange(updated);

    setTimeout(() => {
      textarea.focus();
    }, 10);
  }, [value, onChange]);

  const handleMediaSelected = (selection: MediaSelection) => {
    if (selection.type === "youtube" || selection.url.includes("youtube") || selection.url.includes("youtu.be")) {
      insertBlock(`> **Video Evidence**: [${selection.title || "Watch on YouTube"}](${selection.url})\n\n`);
    } else {
      insertBlock(`![${selection.title || "Evidence Figure"}](${selection.url})`);
    }
  };

  const renderedHtml = renderWysiwygProseHtml(value);

  return (
    <div className="space-y-2 rounded-xl border border-border bg-card p-4 shadow-xs">
      {/* Header & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-3">
        <div>
          {label ? (
            <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-primary" />
              <span>{label}</span>
            </label>
          ) : null}
          {description ? (
            <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>
          ) : null}
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setViewMode("write")}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
              viewMode === "write" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
            title="Focus on text editor"
          >
            <Edit3 className="size-3 inline mr-1" />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
              viewMode === "split" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
            title="Side by side editor and live preview"
          >
            <Columns className="size-3 inline mr-1" />
            <span>Split</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
              viewMode === "preview" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
            title="Full formatted preview"
          >
            <Eye className="size-3 inline mr-1" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Formatting Toolbar */}
      {viewMode !== "preview" ? (
        <div className="flex flex-wrap items-center gap-1 border-b border-border/40 pb-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => applyFormatting("**", "**", "bold text")}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            title="Bold (Ctrl+B)"
          >
            <Bold className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => applyFormatting("*", "*", "italic text")}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            title="Italic (Ctrl+I)"
          >
            <Italic className="size-3.5" />
          </Button>

          <div className="h-4 w-px bg-border/60 mx-1" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertBlock("## Section Heading\n")}
            className="h-7 px-2 text-xs font-bold text-muted-foreground hover:text-foreground"
            title="Heading 2"
          >
            <Heading2 className="size-3.5 mr-0.5" />
            <span>H2</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertBlock("### Subsection Heading\n")}
            className="h-7 px-2 text-xs font-bold text-muted-foreground hover:text-foreground"
            title="Heading 3"
          >
            <Heading3 className="size-3.5 mr-0.5" />
            <span>H3</span>
          </Button>

          <div className="h-4 w-px bg-border/60 mx-1" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertBlock("- First key observation\n- Second evidentiary finding\n- Third conclusion")}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            title="Bullet List"
          >
            <List className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertBlock("1. Step one: verify data\n2. Step two: embed in field\n3. Step three: publish brief")}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            title="Numbered List"
          >
            <ListOrdered className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertBlock("> Key quote or principal investigator statement.")}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            title="Blockquote / Callout"
          >
            <Quote className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => applyFormatting("[", "](https://example.com)", "link title")}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            title="Insert Link"
          >
            <Link2 className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertBlock("---\n")}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            title="Section Divider"
          >
            <Minus className="size-3.5" />
          </Button>

          {allowMediaPicker ? (
            <>
              <div className="h-4 w-px bg-border/60 mx-1" />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMediaPickerOpen(true)}
                className="h-7 text-xs font-semibold gap-1 text-primary hover:text-primary"
                title="Insert R2 Video, YouTube, or Image"
              >
                <Video className="size-3.5" />
                <span>Insert Media</span>
              </Button>
            </>
          ) : null}
        </div>
      ) : null}

      {/* Editor Body */}
      <div className={viewMode === "split" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : ""}>
        {/* Write Pane */}
        {viewMode !== "preview" ? (
          <div className="space-y-1">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              rows={minRows}
              className="w-full rounded-lg border border-input bg-background p-3 text-xs leading-relaxed font-mono text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary shadow-xs"
            />
            <div className="flex items-center justify-between text-[10px] text-muted-foreground px-1">
              <span>Supports standard Markdown: **bold**, *italic*, ## headings, - lists, [links](url)</span>
              <span>{value.length} characters</span>
            </div>
          </div>
        ) : null}

        {/* Live Preview Pane */}
        {viewMode !== "write" ? (
          <div className="rounded-lg border border-border/80 bg-muted/15 p-4 overflow-y-auto max-h-[450px]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-2 flex items-center justify-between">
              <span>Live Formatted Preview</span>
              <span className="text-emerald-500 font-semibold">WYSIWYG Active</span>
            </div>
            {value.trim() ? (
              <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />
            ) : (
              <div className="text-xs text-muted-foreground italic py-8 text-center">
                Type something in the editor to see formatted preview...
              </div>
            )}
          </div>
        ) : null}
      </div>

      {allowMediaPicker && mediaPickerOpen ? (
        <MediaAssetPicker
          onClose={() => setMediaPickerOpen(false)}
          onSelect={handleMediaSelected}
          title="Insert Media into Dossier"
        />
      ) : null}
    </div>
  );
}
