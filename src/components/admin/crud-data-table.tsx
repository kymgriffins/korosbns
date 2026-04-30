import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ExternalLink, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export type ColumnDef<T> = {
  key: string
  header: string
  sortable?: boolean
  render?: (value: unknown, row: T, index: number) => React.ReactNode
  className?: string
}

interface CrudDataTableProps<T extends Record<string, unknown>> {
  data: T[]
  columns: ColumnDef<T>[]
  selectedIds: Set<string | number>
  onToggleSelect: (id: string | number) => void
  onSelectAll: (ids: (string | number)[]) => void
  onEdit: (row: T) => void
  onDelete?: (row: T) => void
  onView?: (row: T) => void
  extraActions?: Array<{
    label: string
    icon?: React.ComponentType<{ className?: string }>
    onClick: (row: T) => void
    variant?: "default" | "destructive"
  }>
  loading?: boolean
  emptyMessage?: string
  rowId?: keyof T | ((row: T) => string | number)
}

export function CrudDataTable<T extends Record<string, unknown>>({
  data,
  columns,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onEdit,
  onDelete,
  onView,
  extraActions,
  loading = false,
  emptyMessage = "No records found",
  rowId = "id",
}: CrudDataTableProps<T>) {
  const getRowId = (row: T): string | number => {
    if (typeof rowId === "function") {
      return rowId(row)
    }
    return row[rowId] as string | number
  }

  const allSelected = data.length > 0 && data.every((row) => selectedIds.has(getRowId(row)))
  const ids = data.map(getRowId)

  const formatCellValue = (value: unknown): string => {
    if (value === null || value === undefined) return "-"
    if (value instanceof Date) return formatDistanceToNow(value, { addSuffix: true })
    if (typeof value === "boolean") return value ? "Yes" : "No"
    if (typeof value === "object") return JSON.stringify(value)
    return String(value)
  }

  const renderCell = (column: ColumnDef<T>, row: T, index: number) => {
    const value = row[column.key]
    if (column.render) {
      return column.render(value, row, index)
    }
    return <span className={column.className}>{formatCellValue(value)}</span>
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-muted/30 animate-pulse rounded-md" />
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <span className="text-4xl">📋</span>
        </div>
        <h3 className="text-lg font-semibold">{emptyMessage}</h3>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b bg-muted/30">
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onSelectAll(ids)
                  } else {
                    onToggleSelect(ids[0]) // Clear by toggling first (will trigger clearAll)
                    selectedIds.forEach((id) => onToggleSelect(id))
                  }
                }}
                aria-label="Select all rows"
              />
            </TableHead>
            {columns.map((col) => (
              <TableHead key={col.key} className="font-semibold">
                {col.header}
              </TableHead>
            ))}
            <TableHead className="text-right w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => {
            const id = getRowId(row)
            const isSelected = selectedIds.has(id)

            return (
              <TableRow
                key={id}
                className={`group transition-colors ${
                  isSelected ? "bg-primary/5" : "hover:bg-muted/50"
                }`}
              >
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggleSelect(id)}
                    aria-label={`Select row ${id}`}
                  />
                </TableCell>
                {columns.map((col) => (
                  <TableCell key={`${id}-${col.key}`}>
                    {renderCell(col, row, index)}
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(row)}
                      title="Edit"
                    >
                      ✏️
                    </Button>
                    {onView && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(row)}
                        title="View Details"
                      >
                        <ExternalLink className="size-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(row)}
                        title="Delete"
                        className="text-destructive hover:text-destructive"
                      >
                        🗑️
                      </Button>
                    )}
                    {(extraActions && extraActions.length > 0) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {extraActions.map((action, idx) => (
                            <DropdownMenuItem
                              key={idx}
                              onClick={() => action.onClick(row)}
                              className={action.variant === "destructive" ? "text-destructive" : ""}
                            >
                              {action.icon && <action.icon className="mr-2 size-4" />}
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

// Utility: Format date nicely in table
export function formatDate(value: unknown): string {
  if (!value) return "-"
  try {
    const date = new Date(value as string)
    if (isNaN(date.getTime())) {
      return String(value)
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return String(value)
  }
}

// Utility: Render a user avatar in table
export function renderUserCell(value: unknown): React.ReactNode {
  if (!value) return <span className="text-muted-foreground">-</span>
  return (
    <div className="flex items-center gap-2">
      <Avatar className="size-6">
        <AvatarImage src={""} alt={String(value)} />
        <AvatarFallback className="text-[10px]">
          {String(value).slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span>{String(value)}</span>
    </div>
  )
}

// Utility: Render boolean as badge
export function renderBooleanCell(value: unknown): React.ReactNode {
  if (value === true) {
    return (
      <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
        Active
      </Badge>
    )
  }
  return (
    <Badge variant="secondary" className="text-muted-foreground">
      Inactive
    </Badge>
  )
}

// Utility: Render a truncated long text
export function renderTruncatedText(value: unknown, maxLength = 50): React.ReactNode {
  const str = String(value ?? "")
  if (str.length <= maxLength) return str
  return (
    <span title={str} className="truncate block max-w-xs">
      {str.slice(0, maxLength)}...
    </span>
  )
}
