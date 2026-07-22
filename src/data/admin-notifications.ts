import { adminNotificationsApi, adminAuditLogsApi } from "@/lib/admin-api";
import type { NotificationQueueItem, TriggerRule, AuditLogEntry } from "@/lib/admin-api";
import { withFallback } from "@/data/adapter";
import { normalizeListResponse } from "@/lib/admin-api";

export type { NotificationQueueItem, TriggerRule, AuditLogEntry };

let _queue: NotificationQueueItem[] = [];
let _history: NotificationQueueItem[] = [];
let _triggerRules: TriggerRule[] = [];
let _auditLogs: AuditLogEntry[] = [];

export const adminNotificationsData = {
  queue: {
    get: () => _queue,
    set: (items: NotificationQueueItem[]) => { _queue = items; },
    fetch: (params?: { page?: number; status?: string; trigger_type?: string }) =>
      withFallback(
        "admin-notifications",
        () => adminNotificationsApi.queue(params).then((r) => {
          const { results } = normalizeListResponse(r);
          _queue = results;
          return results;
        }),
        () => _queue,
      ),
  },
  history: {
    get: () => _history,
    set: (items: NotificationQueueItem[]) => { _history = items; },
    fetch: (params?: { page?: number; status?: string; trigger_type?: string }) =>
      withFallback(
        "admin-notifications",
        () => adminNotificationsApi.history(params).then((r) => {
          const { results } = normalizeListResponse(r);
          _history = results;
          return results;
        }),
        () => _history,
      ),
  },
  triggerRules: {
    get: () => _triggerRules,
    set: (items: TriggerRule[]) => { _triggerRules = items; },
    fetch: () =>
      withFallback(
        "admin-notifications",
        () => adminNotificationsApi.triggerRules().then((r) => {
          const { results } = normalizeListResponse(r);
          _triggerRules = results;
          return results;
        }),
        () => _triggerRules,
      ),
    toggle: (id: string, enabled: boolean) =>
      withFallback(
        "admin-notifications",
        () => adminNotificationsApi.toggleRule(id, enabled).then((r) => {
          const idx = _triggerRules.findIndex((t) => t.id === id);
          if (idx !== -1) _triggerRules[idx] = { ..._triggerRules[idx], enabled: r.enabled };
          return r;
        }),
        () => {
          const idx = _triggerRules.findIndex((t) => t.id === id);
          if (idx !== -1) _triggerRules[idx] = { ..._triggerRules[idx], enabled };
          return _triggerRules[idx] ?? null;
        },
      ),
  },
  auditLogs: {
    get: () => _auditLogs,
    set: (items: AuditLogEntry[]) => { _auditLogs = items; },
    fetch: (params?: { page?: number; q?: string; action?: string; target_model?: string }) =>
      withFallback(
        "admin-notifications",
        () => adminAuditLogsApi.list(params).then((r) => {
          const { results } = normalizeListResponse(r);
          _auditLogs = results;
          return results;
        }),
        () => _auditLogs,
      ),
  },
};
