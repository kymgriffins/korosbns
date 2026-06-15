export function formatKesBillions(
  value: number,
  options?: { prefix?: boolean; decimals?: number },
): string {
  const decimals = options?.decimals ?? (value >= 100 ? 1 : 2);
  const formatted = value.toLocaleString("en-KE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  const prefix = options?.prefix !== false ? "KES " : "";
  return `${prefix}${formatted}B`;
}

export function formatKesTrillions(valueBillions: number): string {
  const trillions = valueBillions / 1000;
  return `KES ${trillions.toFixed(2)}T`;
}

export function percentChange(current: number, previous: number): string {
  if (!previous) return "—";
  const pct = ((current - previous) / previous) * 100;
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}

export function shareOfTotal(part: number, total: number): string {
  if (!total) return "—";
  return `${((part / total) * 100).toFixed(1)}%`;
}
