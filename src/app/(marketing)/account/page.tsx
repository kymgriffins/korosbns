"use client";

import Link from "next/link";
import { ContentLayout } from "@/components/citizen/content-layout";
import { AccountProfileForm } from "@/components/citizen/account-profile-form";
import { Protected } from "@/components/citizen/protected";
import { Button } from "@/components/ui/button";
import { Routes } from "@/constants/routes";

export default function AccountPage() {
  return (
    <Protected>
      <ContentLayout
        title="Profile & settings"
        description="Manage your public profile, avatar, and social links."
        breadcrumbs={[
          { label: "Home", href: Routes.Home },
          { label: "Account" },
        ]}
        actions={
          <Button type="button" variant="outline" size="sm" asChild>
            <Link href={Routes.AccountSignOut}>Sign out</Link>
          </Button>
        }
      >
        <AccountProfileForm />
      </ContentLayout>
    </Protected>
  );
}
