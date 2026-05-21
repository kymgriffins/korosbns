"use client";

import Image from "next/image";
import Link from "next/link";
import { Routes } from "@/constants/routes";

export function AuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <Link href={Routes.Home} className="mb-2">
        <Image src="/logo.svg" alt="Budget Ndio Story" width={160} height={32} className="h-7 w-auto" />
      </Link>
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-center">{title}</h1>
        {description ? (
          <p className="mt-2 text-center text-sm text-muted-foreground">{description}</p>
        ) : null}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
