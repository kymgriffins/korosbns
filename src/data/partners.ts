import { withFallback } from "@/data/adapter";
import bnsConfig from "@/constants/bnsConfig.json";

export type Partner = {
  id?: string;
  name: string;
  website?: string;
  role?: string;
  logo_url?: string;
  tier?: string;
  is_active?: boolean;
};

const config = bnsConfig as {
  consortium?: {
    partners?: Partner[];
  };
};

const DEFAULT_PARTNERS: Partner[] = (config.consortium?.partners ?? []).map((p) => ({
  id: p.id,
  name: p.name,
  website: p.website,
  role: p.role,
  is_active: true,
}));

let _partners: Partner[] = [...DEFAULT_PARTNERS];

export const partnerData = {
  get: () => _partners,
  set: (items: Partner[]) => { _partners = items; },
  fetch: () =>
    withFallback(
      "partners",
      () => Promise.resolve(_partners),
      () => _partners,
    ),
};
