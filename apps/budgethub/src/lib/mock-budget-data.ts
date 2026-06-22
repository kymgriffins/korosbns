import { COUNTIES } from "@/constants/counties";
import type {
  BudgetFiscalYear,
  BudgetAllocation,
  BudgetEntity,
  BudgetKpiRaw,
  BudgetHighlightRaw,
} from "@/lib/budget-api";

// ─── County population weighting (2025 estimates in millions) ───
const COUNTY_POPULATION: Record<string, number> = {
  Nairobi: 5.34, Kiambu: 2.5, Nakuru: 2.2, Kakamega: 2.0, Bungoma: 1.8,
  Kisumu: 1.6, Mombasa: 1.5, Machakos: 1.5, Meru: 1.4, Kilifi: 1.4,
  Mandera: 1.3, Garissa: 1.3, Turkana: 1.2, Kitui: 1.2, Kisii: 1.1,
  Migori: 1.0, HomaBay: 1.0, UasinGishu: 1.0, Narok: 1.0, Kajiado: 0.9,
  Muranga: 0.9, Kericho: 0.9, Nyeri: 0.8, Makueni: 0.8, Kwale: 0.8,
  Marsabit: 0.7, Busia: 0.7, Siaya: 0.7, Baringo: 0.7, WestPokot: 0.6,
  Laikipia: 0.6, Nandi: 0.6, TanaRiver: 0.5, TharakaNithi: 0.5,
  Embu: 0.5, Bomet: 0.5, Vihiga: 0.5, Nyandarua: 0.5, Isiolo: 0.4,
  Lamu: 0.3, Samburu: 0.3, TransNzoia: 0.9, ElgeyoMarakwet: 0.4,
  TaitaTaveta: 0.4, Wajir: 1.1, Kirinyaga: 0.6, Nyamira: 0.6,
};

function pop(county: string): number {
  return COUNTY_POPULATION[county] ?? 0.5;
}

