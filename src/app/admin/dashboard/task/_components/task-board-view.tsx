"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, MoreVertical, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getFullUrl, useRouteBase } from "@/lib/route-base";
import { useAuth } from "@/contexts/auth-context";
import { taskData } from "@/data/tasks";
import { invalidateTaskList } from "@/lib/task-events";
import type { Task } from "@/types/tasks";

type ColumnId = "ideas" | "planned" | "building" | "qa" | "shipped";

const COLUMNS: Array<{ id: ColumnId; title: string }> = [
  { id: "ideas", title: "Ideas" },
  { id: "planned", title: "Planned" },
  { id: "building", title: "Building" },
  { id: "qa", title: "QA" },
  { id: "shipped", title: "Shipped" },
];

type Props = {
  tasks: Task[];
  onRefresh: () => void;
  query: string;
};

function BoardCard({ task, isOverlay = false }: { task: Task; isOverlay?: boolean }) {
  const routeBase = useRouteBase();
  const router = useRouter();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    opacity: isDragging ? 0.6 : 1,
    touchAction: isDragging ? "none" : "auto",
    zIndex: isDragging ? 999 : "auto",
  } as React.CSSProperties;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => router.push(getFullUrl(routeBase, `/dashboard/task/${task.id}`))}
      className={cn(
        "cursor-move rounded-lg border bg-background p-3 shadow-xs/5 transition-all duration-200 ease-out",
        isOverlay && "rotate-1 shadow-lg",
        isDragging ? "border-ring/40 bg-card shadow-lg" : "border-border hover:border-border/90 hover:shadow-sm",
      )}
    >
      <div className="mb-2 pr-2">
        <div
          className="overflow-hidden break-words text-sm leading-5 font-medium text-foreground/95"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            wordBreak: "break-word",
            hyphens: "auto",
          }}
        >
          {task.title}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground border border-border/30">
            {(task.assignee_name ?? task.assignee ?? "?")[0]?.toUpperCase() ?? "?"}
          </span>
          <span className="text-[11px] text-muted-foreground truncate max-w-16">
            {task.assignee_name || task.assignee || "?"}
          </span>
        </div>
        {task.due_date && (
          <span className="text-[10px] text-muted-foreground/70">
            {new Date(task.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        )}
      </div>
    </div>
  );
}

function BoardColumn({ column, tasks }: { column: typeof COLUMNS[number]; tasks: Task[] }) {
  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);

  return (
    <section className="flex min-h-0 flex-col rounded-t-xl border bg-muted/50">
      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3">
        <div className="min-w-0 space-y-1">
          <h2 className="truncate font-medium text-base leading-none">{column.title}</h2>
          <p className="text-muted-foreground text-sm tabular-nums leading-none">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </p>
        </div>
        <div className="-mr-2 flex items-center gap-0.5 text-muted-foreground">
          <Button variant="ghost" size="icon-sm" aria-label={`Add task to ${column.title}`}>
            <Plus />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label={`${column.title} column actions`}>
            <MoreVertical />
          </Button>
        </div>
      </div>

      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="scrollbar-thin flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 pb-3 [scrollbar-color:var(--border)_transparent] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1">
          {tasks.map((task) => (
            <BoardCard key={task.id} task={task} />
          ))}
          {tasks.length === 0 && (
            <div className="flex items-center justify-center rounded-lg border border-dashed p-6 text-xs text-muted-foreground">
              No tasks
            </div>
          )}
        </div>
      </SortableContext>
    </section>
  );
}

export function TaskBoardView({ tasks, onRefresh, query }: Props) {
  const { isLoggedIn } = useAuth();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const boardBeforeDrag = useRef<Task[] | null>(null);
  const [localTasks, setLocalTasks] = useState(tasks);

  const q = query.toLowerCase();
  const filtered = useMemo(
    () =>
      localTasks.filter(
        (t) =>
          !q ||
          t.title.toLowerCase().includes(q) ||
          (t.assignee_name ?? t.assignee ?? "").toLowerCase().includes(q) ||
          (t.content ?? "").toLowerCase().includes(q),
      ),
    [localTasks, q],
  );

  const grouped = useMemo(() => {
    const map: Record<ColumnId, Task[]> = {
      ideas: [],
      planned: [],
      building: [],
      qa: [],
      shipped: [],
    };
    for (const task of filtered) {
      const col = (task.kanban_column ?? "ideas") as ColumnId;
      if (map[col]) map[col].push(task);
      else map.ideas.push(task);
    }
    return map;
  }, [filtered]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor),
  );

  const findColumn = useCallback(
    (taskId: string): ColumnId | null => {
      for (const [colId, colTasks] of Object.entries(grouped)) {
        if (colTasks.some((t) => t.id === taskId)) return colId as ColumnId;
      }
      return null;
    },
    [grouped],
  );

  function handleDragStart(event: DragStartEvent) {
    const task = filtered.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
    boardBeforeDrag.current = [...filtered];
  }

  function handleDragCancel() {
    boardBeforeDrag.current = null;
    setActiveTask(null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || !active) {
      boardBeforeDrag.current = null;
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    const sourceCol = findColumn(activeId);
    const destCol = findColumn(overId);
    if (!sourceCol || !destCol) return;

    if (sourceCol === destCol) return;

    if (isLoggedIn) {
      try {
        await taskData.tasks.update(activeId, { kanban_column: destCol });
        invalidateTaskList();
        onRefresh();
        toast.success("Task moved");
      } catch {
        toast.error("Failed to move task");
      }
    }

    setLocalTasks((prev) =>
      prev.map((t) => (t.id === activeId ? { ...t, kanban_column: destCol } : t)),
    );
    boardBeforeDrag.current = null;
  }

  return (
    <DndContext
      id="task-board"
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="relative min-h-0 min-w-0 flex-1">
        <p className="mb-2 px-4 text-[11px] text-muted-foreground md:hidden lg:px-5">
          Swipe to browse board columns
        </p>
        <div className="pointer-events-none absolute right-0 top-8 z-10 h-[calc(100%-2rem)] w-6 bg-gradient-to-l from-muted/40 to-transparent md:hidden" aria-hidden />
        <div className="scrollbar-thin min-h-0 min-w-0 flex-1 overflow-x-auto overflow-y-hidden bg-muted/25 px-3 pt-2 pb-0 scroll-smooth [scrollbar-color:var(--border)_transparent] sm:px-4 lg:px-5 lg:pt-5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:h-1.5">
          <div className="inline-grid h-full min-w-full grid-cols-[repeat(5,minmax(14rem,1fr))] gap-3 sm:grid-cols-[repeat(5,minmax(16rem,1fr))] lg:grid-cols-[repeat(5,minmax(18rem,1fr))] lg:gap-4">
          {COLUMNS.map((column) => (
            <BoardColumn key={column.id} column={column} tasks={grouped[column.id]} />
          ))}
          </div>
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {activeTask ? <BoardCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
