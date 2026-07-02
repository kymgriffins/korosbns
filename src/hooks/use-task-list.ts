"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { taskApi } from "@/lib/task-api";
import { taskData } from "@/data/tasks";
import { TASK_LIST_INVALIDATED_EVENT } from "@/lib/task-events";
import type { Task } from "@/types/tasks";

type FetchOptions = {
  silent?: boolean;
};

export function useTaskList(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true;
  const pathname = usePathname();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = useCallback(
    async (opts?: FetchOptions) => {
      if (!enabled) {
        setLoading(false);
        return;
      }

      if (!opts?.silent) {
        setLoading(true);
      }
      setError("");

      try {
        const data = await taskApi.listAll();
        taskData.tasks.set(data);
        setTasks(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load tasks";
        setError(message);
        setTasks([]);
      } finally {
        if (!opts?.silent) {
          setLoading(false);
        }
      }
    },
    [enabled],
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, pathname]);

  useEffect(() => {
    if (!enabled) return;

    const refresh = () => {
      void fetchTasks({ silent: true });
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    };

    window.addEventListener(TASK_LIST_INVALIDATED_EVENT, refresh);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.removeEventListener(TASK_LIST_INVALIDATED_EVENT, refresh);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [enabled, fetchTasks]);

  const upsertTask = useCallback((task: Task) => {
    setTasks((prev) => {
      const idx = prev.findIndex((t) => t.id === task.id);
      if (idx === -1) return [...prev, task];
      const next = [...prev];
      next[idx] = task;
      return next;
    });

    const cached = taskData.tasks.get();
    const idx = cached.findIndex((t) => t.id === task.id);
    if (idx === -1) {
      taskData.tasks.set([...cached, task]);
    } else {
      const next = [...cached];
      next[idx] = task;
      taskData.tasks.set(next);
    }
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    taskData.tasks.set(taskData.tasks.get().filter((t) => t.id !== id));
  }, []);

  return {
    tasks,
    setTasks,
    loading,
    error,
    fetchTasks,
    upsertTask,
    removeTask,
  };
}
