"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bold, Heading1, Heading2, Heading3, Italic, List, ListOrdered,
  Quote, Code, Image, Minus, Undo, Redo, Eye, Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export interface EditorBlock {
  id: string;
  type: "paragraph" | "header" | "list" | "quote" | "code" | "image" | "delimiter";
  data: Record<string, unknown>;
}

export interface EditorDocument {
  time: number;
  blocks: EditorBlock[];
  version: string;
}

let blockIdCounter = 0;
function genId() {
  blockIdCounter += 1;
  return `block-${blockIdCounter}-${Date.now().toString(36)}`;
}

function serializeToEditorJs(blocks: EditorBlock[]): string {
  return JSON.stringify({
    time: Date.now(),
    blocks,
    version: "2.30.6",
  } satisfies EditorDocument);
}

function inlineFormat(text: string, formats: { bold?: boolean; italic?: boolean }): string {
  let result = text;
  if (formats.bold) result = `<strong>${result}</strong>`;
  if (formats.italic) result = `<em>${result}</em>`;
  return result;
}

interface BlockEditorProps {
  value: string;
  onChange: (value: string) => void;
  minHeight?: number;
  placeholder?: string;
}

type ToolbarAction =
  | "h1" | "h2" | "h3" | "bold" | "italic"
  | "ul" | "ol" | "quote" | "code"
  | "image" | "divider" | "undo" | "redo";

const TOOLBAR_GROUPS: ToolbarAction[][] = [
  ["undo", "redo"],
  ["h1", "h2", "h3"],
  ["bold", "italic"],
  ["ul", "ol"],
  ["quote", "code"],
  ["image", "divider"],
];

const HEADER_TYPES = new Set<ToolbarAction>(["h1", "h2", "h3"]);

