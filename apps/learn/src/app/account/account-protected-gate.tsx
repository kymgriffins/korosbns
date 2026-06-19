"use client";

import { useAuth } from "@/contexts/auth-context";

export function AccountProtectedGate({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isLoggedIn) return <div>Please sign in to access your account settings.</div>;

  return <>{children}</>;
}
