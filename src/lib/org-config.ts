import bnsConfig from "@/constants/bnsConfig.json";
import { citizenApi, type OrgConfigApi } from "@/lib/api-client";

export type { OrgConfigApi };

const CACHE_KEY = "bns_org_config_v1";

let memoryCached: OrgConfigApi | null = null;

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

/** Public org config from BNSKE with static + localStorage fallback (client) or static (SSR). */
export async function fetchPublicOrgConfig(): Promise<OrgConfigApi> {
  if (memoryCached) return memoryCached;
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) memoryCached = JSON.parse(raw) as OrgConfigApi;
    } catch {
      /* ignore */
    }
  }
  try {
    const data = await citizenApi.getOrgConfig();
    memoryCached = data;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      } catch {
        /* ignore */
      }
    }
    return data;
  } catch {
    return memoryCached ?? staticFallback();
  }
}
