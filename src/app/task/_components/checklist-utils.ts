import type { ChecklistItem } from "@/types/tasks";

export function isChecklistItemDone(item: ChecklistItem): boolean {
  return item.checked === true || item.status === "done";
}

/** Active items first (stable order), completed items sink to the bottom. */
export function partitionChecklistItems(items: ChecklistItem[]) {
  const active: ChecklistItem[] = [];
  const done: ChecklistItem[] = [];
  for (const item of items) {
    if (isChecklistItemDone(item)) done.push(item);
    else active.push(item);
  }
  return { active, done };
}

export function mergeChecklistOrder(items: ChecklistItem[]): ChecklistItem[] {
  const { active, done } = partitionChecklistItems(items);
  return [...active, ...done];
}
