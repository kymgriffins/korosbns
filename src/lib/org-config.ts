import bnsConfig from "@/constants/bnsConfig.json";
import { citizenApi, type OrgConfigApi } from "@/lib/api-client";

export type { OrgConfigApi };

const CACHE_KEY = "bns_org_config_v2";
const CACHE_TS_KEY = "bns_org_config_v2_ts";
/** Offline fallback only — never preferred over a successful API response. */
const OFFLINE_MAX_AGE_MS = 5 * 60 * 1000;

function staticFallback(): OrgConfigApi {
  return {
    tagline: bnsConfig.tagline,
    mission: bnsConfig.mission,
    vision: (bnsConfig as { vision?: string }).vision,
    seo: {
      title: bnsConfig.legalName,
      description: bnsConfig.overview,
    },
    layout: {
      show_newsletter_signup: true,
      show_partner_carousel: true,
      footer_note: bnsConfig.tagline,
    },
  };
}

function readOfflineCache(): OrgConfigApi | null {
  if (typeof window === "undefined") return null;
  try {
    const ts = Number(localStorage.getItem(CACHE_TS_KEY) || "0");
    if (!ts || Date.now() - ts > OFFLINE_MAX_AGE_MS) return null;
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as OrgConfigApi) : null;
  } catch {
    return null;
  }
}

function writeOfflineCache(config: OrgConfigApi): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(config));
    localStorage.setItem(CACHE_TS_KEY, String(Date.now()));
  } catch {
    /* ignore quota */
  }
}

/** Always hits the network first; uses short-lived offline cache only on failure. */
export async function fetchPublicOrgConfig(): Promise<OrgConfigApi> {
  try {
    const data = await citizenApi.getOrgConfig();
    writeOfflineCache(data);
    return data;
  } catch {
    return readOfflineCache() ?? staticFallback();
  }
}
