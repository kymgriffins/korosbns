"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { AuthShell } from "@/layouts/AuthShell";
import { Button } from "@/ui/button";
import { Routes } from "@/constants/routes";
import { citizenApi } from "@/lib/api-client";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email…");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token.");
      return;
    }
    void citizenApi
      .verifyEmail(token)
      .then((data) => {
        setStatus("success");
        setMessage(data.detail || "Email verified.");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Verification failed.");
      });
  }, [token]);

  return (
    <AuthShell title="Email verification">
      <div className="flex flex-col items-center text-center">
        {status === "loading" && <Loader2 className="size-12 animate-spin text-primary" />}
        {status === "success" && <CheckCircle2 className="size-12 text-emerald-500" />}
        {status === "error" && <XCircle className="size-12 text-rose-500" />}
        <p className="mt-4 text-sm text-muted-foreground">{message}</p>
        {status !== "loading" && (
          <Button asChild className="mt-6">
            <Link href={Routes.Login}>Sign in</Link>
          </Button>
        )}
      </div>
    </AuthShell>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<AuthShell title="Email verification">Loading…</AuthShell>}>
      <VerifyContent />
    </Suspense>
  );
}
