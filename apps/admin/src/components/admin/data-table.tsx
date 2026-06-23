"use client";

import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  cell: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onCreate?: () => void;
  createLabel?: string;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onRefresh?: () => void;
}

export function DataTable<T>({
  columns,
  data,
  loading,
  error,
  emptyMessage = "No items found.",
  searchable,
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  onCreate,
  createLabel = "Create",
  page,
  totalPages,
  onPageChange,
}: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      {(searchable || onCreate) && (
        <div className="flex items-center justify-between gap-4">
          {searchable && (
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue ?? ""}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-8"
              />
            </div>
          )}
          {onCreate && (
            <Button onClick={onCreate} size="sm">
              <Plus className="mr-1.5 size-4" />
              {createLabel}
            </Button>
          )}
        </div>
      )}

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>{col.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-8 text-center text-sm text-destructive">
                  {error}
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-8 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, idx) => (
                <TableRow key={idx}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className={cn("py-3", col.className)}>
                      {col.cell(item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {page !== undefined && totalPages !== undefined && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange?.(page - 1)}>
              <ChevronLeft className="size-4" />
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange?.(page + 1)}>
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
