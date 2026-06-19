export type DebugDomain = "Auth" | "API" | "RBAC";

export type DebugLogEntry = {
  id: string;
  domain: DebugDomain;
  message: string;
  timestamp: string;
  meta?: Record<string, unknown>;
};

const EVENT_NAME = "bns-debug-log";
const MAX_LOGS = 250;

declare global {
  interface Window {
    __BNS_DEBUG_LOGS__?: DebugLogEntry[];
  }
}

export function debugLogsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DEBUG_LOGS === "true";
}

function append(entry: DebugLogEntry): void {
  if (typeof window === "undefined") return;
  const existing = window.__BNS_DEBUG_LOGS__ ?? [];
  const next = [...existing, entry].slice(-MAX_LOGS);
  window.__BNS_DEBUG_LOGS__ = next;
  window.dispatchEvent(new CustomEvent<DebugLogEntry>(EVENT_NAME, { detail: entry }));
}

export function getExistingDebugLogs(): DebugLogEntry[] {
  if (typeof window === "undefined") return [];
  return window.__BNS_DEBUG_LOGS__ ?? [];
}

export function sanitizeToken(token: string | null | undefined): string {
  if (!token) return "none";
  if (token.length < 12) return "***";
  return `${token.slice(0, 6)}...${token.slice(-4)}`;
}

export function logDebug(
  domain: DebugDomain,
  message: string,
  meta?: Record<string, unknown>,
): void {
  const timestamp = new Date().toISOString();
  const entry: DebugLogEntry = {
    id: `${timestamp}-${Math.random().toString(36).slice(2, 8)}`,
    domain,
    message,
    timestamp,
    meta,
  };

  if (debugLogsEnabled()) {
    append(entry);
  }

  if (process.env.NODE_ENV !== "production" || debugLogsEnabled()) {
    const prefix = `[BNS:${domain}]`;
    if (meta) {
      console.log(prefix, message, meta);
    } else {
      console.log(prefix, message);
    }
  }
}

export function subscribeDebugLogs(
  listener: (entry: DebugLogEntry) => void,
): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<DebugLogEntry>;
    if (customEvent.detail) {
      listener(customEvent.detail);
    }
  };
  window.addEventListener(EVENT_NAME, handler as EventListener);
  return () => window.removeEventListener(EVENT_NAME, handler as EventListener);
}