export function AdminContentEditor({
  value,
  onChange,
  minHeight = 320,
  placeholder = "Start writing your content...",
}: BlockEditorProps) {
  const [blocks, setBlocks] = useState<EditorBlock[]>(() => {
    try {
      const parsed = JSON.parse(value || "{}");
      if (parsed?.blocks && Array.isArray(parsed.blocks)) return parsed.blocks;
    } catch { /* not json */ }
    return value
      ? [{ id: genId(), type: "paragraph" as const, data: { text: value } }]
      : [];
  });
  const [history, setHistory] = useState<EditorBlock[][]>([blocks]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [preview, setPreview] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageDialog, setImageDialog] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onChange(serializeToEditorJs(blocks));
  }, [blocks, onChange]);

  const pushHistory = useCallback((newBlocks: EditorBlock[]) => {
    setHistory((prev) => {
      const fresh = [...prev.slice(0, historyIndex + 1), newBlocks];
      return fresh.slice(-50);
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 49));
    setBlocks(newBlocks);
  }, [historyIndex]);

  const updateBlock = useCallback((id: string, data: Record<string, unknown>) => {
    setBlocks((prev) => {
      const next = prev.map((b) => (b.id === id ? { ...b, data } : b));
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const addBlock = useCallback((afterId: string | null, type: EditorBlock["type"], extraData?: Record<string, unknown>) => {
    setBlocks((prev) => {
      const newBlock: EditorBlock = {
        id: genId(), type, data: extraData ?? {},
      };
      const idx = afterId ? prev.findIndex((b) => b.id === afterId) : prev.length - 1;
      const next = [...prev];
      next.splice(idx + 1, 0, newBlock);
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const removeBlock = useCallback((id: string) => {
    setBlocks((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.filter((b) => b.id !== id);
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const insertImage = useCallback((url: string) => {
    if (!imageDialog) return;
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === imageDialog);
      const next = [...prev];
      next.splice(idx + 1, 0, { id: genId(), type: "image", data: { url, caption: "" } });
      pushHistory(next);
      return next;
    });
    setImageDialog(null);
    setImageUrl("");
  }, [imageDialog, pushHistory]);

  const applyToolbar = useCallback((action: ToolbarAction) => {
    const sel = window.getSelection();
    const el = sel?.focusNode?.parentElement?.closest("[data-block-id]");
    if (!el) return;
    const blockId = el.getAttribute("data-block-id");
    if (!blockId) return;

    const block = blocks.find((b) => b.id === blockId);
    if (!block) return;

    if (HEADER_TYPES.has(action)) {
      const level = action === "h1" ? 1 : action === "h2" ? 2 : 3;
      updateBlock(blockId, { ...block.data, level, type: "header" });
      setBlocks((prev) => prev.map((b) => b.id === blockId ? { ...b, type: "header" as const } : b));
    } else if (action === "bold" || action === "italic") {
      const text = String(block.data.text ?? "");
      const formats = { bold: block.data.bold as boolean, italic: block.data.italic as boolean };
      if (action === "bold") formats.bold = !formats.bold;
      if (action === "italic") formats.italic = !formats.italic;
      updateBlock(blockId, { ...block.data, ...formats, html: inlineFormat(text, formats) });
    } else if (action === "ul") {
      updateBlock(blockId, { ...block.data, style: "unordered" });
      setBlocks((prev) => prev.map((b) => b.id === blockId ? { ...b, type: "list" as const } : b));
    } else if (action === "ol") {
      updateBlock(blockId, { ...block.data, style: "ordered" });
      setBlocks((prev) => prev.map((b) => b.id === blockId ? { ...b, type: "list" as const } : b));
    } else if (action === "quote") {
      setBlocks((prev) => prev.map((b) => b.id === blockId ? { ...b, type: "quote" as const } : b));
    } else if (action === "code") {
      setBlocks((prev) => prev.map((b) => b.id === blockId ? { ...b, type: "code" as const } : b));
    } else if (action === "divider") {
      addBlock(blockId, "delimiter");
    }
  }, [blocks, updateBlock, addBlock]);

  const handleUndo = useCallback(() => {
    if (historyIndex <= 0) return;
    const newIdx = historyIndex - 1;
    setHistoryIndex(newIdx);
    setBlocks(history[newIdx]);
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const newIdx = historyIndex + 1;
    setHistoryIndex(newIdx);
    setBlocks(history[newIdx]);
  }, [historyIndex, history]);

  const renderBlockContent = (block: EditorBlock) => {
    switch (block.type) {
      case "header": {
        const level = (block.data.level as number) || 2;
        const Tag = `h${level}` as "h1" | "h2" | "h3";
        return (
          <Tag
            contentEditable
            suppressContentEditableWarning
            className="outline-none font-semibold"
            style={{ fontSize: level === 1 ? 28 : level === 2 ? 22 : 18 }}
            onBlur={(e) => updateBlock(block.id, { ...block.data, text: e.currentTarget.textContent || "" })}
            dangerouslySetInnerHTML={{ __html: (block.data.html as string) || (block.data.text as string) || "" }}
          />
        );
      }
      case "quote":
        return (
          <div className="relative pl-4 border-l-4 border-primary/40">
            <p
              contentEditable
              suppressContentEditableWarning
              className="outline-none italic text-muted-foreground"
              onBlur={(e) => updateBlock(block.id, { ...block.data, text: e.currentTarget.textContent || "" })}
              dangerouslySetInnerHTML={{ __html: (block.data.html as string) || (block.data.text as string) || "" }}
            />
            <input
              className="mt-1 text-xs text-muted-foreground bg-transparent border-none outline-none w-full"
              placeholder="— Attribution"
              defaultValue={block.data.caption as string || ""}
              onBlur={(e) => updateBlock(block.id, { ...block.data, caption: e.currentTarget.value })}
            />
          </div>
        );
      case "code":
        return (
          <pre className="bg-muted rounded-lg p-4 overflow-x-auto">
            <code
              contentEditable
              suppressContentEditableWarning
              className="outline-none text-sm font-mono"
              onBlur={(e) => updateBlock(block.id, { ...block.data, code: e.currentTarget.textContent || "" })}
            >{(block.data.code as string) || ""}</code>
          </pre>
        );
      case "list": {
        const style = block.data.style as string;
        const Tag = style === "ordered" ? "ol" : "ul";
        const items = (block.data.items as string[]) || [""];
        return (
          <Tag className="pl-6 space-y-1">
            {items.map((item, i) => (
              <li key={i} className="outline-none" contentEditable suppressContentEditableWarning
                onBlur={(e) => {
                  const newItems = [...items];
                  newItems[i] = e.currentTarget.textContent || "";
                  updateBlock(block.id, { ...block.data, items: newItems });
                }}
              >{item}</li>
            ))}
            <button className="text-xs text-muted-foreground hover:text-foreground" onClick={() => {
              const newItems = [...items, ""];
              updateBlock(block.id, { ...block.data, items: newItems });
            }}>+ Add item</button>
          </Tag>
        );
      }
      case "image":
        return (
          <figure className="space-y-2">
            <img src={block.data.url as string} alt={block.data.caption as string || ""}
              className="max-w-full rounded-lg" style={{ maxHeight: 400 }} />
            <figcaption>
              <input
                className="w-full text-center text-sm text-muted-foreground bg-transparent border-none outline-none"
                placeholder="Add a caption..."
                defaultValue={block.data.caption as string || ""}
                onBlur={(e) => updateBlock(block.id, { ...block.data, caption: e.currentTarget.value })}
              />
            </figcaption>
          </figure>
        );
      case "delimiter":
        return <div className="flex items-center gap-2 py-2"><Minus className="size-4 text-muted-foreground/40" /></div>;
      default:
        return (
          <p
            contentEditable
            suppressContentEditableWarning
            className="outline-none min-h-[1.5em]"
            onBlur={(e) => {
              const text = e.currentTarget.textContent || "";
              const formats = { bold: block.data.bold as boolean, italic: block.data.italic as boolean };
              updateBlock(block.id, { ...block.data, text, html: inlineFormat(text, formats) });
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                addBlock(block.id, "paragraph");
              }
              if (e.key === "Backspace" && !e.currentTarget.textContent) {
                e.preventDefault();
                removeBlock(block.id);
              }
            }}
            dangerouslySetInnerHTML={{
              __html: (block.data.html as string) || (block.data.text as string) || ""
            }}
          />
        );
    }
  };

  const replaceHistory = (fn: (prev: EditorBlock[]) => EditorBlock[]) => {
    setBlocks((prev) => {
      const next = fn(prev);
      pushHistory(next);
      return next;
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-lg border bg-card p-0.5 shadow-xs">
          {TOOLBAR_GROUPS.map((group, gi) => (
            <div key={gi} className="flex items-center gap-0.5">
              {gi > 0 && <Separator orientation="vertical" className="mx-0.5 h-5" />}
              {group.map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => action === "undo" ? handleUndo() : action === "redo" ? handleRedo() : applyToolbar(action)}
                  className={cn(
                    "flex size-7 items-center justify-center rounded-md text-muted-foreground",
                    "hover:bg-muted hover:text-foreground transition-colors",
                    action === "undo" && (historyIndex <= 0) && "opacity-30 pointer-events-none",
                    action === "redo" && (historyIndex >= history.length - 1) && "opacity-30 pointer-events-none",
                  )}
                  title={action === "h1" ? "Heading 1" : action === "h2" ? "Heading 2" : action === "h3" ? "Heading 3" : action.charAt(0).toUpperCase() + action.slice(1)}
                >
                  {action === "h1" && <Heading1 className="size-3.5" />}
                  {action === "h2" && <Heading2 className="size-3.5" />}
                  {action === "h3" && <Heading3 className="size-3.5" />}
                  {action === "bold" && <Bold className="size-3.5" />}
                  {action === "italic" && <Italic className="size-3.5" />}
                  {action === "ul" && <List className="size-3.5" />}
                  {action === "ol" && <ListOrdered className="size-3.5" />}
                  {action === "quote" && <Quote className="size-3.5" />}
                  {action === "code" && <Code className="size-3.5" />}
                  {action === "image" && <Image className="size-3.5" />}
                  {action === "divider" && <Minus className="size-3.5" />}
                  {action === "undo" && <Undo className="size-3.5" />}
                  {action === "redo" && <Redo className="size-3.5" />}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setPreview(!preview)}
            className={cn(preview && "bg-muted text-foreground")}
            aria-label={preview ? "Edit" : "Preview"}
          >
            <AnimatePresence mode="wait">
              {preview ? (
                <motion.div key="edit" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Edit3 className="size-3.5" />
                </motion.div>
              ) : (
                <motion.div key="preview" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Eye className="size-3.5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>

      <div
        ref={editorRef}
        className={cn(
          "rounded-lg border bg-card",
          preview ? "p-4" : "p-3",
        )}
        style={{ minHeight }}
      >
        {preview ? (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {blocks.length === 0 ? (
              <p className="text-muted-foreground italic">No content</p>
            ) : (
              blocks.map((block) => {
                switch (block.type) {
                  case "header": {
                    const level = (block.data.level as number) || 2;
                    const Tag = `h${level}` as "h1" | "h2" | "h3";
                    return <Tag key={block.id}>{block.data.text as string}</Tag>;
                  }
                  case "quote":
                    return <blockquote key={block.id}><p>{(block.data.text as string) || ""}</p></blockquote>;
                  case "code":
                    return <pre key={block.id}><code>{(block.data.code as string) || ""}</code></pre>;
                  case "list": {
                    const Tag = (block.data.style as string) === "ordered" ? "ol" : "ul";
                    return (
                      <Tag key={block.id}>
                        {((block.data.items as string[]) || []).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </Tag>
                    );
                  }
                  case "image":
                    return (
                      <figure key={block.id}>
                        <img src={block.data.url as string} alt="" className="max-w-full rounded" />
                        {(block.data.caption as string) && <figcaption className="text-sm">{block.data.caption as string}</figcaption>}
                      </figure>
                    );
                  case "delimiter":
                    return <hr key={block.id} />;
                  default:
                    return <p key={block.id}>{(block.data.html as string) || (block.data.text as string) || ""}</p>;
                }
              })
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {blocks.length === 0 && (
              <p className="text-muted-foreground/50 text-sm select-none">{placeholder}</p>
            )}
            {blocks.map((block) => (
              <div key={block.id} data-block-id={block.id} className="group relative rounded px-0.5 -mx-0.5 hover:bg-muted/30 transition-colors">
                <div className="absolute -left-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-px pt-1">
                  <button type="button" className="size-4 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground text-xs"
                    onClick={() => addBlock(block.id, "paragraph")}>+</button>
                </div>
                {renderBlockContent(block)}
                <div className="absolute -right-0.5 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-px pt-1">
                  <button type="button" className="size-4 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground text-xs"
                    onClick={() => removeBlock(block.id)}>×</button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addBlock(null, "paragraph")}
              className="w-full text-left py-1 text-xs text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"
            >
              + Add block
            </button>
          </div>
        )}
      </div>

      <Popover open={!!imageDialog} onOpenChange={(o) => { if (!o) { setImageDialog(null); setImageUrl(""); } }}>
        <PopoverTrigger asChild><span /></PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Insert Image</h4>
            <Input placeholder="https://example.com/image.jpg" value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)} />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => { setImageDialog(null); setImageUrl(""); }}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => insertImage(imageUrl)} disabled={!imageUrl}>
                Insert
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
