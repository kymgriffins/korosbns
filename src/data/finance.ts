import { withFallback } from "@/data/adapter";

export type AccountType = "checking" | "savings" | "investment" | "credit" | "reserve";

export type FinanceAccount = {
  id: string;
  name: string;
  type: AccountType;
  accountNumber: string;
  balance: number;
  previousBalance: number;
  currency: string;
  interestRate: string;
  status: "active" | "frozen" | "closed";
  openedDate: string;
  institution: string;
};

export type TransactionCategory =
  | "salary"
  | "freelance"
  | "dividends"
  | "food"
  | "transport"
  | "utilities"
  | "entertainment"
  | "shopping"
  | "health"
  | "education"
  | "housing"
  | "transfer"
  | "investment"
  | "other";

export type TransactionStatus = "completed" | "pending" | "failed";

export type Transaction = {
  id: string;
  date: string;
  description: string;
  category: TransactionCategory;
  amount: number;
  type: "credit" | "debit";
  status: TransactionStatus;
  accountId: string;
  reference: string;
};

const seedAccounts: FinanceAccount[] = [
  { id: "acc-001", name: "Main Checking", type: "checking", accountNumber: "**** 4182", balance: 12450.60, previousBalance: 11980.25, currency: "USD", interestRate: "0.01%", status: "active", openedDate: "Jan 2020", institution: "Revolut" },
  { id: "acc-002", name: "High-Yield Savings", type: "savings", accountNumber: "**** 7721", balance: 48320.00, previousBalance: 47200.00, currency: "USD", interestRate: "4.20%", status: "active", openedDate: "Mar 2021", institution: "Ally Bank" },
  { id: "acc-003", name: "Investment Portfolio", type: "investment", accountNumber: "**** 3345", balance: 36780.00, previousBalance: 35200.00, currency: "USD", interestRate: "—", status: "active", openedDate: "Jun 2019", institution: "Vanguard" },
  { id: "acc-004", name: "Reserve Fund", type: "reserve", accountNumber: "**** 9912", balance: 27256.00, previousBalance: 27256.00, currency: "USD", interestRate: "3.50%", status: "active", openedDate: "Nov 2022", institution: "Barclays" },
  { id: "acc-005", name: "Travel Rewards Card", type: "credit", accountNumber: "**** 5601", balance: -1240.00, previousBalance: -890.00, currency: "USD", interestRate: "18.24%", status: "active", openedDate: "Feb 2023", institution: "Chase" },
  { id: "acc-006", name: "Business Account", type: "checking", accountNumber: "**** 2034", balance: 32100.00, previousBalance: 28900.00, currency: "USD", interestRate: "0.05%", status: "active", openedDate: "Aug 2018", institution: "HSBC" },
  { id: "acc-007", name: "Euro Wallet", type: "checking", accountNumber: "**** 6743", balance: 4520.00, previousBalance: 4300.00, currency: "EUR", interestRate: "0.01%", status: "active", openedDate: "May 2023", institution: "Revolut" },
  { id: "acc-008", name: "Old Savings Account", type: "savings", accountNumber: "**** 1102", balance: 0, previousBalance: 15000.00, currency: "USD", interestRate: "0.50%", status: "closed", openedDate: "Jan 2015", institution: "Wells Fargo" },
];

const transactionDescriptions: Record<TransactionCategory, string[]> = {
  salary: ["Monthly salary deposit", "Bonus payment", "Commission payout"],
  freelance: ["Web development project", "UI/UX consultation", "Content writing gig", "Contract work payment"],
  dividends: ["Stock dividend payment", "ETF distribution", "REIT income"],
  food: ["Whole Foods Market", "Trader Joe's", "Local restaurant", "Uber Eats", "Coffee shop", "Sushi bar"],
  transport: ["Uber ride", "Gas station", "Metro card top-up", "Parking fee", "Toll charge"],
  utilities: ["Electric bill", "Water bill", "Internet service", "Phone plan", "Netflix subscription"],
  entertainment: ["Movie tickets", "Concert tickets", "Streaming service", "Spotify premium", "Game purchase"],
  shopping: ["Amazon order", "Target", "Best Buy", "Clothing store", "Electronics shop", "Home goods"],
  health: ["Pharmacy", "Doctor visit", "Dental checkup", "Health insurance", "Gym membership"],
  education: ["Online course", "Bookstore", "Certification fee", "Tutorial subscription"],
  housing: ["Rent payment", "Mortgage payment", "Property tax", "Home insurance", "Maintenance fee"],
  transfer: ["Transfer to savings", "Transfer to investment", "Internal transfer", "Wire transfer"],
  investment: ["Stock purchase", "ETF buy", "Crypto purchase", "Bond purchase", "Mutual fund buy"],
  other: ["ATM withdrawal", "Miscellaneous", "Cash deposit", "Refund"],
};

function generateSeedTransactions(): Transaction[] {
  const txns: Transaction[] = [];
  const categories: TransactionCategory[] = ["salary", "freelance", "dividends", "food", "transport", "utilities", "entertainment", "shopping", "health", "education", "housing", "transfer", "investment", "other"];
  const now = new Date();
  const accountIds = ["acc-001", "acc-002", "acc-003", "acc-004", "acc-006", "acc-007"];

  for (let i = 0; i < 120; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date(now.getTime() - daysAgo * 86400000);
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const descs = transactionDescriptions[cat];
    const desc = descs[Math.floor(Math.random() * descs.length)];
    const isCredit = cat === "salary" || cat === "freelance" || cat === "dividends" || (cat === "transfer" && Math.random() > 0.5);
    const amount = isCredit
      ? Math.round((Math.random() * 5000 + 100) * 100) / 100
      : Math.round((Math.random() * 500 + 5) * 100) / 100;
    const statusRand = Math.random();
    const status: TransactionStatus = statusRand > 0.95 ? "failed" : statusRand > 0.85 ? "pending" : "completed";

    txns.push({
      id: `txn-${String(i + 1).padStart(4, "0")}`,
      date: date.toISOString(),
      description: desc,
      category: cat,
      amount,
      type: isCredit ? "credit" : "debit",
      status,
      accountId: accountIds[Math.floor(Math.random() * accountIds.length)],
      reference: `REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    });
  }

  txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return txns;
}

const seedTransactions = generateSeedTransactions();

export const financeData = {
  accounts: {
    fetch: (): Promise<FinanceAccount[]> =>
      withFallback("finance", () => Promise.resolve(seedAccounts), () => seedAccounts),
  },
  transactions: {
    fetch: (params?: { accountId?: string; category?: TransactionCategory; type?: "credit" | "debit" }): Promise<Transaction[]> =>
      withFallback("finance", () => {
        let filtered = [...seedTransactions];
        if (params?.accountId) filtered = filtered.filter((t) => t.accountId === params.accountId);
        if (params?.category) filtered = filtered.filter((t) => t.category === params.category);
        if (params?.type) filtered = filtered.filter((t) => t.type === params.type);
        return Promise.resolve(filtered);
      }, () => seedTransactions),
  },
};
