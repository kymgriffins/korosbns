"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Ban, CheckCircle2, Clock, Download, Search, SlidersHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { financeData, type Transaction, type TransactionCategory, type TransactionStatus } from "@/data/finance";

const categoryLabels: Record<TransactionCategory, string> = {
  salary: "Salary", freelance: "Freelance", dividends: "Dividends",
  food: "Food & Dining", transport: "Transport", utilities: "Utilities",
  entertainment: "Entertainment", shopping: "Shopping", health: "Health",
  education: "Education", housing: "Housing", transfer: "Transfer",
  investment: "Investment", other: "Other",
};

const statusStyles: Record<TransactionStatus, string> = {
  completed: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  pending: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
  failed: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300",
};

const statusIcons: Record<TransactionStatus, React.ComponentType<{ className?: string }>> = {
  completed: CheckCircle2,
  pending: Clock,
  failed: Ban,
};

const ITEMS_PER_PAGE = 15;

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

type TransactionRowProps = {
  transaction: Transaction;
};

function TransactionRow({ transaction }: TransactionRowProps) {
  const StatusIcon = statusIcons[transaction.status];
  const isCredit = transaction.type === "credit";

  return (
    <div className="flex items-center gap-4 rounded-lg border border-transparent px-3 py-2.5 transition-colors hover:bg-muted/50">
      <div className={`flex size-9 shrink-0 items-center justify-center rounded-full ${isCredit ? "bg-emerald-500/10" : "bg-rose-500/10"}`}>
        {isCredit ? <ArrowDownLeft className="size-4 text-emerald-600 dark:text-emerald-400" /> : <ArrowUpRight className="size-4 text-rose-600 dark:text-rose-400" />}
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{transaction.description}</div>
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <span>{formatDate(transaction.date)}</span>
            <span>·</span>
            <span>{categoryLabels[transaction.category]}</span>
            <span>·</span>
            <span className="font-mono text-[10px]">{transaction.reference}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className={`text-right text-sm tabular-nums ${isCredit ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}>
            {isCredit ? "+" : "-"}{formatAmount(transaction.amount)}
          </div>
          <Badge variant="outline" className={`gap-1 ${statusStyles[transaction.status]}`}>
            <StatusIcon className="size-3" />
            {transaction.status}
          </Badge>
        </div>
      </div>
    </div>
  );
}

export function TransactionsTab() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    financeData.transactions.fetch().then((data) => {
      if (!cancelled) {
        setTransactions(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    let result = [...transactions];
    if (typeFilter === "credit") result = result.filter((t) => t.type === "credit");
    if (typeFilter === "debit") result = result.filter((t) => t.type === "debit");
    if (categoryFilter !== "all") result = result.filter((t) => t.category === categoryFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) =>
        t.description.toLowerCase().includes(q) ||
        t.reference.toLowerCase().includes(q)
      );
    }
    return result;
  }, [transactions, typeFilter, categoryFilter, searchQuery]);

  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const totalCredits = filtered.filter((t) => t.type === "credit").reduce((s, t) => s + t.amount, 0);
  const totalDebits = filtered.filter((t) => t.type === "debit").reduce((s, t) => s + t.amount, 0);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-3 py-2.5">
            <Skeleton className="size-9 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-64" />
            </div>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  const categories = Array.from(new Set(transactions.map((t) => t.category))).sort();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-emerald-600 dark:text-emerald-400">
            Inflow: <span className="font-medium tabular-nums">{formatAmount(totalCredits)}</span>
          </span>
          <span className="text-muted-foreground">|</span>
          <span className="text-rose-600 dark:text-rose-400">
            Outflow: <span className="font-medium tabular-nums">{formatAmount(totalDebits)}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <Download />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <InputGroup className="h-8 w-60">
          <InputGroupInput
            className="h-8"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
        <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(0); }}>
          <SelectTrigger className="w-28" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="credit">Income</SelectItem>
              <SelectItem value="debit">Expense</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(0); }}>
          <SelectTrigger className="w-36" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{categoryLabels[cat]}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {paged.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-muted-foreground text-sm">
          No transactions found.
        </div>
      ) : (
        <div className="divide-y">
          {paged.map((txn) => (
            <TransactionRow key={txn.id} transaction={txn} />
          ))}
        </div>
      )}

      {pageCount > 1 && (
        <div className="flex items-center justify-between border-border border-t pt-3">
          <span className="text-muted-foreground text-sm">
            Showing {page * ITEMS_PER_PAGE + 1}–{Math.min((page + 1) * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            {Array.from({ length: Math.min(pageCount, 5) }).map((_, i) => (
              <Button key={i} size="sm" variant={page === i ? "default" : "outline"} onClick={() => setPage(i)}>
                {i + 1}
              </Button>
            ))}
            <Button size="sm" variant="outline" disabled={page >= pageCount - 1} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
