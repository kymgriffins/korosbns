import React from "react";

export interface Column<T> {
  key: string;
  header: string;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  error?: string;
  searchable?: boolean;
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  onCreate?: () => void;
  createLabel?: string;
  page?: number;
  totalPages?: number;
  onPageChange?: (p: number) => void;
}

export function DataTable<T>({ columns, data, loading, error }: DataTableProps<T>) {
  if (loading) return <div data-testid="data-table-loading">Loading...</div>;
  if (error) return <div data-testid="data-table-error">{error}</div>;
  return (
    <div data-testid="data-table">
      <table><thead><tr>{columns.map((c) => <th key={c.key}>{c.header}</th>)}</tr></thead>
      <tbody>{data.map((item: any, i: number) => <tr key={i}>{columns.map((c) => <td key={c.key} className={c.className}>{c.cell ? c.cell(item) : String(item[c.key] ?? "")}</td>)}</tr>)}</tbody></table>
    </div>
  );
}
