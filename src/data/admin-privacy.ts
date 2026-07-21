import { adminPrivacyApi } from "@/lib/admin-api";
import type { PrivacyConfigApi } from "@/lib/admin-api";
import { withFallback } from "@/data/adapter";

export type { PrivacyConfigApi };

const DEFAULT_PRIVACY: PrivacyConfigApi = {
  dpa_contact: "",
  data_retention_days: 365,
  cookie_policy_url: "",
  privacy_policy_url: "",
  gdpr_compliant: true,
  third_party_sharing: false,
  data_collection_purpose: "",
  last_updated: "",
};

let _cached: PrivacyConfigApi = { ...DEFAULT_PRIVACY };

export const adminPrivacyData = {
  get: () => _cached,
  set: (data: PrivacyConfigApi) => { _cached = data; },
  fetch: () =>
    withFallback(
      "admin-privacy",
      () => adminPrivacyApi.getConfig().then((r) => {
        _cached = r;
        return r;
      }),
      () => _cached,
    ),
};
