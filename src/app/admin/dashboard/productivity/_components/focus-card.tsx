"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { BellOff, Pause, Play } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { taskApi } from "@/lib/task-api";

export function FocusCard() {
  const [active, setActive] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [duration] = useState(90 * 60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    taskApi.getActiveFocusSession().then((res) => {
      if (res.active && res.id) {
        setActive(true);
        setSessionId(res.id);
        if (res.started_at) {
          const started = new Date(res.started_at).getTime();
          const now = Date.now();
          setElapsed(Math.floor((now - started) / 1000));
        }
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (active) {
      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [active]);

  const remaining = Math.max(0, duration - elapsed);
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const display = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  const handleStart = useCallback(async () => {
    try {
      const res = await taskApi.startFocusSession(undefined, duration);
      setActive(true);
      setSessionId(res.id);
      setElapsed(0);
      toast.success("Focus session started");
    } catch {
      toast.error("Failed to start focus session");
    }
  }, [duration]);

  const handleStop = useCallback(async () => {
    if (!sessionId) return;
    try {
      await taskApi.stopFocusSession(sessionId);
      setActive(false);
      setSessionId(null);
      setElapsed(0);
      toast.success("Focus session completed");
    } catch {
      toast.error("Failed to stop focus session");
    }
  }, [sessionId]);

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>Focus</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <div className="text-3xl tracking-tight font-mono">{display}</div>
            {active ? (
              <Button variant="outline" onClick={handleStop}>
                <Pause className="mr-1.5 size-3.5" />
                Stop
              </Button>
            ) : (
              <Button onClick={handleStart}>
                <Play className="mr-1.5 size-3.5" />
                Start
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <BellOff className="size-3" />
            <span>{active ? "In progress" : "Ready"} · Full focus</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
