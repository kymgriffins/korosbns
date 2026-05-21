"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AuthShell } from "@/components/citizen/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Routes } from "@/constants/routes";
import { citizenApi } from "@/lib/api-client";

function ResetContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);
  const [done, setDone] = useState(false);

  const requestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await citizenApi.requestPasswordReset(email);
      setRequested(true);
      toast.success("If that email exists, we sent a reset link.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Request failed.");
    } finally {
      setLoading(false);
    }
  };

  const confirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    try {
      await citizenApi.confirmPasswordReset(token, password);
      setDone(true);
      toast.success("Password updated. You can sign in now.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthShell title="Password updated">
        <Button asChild className="w-full">
          <Link href={Routes.Login}>Sign in</Link>
        </Button>
      </AuthShell>
    );
  }

  if (token) {
    return (
      <AuthShell title="Set new password">
        <form onSubmit={confirmReset} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              minLength={8}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving…" : "Update password"}
          </Button>
        </form>
      </AuthShell>
    );
  }

  if (requested) {
    return (
      <AuthShell
        title="Check your email"
        description="If an account exists for that address, we sent reset instructions."
      >
        <Button asChild className="w-full">
          <Link href={Routes.Login}>Back to sign in</Link>
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Reset password" description="We'll email you a link if the account exists.">
      <form onSubmit={requestReset} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending…" : "Send reset link"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm">
        <Link href={Routes.Login} className="text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}

export default function ResetPage() {
  return (
    <Suspense fallback={<AuthShell title="Reset password">Loading…</AuthShell>}>
      <ResetContent />
    </Suspense>
  );
}
