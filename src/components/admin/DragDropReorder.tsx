"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/utils";

interface DragDropReorderProps<T> {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
  className?: string;
}

function SortableItem<T>({
  item,
  index,
  renderItem,
  keyExtractor,
}: {
  item: T;
  index: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: keyExtractor(item) });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-start gap-2 rounded-lg border border-border/40 bg-background p-3 transition-shadow",
        isDragging && "shadow-lg border-primary/50 z-10",
      )}
    >
      <button
        type="button"
        className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>
      <div className="flex-1 min-w-0">
        {renderItem(item, index)}
      </div>
    </div>
  );
}

export function DragDropReorder<T>({
  items,
  onReorder,
  renderItem,
  keyExtractor,
  className,
}: DragDropReorderProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex(
        (item) => keyExtractor(item) === active.id,
      );
      const newIndex = items.findIndex(
        (item) => keyExtractor(item) === over?.id,
      );
      onReorder(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(keyExtractor)}
        strategy={verticalListSortingStrategy}
      >
        <div className={cn("space-y-2", className)}>
          {items.map((item, index) => (
            <SortableItem
              key={keyExtractor(item)}
              item={item}
              index={index}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
