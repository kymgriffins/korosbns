"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignupForm } from "@/components/signup-form";

export default function AdminSignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    org_name: "Budget Ndio Story",
    org_slug: "bns",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const setField = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.message || payload?.email?.[0] || "Signup failed.");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6 text-center md:max-w-md">
           <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-xl backdrop-blur-md">
              <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-primary/20 text-primary">
                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
              <p className="mt-4 text-sm text-foreground/60 leading-relaxed">
                We&apos;ve sent a verification link to <strong>{form.email}</strong>. 
                Please click the link in the email to activate your admin account.
              </p>
              <div className="mt-8">
                <Link href="/admin/login" className="text-sm font-semibold text-primary hover:underline">
                  Back to Login
                </Link>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 md:max-w-md">
        <SignupForm
          form={form}
          setField={setField}
          loading={loading}
          error={error}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
