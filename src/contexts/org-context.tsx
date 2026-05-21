"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import bnsConfig from "@/constants/bnsConfig.json";
import { citizenApi, type OrgConfigApi } from "@/lib/api-client";

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

type OrgContextValue = {
  config: OrgConfigApi;
  loading: boolean;
  showNewsletter: boolean;
  showPartners: boolean;
  refreshConfig: () => Promise<void>;
};

const OrgContext = createContext<OrgContextValue | null>(null);

export function OrgProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<OrgConfigApi>(staticFallback);
  const [loading, setLoading] = useState(true);

  const refreshConfig = useCallback(async () => {
    try {
      const data = await citizenApi.getOrgConfig();
      setConfig(data);
    } catch {
      /* keep last good config */
    }
  }, []);

  useEffect(() => {
    let alive = true;
    void (async () => {
      setLoading(true);
      try {
        const data = await citizenApi.getOrgConfig();
        if (alive) setConfig(data);
      } catch {
        if (alive) setConfig(staticFallback());
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        void refreshConfig();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [refreshConfig]);

  const value = useMemo(
    () => ({
      config,
      loading,
      showNewsletter: config.layout?.show_newsletter_signup !== false,
      showPartners: config.layout?.show_partner_carousel !== false,
      refreshConfig,
    }),
    [config, loading, refreshConfig],
  );

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
}

export function useOrg(): OrgContextValue {
  const ctx = useContext(OrgContext);
  if (!ctx) throw new Error("useOrg must be used within OrgProvider");
  return ctx;
}
