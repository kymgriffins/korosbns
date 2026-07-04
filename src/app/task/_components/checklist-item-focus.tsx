"use client";

import { ArrowLeft, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/utils/index";
import type { AssignableUser, ChecklistItem } from "@/types/tasks";
import { isChecklistItemDone } from "./checklist-utils";

export function ChecklistItemFocus({
  item,
  assignableUsers,
  readonly,
  onBack,
  onUpdate,
  onRemove,
}: {
  item: ChecklistItem;
  assignableUsers: AssignableUser[];
  readonly?: boolean;
  onBack: () => void;
  onUpdate: (patch: Partial<ChecklistItem>, options?: { debounce?: boolean }) => void;
  onRemove: () => void;
}) {
  const title = item.title || item.text || "Untitled item";
  const done = isChecklistItemDone(item);
  const selectedUser = assignableUsers.find((u) => u.id === item.assignee);

  return (
    <div className="animate-in fade-in slide-in-from-right-2 duration-200">
      <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm" aria-label="Checklist navigation">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Sub-tasks
        </button>
        <span className="text-muted-foreground/50" aria-hidden>
          /
        </span>
        <span className={cn("truncate font-medium", done && "text-muted-foreground line-through")}>
          {title}
        </span>
      </nav>

      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm",
          done && "opacity-90",
        )}
      >
        <div className="absolute inset-y-0 left-0 w-1 bg-primary/80" aria-hidden />

        <div className="space-y-4 p-4 pl-5 md:p-5 md:pl-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <Checkbox
                checked={done}
                disabled={readonly}
                className="mt-1"
                onCheckedChange={(checked) =>
                  onUpdate({ checked: checked === true, status: checked ? "done" : "todo" })
                }
              />
              <div className="min-w-0 flex-1 space-y-1">
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  Sub-task
                </p>
                <Input
                  value={item.title || item.text}
                  disabled={readonly}
                  onChange={(e) => onUpdate({ title: e.target.value, text: e.target.value })}
                  placeholder="What needs to happen?"
                  className="h-9 border-0 bg-transparent px-0 text-base font-semibold shadow-none focus-visible:ring-0"
                />
              </div>
            </div>
            <div className="flex items-center gap-1">
              {!readonly && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground hover:text-destructive"
                  onClick={onRemove}
                  aria-label="Remove sub-task"
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
              <Button type="button" variant="secondary" size="sm" onClick={onBack}>
                Done
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Assignee</Label>
            <Select
              value={item.assignee || "unassigned_value_placeholder"}
              disabled={readonly}
              onValueChange={(v) =>
                onUpdate({
                  assignee: v === "unassigned_value_placeholder" ? null : v,
                  assignee_name:
                    v === "unassigned_value_placeholder"
                      ? null
                      : assignableUsers.find((u) => u.id === v)?.display_name ?? null,
                })
              }
            >
              <SelectTrigger className="h-9 bg-background text-sm">
                <SelectValue placeholder={readonly ? "Unassigned" : "Select assignee"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned_value_placeholder">None (Unassigned)</SelectItem>
                {assignableUsers.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.display_name || `${u.first_name} ${u.last_name}`.trim() || u.email}
                    <span className="ml-2 text-[10px] text-muted-foreground">
                      ({u.role}{u.team ? ` · ${u.team.name}` : ""})
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedUser && (
              <p className="text-[10px] text-muted-foreground">
                {selectedUser.display_name ||
                  `${selectedUser.first_name} ${selectedUser.last_name}`.trim()}
                {" · "}
                {selectedUser.role}
                {selectedUser.team ? ` · ${selectedUser.team.name}` : ""}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
