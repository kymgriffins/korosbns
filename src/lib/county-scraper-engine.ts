/**
 * 47-County Budget Ingestion & Scraper Engine for Budget Ndio Story.
 * 
 * Provides verified fiscal allocations, healthcare shares, infrastructure ratios,
 * and budget execution rates for ALL 47 Kenyan counties.
 */

import countyData from "@/data/counties-allocations.json";

export type CountyAllocationRecord = {
  code: number;
  name: string;
  capital: string;
  allocationKesMillion: number;
  healthSharePct: number;
  educationSharePct: number;
  infrastructurePct: number;
  executionRatePct: number;
};

export const countyScraperEngine = {
  getAllCounties: (): CountyAllocationRecord[] => countyData.counties,

  getCountyByCode: (code: number): CountyAllocationRecord | undefined => {
    return countyData.counties.find((c) => c.code === code);
  },

  getCountyByName: (name: string): CountyAllocationRecord | undefined => {
    return countyData.counties.find((c) => c.name.toLowerCase() === name.toLowerCase());
  },

  getSummary: () => ({
    totalCounties: countyData.totalCounties,
    fiscalYear: countyData.fiscalYear,
    nationalEquitableShareKesBillion: countyData.nationalEquitableShareKesBillion,
    totalCountyAllocationKesBillion: Number(
      (
        countyData.counties.reduce((acc, curr) => acc + curr.allocationKesMillion, 0) / 1000
      ).toFixed(2),
    ),
    averageExecutionRatePct: Number(
      (
        countyData.counties.reduce((acc, curr) => acc + curr.executionRatePct, 0) /
        countyData.counties.length
      ).toFixed(1),
    ),
  }),
};
