"use client";

import * as React from "react";
import { motion, type Transition } from "motion/react";
import { Plus } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/animate-ui/components/radix/checkbox";
import { cn } from "@/utils";

export type PlayfulTodoItem = {
  id: string;
  label: string;
  checked?: boolean;
  hint?: string;
};

const getPathAnimate = (isChecked: boolean) => ({
  pathLength: isChecked ? 1 : 0,
  opacity: isChecked ? 1 : 0,
});

const getPathTransition = (isChecked: boolean): Transition => ({
  pathLength: { duration: 1, ease: "easeInOut" },
  opacity: {
    duration: 0.01,
    delay: isChecked ? 0 : 1,
  },
});

type PlayfulTodolistProps = {
  items: PlayfulTodoItem[];
  onToggle?: (id: string, checked: boolean) => void;
  onAdd?: () => void;
  onSelect?: (id: string) => void;
  addLabel?: string;
  emptyLabel?: string;
  className?: string;
  disabled?: boolean;
};

/**
 * Playful todolist with wavy strikethrough — controlled for real task checklists.
 * Installed from @animate-ui/components-community-playful-todolist, extended for BNS tasks.
 */
function PlayfulTodolist({
  items,
  onToggle,
  onAdd,
  onSelect,
  addLabel = "Add checklist item",
  emptyLabel = "No checklist items yet — add the first step for this week.",
  className,
  disabled,
}: PlayfulTodolistProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-2xl border border-border/60 bg-muted/40 p-4 sm:p-6",
        className,
      )}
    >
      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        items.map((item, idx) => {
          const isChecked = Boolean(item.checked);
          const checkboxId = `playful-todo-${item.id}`;
          return (
            <div key={item.id} className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  variant="accent"
                  checked={isChecked}
                  disabled={disabled}
                  onCheckedChange={(val) => onToggle?.(item.id, val === true)}
                  id={checkboxId}
                  className="mt-0.5"
                />
                <div className="min-w-0 flex-1">
                  <div className="relative inline-block max-w-full">
                    {onSelect ? (
                      <button
                        type="button"
                        onClick={() => onSelect(item.id)}
                        className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Label
                          htmlFor={checkboxId}
                          className={cn(
                            "cursor-pointer text-sm font-medium leading-snug text-foreground",
                            isChecked && "text-muted-foreground",
                          )}
                        >
                          {item.label}
                        </Label>
                      </button>
                    ) : (
                      <Label
                        htmlFor={checkboxId}
                        className={cn(
                          "cursor-pointer text-sm font-medium leading-snug text-foreground",
                          isChecked && "text-muted-foreground",
                        )}
                      >
                        {item.label}
                      </Label>
                    )}
                    <motion.svg
                      width="340"
                      height="32"
                      viewBox="0 0 340 32"
                      className="pointer-events-none absolute left-0 top-1/2 z-20 h-10 w-full -translate-y-1/2"
                      aria-hidden
                    >
                      <motion.path
                        d="M 10 16.91 s 79.8 -11.36 98.1 -11.34 c 22.2 0.02 -47.82 14.25 -33.39 22.02 c 12.61 6.77 124.18 -27.98 133.31 -17.28 c 7.52 8.38 -26.8 20.02 4.61 22.05 c 24.55 1.93 113.37 -20.36 113.37 -20.36"
                        vectorEffect="non-scaling-stroke"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeMiterlimit={10}
                        fill="none"
                        initial={false}
                        animate={getPathAnimate(isChecked)}
                        transition={getPathTransition(isChecked)}
                        className="stroke-foreground"
                      />
                    </motion.svg>
                  </div>
                  {item.hint ? (
                    <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p>
                  ) : null}
                </div>
              </div>
              {idx !== items.length - 1 ? (
                <div className="border-t border-border/50" />
              ) : null}
            </div>
          );
        })
      )}

      {onAdd ? (
        <div className={cn("pt-2", items.length > 0 && "mt-2 border-t border-border/50")}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={onAdd}
            className="h-9 w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          >
            <Plus className="size-4" aria-hidden />
            {addLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export { PlayfulTodolist };
