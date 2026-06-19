import "@/app/globals.css";

export default function BudgethubLayout({ children }: { children: React.ReactNode }) {
  return <div data-budgethub-theme>{children}</div>;
}
