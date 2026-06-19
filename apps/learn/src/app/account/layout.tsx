import { AccountProtectedGate } from "./account-protected-gate";

export const metadata = {
  title: "Account Settings — Budget Ndio Story",
  robots: { index: false, follow: false } as const,
};

export default function LearnAccountLayout({ children }: { children: React.ReactNode }) {
  return <AccountProtectedGate>{children}</AccountProtectedGate>;
}