// ─── Helpers ───
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randFloat(min: number, max: number, decimals = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

// ─── Fiscal Years ───
const FISCAL_YEARS: BudgetFiscalYear[] = [
  { id: "fy2023", fiscal_year: 2023, label: "FY 2023/24", starts_at: "2023-07-01", ends_at: "2024-06-30", is_current: false },
  { id: "fy2024", fiscal_year: 2024, label: "FY 2024/25", starts_at: "2024-07-01", ends_at: "2025-06-30", is_current: false },
  { id: "fy2025", fiscal_year: 2025, label: "FY 2025/26", starts_at: "2025-07-01", ends_at: "2026-06-30", is_current: true },
];

// ─── National Sectors ───
const NATIONAL_SECTORS = [
  "Education", "Health", "Infrastructure", "Agriculture", "Defence",
  "Energy", "Water & Sanitation", "Social Protection", "Trade & Industry", "Environment",
];

// ─── National Entity (one per sector) ───
function buildNationalEntities(): BudgetEntity[] {
  return NATIONAL_SECTORS.map((s, i) => ({
    id: `nat-${String(i + 1).padStart(3, "0")}`,
    type: "national",
    code: `NAT-${String(i + 1).padStart(2, "0")}`,
    name: `Ministry of ${s}`,
    parent: null,
    gfs_code: `N${String(i + 1).padStart(3, "0")}`,
    is_active: true,
    sort_order: i + 1,
  }));
}

// ─── County Sectors (subset) ───
const COUNTY_SECTORS = [
  "County Administration", "Agriculture & Livestock", "Health Services", "Infrastructure & Transport",
  "Water & Environment", "Education & VTC", "Trade & Cooperatives", "Social Services",
  "Youth & Sports", "Public Works",
];

// ─── Constituency & Ward generation ───
const CONSTITUENCY_SUFFIXES = [
  "Central", "North", "South", "East", "West", "Town", "Rural", "Constituency",
];
const WARD_PREFIXES = [
  "Upper", "Lower", "Central", "North", "South", "East", "West",
];

function buildConstituencies(countyName: string, count: number): string[] {
  const names: string[] = [];
  for (let i = 0; i < count; i++) {
    const suffix = CONSTITUENCY_SUFFIXES[i % CONSTITUENCY_SUFFIXES.length];
    names.push(`${countyName} ${suffix}`);
  }
  return names;
}

function buildWards(constituencyName: string, count: number): string[] {
  const names: string[] = [];
  for (let i = 0; i < count; i++) {
    const prefix = WARD_PREFIXES[i % WARD_PREFIXES.length];
    names.push(`${prefix} ${constituencyName} Ward`);
  }
  return names;
}

// ─── Build all entities ───
function buildAllEntities(): BudgetEntity[] {
  const entities: BudgetEntity[] = [];
  let sortOrder = 0;

  // National
  for (const e of buildNationalEntities()) {
    e.sort_order = sortOrder++;
    entities.push(e);
  }

  // Counties + Constituencies + Wards
  const seeded = new Date().getDate(); // deterministic-ish per day

  for (let ci = 0; ci < COUNTIES.length; ci++) {
    const county = COUNTIES[ci];
    const popFactor = pop(county);
    const countyId = `county-${String(ci + 1).padStart(2, "0")}`;

    // County entity
    entities.push({
      id: countyId,
      type: "county",
      code: `CG-${String(ci + 1).padStart(2, "0")}`,
      name: `${county} County Government`,
      parent: null,
      gfs_code: `C${String(ci + 1).padStart(3, "0")}`,
      is_active: true,
      sort_order: sortOrder++,
    });

    // Constituencies (6-10 per county based on population)
    const numConstituencies = Math.max(6, Math.min(10, Math.round(popFactor * 8)));
    const constituencies = buildConstituencies(county, numConstituencies);

    for (let wci = 0; wci < constituencies.length; wci++) {
      const constId = `const-${String(ci + 1).padStart(2, "0")}-${String(wci + 1).padStart(2, "0")}`;
      entities.push({
        id: constId,
        type: "constituency",
        code: `CONST-${String(ci + 1).padStart(2, "0")}-${String(wci + 1).padStart(2, "0")}`,
        name: constituencies[wci],
        parent: countyId,
        gfs_code: `CN${String(ci + 1).padStart(3, "0")}${String(wci + 1).padStart(2, "0")}`,
        is_active: true,
        sort_order: sortOrder++,
      });

      // Wards (4-6 per constituency)
      const numWards = (seeded + wci + ci) % 3 + 4;
      const wards = buildWards(constituencies[wci], numWards);
      for (let wdi = 0; wdi < wards.length; wdi++) {
        entities.push({
          id: `ward-${String(ci + 1).padStart(2, "0")}-${String(wci + 1).padStart(2, "0")}-${String(wdi + 1).padStart(2, "0")}`,
          type: "ward",
          code: `WARD-${String(ci + 1).padStart(2, "0")}-${String(wci + 1).padStart(2, "0")}-${String(wdi + 1).padStart(2, "0")}`,
          name: wards[wdi],
          parent: constId,
          gfs_code: `WD${String(ci + 1).padStart(3, "0")}${String(wci + 1).padStart(2, "0")}${String(wdi + 1).padStart(2, "0")}`,
          is_active: true,
          sort_order: sortOrder++,
        });
      }
    }
  }

  return entities;
}

let cachedEntities: BudgetEntity[] | null = null;
function getEntities(): BudgetEntity[] {
  if (!cachedEntities) cachedEntities = buildAllEntities();
  return cachedEntities;
}

// ─── Build Allocations ───
function buildAllocations(fiscalYearId: string, entityId: string, entityName: string, entityType: string): BudgetAllocation[] {
  const isNational = entityType === "national";
  const isCounty = entityType === "county";
  const isConstituency = entityType === "constituency";
  const isWard = entityType === "ward";

  // Base amount in KES (full budget)
  const sectors = isNational ? NATIONAL_SECTORS : COUNTY_SECTORS;

  return sectors.map((sector, i) => {
    let baseAmount: number;
    if (isNational) {
      baseAmount = randFloat(80, 600, 1) * 1e9; // billions
    } else if (isCounty) {
      const popFactor = pop(entityName.replace(" County Government", ""));
      baseAmount = randFloat(2, 15, 1) * popFactor * 1e9;
    } else if (isConstituency) {
      baseAmount = randFloat(50, 400, 0) * 1e6; // millions
    } else {
      baseAmount = randFloat(5, 60, 0) * 1e6; // smaller for wards
    }

    const sectorWeight = 1 + ((i % 3) * 0.15);
    const amount = Math.round(baseAmount * sectorWeight);
    const prevAmount = Math.round(amount * randFloat(0.88, 1.12));
    const prevYear = fiscalYearId === "fy2023" ? null : fiscalYearId;

    return {
      id: `alloc-${fiscalYearId}-${entityId}-${i}`,
      fiscal_year: fiscalYearId,
      fiscal_year_label: FISCAL_YEARS.find((fy) => fy.id === fiscalYearId)?.label ?? "",
      entity: entityId,
      entity_name: `${entityName} - ${sector}`,
      entity_type: entityType,
      allocation_type: "approved" as const,
      amount: String(amount),
      amount_previous: prevYear ? String(prevAmount) : null,
      notes: "",
    };
  });
}

// ─── Build KPIs ───
function buildKpis(fiscalYearId: string, entityId: string, entityName: string): BudgetKpiRaw[] {
  const isNational = entityId.startsWith("nat");
  let totalBudget: number;

  if (isNational) {
    totalBudget = randInt(3500, 4200) * 1e9; // ~3.5-4.2T KES
  } else {
    const county = entityName.replace(" County Government", "");
    totalBudget = Math.round(pop(county) * randFloat(8, 20, 1) * 1e9);
  }

  const revenue = Math.round(totalBudget * randFloat(0.82, 0.95));
  const expenditure = Math.round(totalBudget * randFloat(0.88, 0.98));

  return [
    {
      id: `kpi-${fiscalYearId}-${entityId}-total`,
      fiscal_year: fiscalYearId,
      entity: entityId,
      entity_name: entityName,
      key: "total_budget",
      label: "Total Budget",
      value: String(totalBudget),
      previous_value: String(Math.round(totalBudget * randFloat(0.9, 1.05))),
      trend: "up" as const,
      suffix: "",
      description: `Total approved budget for ${entityName}`,
      sort_order: 1,
    },
    {
      id: `kpi-${fiscalYearId}-${entityId}-revenue`,
      fiscal_year: fiscalYearId,
      entity: entityId,
      entity_name: entityName,
      key: "total_revenue",
      label: "Total Revenue",
      value: String(revenue),
      previous_value: String(Math.round(revenue * randFloat(0.9, 1.05))),
      trend: revenue >= totalBudget * 0.9 ? "up" as const : "flat" as const,
      suffix: "",
      description: `Total projected revenue for ${entityName}`,
      sort_order: 2,
    },
    {
      id: `kpi-${fiscalYearId}-${entityId}-expenditure`,
      fiscal_year: fiscalYearId,
      entity: entityId,
      entity_name: entityName,
      key: "total_expenditure",
      label: "Total Expenditure",
      value: String(expenditure),
      previous_value: String(Math.round(expenditure * randFloat(0.9, 1.05))),
      trend: expenditure > revenue ? "down" as const : "up" as const,
      suffix: "",
      description: `Total projected expenditure for ${entityName}`,
      sort_order: 3,
    },
  ];
}

// ─── Build Highlights ───
function buildHighlights(fiscalYearId: string): BudgetHighlightRaw[] {
  return [
    {
      id: `hl-${fiscalYearId}-1`,
      fiscal_year: fiscalYearId,
      entity: null,
      entity_name: "National Government",
      type: "trend" as const,
      title: "Budget Size",
      text: `Total national budget shows moderate growth compared to previous fiscal year, with increased allocations to infrastructure and health sectors.`,
      sort_order: 1,
    },
    {
      id: `hl-${fiscalYearId}-2`,
      fiscal_year: fiscalYearId,
      entity: null,
      entity_name: "National Government",
      type: "success" as const,
      title: "Revenue Collection",
      text: `Domestic revenue collection has improved, driven by enhanced tax administration and compliance measures across all counties.`,
      sort_order: 2,
    },
    {
      id: `hl-${fiscalYearId}-3`,
      fiscal_year: fiscalYearId,
      entity: null,
      entity_name: "National Government",
      type: "warning" as const,
      title: "Fiscal Deficit",
      text: `The fiscal deficit remains elevated at an estimated 5.5% of GDP, necessitating continued borrowing from domestic and external sources.`,
      sort_order: 3,
    },
  ];
}

// ─── Cache for allocations (one per fiscal year) ───
const allocCache: Record<string, BudgetAllocation[]> = {};
const kpiCache: Record<string, BudgetKpiRaw[]> = {};

function ensureData(year: string) {
  if (allocCache[year]) return;

  const entities = getEntities();
  const allAllocs: BudgetAllocation[] = [];
  const allKpis: BudgetKpiRaw[] = [];

  for (const entity of entities) {
    const allocs = buildAllocations(year, entity.id, entity.name, entity.type);
    allAllocs.push(...allocs);
    // Only KPIs for national & county level
    if (entity.type === "national" || entity.type === "county") {
      const kpis = buildKpis(year, entity.id, entity.name);
      allKpis.push(...kpis);
    }
  }

  allocCache[year] = allAllocs;
  kpiCache[year] = allKpis;
}

// ══════════════════════════════════════════════════════════════════
// Public API — mirrors @/lib/budget-api signatures
// ══════════════════════════════════════════════════════════════════

export function mockFetchBudgetFiscalYears(): Promise<BudgetFiscalYear[]> {
  return Promise.resolve(FISCAL_YEARS);
}

export function mockFetchBudgetEntities(): Promise<BudgetEntity[]> {
  return Promise.resolve(getEntities());
}

export function mockFetchBudgetAllocations(params?: {
  fiscal_year?: string;
  entity?: string;
  allocation_type?: string;
}): Promise<BudgetAllocation[]> {
  const year = params?.fiscal_year || "fy2025";
  ensureData(year);

  let result = allocCache[year] || [];
  if (params?.entity) {
    // Return allocations for the entity or any of its children (constituencies/wards)
    result = result.filter((a) => a.entity === params.entity);
  }
  if (params?.allocation_type) {
    result = result.filter((a) => a.allocation_type === params.allocation_type);
  }
  return Promise.resolve(result);
}

export function mockFetchBudgetKpis(params?: {
  fiscal_year?: string;
  entity?: string;
}): Promise<BudgetKpiRaw[]> {
  const year = params?.fiscal_year || "fy2025";
  ensureData(year);

  let result = kpiCache[year] || [];
  if (params?.entity) {
    result = result.filter((k) => k.entity === params.entity);
  }
  return Promise.resolve(result);
}

export function mockFetchBudgetHighlights(params?: {
  fiscal_year?: string;
}): Promise<BudgetHighlightRaw[]> {
  const year = params?.fiscal_year || "fy2025";
  return Promise.resolve(buildHighlights(year));
}

// ─── Stats for UI display ───
export function getMockStats() {
  const entities = getEntities();
  return {
    totalEntities: entities.length,
    national: entities.filter((e) => e.type === "national").length,
    counties: entities.filter((e) => e.type === "county").length,
    constituencies: entities.filter((e) => e.type === "constituency").length,
    wards: entities.filter((e) => e.type === "ward").length,
  };
}
