import episodesFile from "../../apps/budgethub/src/data/budget-fy-episodes.json";
import type { YearVerificationStatus } from "@/lib/budget-sources";
import { verificationBadgeText } from "@/data/budget-years-catalogue";

export type EpisodeSource = {
  name: string;
  url: string;
  org: string;
};

export type EpisodeMetrics = {
  total_expenditure_billions: number;
  total_revenue_billions: number;
  deficit_billions: number;
  deficit_gdp_pct: number;
  recurrent_billions: number | null;
  development_billions: number | null;
  debt_interest_billions: number | null;
};

export type EpisodeSector = {
  name: string;
  value_billions: number;
};

export type CitizenImpactBlurb = {
  title: string;
  text: string;
};

export type CitizenImpactBlock = {
  title: string;
  source_note: string;
  blurbs: CitizenImpactBlurb[];
};

export type FyEpisode = {
  fy: string;
  status: YearVerificationStatus;
  theme: string;
  presented_by: string;
  presented_date: string;
  approved_date: string;
  seed_key: string;
  provenance_level: number;
  sources: EpisodeSource[];
  metrics: EpisodeMetrics;
  top_sectors: EpisodeSector[];
  synopsis: string;
  citizen_impact: CitizenImpactBlock | null;
};

type EpisodesFile = {
  version: number;
  episodes: Record<string, FyEpisode>;
};

const FILE = episodesFile as EpisodesFile;

export function getFyEpisode(fyId: string): FyEpisode | undefined {
  return FILE.episodes[fyId];
}

export function listInAppEpisodes(): FyEpisode[] {
  return Object.values(FILE.episodes).filter((e) => e.status === "IN_APP");
}

export function episodeVerificationBadge(episode: FyEpisode): string {
  return verificationBadgeText(episode.status);
}
