"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/layouts/AuthShell";
import { FormStatus } from "@/components/citizen/form-status";
import { GuestOnly } from "@/components/citizen/guest-only";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Routes } from "@/constants/routes";
import { citizenApi } from "@/lib/api-client";

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");
    try {
      await citizenApi.register(form);
      setSent(true);
      toast.success("Check your email to verify your account.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed.";
      setFormError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <GuestOnly>
        <AuthShell title="Check your email" description={`We sent a verification link to ${form.email}.`}>
          <Button asChild className="w-full">
            <Link href={Routes.Login}>Back to sign in</Link>
          </Button>
        </AuthShell>
      </GuestOnly>
    );
  }

  return (
    <GuestOnly>
    <AuthShell title="Create account" description="Join Budget Ndio Story as a citizen member.">
      <FormStatus message={formError} variant="error" />
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="first_name">First name</Label>
            <Input
              id="first_name"
              autoComplete="given-name"
              value={form.first_name}
              onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Last name</Label>
            <Input
              id="last_name"
              autoComplete="family-name"
              value={form.last_name}
              onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={10}
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating…" : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href={Routes.Login} className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
    </GuestOnly>
  );
}
