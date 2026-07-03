"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Building2, CreditCard, Landmark, PiggyBank, TrendingUp, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { financeData, type FinanceAccount, type AccountType } from "@/data/finance";

const accountTypeConfig: Record<AccountType, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  checking: { label: "Checking", icon: Wallet, color: "text-blue-500" },
  savings: { label: "Savings", icon: PiggyBank, color: "text-emerald-500" },
  investment: { label: "Investment", icon: TrendingUp, color: "text-purple-500" },
  credit: { label: "Credit", icon: CreditCard, color: "text-rose-500" },
  reserve: { label: "Reserve", icon: Landmark, color: "text-amber-500" },
};

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  frozen: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300",
  closed: "bg-muted text-muted-foreground",
};

function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function formatEUR(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(amount);
}

function AccountCard({ account }: { account: FinanceAccount }) {
  const config = accountTypeConfig[account.type];
  const Icon = config.icon;
  const balanceChange = account.balance - account.previousBalance;
  const changePercent = account.previousBalance !== 0
    ? ((account.balance - account.previousBalance) / Math.abs(account.previousBalance)) * 100
    : 0;
  const isPositive = balanceChange >= 0;
  const formatter = account.currency === "EUR" ? formatEUR : formatUSD;

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
            <Icon className={`size-5 ${config.color}`} />
          </div>
          <div>
            <CardTitle className="text-sm">{account.name}</CardTitle>
            <CardDescription className="text-xs">{account.accountNumber}</CardDescription>
          </div>
        </div>
        <Badge variant="outline" className={statusStyles[account.status]}>
          {account.status}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div>
          <div className="text-2xl tracking-tight">{formatter(account.balance)}</div>
          <div className="mt-1 flex items-center gap-1.5 text-xs">
            <span className={`inline-flex items-center gap-0.5 ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
              {isPositive ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
              {formatter(Math.abs(balanceChange))}
            </span>
            <span className="text-muted-foreground">({changePercent.toFixed(1)}%) vs last month</span>
          </div>
        </div>
        <div className="flex items-center justify-between border-border border-t pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Building2 className="size-3" />
            {account.institution}
          </span>
          {account.interestRate !== "—" && (
            <span className="flex items-center gap-1">
              <ArrowUpDown className="size-3" />
              {account.interestRate} APY
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function AccountsTab() {
  const [accounts, setAccounts] = useState<FinanceAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    financeData.accounts.fetch().then((data) => {
      if (!cancelled) {
        setAccounts(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const filtered = filter === "all" ? accounts : accounts.filter((a) => a.type === filter);
  const activeAccounts = filtered.filter((a) => a.status === "active");
  const closedAccounts = filtered.filter((a) => a.status === "closed");

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-lg" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-5 w-14 rounded-full" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-px w-full" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">{activeAccounts.length} active accounts</p>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-36" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="checking">Checking</SelectItem>
              <SelectItem value="savings">Savings</SelectItem>
              <SelectItem value="investment">Investment</SelectItem>
              <SelectItem value="credit">Credit</SelectItem>
              <SelectItem value="reserve">Reserve</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {activeAccounts.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {activeAccounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      )}

      {closedAccounts.length > 0 && (
        <>
          <h3 className="pt-2 font-medium text-muted-foreground text-sm">Closed Accounts</h3>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {closedAccounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
