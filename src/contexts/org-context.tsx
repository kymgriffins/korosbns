"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import bnsConfig from "@/constants/bnsConfig.json";
import { citizenApi, type OrgConfigApi } from "@/lib/api-client";

const ORG_CONFIG_KEY = ["org", "config"];

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
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ORG_CONFIG_KEY,
    queryFn: () => citizenApi.getOrgConfig(),
    staleTime: 1000 * 60 * 30,
    retry: 1,
  });

  const config = data ?? staticFallback();

  const refreshConfig = async () => {
    await queryClient.invalidateQueries({ queryKey: ORG_CONFIG_KEY });
  };

  const value = useMemo(
    () => ({
      config,
      loading: isLoading,
      showNewsletter: config.layout?.show_newsletter_signup !== false,
      showPartners: config.layout?.show_partner_carousel !== false,
      refreshConfig,
    }),
    [config, isLoading, refreshConfig],
  );

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
}

export function useOrg(): OrgContextValue {
  const ctx = useContext(OrgContext);
  if (!ctx) throw new Error("useOrg must be used within OrgProvider");
  return ctx;
}
