"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/api-config";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token.");
      return;
    }

    const verify = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();
        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed. The link may be expired.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("A network error occurred. Please try again.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 text-center md:max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 shadow-xl backdrop-blur-md">
          {status === "loading" && (
            <div className="flex flex-col items-center">
              <Loader2 className="size-16 animate-spin text-primary" />
              <h1 className="mt-6 text-2xl font-bold">Verifying...</h1>
              <p className="mt-2 text-foreground/60">{message}</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center">
              <CheckCircle2 className="size-16 text-emerald-500" />
              <h1 className="mt-6 text-2xl font-bold text-foreground">Success!</h1>
              <p className="mt-2 text-foreground/60 leading-relaxed">{message}</p>
              <Link
                href="/admin/login"
                className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-8 text-sm font-bold text-white transition-all hover:bg-primary/90"
              >
                Sign In
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center">
              <XCircle className="size-16 text-rose-500" />
              <h1 className="mt-6 text-2xl font-bold text-foreground">Verification Failed</h1>
              <p className="mt-2 text-foreground/60 leading-relaxed">{message}</p>
              <Link
                href="/admin/signup"
                className="mt-8 inline-flex h-11 items-center justify-center rounded-xl border border-white/10 px-8 text-sm font-bold text-foreground transition-all hover:bg-white/5"
              >
                Back to Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6 text-center md:max-w-md">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 shadow-xl backdrop-blur-md">
            <div className="flex flex-col items-center">
              <Loader2 className="size-16 animate-spin text-primary" />
              <h1 className="mt-6 text-2xl font-bold">Loading...</h1>
            </div>
          </div>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
