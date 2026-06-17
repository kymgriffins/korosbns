"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/layouts/AuthShell";
import { FormStatus } from "@/components/citizen/form-status";
import { GuestOnly } from "@/components/citizen/guest-only";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Routes } from "@/constants/routes";
import { sanitizeRedirectPath } from "@/lib/auth-policy";
import { useAuth } from "@/contexts/auth-context";
import { useResendVerification } from "@/hooks/use-auth-actions";

function LoginForm() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const next = sanitizeRedirectPath(searchParams.get("next"), Routes.Learn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [resending, setResending] = useState(false);
  const resendMutation = useResendVerification();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");
    try {
      await login(email, password, next);
      toast.success("Welcome back!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed.";
      setFormError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email.trim()) {
      toast.error("Enter your email address first.");
      return;
    }
    setResending(true);
    try {
      await resendMutation.mutateAsync(email.trim());
      toast.success("If that email exists, we sent a new verification link.");
    } catch {
      toast.error("Failed to resend verification email.");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthShell
      title="Sign in"
      description="Use your verified Budget Ndio Story account."
    >
      <FormStatus message={formError} variant="error" />
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href={Routes.Reset} className="text-primary hover:underline">
          Forgot password?
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        <button
          type="button"
          onClick={handleResendVerification}
          disabled={resending}
          className="text-primary hover:underline text-sm"
        >
          {resending ? "Sending…" : "Resend verification email"}
        </button>
      </p>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        No account?{" "}
        <Link href={Routes.Register} className="text-primary hover:underline">
          Create one
        </Link>
      </p>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <GuestOnly>
      <Suspense fallback={<AuthShell title="Sign in">Loading…</AuthShell>}>
        <LoginForm />
      </Suspense>
    </GuestOnly>
  );
}
