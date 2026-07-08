"use client";

import { NewsletterSignup } from "@/components/learn/newsletter-signup";
import { BudgetHubPage } from "@/components/budget-hub/layout/budget-hub-page";

export function NewsletterSection() {
  return (
    <section className="border-t border-[var(--bh-border)] bg-[var(--bh-surface)] py-[var(--bh-section-y)]">
      <BudgetHubPage className="max-w-2xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Stay informed on Kenya&apos;s budget
        </h2>
        <p className="mt-3 text-[15px] text-muted-foreground">
          Get civic explainers and participation alerts — no spam, just clarity.
        </p>
        <div className="mt-8 flex justify-center">
          <NewsletterSignup />
        </div>
      </BudgetHubPage>
    </section>
  );
}
