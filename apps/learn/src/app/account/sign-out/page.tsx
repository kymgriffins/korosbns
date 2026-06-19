"use client";

import { useAuth } from "@/contexts/auth-context";

export default function SignOutPage() {
  const { logout } = useAuth();

  return (
    <div>
      <p>Are you sure you want to sign out?</p>
      <button onClick={() => logout()}>Sign out</button>
    </div>
  );
}
