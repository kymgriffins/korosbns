"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PageBreadcrumbs } from "@/components/global/page-breadcrumbs";
import { Routes } from "@/constants/routes";

const AUTH_LABELS: Record<string, string> = {
  "/auth/login": "Sign in",
  "/auth/register": "Create account",
  "/auth/verify": "Verify email",
  "/auth/reset": "Reset password",
  "/invite": "Accept invitation",
};

export function AuthBreadcrumbBar() {
  const pathname = usePathname();
  const currentLabel = AUTH_LABELS[pathname] || "Account";

  return (
    <header className="border-b border-border/60 bg-background/95 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 md:px-8 py-3">
        <Link href={Routes.Home} className="inline-flex items-center gap-2">
          <Image src="/logo.svg" alt="Budget Ndio Story" width={140} height={28} className="h-6 w-auto" />
        </Link>
        <PageBreadcrumbs
          items={[
            { label: "Home", href: Routes.Home },
            { label: currentLabel },
          ]}
        />
      </div>
    </header>
  );
}
