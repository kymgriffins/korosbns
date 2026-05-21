"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import bnsConfig from "@/constants/bnsConfig.json";
import { citizenApi, type OrgConfigApi } from "@/lib/api-client";

const CACHE_KEY = "bns_org_config_v1";

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
    socials: [],
    partners: [],
  };
}

function readCache(): OrgConfigApi | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as OrgConfigApi) : null;
  } catch {
    return null;
  }
}

function writeCache(config: OrgConfigApi): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(config));
  } catch {
    /* ignore quota */
  }
}

type OrgContextValue = {
  config: OrgConfigApi;
  loading: boolean;
  showNewsletter: boolean;
  showPartners: boolean;
};

const OrgContext = createContext<OrgContextValue | null>(null);

export function OrgProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<OrgConfigApi>(() => readCache() ?? staticFallback());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    void citizenApi
      .getOrgConfig()
      .then((data) => {
        if (!alive) return;
        setConfig(data);
        writeCache(data);
      })
      .catch(() => {
        if (!alive) return;
        const cached = readCache();
        if (cached) setConfig(cached);
        else setConfig(staticFallback());
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      config,
      loading,
      showNewsletter: config.layout?.show_newsletter_signup !== false,
      showPartners: config.layout?.show_partner_carousel !== false,
    }),
    [config, loading],
  );

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
}

export function useOrg(): OrgContextValue {
  const ctx = useContext(OrgContext);
  if (!ctx) throw new Error("useOrg must be used within OrgProvider");
  return ctx;
}
