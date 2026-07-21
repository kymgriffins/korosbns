import { adminSecurityApi } from "@/lib/admin-api";
import type { SecurityInfoApi } from "@/lib/admin-api";
import { withFallback } from "@/data/adapter";

export type { SecurityInfoApi };

const DEFAULT_SECURITY: SecurityInfoApi = {
  last_audit_date: "",
  encryption: "AES-256",
  headers: {},
  dpa_status: "Not assessed",
  data_retention_days: 365,
  backup_frequency: "Daily",
};

let _cached: SecurityInfoApi = { ...DEFAULT_SECURITY };

export const adminSecurityData = {
  get: () => _cached,
  set: (data: SecurityInfoApi) => { _cached = data; },
  fetch: () =>
    withFallback(
      "admin-security",
      () => adminSecurityApi.getInfo().then((r) => {
        _cached = r;
        return r;
      }),
      () => _cached,
    ),
};
