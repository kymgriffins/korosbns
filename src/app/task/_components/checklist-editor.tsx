"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Checkbox } from "@/ui/checkbox";
import type { ChecklistItem } from "@/types/tasks";

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

export function ChecklistEditor({
  items,
  onChange,
}: {
  items: ChecklistItem[];
  onChange: (items: ChecklistItem[]) => void;
}) {
  function addItem() {
    onChange([...items, { id: genId(), text: "", checked: false }]);
  }

  function removeItem(id: string) {
    onChange(items.filter((i) => i.id !== id));
  }

  function updateItem(id: string, patch: Partial<ChecklistItem>) {
    onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Checklist</label>
        <Button type="button" variant="ghost" size="sm" onClick={addItem}>
          <Plus className="mr-1 size-3.5" />
          Add item
        </Button>
      </div>
      {items.length === 0 && (
        <p className="text-xs text-muted-foreground py-2">No checklist items yet.</p>
      )}
      <div className="space-y-1.5">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2 group">
            <GripVertical className="size-3.5 shrink-0 text-muted-foreground/40" />
            <Checkbox
              checked={item.checked}
              onCheckedChange={(checked) =>
                updateItem(item.id, { checked: checked === true })
              }
            />
            <Input
              value={item.text}
              onChange={(e) => updateItem(item.id, { text: e.target.value })}
              placeholder="Checklist item..."
              className={`h-8 text-sm flex-1 rounded-lg bg-background ${
                item.checked ? "line-through text-muted-foreground" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") removeItem(item.id); }}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/50 rounded"
              aria-label={`Remove checklist item: ${item.text || "untitled"}`}
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
