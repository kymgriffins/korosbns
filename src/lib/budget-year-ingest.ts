/**
 * Honest SOURCE_LISTED catalogue for CBK/Treasury ingest scaffolding (2013/14–2024/25).
 * No invented figures — stubs point at official portals only.
 */

import stubsFile from "../../audit/data/budget-year-ingest-stubs.json";

export type IngestPortal = {
  id: string;
  name: string;
  url: string;
};

export type YearIngestStub = {
  status: "SOURCE_LISTED";
  era: string;
  note: string;
  seed_available: boolean;
  source_hints: string[];
  comparison_mentioned_in?: string[];
};

type StubsFile = {
  version: number;
  ingest_targets: {
    from_fy: string;
    to_fy: string;
    status: string;
    primary_portals: IngestPortal[];
  };
  years: Record<string, YearIngestStub>;
};

const FILE = stubsFile as StubsFile;

export function listIngestPortals(): IngestPortal[] {
  return FILE.ingest_targets.primary_portals;
}

export function getYearIngestStub(fyId: string): YearIngestStub | undefined {
  return FILE.years[fyId];
}

export function listIngestStubYears(): string[] {
  return Object.keys(FILE.years).sort();
}

export function portalsForYear(fyId: string): IngestPortal[] {
  const stub = getYearIngestStub(fyId);
  const all = listIngestPortals();
  if (!stub?.source_hints?.length) return all;
  const matched = stub.source_hints
    .map((id) => all.find((p) => p.id === id))
    .filter(Boolean) as IngestPortal[];
  return matched.length ? matched : all;
}
