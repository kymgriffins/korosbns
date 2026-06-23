function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeCsv(val: unknown): string {
  const s = val == null ? "" : String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function exportTasksAsCsv<T extends Record<string, unknown>>(
  rows: T[],
  columns: { key: keyof T; label: string }[],
  filename = "tasks.csv",
) {
  const header = columns.map((c) => escapeCsv(c.label)).join(",");
  const body = rows
    .map((row) => columns.map((c) => escapeCsv(row[c.key])).join(","))
    .join("\n");
  downloadBlob(`${header}\n${body}`, filename, "text/csv;charset=utf-8;");
}

export function exportTasksAsJson<T>(data: T[], filename = "tasks.json") {
  downloadBlob(JSON.stringify(data, null, 2), filename, "application/json");
}
