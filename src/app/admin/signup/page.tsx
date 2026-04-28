"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    org_name: "",
    org_slug: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const setField = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.message ?? "Signup failed.");
      }

      router.push("/admin/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#090B10] px-4 py-10">
      <Card className="w-full max-w-lg border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">BNS Admin Signup</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={onSubmit}>
            <Input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(event) => setField("email", event.target.value)}
              required
              className="border-white/20 bg-black/30 text-white placeholder:text-white/50"
            />
            <Input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(event) => setField("password", event.target.value)}
              required
              className="border-white/20 bg-black/30 text-white placeholder:text-white/50"
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                placeholder="First name"
                value={form.first_name}
                onChange={(event) => setField("first_name", event.target.value)}
                required
                className="border-white/20 bg-black/30 text-white placeholder:text-white/50"
              />
              <Input
                placeholder="Last name"
                value={form.last_name}
                onChange={(event) => setField("last_name", event.target.value)}
                required
                className="border-white/20 bg-black/30 text-white placeholder:text-white/50"
              />
            </div>
            <Input
              placeholder="Organization name"
              value={form.org_name}
              onChange={(event) => setField("org_name", event.target.value)}
              required
              className="border-white/20 bg-black/30 text-white placeholder:text-white/50"
            />
            <Input
              placeholder="Organization slug (e.g. bns-foundation)"
              value={form.org_slug}
              onChange={(event) => setField("org_slug", event.target.value)}
              required
              className="border-white/20 bg-black/30 text-white placeholder:text-white/50"
            />
            {error ? <p className="text-sm text-red-300">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
          <p className="mt-4 text-sm text-white/60">
            Already have an account?{" "}
            <Link href="/admin/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
