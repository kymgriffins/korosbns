"use client";

import { useEffect, useMemo, useState } from "react";

import {
  debugLogsEnabled,
  getExistingDebugLogs,
  subscribeDebugLogs,
  type DebugLogEntry,
} from "@/lib/debug-logs";

export function DebugLogPanel() {
  const [logs, setLogs] = useState<DebugLogEntry[]>([]);

  useEffect(() => {
    if (!debugLogsEnabled()) return;
    setLogs(getExistingDebugLogs());
    return subscribeDebugLogs((entry) => {
      setLogs((current) => [...current, entry].slice(-250));
    });
  }, []);

  const visible = useMemo(() => debugLogsEnabled(), []);
  if (!visible) return null;

  return (
    <aside className="fixed bottom-4 right-4 z-[70] flex h-64 w-[30rem] max-w-[92vw] flex-col rounded-md border bg-black/85 p-2 text-xs text-green-200 shadow-2xl">
      <p className="mb-2 border-b border-green-400/30 pb-1 font-semibold">
        BNS Debug Logs ({logs.length})
      </p>
      <div className="space-y-1 overflow-y-auto pr-1">
        {logs.map((entry) => (
          <div key={entry.id} className="rounded bg-black/40 px-2 py-1">
            <p className="font-mono text-[10px] text-green-300/90">
              {new Date(entry.timestamp).toLocaleTimeString()} [{entry.domain}]
            </p>
            <p>{entry.message}</p>
            {entry.meta ? (
              <pre className="mt-1 overflow-x-auto whitespace-pre-wrap text-[10px] text-green-100/80">
                {JSON.stringify(entry.meta)}
              </pre>
            ) : null}
          </div>
        ))}
      </div>
    </aside>
  );
}
