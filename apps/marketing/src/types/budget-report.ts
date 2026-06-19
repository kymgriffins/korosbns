export type BudgetKpi = {
  key: string;
  label: string;
  value: number;
  unit?: "B" | "T" | "%" | "M";
  prefix?: string;
  suffix?: string;
  previous?: number;
  trend?: "up" | "down" | "flat";
  description?: string;
};

export type BudgetChartPoint = {
  name: string;
  value: number;
  fill?: string;
  previous?: number;
};

export type BudgetComparisonRow = {
  label: string;
  fy2025: string;
  fy2026: string;
  change: string;
  highlight?: boolean;
};

export type BudgetCallout = {
  type: "info" | "warning" | "success" | "trend";
  title: string;
  text: string;
};

export type BudgetReportSection = {
  id: string;
  title: string;
  content: string;
};

export type BudgetChartConfig = {
  type: "bar" | "pie" | "line" | "area";
  title: string;
  subtitle?: string;
  data: BudgetChartPoint[];
  valueLabel?: string;
};

export type BudgetReportProfile = {
  fiscal_year: string;
  fiscal_year_previous?: string;
  presented_date?: string;
  approved_date?: string;
  presented_by?: string;
  theme?: string;
  executive_summary?: string;
  source?: string;
  kpis?: BudgetKpi[];
  sector_chart?: BudgetChartPoint[];
  revenue_chart?: BudgetChartPoint[];
  expenditure_chart?: BudgetChartPoint[];
  comparison_rows?: BudgetComparisonRow[];
  highlights?: BudgetCallout[];
};

export type ChapterReportData = {
  kpis?: BudgetKpi[];
  chart?: BudgetChartConfig;
  comparison_rows?: BudgetComparisonRow[];
  callouts?: BudgetCallout[];
  sections?: BudgetReportSection[];
};
