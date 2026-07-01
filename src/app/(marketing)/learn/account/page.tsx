"use client";

import Link from "next/link";
import { KeyRound, LogOut } from "lucide-react";
import { ContentLayout } from "@/layouts/DashboardShell";
import { AccountProfileForm } from "@/components/citizen/account-profile-form";
import { Button } from "@/components/ui/button";
import { Routes } from "@/constants/routes";

export default function AccountPage() {
  return (
    <ContentLayout
        title="My Profile"
        description="Manage your public profile, bio, avatar, and social links."
        breadcrumbs={[
          { label: "Home", href: Routes.Home },
          { label: "Dashboard", href: Routes.Learn },
          { label: "My Profile" },
        ]}
        actions={
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" asChild>
              <Link href={Routes.AccountPassword}>
                <KeyRound className="mr-1.5 size-3.5" aria-hidden />
                Password
              </Link>
            </Button>
            <Button type="button" variant="outline" size="sm" asChild>
              <Link href={Routes.AccountSignOut}>
                <LogOut className="mr-1.5 size-3.5" aria-hidden />
                Sign out
              </Link>
            </Button>
          </div>
        }
      >
        <AccountProfileForm />
      </ContentLayout>
  );
}
